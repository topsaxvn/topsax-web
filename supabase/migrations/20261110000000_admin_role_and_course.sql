-- TOPSAX: quyền admin riêng + khóa học saxophone
--
-- Chạy MỘT LẦN trong Supabase SQL Editor
-- (https://supabase.com/dashboard/project/thvhoethafeeytxjktbp/sql/new).
-- Cả file nằm trong một transaction: lỗi ở bất kỳ đâu thì không gì thay đổi.
--
-- Phần 1 sửa một lỗ hổng có từ trước: các policy "admin manage ..." cho MỌI
-- tài khoản đã đăng nhập toàn quyền, trong khi project đang bật "Allow new
-- users to sign up". Sau file này chỉ tài khoản trong bảng admin_users mới có
-- quyền admin, nên học viên đăng ký tài khoản được mà không chạm được vào sản
-- phẩm, bài viết hay tin nhắn liên hệ.
--
-- Không đụng tới bảng "songs" (virtual-piano): bảng đó vẫn mở cho anon như cũ.

begin;

-- ---------------------------------------------------------------------------
-- 1. Admin
-- ---------------------------------------------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Mỗi người chỉ thấy dòng của chính mình. Thêm/bớt admin chỉ làm trong SQL
-- Editor, không có policy ghi nào.
create policy "admin sees own row"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

insert into public.admin_users (user_id)
select id from auth.users where lower(email) = 'topsaxvn@gmail.com';

do $$
begin
  if not exists (select 1 from public.admin_users) then
    raise exception 'Không tìm thấy tài khoản topsaxvn@gmail.com trong auth.users - dừng lại, chưa đổi gì.';
  end if;
end;
$$;

-- Quyền admin cũ: "authenticated" (= mọi tài khoản) -> chỉ admin.
alter policy "admin manage categories" on public.categories
  using (public.is_admin()) with check (public.is_admin());
alter policy "admin manage brands" on public.brands
  using (public.is_admin()) with check (public.is_admin());
alter policy "admin manage products" on public.products
  using (public.is_admin()) with check (public.is_admin());
alter policy "admin manage product images" on public.product_images
  using (public.is_admin()) with check (public.is_admin());
alter policy "admin manage blog categories" on public.blog_categories
  using (public.is_admin()) with check (public.is_admin());
alter policy "admin manage posts" on public.posts
  using (public.is_admin()) with check (public.is_admin());
alter policy "admin manage contact messages" on public.contact_messages
  using (public.is_admin()) with check (public.is_admin());

-- Quyền đọc công khai trước chỉ cấp cho anon. Học viên đã đăng nhập (role
-- authenticated) cũng phải xem được sản phẩm, bài viết như khách.
alter policy "public read active categories" on public.categories to anon, authenticated;
alter policy "public read active brands" on public.brands to anon, authenticated;
alter policy "public read visible products" on public.products to anon, authenticated;
alter policy "public read images of visible products" on public.product_images to anon, authenticated;
alter policy "public read blog categories" on public.blog_categories to anon, authenticated;
alter policy "public read published posts" on public.posts to anon, authenticated;
alter policy "public submit contact message" on public.contact_messages to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Khóa học
-- ---------------------------------------------------------------------------
create type public.course_status as enum ('draft', 'published');

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  price numeric(12, 2) not null default 0 check (price >= 0),
  total_days integer not null default 30 check (total_days between 1 and 365),
  -- draft: chỉ admin và học viên đã được mở khóa thấy (để chạy thử trước khi bán)
  status public.course_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

create table public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  day integer not null check (day between 1 and 365),
  title text not null default '',
  note text not null default '',
  -- học thử: ai cũng mở được khi khóa học đã published
  is_free boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, day)
);

create index course_lessons_course_id_idx on public.course_lessons (course_id);

create trigger course_lessons_set_updated_at
  before update on public.course_lessons
  for each row execute function public.set_updated_at();

-- Nội dung bản nhạc (.nhac.json) tách riêng khỏi course_lessons: tên và số
-- ngày thì ai cũng xem được, còn nốt nhạc chỉ người có quyền mới tải được.
create table public.course_lesson_scores (
  lesson_id uuid primary key references public.course_lessons (id) on delete cascade,
  score jsonb not null,
  file_name text not null default '',
  updated_at timestamptz not null default now()
);

create trigger course_lesson_scores_set_updated_at
  before update on public.course_lesson_scores
  for each row execute function public.set_updated_at();

create table public.course_enrollments (
  course_id uuid not null references public.courses (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  note text not null default '',
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (course_id, user_id)
);

create index course_enrollments_user_id_idx on public.course_enrollments (user_id);

create table public.course_progress (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.course_lessons (id) on delete cascade,
  best_score integer not null check (best_score between 0 and 100),
  stars integer not null check (stars between 0 and 3),
  attempts integer not null default 1 check (attempts >= 1),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index course_progress_lesson_id_idx on public.course_progress (lesson_id);

create trigger course_progress_set_updated_at
  before update on public.course_progress
  for each row execute function public.set_updated_at();

create or replace function public.has_course_access(p_course uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin()
    or exists (
      select 1 from public.course_enrollments e
      where e.course_id = p_course and e.user_id = auth.uid()
    );
$$;

revoke all on function public.has_course_access(uuid) from public;
grant execute on function public.has_course_access(uuid) to anon, authenticated;

alter table public.courses enable row level security;
alter table public.course_lessons enable row level security;
alter table public.course_lesson_scores enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.course_progress enable row level security;

-- courses
create policy "read published or own courses"
  on public.courses for select
  to anon, authenticated
  using (status = 'published' or public.has_course_access(id));

create policy "admin manage courses"
  on public.courses for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- course_lessons: danh sách bài (không có nốt nhạc)
create policy "read published lessons"
  on public.course_lessons for select
  to anon, authenticated
  using (
    public.is_admin()
    or (
      is_published
      and exists (
        select 1 from public.courses c
        where c.id = course_id
          and (c.status = 'published' or public.has_course_access(c.id))
      )
    )
  );

create policy "admin manage lessons"
  on public.course_lessons for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- course_lesson_scores: nốt nhạc - bài học thử, hoặc đã được mở khóa
create policy "read scores with access"
  on public.course_lesson_scores for select
  to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.course_lessons l
      join public.courses c on c.id = l.course_id
      where l.id = lesson_id
        and l.is_published
        and (public.has_course_access(c.id) or (l.is_free and c.status = 'published'))
    )
  );

create policy "admin manage scores"
  on public.course_lesson_scores for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- course_enrollments: học viên chỉ đọc dòng của mình, admin mở/khóa
create policy "read own enrollments"
  on public.course_enrollments for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "admin manage enrollments"
  on public.course_enrollments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- course_progress: mỗi người ghi tiến độ của mình, admin xem tất cả
create policy "read own progress"
  on public.course_progress for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "write own progress"
  on public.course_progress for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "update own progress"
  on public.course_progress for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Admin mở khóa theo email (bảng auth.users không đọc được từ client).
create or replace function public.admin_grant_course(p_course uuid, p_email text, p_note text default '')
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid;
begin
  if not public.is_admin() then
    raise exception 'Chỉ admin mới mở khóa được.' using errcode = '42501';
  end if;

  select id into v_user from auth.users where lower(email) = lower(trim(p_email));
  if v_user is null then
    raise exception 'Chưa có tài khoản nào với email %. Học viên cần đăng ký trước.', trim(p_email)
      using errcode = 'P0002';
  end if;

  insert into public.course_enrollments (course_id, user_id, note, created_by)
  values (p_course, v_user, coalesce(p_note, ''), auth.uid())
  on conflict (course_id, user_id) do update set note = excluded.note;

  return v_user;
end;
$$;

revoke all on function public.admin_grant_course(uuid, text, text) from public;
grant execute on function public.admin_grant_course(uuid, text, text) to authenticated;

create or replace function public.admin_course_students(p_course uuid)
returns table (
  user_id uuid,
  email text,
  note text,
  granted_at timestamptz,
  lessons_done integer,
  last_activity timestamptz
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
  select
    e.user_id,
    u.email::text,
    e.note,
    e.created_at,
    (select count(*)::integer from public.course_progress p
       join public.course_lessons l on l.id = p.lesson_id
      where p.user_id = e.user_id and l.course_id = e.course_id),
    (select max(p.updated_at) from public.course_progress p
       join public.course_lessons l on l.id = p.lesson_id
      where p.user_id = e.user_id and l.course_id = e.course_id)
  from public.course_enrollments e
  join auth.users u on u.id = e.user_id
  where e.course_id = p_course
  order by e.created_at desc;
end;
$$;

revoke all on function public.admin_course_students(uuid) from public;
grant execute on function public.admin_course_students(uuid) to authenticated;

-- Khóa học đầu tiên, ở dạng nháp
insert into public.courses (slug, title, subtitle, description, total_days)
values (
  'saxophone-co-ban-30-ngay',
  'Saxophone cơ bản 30 ngày',
  '30 ngày làm quen với kèn',
  'Mỗi ngày một bài ngắn. App nghe tiếng kèn của bạn qua micro: thổi đúng cao độ thì nhạc chạy tiếp, sai thì nhạc đứng chờ.',
  30
);

commit;
