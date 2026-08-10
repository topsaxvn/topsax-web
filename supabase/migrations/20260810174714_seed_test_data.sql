-- TOPSAX - dữ liệu test cho môi trường phát triển.
-- An toàn chạy nhiều lần: dùng slug làm khóa "upsert" (on conflict do nothing)
-- nên có thể chạy lại mà không tạo bản ghi trùng.

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug, description, sort_order) values
  ('Saxophone', 'saxophone', 'Saxophone mới và đã qua sử dụng', 1),
  ('Phụ kiện', 'phu-kien', 'Phụ kiện saxophone chính hãng', 2)
on conflict (slug) do nothing;

insert into public.categories (name, slug, description, parent_id, sort_order)
select 'Alto', 'alto', 'Saxophone Alto', (select id from public.categories where slug = 'saxophone'), 1
where not exists (select 1 from public.categories where slug = 'alto');

insert into public.categories (name, slug, description, parent_id, sort_order)
select 'Tenor', 'tenor', 'Saxophone Tenor', (select id from public.categories where slug = 'saxophone'), 2
where not exists (select 1 from public.categories where slug = 'tenor');

insert into public.categories (name, slug, description, parent_id, sort_order)
select 'Baritone', 'baritone', 'Saxophone Baritone', (select id from public.categories where slug = 'saxophone'), 3
where not exists (select 1 from public.categories where slug = 'baritone');

insert into public.categories (name, slug, description, parent_id, sort_order)
select 'Mouthpiece', 'mouthpiece', 'Mouthpiece saxophone', (select id from public.categories where slug = 'phu-kien'), 1
where not exists (select 1 from public.categories where slug = 'mouthpiece');

insert into public.categories (name, slug, description, parent_id, sort_order)
select 'Reed', 'reed', 'Reed (lưỡi gà) saxophone', (select id from public.categories where slug = 'phu-kien'), 2
where not exists (select 1 from public.categories where slug = 'reed');

insert into public.categories (name, slug, description, parent_id, sort_order)
select 'Ligature', 'ligature', 'Ligature saxophone', (select id from public.categories where slug = 'phu-kien'), 3
where not exists (select 1 from public.categories where slug = 'ligature');

insert into public.categories (name, slug, description, parent_id, sort_order)
select 'Case', 'case', 'Hộp đựng saxophone', (select id from public.categories where slug = 'phu-kien'), 4
where not exists (select 1 from public.categories where slug = 'case');

-- ---------------------------------------------------------------------------
-- brands
-- ---------------------------------------------------------------------------
insert into public.brands (name, slug, description) values
  ('Yamaha', 'yamaha', 'Thương hiệu nhạc cụ Nhật Bản, phổ biến với người mới và người chơi bán chuyên'),
  ('Selmer', 'selmer', 'Thương hiệu saxophone cao cấp của Pháp'),
  ('Jupiter', 'jupiter', 'Thương hiệu nhạc cụ phổ thông, giá tốt cho người mới bắt đầu'),
  ('Vandoren', 'vandoren', 'Chuyên reed và mouthpiece cho kèn hơi'),
  ('Rovner', 'rovner', 'Chuyên ligature cho saxophone và clarinet'),
  ('BAM', 'bam', 'Thương hiệu case và phụ kiện bảo vệ nhạc cụ')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- products - saxophone
-- ---------------------------------------------------------------------------
insert into public.products (
  name, slug, category_id, brand_id, model, description, short_description,
  price, condition, status, featured, year, specifications
)
select
  'Yamaha YAS-280', 'yamaha-yas-280',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'yamaha'),
  'YAS-280',
  'Saxophone alto dành cho người mới bắt đầu, dễ thổi, âm thanh ổn định, phù hợp học sinh - sinh viên.',
  'Alto saxophone cho người mới bắt đầu',
  16500000, 'new', 'available', true, 2024,
  '{"key": "Eb", "finish": "Gold lacquer", "case_included": true}'::jsonb
where not exists (select 1 from public.products where slug = 'yamaha-yas-280');

insert into public.products (
  name, slug, category_id, brand_id, model, description, short_description,
  price, condition, status, featured, year, specifications
)
select
  'Yamaha YAS-480', 'yamaha-yas-480',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'yamaha'),
  'YAS-480',
  'Saxophone alto tầm trung, nâng cấp từ dòng student, phù hợp người chơi đã có nền tảng cơ bản.',
  'Alto saxophone tầm trung',
  28900000, 'new', 'available', true, 2024,
  '{"key": "Eb", "finish": "Gold lacquer", "case_included": true}'::jsonb
where not exists (select 1 from public.products where slug = 'yamaha-yas-480');

insert into public.products (
  name, slug, category_id, brand_id, model, description, short_description,
  price, condition, status, featured, year, serial_number, specifications
)
select
  'Yamaha YAS-62', 'yamaha-yas-62',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'yamaha'),
  'YAS-62',
  'Dòng alto bán chuyên được ưa chuộng nhất của Yamaha. Sản phẩm đã qua sử dụng, đã kiểm tra pad, leak và tình trạng body trước khi bán.',
  'Alto saxophone bán chuyên, đã kiểm tra kỹ',
  25000000, 'used', 'available', true, 2016, 'TEST-SN-YAS62-001',
  '{"key": "Eb", "finish": "Gold lacquer", "pad_condition": "good", "body_condition": "good", "neck_condition": "good"}'::jsonb
where not exists (select 1 from public.products where slug = 'yamaha-yas-62');

insert into public.products (
  name, slug, category_id, brand_id, model, description, short_description,
  price, condition, status, featured, year, specifications
)
select
  'Yamaha YTS-62', 'yamaha-yts-62',
  (select id from public.categories where slug = 'tenor'),
  (select id from public.brands where slug = 'yamaha'),
  'YTS-62',
  'Saxophone tenor bán chuyên, âm thanh dày và ấm, phù hợp chơi jazz và nhạc nhẹ.',
  'Tenor saxophone bán chuyên',
  27500000, 'used', 'available', false, 2015,
  '{"key": "Bb", "finish": "Gold lacquer", "pad_condition": "good"}'::jsonb
where not exists (select 1 from public.products where slug = 'yamaha-yts-62');

insert into public.products (
  name, slug, category_id, brand_id, model, description, short_description,
  price, condition, status, featured, year, specifications
)
select
  'Jupiter JAS-1100', 'jupiter-jas-1100',
  (select id from public.categories where slug = 'alto'),
  (select id from public.brands where slug = 'jupiter'),
  'JAS-1100',
  'Saxophone alto giá tốt cho người mới bắt đầu, thiết kế chắc chắn, dễ bảo trì.',
  'Alto saxophone giá tốt cho người mới',
  12500000, 'new', 'available', false, 2024,
  '{"key": "Eb", "finish": "Gold lacquer", "case_included": true}'::jsonb
where not exists (select 1 from public.products where slug = 'jupiter-jas-1100');

insert into public.products (
  name, slug, category_id, brand_id, model, description, short_description,
  price, condition, status, featured, year, specifications
)
select
  'Selmer Series II', 'selmer-series-ii',
  (select id from public.categories where slug = 'tenor'),
  (select id from public.brands where slug = 'selmer'),
  'Series II',
  'Saxophone tenor cao cấp của Pháp. Sản phẩm mẫu này đã bán, giữ lại trang để tham khảo.',
  'Tenor saxophone cao cấp (đã bán)',
  68000000, 'used', 'sold', false, 2010,
  '{"key": "Bb", "finish": "Gold lacquer"}'::jsonb
where not exists (select 1 from public.products where slug = 'selmer-series-ii');

insert into public.products (
  name, slug, category_id, brand_id, model, description, short_description,
  price, condition, status, featured, year, specifications
)
select
  'Yamaha YBS-52', 'yamaha-ybs-52',
  (select id from public.categories where slug = 'baritone'),
  (select id from public.brands where slug = 'yamaha'),
  'YBS-52',
  'Saxophone baritone phù hợp dàn kèn, ban nhạc trường học và nhóm nhạc.',
  'Baritone saxophone cho dàn kèn',
  56000000, 'new', 'available', false, 2023,
  '{"key": "Eb", "finish": "Gold lacquer"}'::jsonb
where not exists (select 1 from public.products where slug = 'yamaha-ybs-52');

-- ---------------------------------------------------------------------------
-- products - phụ kiện
-- ---------------------------------------------------------------------------
insert into public.products (
  name, slug, category_id, brand_id, model, description, short_description,
  price, condition, status, featured, specifications
)
select
  'Mouthpiece Yamaha 4C', 'mouthpiece-yamaha-4c',
  (select id from public.categories where slug = 'mouthpiece'),
  (select id from public.brands where slug = 'yamaha'),
  '4C',
  'Mouthpiece tiêu chuẩn đi kèm saxophone alto Yamaha, phù hợp người mới bắt đầu.',
  'Mouthpiece alto phổ biến cho người mới',
  650000, 'new', 'available', true,
  '{"for_instrument": "Alto"}'::jsonb
where not exists (select 1 from public.products where slug = 'mouthpiece-yamaha-4c');

insert into public.products (
  name, slug, category_id, brand_id, model, description, short_description,
  price, condition, status, featured, specifications
)
select
  'Reed Vandoren Java (hộp 10)', 'reed-vandoren-java-hop-10',
  (select id from public.categories where slug = 'reed'),
  (select id from public.brands where slug = 'vandoren'),
  'Java',
  'Hộp 10 reed Vandoren Java, độ cứng 2.5, phù hợp saxophone alto.',
  'Reed alto, độ cứng 2.5, hộp 10 chiếc',
  850000, 'new', 'available', true,
  '{"strength": 2.5, "for_instrument": "Alto"}'::jsonb
where not exists (select 1 from public.products where slug = 'reed-vandoren-java-hop-10');

insert into public.products (
  name, slug, category_id, brand_id, model, description, short_description,
  price, condition, status, featured, specifications
)
select
  'Ligature Rovner Dark', 'ligature-rovner-dark',
  (select id from public.categories where slug = 'ligature'),
  (select id from public.brands where slug = 'rovner'),
  'Dark',
  'Ligature vải bọc dây, cho âm thanh ấm và tối, dễ sử dụng.',
  'Ligature cho âm thanh ấm, dễ dùng',
  450000, 'new', 'available', false,
  '{"for_instrument": "Alto"}'::jsonb
where not exists (select 1 from public.products where slug = 'ligature-rovner-dark');

insert into public.products (
  name, slug, category_id, brand_id, model, description, short_description,
  price, condition, status, featured, specifications
)
select
  'Case BAM Hightech', 'case-bam-hightech',
  (select id from public.categories where slug = 'case'),
  (select id from public.brands where slug = 'bam'),
  'Hightech',
  'Case chống sốc, chống nước cho saxophone alto, có quai đeo vai.',
  'Case chống sốc cho saxophone alto',
  4200000, 'new', 'available', false,
  '{"for_instrument": "Alto"}'::jsonb
where not exists (select 1 from public.products where slug = 'case-bam-hightech');

-- ---------------------------------------------------------------------------
-- blog_categories
-- ---------------------------------------------------------------------------
insert into public.blog_categories (name, slug, description) values
  ('Chọn saxophone', 'chon-saxophone', 'Hướng dẫn chọn mua saxophone phù hợp'),
  ('Kiểm tra và sửa chữa', 'kiem-tra-va-sua-chua', 'Kiểm tra tình trạng và sửa chữa saxophone'),
  ('So sánh model', 'so-sanh-model', 'So sánh các dòng saxophone'),
  ('Phụ kiện', 'phu-kien-blog', 'Kiến thức về phụ kiện saxophone'),
  ('Hướng dẫn chơi và bảo quản', 'huong-dan-choi-va-bao-quan', 'Hướng dẫn chơi và bảo quản saxophone')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------
insert into public.posts (title, slug, excerpt, content, category_id, status, published_at)
select
  'Yamaha YAS-62 có đáng mua không?',
  'yamaha-yas-62-co-dang-mua-khong',
  'Đánh giá chi tiết Yamaha YAS-62 - dòng alto saxophone bán chuyên được ưa chuộng nhất của Yamaha.',
  '# Yamaha YAS-62 có đáng mua không?

Yamaha YAS-62 là một trong những dòng saxophone alto bán chuyên được đánh giá cao nhất, nhờ độ bền, âm thanh ổn định và giá trị bán lại tốt.

## Ưu điểm

- Âm thanh ấm, đều ở mọi quãng
- Cơ chế phím bền, ít hư hỏng vặt
- Phụ tùng, thợ sửa phổ biến tại Việt Nam

## Có đáng mua bản đã qua sử dụng?

Nếu được kiểm tra kỹ tình trạng pad, leak và body trước khi mua, YAS-62 cũ vẫn là lựa chọn rất đáng cân nhắc so với nhiều dòng mới cùng tầm giá.

*(Nội dung test, sẽ cập nhật đầy đủ sau.)*',
  (select id from public.blog_categories where slug = 'so-sanh-model'),
  'published', now()
where not exists (select 1 from public.posts where slug = 'yamaha-yas-62-co-dang-mua-khong');

insert into public.posts (title, slug, excerpt, content, category_id, status, published_at)
select
  'Cách kiểm tra saxophone cũ trước khi mua',
  'cach-kiem-tra-saxophone-cu-truoc-khi-mua',
  'Những điểm cần kiểm tra khi mua saxophone cũ: pad, leak, tình trạng body và neck.',
  '# Cách kiểm tra saxophone cũ trước khi mua

Khi mua saxophone cũ, cần kiểm tra kỹ các điểm sau trước khi quyết định.

## 1. Kiểm tra pad

Ấn nhẹ từng phím, quan sát pad có bị mòn, rách hoặc đóng không kín hay không.

## 2. Kiểm tra leak (rò khí)

Bịt kín chuông và thử thổi - nếu hơi thoát ra dễ dàng, khả năng cao đàn đang bị leak.

## 3. Kiểm tra thân và cần (neck)

Quan sát các vết móp, hàn lại hoặc cong vênh ở thân và neck - đây là những lỗi khó và tốn kém để sửa.

*(Nội dung test, sẽ cập nhật đầy đủ sau.)*',
  (select id from public.blog_categories where slug = 'kiem-tra-va-sua-chua'),
  'published', now()
where not exists (select 1 from public.posts where slug = 'cach-kiem-tra-saxophone-cu-truoc-khi-mua');

insert into public.posts (title, slug, excerpt, content, category_id, status, published_at)
select
  'Alto vs Tenor: Nên chọn loại nào cho người mới?',
  'alto-vs-tenor-nen-chon-loai-nao-cho-nguoi-moi',
  'So sánh saxophone alto và tenor để giúp người mới bắt đầu chọn đúng loại phù hợp.',
  '# Alto vs Tenor: Nên chọn loại nào cho người mới?

Đây là câu hỏi phổ biến nhất của người mới bắt đầu học saxophone.

## Alto saxophone

Kích thước nhỏ gọn hơn, nhẹ hơn, dễ cầm và thổi hơn - thường được khuyên cho người mới, đặc biệt là học sinh.

## Tenor saxophone

Âm vực trầm và dày hơn, phổ biến trong nhạc jazz, nhưng đòi hỏi hơi thở khỏe hơn một chút so với alto.

## Kết luận

Nếu chưa chắc chắn, alto vẫn là lựa chọn an toàn hơn cho người mới bắt đầu.

*(Nội dung test, sẽ cập nhật đầy đủ sau.)*',
  (select id from public.blog_categories where slug = 'chon-saxophone'),
  'published', now()
where not exists (select 1 from public.posts where slug = 'alto-vs-tenor-nen-chon-loai-nao-cho-nguoi-moi');
