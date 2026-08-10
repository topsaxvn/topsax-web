-- Import 39 saxophone da nhap kho tu du an sax-stock-manager (Hanoi Sax).
-- Gia ban chua duoc dinh (sell_price = 0 o nguon), nen import o trang thai
-- 'hidden' - admin can vao /admin/products dat gia that roi chuyen sang
-- 'available' de hien cong khai.

-- Category "Soprano" chua co trong topsax, tao moi duoi "saxophone".
insert into public.categories (name, slug, description, parent_id, sort_order)
select 'Soprano', 'soprano', 'Saxophone Soprano', (select id from public.categories where slug = 'saxophone'), 4
where not exists (select 1 from public.categories where slug = 'soprano');

-- Cac thuong hieu moi (chua co trong topsax)
insert into public.brands (name, slug) values
  ('Yamaha', 'yamaha'),
  ('Selmer', 'selmer'),
  ('Signature', 'signature'),
  ('Maxtone', 'maxtone'),
  ('Marcato', 'marcato'),
  ('Yanashigawa', 'yanashigawa'),
  ('Cadeson', 'cadeson'),
  ('Buffet', 'buffet'),
  ('Sylphide', 'sylphide'),
  ('Amati', 'amati'),
  ('Kawai', 'kawai'),
  ('Alice', 'alice'),
  ('Kerntner', 'kerntner'),
  ('Michael', 'michael'),
  ('Grassi', 'grassi'),
  ('Galante', 'galante'),
  ('MG', 'mg'),
  ('Roxy', 'roxy'),
  ('Playtech', 'playtech'),
  ('Mavis', 'mavis'),
  ('Splendor', 'splendor'),
  ('Mombasa', 'mombasa')
on conflict (slug) do nothing;

-- San pham
insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Yamaha bao vải', 'yamaha-bao-vai-k6',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'yamaha'),
  'K6', 'Có beck không tên', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSKLL0MLUR7"}'::jsonb
where not exists (select 1 from public.products where slug = 'yamaha-bao-vai-k6');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786207053/products/f40hfnub3ti2ut7cniuh.jpg', 'products/f40hfnub3ti2ut7cniuh', 'Yamaha bao vải', 0, true
from public.products where slug = 'yamaha-bao-vai-k6'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-bao-vai-k6') and public_id = 'products/f40hfnub3ti2ut7cniuh'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786207059/products/rdybpusfpxfiysfwb5f0.jpg', 'products/rdybpusfpxfiysfwb5f0', 'Yamaha bao vải', 1, false
from public.products where slug = 'yamaha-bao-vai-k6'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-bao-vai-k6') and public_id = 'products/rdybpusfpxfiysfwb5f0'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786207065/products/hnxzusfgbg9uomur60rq.jpg', 'products/hnxzusfgbg9uomur60rq', 'Yamaha bao vải', 2, false
from public.products where slug = 'yamaha-bao-vai-k6'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-bao-vai-k6') and public_id = 'products/hnxzusfgbg9uomur60rq'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Selmer super action2', 'selmer-super-action2-k1',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'selmer'),
  'K1', null, 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSKKUXS82G5"}'::jsonb
where not exists (select 1 from public.products where slug = 'selmer-super-action2-k1');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786205800/products/qr2scxtdscvualfq8n2w.jpg', 'products/qr2scxtdscvualfq8n2w', 'Selmer super action2', 0, true
from public.products where slug = 'selmer-super-action2-k1'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'selmer-super-action2-k1') and public_id = 'products/qr2scxtdscvualfq8n2w'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786205816/products/stts5rcli65fxdfpzwtp.jpg', 'products/stts5rcli65fxdfpzwtp', 'Selmer super action2', 1, false
from public.products where slug = 'selmer-super-action2-k1'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'selmer-super-action2-k1') and public_id = 'products/stts5rcli65fxdfpzwtp'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786205858/products/rrogspzsntrgbv9pcslk.jpg', 'products/rrogspzsntrgbv9pcslk', 'Selmer super action2', 2, false
from public.products where slug = 'selmer-super-action2-k1'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'selmer-super-action2-k1') and public_id = 'products/rrogspzsntrgbv9pcslk'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Signature series', 'signature-series-k2',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'signature'),
  'K2', 'Hộp bị hỏng 1 bên khóa, không thấy cổ kèn', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSKL36RHJVG"}'::jsonb
where not exists (select 1 from public.products where slug = 'signature-series-k2');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786206182/products/lwxs227b07dsiv4iatmg.jpg', 'products/lwxs227b07dsiv4iatmg', 'Signature series', 0, true
from public.products where slug = 'signature-series-k2'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'signature-series-k2') and public_id = 'products/lwxs227b07dsiv4iatmg'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786206189/products/opdqggjhqiztgjodfztd.jpg', 'products/opdqggjhqiztgjodfztd', 'Signature series', 1, false
from public.products where slug = 'signature-series-k2'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'signature-series-k2') and public_id = 'products/opdqggjhqiztgjodfztd'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786206197/products/udmryadd6vfvuhaihypd.jpg', 'products/udmryadd6vfvuhaihypd', 'Signature series', 2, false
from public.products where slug = 'signature-series-k2'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'signature-series-k2') and public_id = 'products/udmryadd6vfvuhaihypd'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Maxtone', 'maxtone-k3',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'maxtone'),
  'K3', null, 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSKL6E8QOS6"}'::jsonb
where not exists (select 1 from public.products where slug = 'maxtone-k3');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786206370/products/jeewvrpbhyyppdpn8e1e.jpg', 'products/jeewvrpbhyyppdpn8e1e', 'Maxtone', 0, true
from public.products where slug = 'maxtone-k3'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'maxtone-k3') and public_id = 'products/jeewvrpbhyyppdpn8e1e'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786206378/products/tusxbiwkincwxgypugp6.jpg', 'products/tusxbiwkincwxgypugp6', 'Maxtone', 1, false
from public.products where slug = 'maxtone-k3'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'maxtone-k3') and public_id = 'products/tusxbiwkincwxgypugp6'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786206384/products/x4uhn6buy9afjrcn708q.jpg', 'products/x4uhn6buy9afjrcn708q', 'Maxtone', 2, false
from public.products where slug = 'maxtone-k3'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'maxtone-k3') and public_id = 'products/x4uhn6buy9afjrcn708q'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Marcato', 'marcato-k4',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'marcato'),
  'K4', 'Đủ phụ kiện. Beck rico royal b5', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSKLBW6F34C"}'::jsonb
where not exists (select 1 from public.products where slug = 'marcato-k4');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786206583/products/bh9r4h84crc6cdhmzez3.jpg', 'products/bh9r4h84crc6cdhmzez3', 'Marcato', 0, true
from public.products where slug = 'marcato-k4'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-k4') and public_id = 'products/bh9r4h84crc6cdhmzez3'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786206590/products/vagpcywz5xuj9kwfgumb.jpg', 'products/vagpcywz5xuj9kwfgumb', 'Marcato', 1, false
from public.products where slug = 'marcato-k4'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-k4') and public_id = 'products/vagpcywz5xuj9kwfgumb'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786206595/products/eakw0kjyeqr2uz9lrrtf.jpg', 'products/eakw0kjyeqr2uz9lrrtf', 'Marcato', 2, false
from public.products where slug = 'marcato-k4'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-k4') and public_id = 'products/eakw0kjyeqr2uz9lrrtf'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Yanashigawa', 'yanashigawa-k5',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'yanashigawa'),
  'K5', null, 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSKLG4X40QF"}'::jsonb
where not exists (select 1 from public.products where slug = 'yanashigawa-k5');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786206849/products/rlc1wedoq28qb8f2ckqd.jpg', 'products/rlc1wedoq28qb8f2ckqd', 'Yanashigawa', 0, true
from public.products where slug = 'yanashigawa-k5'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yanashigawa-k5') and public_id = 'products/rlc1wedoq28qb8f2ckqd'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786206856/products/n3hvbqxpfssv1ijd4tts.jpg', 'products/n3hvbqxpfssv1ijd4tts', 'Yanashigawa', 1, false
from public.products where slug = 'yanashigawa-k5'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yanashigawa-k5') and public_id = 'products/n3hvbqxpfssv1ijd4tts'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786206861/products/cjdvgbqopnxcokfvejye.jpg', 'products/cjdvgbqopnxcokfvejye', 'Yanashigawa', 2, false
from public.products where slug = 'yanashigawa-k5'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yanashigawa-k5') and public_id = 'products/cjdvgbqopnxcokfvejye'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Cadeson bao vải', 'cadeson-bao-vai-k7',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'cadeson'),
  'K7', 'Có beck cadeson A3-5', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSKLTALWQA4"}'::jsonb
where not exists (select 1 from public.products where slug = 'cadeson-bao-vai-k7');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786207424/products/a7lg5ewncqguzat0avax.jpg', 'products/a7lg5ewncqguzat0avax', 'Cadeson bao vải', 0, true
from public.products where slug = 'cadeson-bao-vai-k7'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'cadeson-bao-vai-k7') and public_id = 'products/a7lg5ewncqguzat0avax'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786207430/products/xnzfp3zcmnvzz9w1nkyg.jpg', 'products/xnzfp3zcmnvzz9w1nkyg', 'Cadeson bao vải', 1, false
from public.products where slug = 'cadeson-bao-vai-k7'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'cadeson-bao-vai-k7') and public_id = 'products/xnzfp3zcmnvzz9w1nkyg'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786207435/products/ecxy3bzkbr85c4jdxshi.jpg', 'products/ecxy3bzkbr85c4jdxshi', 'Cadeson bao vải', 2, false
from public.products where slug = 'cadeson-bao-vai-k7'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'cadeson-bao-vai-k7') and public_id = 'products/ecxy3bzkbr85c4jdxshi'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Buffet', 'buffet-k8',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'buffet'),
  'K8', 'Có beck buffet', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSKM0JD5M4D"}'::jsonb
where not exists (select 1 from public.products where slug = 'buffet-k8');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786207704/products/r6uzp9nhemsnvzir3tys.jpg', 'products/r6uzp9nhemsnvzir3tys', 'Buffet', 0, true
from public.products where slug = 'buffet-k8'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'buffet-k8') and public_id = 'products/r6uzp9nhemsnvzir3tys'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786207716/products/oy6a96xvkauvznvgz68q.jpg', 'products/oy6a96xvkauvznvgz68q', 'Buffet', 1, false
from public.products where slug = 'buffet-k8'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'buffet-k8') and public_id = 'products/oy6a96xvkauvznvgz68q'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786207723/products/equn7qyitwbfmi5igf2l.jpg', 'products/equn7qyitwbfmi5igf2l', 'Buffet', 2, false
from public.products where slug = 'buffet-k8'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'buffet-k8') and public_id = 'products/equn7qyitwbfmi5igf2l'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786207727/products/msyssqphc4ptqswwbmnt.jpg', 'products/msyssqphc4ptqswwbmnt', 'Buffet', 3, false
from public.products where slug = 'buffet-k8'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'buffet-k8') and public_id = 'products/msyssqphc4ptqswwbmnt'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Marcato 1989 series', 'marcato-1989-series-k9',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'marcato'),
  'K9', 'Có beck b5', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSKM7BWGKNT"}'::jsonb
where not exists (select 1 from public.products where slug = 'marcato-1989-series-k9');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786208080/products/wl40gksvhhv8b6ih0qjr.jpg', 'products/wl40gksvhhv8b6ih0qjr', 'Marcato 1989 series', 0, true
from public.products where slug = 'marcato-1989-series-k9'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-1989-series-k9') and public_id = 'products/wl40gksvhhv8b6ih0qjr'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786208095/products/lnomcziyvvojkzg0svlh.jpg', 'products/lnomcziyvvojkzg0svlh', 'Marcato 1989 series', 1, false
from public.products where slug = 'marcato-1989-series-k9'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-1989-series-k9') and public_id = 'products/lnomcziyvvojkzg0svlh'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786208102/products/xljrw7xumhclhayc1orm.jpg', 'products/xljrw7xumhclhayc1orm', 'Marcato 1989 series', 2, false
from public.products where slug = 'marcato-1989-series-k9'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-1989-series-k9') and public_id = 'products/xljrw7xumhclhayc1orm'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786208108/products/hxxf8rrokrevldslfpen.jpg', 'products/hxxf8rrokrevldslfpen', 'Marcato 1989 series', 3, false
from public.products where slug = 'marcato-1989-series-k9'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-1989-series-k9') and public_id = 'products/hxxf8rrokrevldslfpen'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Yamaha sop', 'yamaha-sop-k10',
  (select id from public.categories where slug = 'soprano'),
  (select id from public.brands where slug = 'yamaha'),
  'K10', '1 beck yamaha, 1 beck selmer', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSKMJAUUANF"}'::jsonb
where not exists (select 1 from public.products where slug = 'yamaha-sop-k10');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786208597/products/xluf4oovy2173tqi23jx.jpg', 'products/xluf4oovy2173tqi23jx', 'Yamaha sop', 0, true
from public.products where slug = 'yamaha-sop-k10'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-sop-k10') and public_id = 'products/xluf4oovy2173tqi23jx'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786208603/products/pymvt3opjnaewxpdvgjt.jpg', 'products/pymvt3opjnaewxpdvgjt', 'Yamaha sop', 1, false
from public.products where slug = 'yamaha-sop-k10'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-sop-k10') and public_id = 'products/pymvt3opjnaewxpdvgjt'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786208624/products/cnjy79lmvtla53m2hfwe.jpg', 'products/cnjy79lmvtla53m2hfwe', 'Yamaha sop', 2, false
from public.products where slug = 'yamaha-sop-k10'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-sop-k10') and public_id = 'products/cnjy79lmvtla53m2hfwe'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786208630/products/rycvd4h2rscagz9rtszo.jpg', 'products/rycvd4h2rscagz9rtszo', 'Yamaha sop', 3, false
from public.products where slug = 'yamaha-sop-k10'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-sop-k10') and public_id = 'products/rycvd4h2rscagz9rtszo'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786208642/products/lmg9vcrebuhnc2sy2kbp.jpg', 'products/lmg9vcrebuhnc2sy2kbp', 'Yamaha sop', 4, false
from public.products where slug = 'yamaha-sop-k10'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-sop-k10') and public_id = 'products/lmg9vcrebuhnc2sy2kbp'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Sylphide', 'sylphide-k11',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'sylphide'),
  'K11', 'Có sẵn beck sylphide', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLFVSXJ6QF"}'::jsonb
where not exists (select 1 from public.products where slug = 'sylphide-k11');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786257942/products/pa4pe6lfhy7vjvnntlhg.jpg', 'products/pa4pe6lfhy7vjvnntlhg', 'Sylphide', 0, true
from public.products where slug = 'sylphide-k11'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'sylphide-k11') and public_id = 'products/pa4pe6lfhy7vjvnntlhg'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786257942/products/uvsdbxzqjighvt2vlagp.jpg', 'products/uvsdbxzqjighvt2vlagp', 'Sylphide', 1, false
from public.products where slug = 'sylphide-k11'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'sylphide-k11') and public_id = 'products/uvsdbxzqjighvt2vlagp'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786257942/products/kr4xf6ujvtiecazys0gn.jpg', 'products/kr4xf6ujvtiecazys0gn', 'Sylphide', 2, false
from public.products where slug = 'sylphide-k11'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'sylphide-k11') and public_id = 'products/kr4xf6ujvtiecazys0gn'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786257942/products/c3zzjzfpetzfi51qsxio.jpg', 'products/c3zzjzfpetzfi51qsxio', 'Sylphide', 3, false
from public.products where slug = 'sylphide-k11'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'sylphide-k11') and public_id = 'products/c3zzjzfpetzfi51qsxio'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Amati Kraslice', 'amati-kraslice-k12',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'amati'),
  'K12', 'Không có beck', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLG3NY1OOA"}'::jsonb
where not exists (select 1 from public.products where slug = 'amati-kraslice-k12');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786258399/products/radpzkrdu3uyqw1b3uqk.jpg', 'products/radpzkrdu3uyqw1b3uqk', 'Amati Kraslice', 0, true
from public.products where slug = 'amati-kraslice-k12'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'amati-kraslice-k12') and public_id = 'products/radpzkrdu3uyqw1b3uqk'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786258399/products/ns3n4rcyrvemqfat5qs9.jpg', 'products/ns3n4rcyrvemqfat5qs9', 'Amati Kraslice', 1, false
from public.products where slug = 'amati-kraslice-k12'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'amati-kraslice-k12') and public_id = 'products/ns3n4rcyrvemqfat5qs9'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786258399/products/i19de1zb3dyvpxehepoi.jpg', 'products/i19de1zb3dyvpxehepoi', 'Amati Kraslice', 2, false
from public.products where slug = 'amati-kraslice-k12'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'amati-kraslice-k12') and public_id = 'products/i19de1zb3dyvpxehepoi'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Kawai', 'kawai-k13',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'kawai'),
  'K13', 'Không có beck', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLGBBUWF7C"}'::jsonb
where not exists (select 1 from public.products where slug = 'kawai-k13');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786258720/products/zwkrkzchrzmw4vv5rj8z.jpg', 'products/zwkrkzchrzmw4vv5rj8z', 'Kawai', 0, true
from public.products where slug = 'kawai-k13'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'kawai-k13') and public_id = 'products/zwkrkzchrzmw4vv5rj8z'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786258720/products/w27u7q62vtw8ns6buzrg.jpg', 'products/w27u7q62vtw8ns6buzrg', 'Kawai', 1, false
from public.products where slug = 'kawai-k13'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'kawai-k13') and public_id = 'products/w27u7q62vtw8ns6buzrg'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786258720/products/towhi92y3koezhsg5pnb.jpg', 'products/towhi92y3koezhsg5pnb', 'Kawai', 2, false
from public.products where slug = 'kawai-k13'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'kawai-k13') and public_id = 'products/towhi92y3koezhsg5pnb'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Alice bạc', 'alice-bac-k14',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'alice'),
  'K14', 'Không có beck', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLGJ1MALOW"}'::jsonb
where not exists (select 1 from public.products where slug = 'alice-bac-k14');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786259064/products/tpz7ttxcrgldfdqlvfba.jpg', 'products/tpz7ttxcrgldfdqlvfba', 'Alice bạc', 0, true
from public.products where slug = 'alice-bac-k14'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'alice-bac-k14') and public_id = 'products/tpz7ttxcrgldfdqlvfba'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786259064/products/lbs0o2cvfmit8v4tn9p0.jpg', 'products/lbs0o2cvfmit8v4tn9p0', 'Alice bạc', 1, false
from public.products where slug = 'alice-bac-k14'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'alice-bac-k14') and public_id = 'products/lbs0o2cvfmit8v4tn9p0'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786259064/products/mes6u4zggq5y8vnx7kf8.jpg', 'products/mes6u4zggq5y8vnx7kf8', 'Alice bạc', 2, false
from public.products where slug = 'alice-bac-k14'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'alice-bac-k14') and public_id = 'products/mes6u4zggq5y8vnx7kf8'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Maxtone', 'maxtone-k15',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'maxtone'),
  'K15', 'Có beck ko tên cắn móp
Hộp bị vỡ', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLGQ7SA276"}'::jsonb
where not exists (select 1 from public.products where slug = 'maxtone-k15');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786259367/products/wsoh0fdvgzdypu8x4kx3.jpg', 'products/wsoh0fdvgzdypu8x4kx3', 'Maxtone', 0, true
from public.products where slug = 'maxtone-k15'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'maxtone-k15') and public_id = 'products/wsoh0fdvgzdypu8x4kx3'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786259367/products/kki616emvlz5aafeict5.jpg', 'products/kki616emvlz5aafeict5', 'Maxtone', 1, false
from public.products where slug = 'maxtone-k15'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'maxtone-k15') and public_id = 'products/kki616emvlz5aafeict5'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786259367/products/e2b2oadjihsl8r207je9.jpg', 'products/e2b2oadjihsl8r207je9', 'Maxtone', 2, false
from public.products where slug = 'maxtone-k15'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'maxtone-k15') and public_id = 'products/e2b2oadjihsl8r207je9'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786259367/products/okv35kqyjaqy11xxq9hy.jpg', 'products/okv35kqyjaqy11xxq9hy', 'Maxtone', 3, false
from public.products where slug = 'maxtone-k15'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'maxtone-k15') and public_id = 'products/okv35kqyjaqy11xxq9hy'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Marcato sop', 'marcato-sop-k16',
  (select id from public.categories where slug = 'soprano'),
  (select id from public.brands where slug = 'marcato'),
  'K16', 'Beck ko tên mòn đầu', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLGWET7XBF"}'::jsonb
where not exists (select 1 from public.products where slug = 'marcato-sop-k16');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786259673/products/coyk28u6yqy4m8qklqxo.jpg', 'products/coyk28u6yqy4m8qklqxo', 'Marcato sop', 0, true
from public.products where slug = 'marcato-sop-k16'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-sop-k16') and public_id = 'products/coyk28u6yqy4m8qklqxo'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786259673/products/vn1hcxjzt9plo1hvd3mr.jpg', 'products/vn1hcxjzt9plo1hvd3mr', 'Marcato sop', 1, false
from public.products where slug = 'marcato-sop-k16'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-sop-k16') and public_id = 'products/vn1hcxjzt9plo1hvd3mr'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786259673/products/dlrpm99gjyo0psn2knj1.jpg', 'products/dlrpm99gjyo0psn2knj1', 'Marcato sop', 2, false
from public.products where slug = 'marcato-sop-k16'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-sop-k16') and public_id = 'products/dlrpm99gjyo0psn2knj1'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786259673/products/jebjz0ob1frz1ftprlef.jpg', 'products/jebjz0ob1frz1ftprlef', 'Marcato sop', 3, false
from public.products where slug = 'marcato-sop-k16'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-sop-k16') and public_id = 'products/jebjz0ob1frz1ftprlef'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Kerntner', 'kerntner-k17',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'kerntner'),
  'K17', 'Có beck
Hộp vỡ góc', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLH3P6TO7D"}'::jsonb
where not exists (select 1 from public.products where slug = 'kerntner-k17');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786259995/products/llsuzqdhb3hrz944tqp7.jpg', 'products/llsuzqdhb3hrz944tqp7', 'Kerntner', 0, true
from public.products where slug = 'kerntner-k17'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'kerntner-k17') and public_id = 'products/llsuzqdhb3hrz944tqp7'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786260029/products/pxeapdybfkmxwsxxof8c.jpg', 'products/pxeapdybfkmxwsxxof8c', 'Kerntner', 1, false
from public.products where slug = 'kerntner-k17'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'kerntner-k17') and public_id = 'products/pxeapdybfkmxwsxxof8c'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786260028/products/qo8yqvzcnb7lcstryeor.jpg', 'products/qo8yqvzcnb7lcstryeor', 'Kerntner', 2, false
from public.products where slug = 'kerntner-k17'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'kerntner-k17') and public_id = 'products/qo8yqvzcnb7lcstryeor'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786260028/products/obbfk5fd3cfmxybuk24f.jpg', 'products/obbfk5fd3cfmxybuk24f', 'Kerntner', 3, false
from public.products where slug = 'kerntner-k17'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'kerntner-k17') and public_id = 'products/obbfk5fd3cfmxybuk24f'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786260029/products/cuypylsfazeu41crskdh.jpg', 'products/cuypylsfazeu41crskdh', 'Kerntner', 4, false
from public.products where slug = 'kerntner-k17'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'kerntner-k17') and public_id = 'products/cuypylsfazeu41crskdh'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Michael', 'michael-k18',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'michael'),
  'K18', 'Không có beck', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLHG9W67GC"}'::jsonb
where not exists (select 1 from public.products where slug = 'michael-k18');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786260576/products/roxyep6rqj5w4dxsa34d.jpg', 'products/roxyep6rqj5w4dxsa34d', 'Michael', 0, true
from public.products where slug = 'michael-k18'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'michael-k18') and public_id = 'products/roxyep6rqj5w4dxsa34d'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786260576/products/kryielg5h0vmkdijleib.jpg', 'products/kryielg5h0vmkdijleib', 'Michael', 1, false
from public.products where slug = 'michael-k18'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'michael-k18') and public_id = 'products/kryielg5h0vmkdijleib'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786260576/products/dx2x8mfthiqh9sy1e67u.jpg', 'products/dx2x8mfthiqh9sy1e67u', 'Michael', 2, false
from public.products where slug = 'michael-k18'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'michael-k18') and public_id = 'products/dx2x8mfthiqh9sy1e67u'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Yamaha bạc', 'yamaha-bac-k19',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'yamaha'),
  'K19', 'Không có beck', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLI80402SU"}'::jsonb
where not exists (select 1 from public.products where slug = 'yamaha-bac-k19');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786261892/products/qyuuiopcln4jvvdc0riy.jpg', 'products/qyuuiopcln4jvvdc0riy', 'Yamaha bạc', 0, true
from public.products where slug = 'yamaha-bac-k19'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-bac-k19') and public_id = 'products/qyuuiopcln4jvvdc0riy'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786261892/products/lpren4zi0jbhznrip2zd.jpg', 'products/lpren4zi0jbhznrip2zd', 'Yamaha bạc', 1, false
from public.products where slug = 'yamaha-bac-k19'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-bac-k19') and public_id = 'products/lpren4zi0jbhznrip2zd'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786261892/products/ehclpfso6x7vpgsiz9v0.jpg', 'products/ehclpfso6x7vpgsiz9v0', 'Yamaha bạc', 2, false
from public.products where slug = 'yamaha-bac-k19'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-bac-k19') and public_id = 'products/ehclpfso6x7vpgsiz9v0'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Marcato', 'marcato-k20',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'marcato'),
  'K20', 'Có beck ko tên', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLIIK6OIFM"}'::jsonb
where not exists (select 1 from public.products where slug = 'marcato-k20');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786262376/products/ewkzw8zkqqd7jqtlityh.jpg', 'products/ewkzw8zkqqd7jqtlityh', 'Marcato', 0, true
from public.products where slug = 'marcato-k20'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-k20') and public_id = 'products/ewkzw8zkqqd7jqtlityh'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786262376/products/fzukfiitemprqzanlqx9.jpg', 'products/fzukfiitemprqzanlqx9', 'Marcato', 1, false
from public.products where slug = 'marcato-k20'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-k20') and public_id = 'products/fzukfiitemprqzanlqx9'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786262376/products/zkinkdohqqt9hj5kofkl.jpg', 'products/zkinkdohqqt9hj5kofkl', 'Marcato', 2, false
from public.products where slug = 'marcato-k20'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-k20') and public_id = 'products/zkinkdohqqt9hj5kofkl'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786262376/products/bwmfdh5tz2yoxv5slfrn.jpg', 'products/bwmfdh5tz2yoxv5slfrn', 'Marcato', 3, false
from public.products where slug = 'marcato-k20'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-k20') and public_id = 'products/bwmfdh5tz2yoxv5slfrn'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Grassi', 'grassi-k21',
  null,
  (select id from public.brands where slug = 'grassi'),
  'K21', 'Không có beck
Hộp cũ xấu', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLISEG9L6E"}'::jsonb
where not exists (select 1 from public.products where slug = 'grassi-k21');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786262808/products/oe12sukz3e1fl1f4w2uj.jpg', 'products/oe12sukz3e1fl1f4w2uj', 'Grassi', 0, true
from public.products where slug = 'grassi-k21'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'grassi-k21') and public_id = 'products/oe12sukz3e1fl1f4w2uj'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786262807/products/r9tmugjeopcqgvoi3dwo.jpg', 'products/r9tmugjeopcqgvoi3dwo', 'Grassi', 1, false
from public.products where slug = 'grassi-k21'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'grassi-k21') and public_id = 'products/r9tmugjeopcqgvoi3dwo'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786262807/products/iorlbo0pyejqsivhc9gn.jpg', 'products/iorlbo0pyejqsivhc9gn', 'Grassi', 2, false
from public.products where slug = 'grassi-k21'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'grassi-k21') and public_id = 'products/iorlbo0pyejqsivhc9gn'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Galante', 'galante-k22',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'galante'),
  'K22', 'Có beck ko tên', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLIY8B4T49"}'::jsonb
where not exists (select 1 from public.products where slug = 'galante-k22');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786263108/products/xbof28veq6rts36qhcty.jpg', 'products/xbof28veq6rts36qhcty', 'Galante', 0, true
from public.products where slug = 'galante-k22'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'galante-k22') and public_id = 'products/xbof28veq6rts36qhcty'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786263108/products/wn2qkcammzsfgeen6oin.jpg', 'products/wn2qkcammzsfgeen6oin', 'Galante', 1, false
from public.products where slug = 'galante-k22'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'galante-k22') and public_id = 'products/wn2qkcammzsfgeen6oin'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786263108/products/xlucgbm5f6qjy4p1krny.jpg', 'products/xlucgbm5f6qjy4p1krny', 'Galante', 2, false
from public.products where slug = 'galante-k22'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'galante-k22') and public_id = 'products/xlucgbm5f6qjy4p1krny'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786263108/products/ekx2kyg7ixsasjvcgsi4.jpg', 'products/ekx2kyg7ixsasjvcgsi4', 'Galante', 3, false
from public.products where slug = 'galante-k22'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'galante-k22') and public_id = 'products/ekx2kyg7ixsasjvcgsi4'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'MG', 'mg-k23',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'mg'),
  'K23', 'Không có beck', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLJPGXZGV8"}'::jsonb
where not exists (select 1 from public.products where slug = 'mg-k23');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786264387/products/itmz8lfnut5whd2grzgg.jpg', 'products/itmz8lfnut5whd2grzgg', 'MG', 0, true
from public.products where slug = 'mg-k23'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'mg-k23') and public_id = 'products/itmz8lfnut5whd2grzgg'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786264387/products/tkqz46ttvhirywaqvvz0.jpg', 'products/tkqz46ttvhirywaqvvz0', 'MG', 1, false
from public.products where slug = 'mg-k23'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'mg-k23') and public_id = 'products/tkqz46ttvhirywaqvvz0'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786264388/products/lymjtvwltgaxpgfsr3mt.jpg', 'products/lymjtvwltgaxpgfsr3mt', 'MG', 2, false
from public.products where slug = 'mg-k23'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'mg-k23') and public_id = 'products/lymjtvwltgaxpgfsr3mt'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Roxy', 'roxy-k24',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'roxy'),
  'K24', 'Không có beck', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLK2VMPTYD"}'::jsonb
where not exists (select 1 from public.products where slug = 'roxy-k24');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786265013/products/tv40mgjngrmatcd2wh0z.jpg', 'products/tv40mgjngrmatcd2wh0z', 'Roxy', 0, true
from public.products where slug = 'roxy-k24'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'roxy-k24') and public_id = 'products/tv40mgjngrmatcd2wh0z'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786265013/products/mbeyjbhs6fohjzazo6sz.jpg', 'products/mbeyjbhs6fohjzazo6sz', 'Roxy', 1, false
from public.products where slug = 'roxy-k24'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'roxy-k24') and public_id = 'products/mbeyjbhs6fohjzazo6sz'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786265013/products/d6gjqiaiudgcikietfyk.jpg', 'products/d6gjqiaiudgcikietfyk', 'Roxy', 2, false
from public.products where slug = 'roxy-k24'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'roxy-k24') and public_id = 'products/d6gjqiaiudgcikietfyk'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Playtech', 'playtech-k25',
  null,
  (select id from public.brands where slug = 'playtech'),
  'K25', 'Có beck ko tên', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLK8T49HQW"}'::jsonb
where not exists (select 1 from public.products where slug = 'playtech-k25');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786265292/products/iplzmlpacbzips4m7ggs.jpg', 'products/iplzmlpacbzips4m7ggs', 'Playtech', 0, true
from public.products where slug = 'playtech-k25'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'playtech-k25') and public_id = 'products/iplzmlpacbzips4m7ggs'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786265291/products/tdrehmih0jy6rs7pdigy.jpg', 'products/tdrehmih0jy6rs7pdigy', 'Playtech', 1, false
from public.products where slug = 'playtech-k25'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'playtech-k25') and public_id = 'products/tdrehmih0jy6rs7pdigy'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786265292/products/trobntzswehbxbuemytc.jpg', 'products/trobntzswehbxbuemytc', 'Playtech', 2, false
from public.products where slug = 'playtech-k25'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'playtech-k25') and public_id = 'products/trobntzswehbxbuemytc'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786265292/products/umo23sqx4aszpzhh0mc4.jpg', 'products/umo23sqx4aszpzhh0mc4', 'Playtech', 3, false
from public.products where slug = 'playtech-k25'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'playtech-k25') and public_id = 'products/umo23sqx4aszpzhh0mc4'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Marcato', 'marcato-k26',
  null,
  (select id from public.brands where slug = 'marcato'),
  'K26', 'Không có beck', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLZ4FSVZ1L"}'::jsonb
where not exists (select 1 from public.products where slug = 'marcato-k26');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786290258/products/glkhvb7qat57wbgklf14.jpg', 'products/glkhvb7qat57wbgklf14', 'Marcato', 0, true
from public.products where slug = 'marcato-k26'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-k26') and public_id = 'products/glkhvb7qat57wbgklf14'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786290258/products/i1ta8qaewrplle1lgbgr.jpg', 'products/i1ta8qaewrplle1lgbgr', 'Marcato', 1, false
from public.products where slug = 'marcato-k26'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-k26') and public_id = 'products/i1ta8qaewrplle1lgbgr'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786290259/products/pbor7a0x5iojiy30nkyb.jpg', 'products/pbor7a0x5iojiy30nkyb', 'Marcato', 2, false
from public.products where slug = 'marcato-k26'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-k26') and public_id = 'products/pbor7a0x5iojiy30nkyb'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Marcato tenor bạc', 'marcato-tenor-bac-k27',
  (select id from public.categories where slug = 'tenor'),
  (select id from public.brands where slug = 'marcato'),
  'K27', 'Không có beck', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLZBM3UQ55"}'::jsonb
where not exists (select 1 from public.products where slug = 'marcato-tenor-bac-k27');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786290609/products/r1wv7zxltzjylsdvhv27.jpg', 'products/r1wv7zxltzjylsdvhv27', 'Marcato tenor bạc', 0, true
from public.products where slug = 'marcato-tenor-bac-k27'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-tenor-bac-k27') and public_id = 'products/r1wv7zxltzjylsdvhv27'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786290609/products/ml1ffc0pzain0hkzuoui.jpg', 'products/ml1ffc0pzain0hkzuoui', 'Marcato tenor bạc', 1, false
from public.products where slug = 'marcato-tenor-bac-k27'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-tenor-bac-k27') and public_id = 'products/ml1ffc0pzain0hkzuoui'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786290609/products/uo32tv466ijmtxtihxul.jpg', 'products/uo32tv466ijmtxtihxul', 'Marcato tenor bạc', 2, false
from public.products where slug = 'marcato-tenor-bac-k27'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'marcato-tenor-bac-k27') and public_id = 'products/uo32tv466ijmtxtihxul'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Michael tenor', 'michael-tenor-k28',
  (select id from public.categories where slug = 'tenor'),
  (select id from public.brands where slug = 'michael'),
  'K28', 'Không có beck', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLZJEZ8M5H"}'::jsonb
where not exists (select 1 from public.products where slug = 'michael-tenor-k28');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786290979/products/bqejrhijngjzbv3psciz.jpg', 'products/bqejrhijngjzbv3psciz', 'Michael tenor', 0, true
from public.products where slug = 'michael-tenor-k28'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'michael-tenor-k28') and public_id = 'products/bqejrhijngjzbv3psciz'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786290979/products/lyeqcgijgz9exg7ymbdm.jpg', 'products/lyeqcgijgz9exg7ymbdm', 'Michael tenor', 1, false
from public.products where slug = 'michael-tenor-k28'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'michael-tenor-k28') and public_id = 'products/lyeqcgijgz9exg7ymbdm'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786290979/products/aahcwpkwdui92j9mfrqd.jpg', 'products/aahcwpkwdui92j9mfrqd', 'Michael tenor', 2, false
from public.products where slug = 'michael-tenor-k28'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'michael-tenor-k28') and public_id = 'products/aahcwpkwdui92j9mfrqd'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Mavis', 'mavis-k29',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'mavis'),
  'K29', 'Có beck Hermes', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLZPT5TLVA"}'::jsonb
where not exists (select 1 from public.products where slug = 'mavis-k29');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786291240/products/vv1msxujc8swogx3iat0.jpg', 'products/vv1msxujc8swogx3iat0', 'Mavis', 0, true
from public.products where slug = 'mavis-k29'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'mavis-k29') and public_id = 'products/vv1msxujc8swogx3iat0'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786291239/products/yigtcbmj54ti4paxgz09.jpg', 'products/yigtcbmj54ti4paxgz09', 'Mavis', 1, false
from public.products where slug = 'mavis-k29'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'mavis-k29') and public_id = 'products/yigtcbmj54ti4paxgz09'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786291245/products/mu9dzgw3lbwzwdsswaow.jpg', 'products/mu9dzgw3lbwzwdsswaow', 'Mavis', 2, false
from public.products where slug = 'mavis-k29'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'mavis-k29') and public_id = 'products/mu9dzgw3lbwzwdsswaow'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786291245/products/jtv1caw7kqtzgmloufic.jpg', 'products/jtv1caw7kqtzgmloufic', 'Mavis', 3, false
from public.products where slug = 'mavis-k29'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'mavis-k29') and public_id = 'products/jtv1caw7kqtzgmloufic'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Yamaha', 'yamaha-k30',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'yamaha'),
  'K30', 'Không có beck', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLZT1DIDZ5"}'::jsonb
where not exists (select 1 from public.products where slug = 'yamaha-k30');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786291431/products/edozhjafekq7rktvkubw.jpg', 'products/edozhjafekq7rktvkubw', 'Yamaha', 0, true
from public.products where slug = 'yamaha-k30'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-k30') and public_id = 'products/edozhjafekq7rktvkubw'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786291431/products/mhegma8emvqivzkt2si3.jpg', 'products/mhegma8emvqivzkt2si3', 'Yamaha', 1, false
from public.products where slug = 'yamaha-k30'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-k30') and public_id = 'products/mhegma8emvqivzkt2si3'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786291432/products/tzrdryfwnx9wvscp103w.jpg', 'products/tzrdryfwnx9wvscp103w', 'Yamaha', 2, false
from public.products where slug = 'yamaha-k30'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-k30') and public_id = 'products/tzrdryfwnx9wvscp103w'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'MG sop', 'mg-sop-k31',
  (select id from public.categories where slug = 'soprano'),
  (select id from public.brands where slug = 'mg'),
  'K31', null, 0, 'new',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSLZZ7FCFSA"}'::jsonb
where not exists (select 1 from public.products where slug = 'mg-sop-k31');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786291715/products/bhzyiwxnebarbuzwdinf.jpg', 'products/bhzyiwxnebarbuzwdinf', 'MG sop', 0, true
from public.products where slug = 'mg-sop-k31'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'mg-sop-k31') and public_id = 'products/bhzyiwxnebarbuzwdinf'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786291715/products/jlyhtppbpnor7rwm7ukn.jpg', 'products/jlyhtppbpnor7rwm7ukn', 'MG sop', 1, false
from public.products where slug = 'mg-sop-k31'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'mg-sop-k31') and public_id = 'products/jlyhtppbpnor7rwm7ukn'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786291715/products/wpzt4mx7nutwzzcl8gvo.jpg', 'products/wpzt4mx7nutwzzcl8gvo', 'MG sop', 2, false
from public.products where slug = 'mg-sop-k31'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'mg-sop-k31') and public_id = 'products/wpzt4mx7nutwzzcl8gvo'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Splendor', 'splendor-k32',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'splendor'),
  'K32', null, 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSM0EMK5L3L"}'::jsonb
where not exists (select 1 from public.products where slug = 'splendor-k32');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786292422/products/qmdm2l7fbdtueok4ekdu.jpg', 'products/qmdm2l7fbdtueok4ekdu', 'Splendor', 0, true
from public.products where slug = 'splendor-k32'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'splendor-k32') and public_id = 'products/qmdm2l7fbdtueok4ekdu'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786292421/products/redrxdtapyw5wpg0ggia.jpg', 'products/redrxdtapyw5wpg0ggia', 'Splendor', 1, false
from public.products where slug = 'splendor-k32'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'splendor-k32') and public_id = 'products/redrxdtapyw5wpg0ggia'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786292422/products/s1ggz4iht6hskjalc0iz.jpg', 'products/s1ggz4iht6hskjalc0iz', 'Splendor', 2, false
from public.products where slug = 'splendor-k32'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'splendor-k32') and public_id = 'products/s1ggz4iht6hskjalc0iz'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Galante', 'galante-k38',
  null,
  (select id from public.brands where slug = 'galante'),
  'K38', null, 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSM1IYB5MZ2"}'::jsonb
where not exists (select 1 from public.products where slug = 'galante-k38');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786294328/products/p1iauy0pep2edijhac8x.jpg', 'products/p1iauy0pep2edijhac8x', 'Galante', 0, true
from public.products where slug = 'galante-k38'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'galante-k38') and public_id = 'products/p1iauy0pep2edijhac8x'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786294328/products/ousfbby5gbjezadpqhxw.jpg', 'products/ousfbby5gbjezadpqhxw', 'Galante', 1, false
from public.products where slug = 'galante-k38'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'galante-k38') and public_id = 'products/ousfbby5gbjezadpqhxw'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786294328/products/av312aacsfiy5wxtf6fd.jpg', 'products/av312aacsfiy5wxtf6fd', 'Galante', 2, false
from public.products where slug = 'galante-k38'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'galante-k38') and public_id = 'products/av312aacsfiy5wxtf6fd'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Yamaha bạc ghẻ', 'yamaha-bac-ghe-k34',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'yamaha'),
  'K34', null, 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSM0TBEKOER"}'::jsonb
where not exists (select 1 from public.products where slug = 'yamaha-bac-ghe-k34');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786293133/products/jrqzowemobrzmm7ctvro.jpg', 'products/jrqzowemobrzmm7ctvro', 'Yamaha bạc ghẻ', 0, true
from public.products where slug = 'yamaha-bac-ghe-k34'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-bac-ghe-k34') and public_id = 'products/jrqzowemobrzmm7ctvro'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786293133/products/xmmoto4fhgrt3nkbmklv.jpg', 'products/xmmoto4fhgrt3nkbmklv', 'Yamaha bạc ghẻ', 1, false
from public.products where slug = 'yamaha-bac-ghe-k34'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-bac-ghe-k34') and public_id = 'products/xmmoto4fhgrt3nkbmklv'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786293133/products/peht2ewiesrhlr0tiz2c.jpg', 'products/peht2ewiesrhlr0tiz2c', 'Yamaha bạc ghẻ', 2, false
from public.products where slug = 'yamaha-bac-ghe-k34'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'yamaha-bac-ghe-k34') and public_id = 'products/peht2ewiesrhlr0tiz2c'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Mombasa', 'mombasa-k33',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'mombasa'),
  'K33', 'Hộp rách', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSM0OSE9HKH"}'::jsonb
where not exists (select 1 from public.products where slug = 'mombasa-k33');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786292915/products/eeb7bzgf2vq2dyh8wz1p.jpg', 'products/eeb7bzgf2vq2dyh8wz1p', 'Mombasa', 0, true
from public.products where slug = 'mombasa-k33'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'mombasa-k33') and public_id = 'products/eeb7bzgf2vq2dyh8wz1p'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786292915/products/ekxzaphwthjq2rimoids.jpg', 'products/ekxzaphwthjq2rimoids', 'Mombasa', 1, false
from public.products where slug = 'mombasa-k33'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'mombasa-k33') and public_id = 'products/ekxzaphwthjq2rimoids'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786292915/products/vgsb1nnjxzg03rjkr2q1.jpg', 'products/vgsb1nnjxzg03rjkr2q1', 'Mombasa', 2, false
from public.products where slug = 'mombasa-k33'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'mombasa-k33') and public_id = 'products/vgsb1nnjxzg03rjkr2q1'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786292960/products/ufy5vcnnsfynepiu2gje.jpg', 'products/ufy5vcnnsfynepiu2gje', 'Mombasa', 3, false
from public.products where slug = 'mombasa-k33'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'mombasa-k33') and public_id = 'products/ufy5vcnnsfynepiu2gje'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Galante', 'galante-k35',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'galante'),
  'K35', null, 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSM0XIJP7DA"}'::jsonb
where not exists (select 1 from public.products where slug = 'galante-k35');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786293312/products/dqc7cr30tsxzvuhbku3j.jpg', 'products/dqc7cr30tsxzvuhbku3j', 'Galante', 0, true
from public.products where slug = 'galante-k35'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'galante-k35') and public_id = 'products/dqc7cr30tsxzvuhbku3j'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786293312/products/sii2jnbgtmuluxtmpnh9.jpg', 'products/sii2jnbgtmuluxtmpnh9', 'Galante', 1, false
from public.products where slug = 'galante-k35'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'galante-k35') and public_id = 'products/sii2jnbgtmuluxtmpnh9'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786293312/products/kazr22f9tswrucuxjlul.jpg', 'products/kazr22f9tswrucuxjlul', 'Galante', 2, false
from public.products where slug = 'galante-k35'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'galante-k35') and public_id = 'products/kazr22f9tswrucuxjlul'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Roxy', 'roxy-k36',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'roxy'),
  'K36', null, 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSM15A5UVMK"}'::jsonb
where not exists (select 1 from public.products where slug = 'roxy-k36');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786293704/products/smvujc2dtcpe7h8gmcg9.jpg', 'products/smvujc2dtcpe7h8gmcg9', 'Roxy', 0, true
from public.products where slug = 'roxy-k36'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'roxy-k36') and public_id = 'products/smvujc2dtcpe7h8gmcg9'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786293704/products/tnm1m6j8rcuktgfvhn34.jpg', 'products/tnm1m6j8rcuktgfvhn34', 'Roxy', 1, false
from public.products where slug = 'roxy-k36'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'roxy-k36') and public_id = 'products/tnm1m6j8rcuktgfvhn34'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786293704/products/zfky5heuuhfncxol6cv3.jpg', 'products/zfky5heuuhfncxol6cv3', 'Roxy', 2, false
from public.products where slug = 'roxy-k36'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'roxy-k36') and public_id = 'products/zfky5heuuhfncxol6cv3'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Playtech', 'playtech-k37',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'playtech'),
  'K37', null, 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSM1AD2W0YG"}'::jsonb
where not exists (select 1 from public.products where slug = 'playtech-k37');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786293925/products/ad7yia4e1juisqtr9por.jpg', 'products/ad7yia4e1juisqtr9por', 'Playtech', 0, true
from public.products where slug = 'playtech-k37'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'playtech-k37') and public_id = 'products/ad7yia4e1juisqtr9por'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786293925/products/epf1uhkhzrz9jof3yoed.jpg', 'products/epf1uhkhzrz9jof3yoed', 'Playtech', 1, false
from public.products where slug = 'playtech-k37'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'playtech-k37') and public_id = 'products/epf1uhkhzrz9jof3yoed'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786293925/products/sm9azbciwfri4nqepthc.jpg', 'products/sm9azbciwfri4nqepthc', 'Playtech', 2, false
from public.products where slug = 'playtech-k37'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'playtech-k37') and public_id = 'products/sm9azbciwfri4nqepthc'
);

insert into public.products (
  name, slug, category_id, brand_id, sku, description, price, condition,
  status, featured, stock_quantity, specifications
)
select
  'Maxstone', 'maxstone-k39',
  null,
  (select id from public.brands where slug = 'maxtone'),
  'K39', 'Có beck
Kèn long hết phím', 0, 'used',
  'hidden', false, 1, '{"imported_from":"sax-stock-manager","original_product_id":"PRDMSM1TQQ4FFD"}'::jsonb
where not exists (select 1 from public.products where slug = 'maxstone-k39');

insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786294787/products/egstt3xbqtraed87gpou.jpg', 'products/egstt3xbqtraed87gpou', 'Maxstone', 0, true
from public.products where slug = 'maxstone-k39'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'maxstone-k39') and public_id = 'products/egstt3xbqtraed87gpou'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786294787/products/tv4s5dknls3nd3bjzv2n.jpg', 'products/tv4s5dknls3nd3bjzv2n', 'Maxstone', 1, false
from public.products where slug = 'maxstone-k39'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'maxstone-k39') and public_id = 'products/tv4s5dknls3nd3bjzv2n'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786294787/products/v4dqabonb3niawghz7yt.jpg', 'products/v4dqabonb3niawghz7yt', 'Maxstone', 2, false
from public.products where slug = 'maxstone-k39'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'maxstone-k39') and public_id = 'products/v4dqabonb3niawghz7yt'
);
insert into public.product_images (product_id, url, public_id, alt_text, sort_order, is_thumbnail)
select id, 'https://res.cloudinary.com/jubredgn/image/upload/v1786294787/products/d3vsxrgnfa2qph7q9wd8.jpg', 'products/d3vsxrgnfa2qph7q9wd8', 'Maxstone', 3, false
from public.products where slug = 'maxstone-k39'
and not exists (
  select 1 from public.product_images where product_id = (select id from public.products where slug = 'maxstone-k39') and public_id = 'products/d3vsxrgnfa2qph7q9wd8'
);

