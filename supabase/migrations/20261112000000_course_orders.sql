-- TOPSAX: mua khóa học bằng chuyển khoản QR, tự mở khóa khi tiền về
--
-- Chạy MỘT LẦN trong Supabase SQL Editor, SAU 20261111000000_course_day_items.sql.
-- Cả file nằm trong một transaction.
--
-- Luồng:
--   1. Học viên bấm "Mua khóa học" -> create_course_order() tạo đơn với mã riêng
--      (TS + 6 ký tự). Trang thanh toán hiện QR VietQR, nội dung chuyển khoản
--      "TSK7F3Q2 SAX30 NGUYEN VAN A" (mã đơn, mã khóa học, tên người mua; tối
--      đa 25 ký tự theo chuẩn VietQR).
--   2. Điện thoại Android của chủ tài khoản (MacroDroid) bắt thông báo biến
--      động số dư của VCB Digibank và gửi về /api/thanh-toan/bao-co.
--   3. Route đó gọi record_bank_payment(): kiểm khóa bí mật, tìm đơn theo mã,
--      đủ tiền thì đánh dấu đã trả và mở khóa học (course_enrollments).
--
-- Khóa bí mật của điện thoại chỉ lưu dạng băm (sha256) trong app_secrets, bảng
-- không ai đọc được qua API. Admin tạo khóa ở trang /admin/khoa-hoc.

begin;

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Mã khóa học trong nội dung chuyển khoản
-- ---------------------------------------------------------------------------
alter table public.courses
  add column pay_code text not null default '' check (pay_code ~ '^[A-Z0-9]{0,8}$');

update public.courses set pay_code = 'SAX30' where slug = 'saxophone-co-ban-30-ngay';

-- "Nguyễn Văn Ánh" -> "NGUYEN VAN ANH" (ngân hàng bỏ dấu trong nội dung chuyển khoản)
create or replace function public.vn_ascii_upper(p text)
returns text
language sql
immutable
set search_path = ''
as $$
  select trim(regexp_replace(
    regexp_replace(
      upper(translate(
        coalesce(p, ''),
        'ÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬĐÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴàáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ',
        'AAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY'
      )),
      '[^A-Z0-9 ]', '', 'g'),
    '\s+', ' ', 'g'));
$$;

-- ---------------------------------------------------------------------------
-- Bảng
-- ---------------------------------------------------------------------------
create table public.course_orders (
  id uuid primary key default gen_random_uuid(),
  -- TS + 6 ký tự, bỏ các chữ dễ nhầm (I, L, O, 0, 1)
  code text not null unique check (code ~ '^TS[A-HJKMNP-Z2-9]{6}$'),
  course_id uuid not null references public.courses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  buyer_name text not null default '',
  amount numeric(12, 0) not null check (amount > 0),
  transfer_note text not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  paid_at timestamptz,
  -- 'bank' (tin báo có trên điện thoại) hoặc 'admin' (xác nhận tay)
  paid_by text not null default '',
  created_at timestamptz not null default now()
);

create index course_orders_user_id_idx on public.course_orders (user_id);
create index course_orders_course_id_idx on public.course_orders (course_id);
-- mỗi người một đơn đang chờ cho mỗi khóa học
create unique index course_orders_one_pending_idx on public.course_orders (course_id, user_id) where status = 'pending';

-- Nhật ký mọi tin báo có điện thoại gửi về (kể cả tin không khớp đơn nào)
create table public.bank_payments (
  id bigint generated always as identity primary key,
  received_at timestamptz not null default now(),
  raw text not null,
  amount numeric(14, 0),
  codes text[] not null default '{}',
  order_id uuid references public.course_orders (id) on delete set null,
  -- matched | no_code | no_order | already_paid | amount_low | no_amount
  result text not null
);

create index bank_payments_received_at_idx on public.bank_payments (received_at desc);

create table public.app_secrets (
  name text primary key,
  hash text not null,
  created_at timestamptz not null default now()
);

alter table public.course_orders enable row level security;
alter table public.bank_payments enable row level security;
alter table public.app_secrets enable row level security;
-- app_secrets: không có policy nào, và không ai được cấp quyền trên bảng
revoke all on table public.app_secrets from anon, authenticated;

create policy "read own orders"
  on public.course_orders for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "admin manage orders"
  on public.course_orders for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin read bank payments"
  on public.bank_payments for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Học viên tạo đơn (dùng lại đơn đang chờ nếu giá không đổi)
-- ---------------------------------------------------------------------------
create or replace function public.create_course_order(p_course uuid)
returns public.course_orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_course public.courses;
  v_order public.course_orders;
  v_name text;
  v_code text;
  v_alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
begin
  if v_uid is null then
    raise exception 'Cần đăng nhập để mua khóa học.' using errcode = '42501';
  end if;

  select * into v_course from public.courses where id = p_course and status = 'published';
  if not found then
    raise exception 'Khóa học chưa mở bán.' using errcode = 'P0002';
  end if;
  if v_course.price <= 0 then
    raise exception 'Khóa học chưa có giá, hãy liên hệ TOPSAX.' using errcode = 'P0001';
  end if;
  if public.has_course_access(p_course) then
    raise exception 'Bạn đã có khóa học này.' using errcode = 'P0001';
  end if;

  select * into v_order from public.course_orders
   where course_id = p_course and user_id = v_uid and status = 'pending';
  if found then
    if v_order.amount = round(v_course.price) then
      return v_order;
    end if;
    -- giá đã đổi: bỏ đơn cũ, tạo đơn mới
    update public.course_orders set status = 'cancelled' where id = v_order.id;
  end if;

  select coalesce(
           nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
           nullif(trim(u.raw_user_meta_data ->> 'name'), ''),
           split_part(u.email, '@', 1)
         )
    into v_name
    from auth.users u where u.id = v_uid;

  loop
    v_code := 'TS';
    for i in 1..6 loop
      v_code := v_code || substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.course_orders where code = v_code);
  end loop;

  insert into public.course_orders (code, course_id, user_id, buyer_name, amount, transfer_note)
  values (
    v_code,
    p_course,
    v_uid,
    coalesce(v_name, ''),
    round(v_course.price),
    -- chuẩn VietQR: nội dung tối đa 25 ký tự; mã đơn đứng đầu để không bị cắt
    trim(left(concat_ws(' ', v_code, nullif(v_course.pay_code, ''), public.vn_ascii_upper(v_name)), 25))
  )
  returning * into v_order;

  return v_order;
end;
$$;

revoke all on function public.create_course_order(uuid) from public;
grant execute on function public.create_course_order(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Tin báo có từ điện thoại
-- ---------------------------------------------------------------------------
create or replace function public.record_bank_payment(p_secret text, p_raw text, p_amount numeric, p_codes text[])
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.course_orders;
  v_result text;
begin
  if not exists (
    select 1 from public.app_secrets
     where name = 'bank_webhook'
       and hash = encode(extensions.digest(coalesce(p_secret, ''), 'sha256'), 'hex')
  ) then
    raise exception 'Sai khóa bí mật.' using errcode = '42501';
  end if;

  if coalesce(array_length(p_codes, 1), 0) = 0 then
    v_result := 'no_code';
  else
    -- đơn đang chờ trước, rồi đến đơn mới nhất
    select * into v_order from public.course_orders
     where code = any (p_codes)
     order by (status = 'pending') desc, created_at desc
     limit 1
     for update;

    if not found then
      v_result := 'no_order';
    elsif v_order.status = 'paid' then
      v_result := 'already_paid';
    elsif p_amount is null then
      v_result := 'no_amount';
    elsif p_amount < v_order.amount then
      v_result := 'amount_low';
    else
      v_result := 'matched';
      update public.course_orders
         set status = 'paid', paid_at = now(), paid_by = 'bank'
       where id = v_order.id;
      insert into public.course_enrollments (course_id, user_id, note)
      values (v_order.course_id, v_order.user_id, 'Chuyển khoản ' || v_order.code)
      on conflict (course_id, user_id) do nothing;
    end if;
  end if;

  insert into public.bank_payments (raw, amount, codes, order_id, result)
  values (left(coalesce(p_raw, ''), 2000), p_amount, coalesce(p_codes, '{}'), v_order.id, v_result);

  return jsonb_build_object('result', v_result, 'order', v_order.code);
end;
$$;

revoke all on function public.record_bank_payment(text, text, numeric, text[]) from public;
grant execute on function public.record_bank_payment(text, text, numeric, text[]) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Admin
-- ---------------------------------------------------------------------------
-- Tạo khóa bí mật mới cho điện thoại; trả về khóa đúng một lần (chỉ lưu bản băm).
create or replace function public.admin_rotate_bank_secret()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_secret text := encode(extensions.gen_random_bytes(18), 'hex');
begin
  if not public.is_admin() then
    raise exception 'Chỉ admin mới tạo được khóa.' using errcode = '42501';
  end if;
  insert into public.app_secrets (name, hash)
  values ('bank_webhook', encode(extensions.digest(v_secret, 'sha256'), 'hex'))
  on conflict (name) do update set hash = excluded.hash, created_at = now();
  return v_secret;
end;
$$;

revoke all on function public.admin_rotate_bank_secret() from public;
grant execute on function public.admin_rotate_bank_secret() to authenticated;

create or replace function public.admin_bank_secret_created_at()
returns timestamptz
language sql
stable
security definer
set search_path = ''
as $$
  select created_at from public.app_secrets where name = 'bank_webhook' and public.is_admin();
$$;

revoke all on function public.admin_bank_secret_created_at() from public;
grant execute on function public.admin_bank_secret_created_at() to authenticated;

-- Xác nhận tay (tiền về nhưng điện thoại không bắt được tin, hoặc khách ghi sai nội dung)
create or replace function public.admin_confirm_order(p_order uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order public.course_orders;
begin
  if not public.is_admin() then
    raise exception 'Chỉ admin mới xác nhận được.' using errcode = '42501';
  end if;
  update public.course_orders
     set status = 'paid', paid_at = now(), paid_by = 'admin'
   where id = p_order and status <> 'paid'
  returning * into v_order;
  if found then
    insert into public.course_enrollments (course_id, user_id, note, created_by)
    values (v_order.course_id, v_order.user_id, 'Chuyển khoản ' || v_order.code || ' (xác nhận tay)', auth.uid())
    on conflict (course_id, user_id) do nothing;
  end if;
end;
$$;

revoke all on function public.admin_confirm_order(uuid) from public;
grant execute on function public.admin_confirm_order(uuid) to authenticated;

create or replace function public.admin_course_orders(p_course uuid)
returns table (
  id uuid,
  code text,
  email text,
  buyer_name text,
  amount numeric,
  transfer_note text,
  status text,
  paid_by text,
  created_at timestamptz,
  paid_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  if not public.is_admin() then
    raise exception 'Chỉ admin mới xem được.' using errcode = '42501';
  end if;
  return query
  select o.id, o.code, u.email::text, o.buyer_name, o.amount, o.transfer_note, o.status, o.paid_by, o.created_at, o.paid_at
    from public.course_orders o
    join auth.users u on u.id = o.user_id
   where o.course_id = p_course
   order by o.created_at desc
   limit 200;
end;
$$;

revoke all on function public.admin_course_orders(uuid) from public;
grant execute on function public.admin_course_orders(uuid) to authenticated;

commit;
