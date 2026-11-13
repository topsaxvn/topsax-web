-- TOPSAX: sản phẩm đề xuất cho khóa học
--
-- Chạy trong Supabase SQL Editor, sau các file 2026111x trước. Chạy lại nhiều
-- lần cũng không sao.
--
-- Mỗi sản phẩm có mục "Đề xuất cho khóa học" trong form sản phẩm ở admin:
-- tích khóa nào thì sản phẩm hiện ở sidebar "Đề xuất cho khóa học" trên trang
-- khóa học đó (kèn cho người mới, béc, dăm, phụ kiện...).
--
-- Ai cũng đọc được bảng này; sản phẩm đang ẩn (status = 'hidden') vẫn bị
-- policy của bảng products chặn nên không lộ ra trang khóa học.

begin;

create table if not exists public.course_products (
  course_id uuid not null references public.courses (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  -- thứ tự trong sidebar (nhỏ lên trước); bằng nhau thì kèn trước phụ kiện
  position integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (course_id, product_id)
);

create index if not exists course_products_product_idx on public.course_products (product_id);

alter table public.course_products enable row level security;

drop policy if exists "public read course products" on public.course_products;
create policy "public read course products"
  on public.course_products for select
  to anon, authenticated
  using (true);

drop policy if exists "admin manage course products" on public.course_products;
create policy "admin manage course products"
  on public.course_products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.course_products to anon, authenticated;
grant insert, update, delete on public.course_products to authenticated;

commit;
