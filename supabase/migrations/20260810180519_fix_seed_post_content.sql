-- Sửa nội dung 3 bài blog test: migration seed trước dùng "\n" trong string
-- literal SQL, nhưng Postgres không hiểu đó là ký tự xuống dòng (chỉ là hai
-- ký tự backslash + n), khiến Markdown bị gộp thành một dòng và render sai.
-- Dùng xuống dòng thật trong string literal ở đây.

update public.posts
set content = '# Yamaha YAS-62 có đáng mua không?

Yamaha YAS-62 là một trong những dòng saxophone alto bán chuyên được đánh giá cao nhất, nhờ độ bền, âm thanh ổn định và giá trị bán lại tốt.

## Ưu điểm

- Âm thanh ấm, đều ở mọi quãng
- Cơ chế phím bền, ít hư hỏng vặt
- Phụ tùng, thợ sửa phổ biến tại Việt Nam

## Có đáng mua bản đã qua sử dụng?

Nếu được kiểm tra kỹ tình trạng pad, leak và body trước khi mua, YAS-62 cũ vẫn là lựa chọn rất đáng cân nhắc so với nhiều dòng mới cùng tầm giá.

*(Nội dung test, sẽ cập nhật đầy đủ sau.)*'
where slug = 'yamaha-yas-62-co-dang-mua-khong';

update public.posts
set content = '# Cách kiểm tra saxophone cũ trước khi mua

Khi mua saxophone cũ, cần kiểm tra kỹ các điểm sau trước khi quyết định.

## 1. Kiểm tra pad

Ấn nhẹ từng phím, quan sát pad có bị mòn, rách hoặc đóng không kín hay không.

## 2. Kiểm tra leak (rò khí)

Bịt kín chuông và thử thổi - nếu hơi thoát ra dễ dàng, khả năng cao đàn đang bị leak.

## 3. Kiểm tra thân và cần (neck)

Quan sát các vết móp, hàn lại hoặc cong vênh ở thân và neck - đây là những lỗi khó và tốn kém để sửa.

*(Nội dung test, sẽ cập nhật đầy đủ sau.)*'
where slug = 'cach-kiem-tra-saxophone-cu-truoc-khi-mua';

update public.posts
set content = '# Alto vs Tenor: Nên chọn loại nào cho người mới?

Đây là câu hỏi phổ biến nhất của người mới bắt đầu học saxophone.

## Alto saxophone

Kích thước nhỏ gọn hơn, nhẹ hơn, dễ cầm và thổi hơn - thường được khuyên cho người mới, đặc biệt là học sinh.

## Tenor saxophone

Âm vực trầm và dày hơn, phổ biến trong nhạc jazz, nhưng đòi hỏi hơi thở khỏe hơn một chút so với alto.

## Kết luận

Nếu chưa chắc chắn, alto vẫn là lựa chọn an toàn hơn cho người mới bắt đầu.

*(Nội dung test, sẽ cập nhật đầy đủ sau.)*'
where slug = 'alto-vs-tenor-nen-chon-loai-nao-cho-nguoi-moi';
