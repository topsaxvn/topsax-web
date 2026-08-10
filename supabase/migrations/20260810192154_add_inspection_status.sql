-- Theo dõi việc kiểm tra/đánh giá chất lượng sản phẩm (đặc biệt saxophone cũ
-- mới nhập kho) tách biệt khỏi trạng thái bán hàng (status: available/sold/
-- hidden). Một sản phẩm có thể đã kiểm tra xong nhưng vẫn đang "hidden" (chưa
-- định giá xong), hoặc ngược lại - hai khái niệm độc lập nhau.

create type public.product_inspection_status as enum (
  'pending',      -- chờ kiểm tra
  'in_progress',  -- đang kiểm tra
  'passed',       -- đạt, sẵn sàng bán
  'failed'        -- không đạt, không bán
);

alter table public.products
  add column inspection_status public.product_inspection_status not null default 'pending';

create index products_inspection_status_idx on public.products (inspection_status);
