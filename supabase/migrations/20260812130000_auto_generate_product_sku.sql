-- Tự sinh SKU khi tạo sản phẩm mới, theo đúng quy ước đã import từ dự án
-- sax-stock-manager: K<n> cho nhánh danh mục Saxophone, P<n> cho nhánh Phụ
-- kiện, mỗi tiền tố có bộ đếm tăng dần riêng. Chỉ sinh khi admin để trống
-- SKU lúc tạo sản phẩm (nếu tự nhập tay thì giữ nguyên giá trị đã nhập).

create sequence if not exists public.product_sku_k_seq;
create sequence if not exists public.product_sku_p_seq;

-- Đưa 2 sequence lên đúng vị trí tiếp theo dựa trên SKU đã có (dữ liệu import
-- từ sax-stock-manager đã dùng K1..K39) để không sinh trùng mã.
do $$
declare
  k_max int;
  p_max int;
begin
  select max(substring(sku from '^K([0-9]+)$')::int) into k_max
    from public.products where sku ~ '^K[0-9]+$';
  if k_max is not null then
    perform setval('public.product_sku_k_seq', k_max, true);
  end if;

  select max(substring(sku from '^P([0-9]+)$')::int) into p_max
    from public.products where sku ~ '^P[0-9]+$';
  if p_max is not null then
    perform setval('public.product_sku_p_seq', p_max, true);
  end if;
end $$;

-- Tìm slug của category gốc (không có parent) theo chuỗi parent_id, dùng để
-- biết sản phẩm thuộc nhánh Saxophone hay Phụ kiện.
create or replace function public.product_root_category_slug(p_category_id uuid) returns text
language sql stable as $$
  with recursive chain as (
    select id, slug, parent_id from public.categories where id = p_category_id
    union all
    select c.id, c.slug, c.parent_id
    from public.categories c
    join chain on c.id = chain.parent_id
  )
  select slug from chain where parent_id is null limit 1;
$$;

create or replace function public.set_product_sku() returns trigger
language plpgsql as $$
declare
  root_slug text;
begin
  if new.sku is null or btrim(new.sku) = '' then
    root_slug := case when new.category_id is null then null
      else public.product_root_category_slug(new.category_id) end;

    if root_slug = 'saxophone' then
      new.sku := 'K' || nextval('public.product_sku_k_seq');
    elsif root_slug = 'phu-kien' then
      new.sku := 'P' || nextval('public.product_sku_p_seq');
    end if;
    -- Danh mục gốc khác (nếu có trong tương lai) không tự sinh SKU - admin
    -- tự nhập tay cho trường hợp này.
  end if;
  return new;
end;
$$;

drop trigger if exists trg_set_product_sku on public.products;
create trigger trg_set_product_sku
  before insert on public.products
  for each row execute function public.set_product_sku();
