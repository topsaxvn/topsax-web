# TOPSAX Website — UX, SEO, Conversion & Technical Audit

**Website hiện tại:** `https://topsaxvn.vercel.app/`  
**Mục tiêu:** Website giới thiệu và tạo khách hàng tiềm năng cho cửa hàng saxophone TOPSAX  
**Mô hình kinh doanh:** Không cần checkout/payment. Khách xem sản phẩm → tìm hiểu → liên hệ qua điện thoại/Zalo hoặc đến cửa hàng.

---

# 1. Mục tiêu sản phẩm

TOPSAX không nên được xây dựng như một ecommerce website đầy đủ.

Mục tiêu chính của website là:

1. Tạo niềm tin.
2. Giúp khách tìm đúng loại saxophone.
3. Giải thích kiến thức cho người mới.
4. Trưng bày sản phẩm rõ ràng.
5. Đưa khách đến hành động cuối cùng:
   - Gọi điện.
   - Nhắn Zalo.
   - Đến cửa hàng.
   - Hỏi tư vấn.
6. Tăng lượng khách tìm thấy TOPSAX thông qua Google.

Website phải ưu tiên **conversion và trust** hơn là số lượng tính năng.

---

# 2. Đánh giá tổng thể

## Điểm mạnh hiện tại

- Branding TOPSAX khá rõ.
- Tập trung vào một niche cụ thể: saxophone.
- Hero section có thông điệp dễ hiểu.
- Có sản phẩm và giá.
- Có blog.
- Có thông tin liên hệ.
- Có định hướng bán cả saxophone mới, saxophone cũ và phụ kiện.
- Kiến trúc hiện tại phù hợp để tiếp tục phát triển.
- Không cần xây ecommerce phức tạp.

## Các vấn đề lớn cần giải quyết

### P0 — Critical

1. Hình ảnh sản phẩm chưa đủ mạnh.
2. Product detail chưa thể hiện đầy đủ thông tin giúp khách quyết định.
3. Trust signal còn yếu.
4. CTA chưa được tối ưu xuyên suốt website.
5. Cần kiểm tra kỹ SEO technical.
6. Cần thiết kế rõ conversion funnel.

### P1 — High

1. Cần xây hệ thống phân loại sản phẩm tốt hơn.
2. Cần tăng internal linking giữa blog và sản phẩm.
3. Cần xây landing page cho người mới.
4. Cần làm nổi bật dịch vụ tư vấn.
5. Cần có nội dung chuyên sâu về saxophone cũ.
6. Cần tối ưu mobile.

### P2 — Medium

1. Review/testimonial.
2. FAQ.
3. Comparison.
4. Breadcrumb.
5. Related products.
6. Schema nâng cao.
7. Search/filter sản phẩm.

---

# 3. Nguyên tắc thiết kế

Không redesign theo hướng quá nhiều animation.

TOPSAX nên có cảm giác:

- chuyên nghiệp
- đáng tin
- am hiểu saxophone
- hơi premium
- nhưng vẫn gần gũi
- dễ sử dụng trên điện thoại

Không biến website thành một "template ecommerce".

Visual hierarchy phải ưu tiên:

```text
Product
   ↓
Trust
   ↓
Information
   ↓
Contact
```

---

# 4. Homepage

Homepage nên có cấu trúc:

```text
HEADER
│
├── Logo
├── Saxophone
├── Phụ kiện
├── Saxophone cũ
├── Blog
├── Về TOPSAX
└── Liên hệ
│
HERO
│
FEATURED PRODUCTS
│
WHY TOPSAX
│
NEW / USED SAXOPHONE
│
BUYING GUIDE
│
USED SAXOPHONE INSPECTION
│
BLOG
│
STORE / LOCATION
│
CTA
│
FOOTER
```

---

# 5. Hero section

Giữ concept hiện tại nhưng tối ưu conversion.

Hero cần trả lời ngay 3 câu:

### TOPSAX là ai?

Cửa hàng chuyên saxophone.

### Bán gì?

Saxophone mới, saxophone cũ và phụ kiện.

### Tôi phải làm gì?

Xem sản phẩm hoặc nhận tư vấn.

CTA nên có hai cấp:

**Primary:**
`Xem saxophone`

**Secondary:**
`Tư vấn chọn kèn`

Có thể giữ câu branding có cá tính:

> "Chúng tôi luôn có cây saxophone bạn cần."

Nếu giữ câu:

> "Chúng tôi đảm bảo bạn thở được thì kèn thổi được"

hãy sử dụng như brand personality, không biến nó thành claim kỹ thuật tuyệt đối.

Hero image nên là ảnh saxophone thật hoặc ảnh cửa hàng thật, tránh stock image nếu có thể.

---

# 6. Product section

Không chỉ hiển thị:

```text
Tên
Giá
Ảnh
```

Product card nên có:

```text
[IMAGE]

Yamaha YAS-280

NEW
Alto Saxophone

16.500.000 ₫

✓ Phù hợp người mới
✓ Có case
✓ Có kiểm tra trước khi giao

[Xem chi tiết]
```

Đối với hàng cũ:

```text
[IMAGE]

Yamaha YAS-62

USED
Tình trạng: Rất tốt

xx.xxx.xxx ₫

✓ Đã kiểm tra
✓ Test kín hơi
✓ Test toàn bộ phím

[Xem chi tiết]
```

Không dùng quá nhiều text trên card.

---

# 7. Product Detail Page

Đây là một trong những phần cần đầu tư nhất.

URL đề xuất:

```text
/saxophone/yamaha-yas-280
/saxophone/yamaha-yas-480
/saxophone-cu/yamaha-yas-62
```

Cấu trúc:

```text
Breadcrumb

Gallery
│
├── Main image
├── Thumbnail
├── Thumbnail
└── Thumbnail

Product information
│
├── Brand
├── Model
├── Type
├── Condition
├── Price
├── Availability
│
├── CTA: Gọi ngay
├── CTA: Nhắn Zalo
└── CTA: Nhận tư vấn

Description

Specifications

What's included

Condition / inspection

Warranty

Who is this saxophone for?

FAQ

Related products

Related articles
```

---

# 8. Product gallery

Đặc biệt với saxophone cũ:

Cần nhiều ảnh thật.

Nên có:

1. Front.
2. Back.
3. Bell.
4. Neck.
5. Keywork.
6. Pad.
7. Engraving/logo.
8. Các vết xước.
9. Case.
10. Accessories.

Nguyên tắc:

**Không che khuyết điểm của sản phẩm cũ.**

Nếu có vết xước phải thể hiện rõ.

Điều này giúp tăng trust.

---

# 9. Saxophone cũ — cần một hệ thống riêng

Đây có thể trở thành USP của TOPSAX.

Tạo landing page:

```text
/saxophone-cu
```

Hero:

# Saxophone cũ đã được kiểm tra trước khi đến tay bạn

Sau đó giải thích:

```text
Body
↓
Keywork
↓
Pad
↓
Leak
↓
Playing test
↓
Final inspection
```

Có thể gọi:

**TOPSAX Used Saxophone Inspection**

Không cần đặt tên quá marketing nếu chưa có quy trình chính thức.

---

# 10. Trust section

Hiện tại các claim như:

- am hiểu chuyên sâu
- kiểm tra kỹ
- thông tin minh bạch
- hỗ trợ trực tiếp

nên được biến thành bằng chứng.

Ví dụ:

## Kiểm tra trước khi giao

### 01 — Ngoại hình
Kiểm tra thân kèn, móp, xước và biến dạng.

### 02 — Keywork
Kiểm tra toàn bộ hệ thống phím.

### 03 — Pad
Kiểm tra tình trạng pad.

### 04 — Leak
Kiểm tra độ kín hơi.

### 05 — Playing test
Thổi thử để đánh giá khả năng hoạt động.

Nếu thực tế cửa hàng có quy trình khác, agent phải hỏi/để owner chỉnh nội dung trước khi publish.

---

# 11. About TOPSAX

Tạo trang:

```text
/gioi-thieu
```

Không viết quá dài.

Nên có:

- TOPSAX là ai.
- Cửa hàng ở đâu.
- Chuyên sản phẩm gì.
- Tại sao thành lập.
- Kinh nghiệm.
- Hình ảnh cửa hàng.
- Người phụ trách.
- Quy trình làm việc.

Quan trọng nhất:

**Ảnh thật.**

Trust của local business đến từ hình ảnh và thông tin xác thực nhiều hơn những đoạn marketing dài.

---

# 12. Contact

Tạo `/lien-he`.

Phải có:

```text
TOPSAX

Địa chỉ
Số điện thoại
Zalo
Email
Google Maps
Giờ mở cửa
```

CTA:

**Gọi TOPSAX**

**Nhắn Zalo**

**Chỉ đường**

Trên mobile nên có sticky bottom bar:

```text
[ Gọi ngay ] [ Zalo ] [ Chỉ đường ]
```

Không cần sticky bar trên desktop nếu gây rối.

---

# 13. Zalo

Zalo là một conversion channel quan trọng với thị trường Việt Nam.

CTA nên xuất hiện tại:

- Header mobile.
- Product detail.
- Contact.
- Footer.
- Sticky mobile CTA.

Không nên chỉ để Zalo ở cuối homepage.

---

# 14. Blog architecture

Blog hiện tại là hướng phát triển rất tốt.

Không viết bài rời rạc.

Xây topic cluster.

## Cluster A — Người mới

```text
/saxophone-cho-nguoi-moi

Saxophone có khó học không?
Nên chọn Alto hay Tenor?
Người mới nên mua saxophone nào?
Saxophone Yamaha nào tốt cho người mới?
Saxophone giá bao nhiêu?
```

## Cluster B — Saxophone cũ

```text
/saxophone-cu

Có nên mua saxophone cũ?
Cách kiểm tra saxophone cũ
10 lỗi khi mua saxophone cũ
Saxophone cũ Yamaha có tốt không?
Cách kiểm tra leak
```

## Cluster C — Reed

```text
/reed-saxophone

Reed là gì?
Reed 2 vs 2.5 vs 3
Vandoren Traditional
Vandoren V16
```

## Cluster D — Mouthpiece

```text
/mouthpiece-saxophone

Mouthpiece là gì?
Mouthpiece cho người mới
Mouthpiece ảnh hưởng âm thanh như thế nào?
```

---

# 15. Internal linking

Đây là một priority cao.

Ví dụ bài:

"Saxophone có khó học không?"

phải link tới:

```text
Saxophone cho người mới
↓
Yamaha YAS-280
↓
Yamaha YAS-480
↓
Nhận tư vấn
```

Bài:

"Có nên mua saxophone cũ?"

phải link tới:

```text
Saxophone cũ
↓
Quy trình kiểm tra saxophone cũ
↓
Các sản phẩm saxophone cũ
↓
Liên hệ
```

Mục tiêu:

```text
Google
   ↓
Blog
   ↓
Product
   ↓
Contact
```

Blog không nên là dead end.

---

# 16. SEO technical audit

Agent phải kiểm tra toàn bộ website trước khi chỉnh.

## Kiểm tra:

- title
- meta description
- canonical
- robots.txt
- sitemap.xml
- Open Graph
- Twitter/X card
- favicon
- heading hierarchy
- alt text
- image dimensions
- lazy loading
- internal links
- broken links
- 404 page
- redirect
- trailing slash consistency
- URL structure
- structured data

---

# 17. Structured Data

Homepage:

```text
Organization / LocalBusiness
```

Product:

```text
Product
Offer
Brand
```

Blog:

```text
Article
```

Breadcrumb:

```text
BreadcrumbList
```

Contact/local business:

```text
LocalBusiness
```

Không thêm schema nếu dữ liệu không thực sự tồn tại.

Đặc biệt không fake:

- rating
- review count
- price
- availability
- aggregate rating

---

# 18. SEO title strategy

Không dùng title chung chung.

Ví dụ:

```text
Yamaha YAS-280 | Saxophone Alto cho người mới | TOPSAX
```

Blog:

```text
Saxophone có khó học không? Kinh nghiệm cho người mới | TOPSAX
```

Category:

```text
Saxophone Alto | Saxophone chính hãng & đã qua sử dụng | TOPSAX
```

---

# 19. URL structure

Nên nhất quán.

Đề xuất:

```text
/
/saxophone
/saxophone/alto
/saxophone/tenor
/saxophone-cu
/phu-kien
/blog
/blog/[slug]
/gioi-thieu
/lien-he
```

Product:

```text
/saxophone/yamaha-yas-280
/saxophone/yamaha-yas-480
```

Used:

```text
/saxophone-cu/yamaha-yas-62
```

Không nên đưa ID database vào URL nếu không cần.

---

# 20. Mobile UX

Mobile là priority cao.

Kiểm tra:

- Header.
- Menu.
- Hero.
- Product cards.
- Product gallery.
- CTA.
- Blog.
- Footer.

Product page trên mobile phải ưu tiên:

```text
Image
↓
Name
↓
Price
↓
Availability
↓
CTA
↓
Short description
↓
Specifications
```

Không bắt khách scroll quá lâu mới thấy nút liên hệ.

---

# 21. Performance

Agent phải audit bằng Lighthouse/PageSpeed.

Mục tiêu:

```text
Performance       >= 90
Accessibility     >= 90
Best Practices    >= 90
SEO               >= 95
```

Đây là target, không phải lý do để hy sinh UX.

Ưu tiên:

- WebP/AVIF.
- Responsive images.
- next/image nếu sử dụng Next.js.
- Lazy load image ngoài viewport.
- Không tải animation library nếu không cần.
- Font tối thiểu.
- Không dùng video hero nặng.
- Không tải third-party scripts không cần thiết.

---

# 22. Image strategy

Đây là một priority đặc biệt cao.

Cloudinary có thể dùng để:

```text
Original image
      ↓
Cloudinary
      ↓
Automatic resize
      ↓
WebP/AVIF
      ↓
Responsive delivery
```

Product image nên có naming rõ ràng:

```text
yamaha-yas-280-front
yamaha-yas-280-back
yamaha-yas-280-bell
yamaha-yas-280-case
```

Alt text:

```text
Yamaha YAS-280 alto saxophone
```

Không dùng:

```text
image123.jpg
IMG_8231.jpg
```

---

# 23. Product data model

Backend nên chuẩn bị schema có thể mở rộng.

Ví dụ:

```text
products
├── id
├── slug
├── name
├── brand
├── model
├── category
├── instrument_type
├── condition
├── price
├── currency
├── description
├── short_description
├── specifications
├── featured
├── available
├── created_at
└── updated_at
```

Product images:

```text
product_images
├── id
├── product_id
├── image_url
├── alt
├── sort_order
└── is_primary
```

Không hard-code product data trong React components.

---

# 24. Admin/data architecture

Nếu đang dùng Supabase:

```text
Frontend
   ↓
Supabase
   ↓
Products
Articles
Categories
Images metadata
```

Cloudinary:

```text
Image storage / transformation
```

Vercel:

```text
Frontend / Next.js
```

Không cần xây admin dashboard quá phức tạp ở giai đoạn đầu.

---

# 25. Conversion funnel

Website phải được thiết kế theo funnel:

```text
Google
   ↓
Blog / Product
   ↓
Trust
   ↓
Product information
   ↓
CTA
   ↓
Zalo / Phone
   ↓
Human consultation
```

Agent không nên tối ưu website chỉ dựa trên "đẹp".

Mỗi page phải có:

**Primary CTA**

và nếu thích hợp:

**Secondary CTA**

---

# 26. Recommended CTA hierarchy

Primary:

**Nhận tư vấn**

Secondary:

**Xem sản phẩm**

Contact:

**Gọi TOPSAX**

**Nhắn Zalo**

Không nên có 5–6 CTA ngang hàng.

---

# 27. FAQ

Thêm FAQ ở các trang quan trọng.

Homepage:

```text
TOPSAX bán những loại saxophone nào?
Có bán saxophone cũ không?
Có được thử kèn không?
Có ship toàn quốc không?
Có bảo hành không?
Có tư vấn chọn kèn cho người mới không?
```

Product:

```text
Cây này phù hợp với ai?
Tình trạng hiện tại thế nào?
Có phụ kiện gì?
Có thể thử kèn không?
Bảo hành thế nào?
```

Nội dung phải phản ánh chính sách thật của cửa hàng.

---

# 28. Comparison feature

Sau này có thể thêm:

```text
So sánh saxophone
```

Ví dụ:

| | YAS-280 | YAS-480 |
|---|---|---|
| Level | Beginner | Intermediate |
| Giá | ... | ... |
| Trọng lượng | ... | ... |
| Key | ... | ... |
| Phù hợp | Người mới | Đã học |
| CTA | Xem | Xem |

Đây là feature tốt cho SEO và conversion nhưng **không phải P0**.

---

# 29. Search/filter

Chỉ triển khai khi số lượng sản phẩm tăng.

Filter:

```text
Loại
├── Alto
├── Tenor
├── Soprano
└── Baritone

Tình trạng
├── Mới
└── Cũ

Thương hiệu
├── Yamaha
├── Selmer
└── ...
```

Nếu hiện tại chỉ có vài sản phẩm thì không cần.

---

# 30. Không nên làm ngay

Agent KHÔNG cần triển khai:

- User account.
- Cart.
- Checkout.
- Payment.
- Wishlist.
- Complex dashboard.
- Chatbot AI.
- Loyalty system.
- Coupon.
- Order management.

Những tính năng này không phục vụ mục tiêu hiện tại.

---

# 31. Navigation đề xuất

Desktop:

```text
TOPSAX

Saxophone
  ├── Alto
  ├── Tenor
  ├── Soprano
  └── Saxophone cũ

Phụ kiện

Blog

Về TOPSAX

Liên hệ

[Nhận tư vấn]
```

Mobile:

```text
☰
Logo
[Zalo]
```

Menu phải ngắn.

---

# 32. Footer

Footer nên có:

```text
TOPSAX
Chuyên saxophone và phụ kiện

Sản phẩm
Blog
Về TOPSAX
Liên hệ

☎ Phone
💬 Zalo
📍 Address

© TOPSAX
```

Nếu có:

- Facebook
- YouTube
- TikTok

thì thêm sau khi xác nhận các tài khoản chính thức.

---

# 33. Local SEO

Đây là cơ hội lớn.

TOPSAX là local business nên phải tối ưu cho:

```text
saxophone Hà Nội
mua saxophone Hà Nội
saxophone cũ Hà Nội
Yamaha saxophone Hà Nội
cửa hàng saxophone Hà Nội
```

Landing page có thể có:

```text
/saxophone-ha-noi
```

Nhưng chỉ tạo nếu nội dung thực sự hữu ích, không tạo doorway page chỉ để SEO.

Trang cần có:

- địa chỉ
- bản đồ
- hình ảnh cửa hàng
- sản phẩm
- hướng dẫn đến cửa hàng
- thông tin thử kèn
- liên hệ

---

# 34. Google Business Profile

Nếu TOPSAX có địa điểm kinh doanh thực tế, cần ưu tiên:

- Google Business Profile.
- Địa chỉ chính xác.
- Số điện thoại.
- Website.
- Giờ mở cửa.
- Ảnh thật.
- Product photos.
- Review thật từ khách hàng.

Review thật sẽ có giá trị rất lớn đối với conversion.

Không mua/fake review.

---

# 35. Accessibility

Agent phải kiểm tra:

- contrast.
- keyboard navigation.
- focus state.
- alt text.
- semantic HTML.
- button có label.
- form có label.
- heading hierarchy.

Không dùng `<div>` thay cho button/link khi không cần.

---

# 36. Error states

Cần thiết kế:

```text
404
Product not found
Product unavailable
Blog not found
Network error
Image unavailable
```

Ví dụ product hết hàng:

```text
Sản phẩm này hiện đã có người mua.

Bạn muốn tìm cây tương tự?

[Nhận tư vấn]
```

Không để trang trắng.

---

# 37. Analytics

Nên chuẩn bị event tracking.

Events:

```text
view_product
click_phone
click_zalo
click_map
view_blog
click_related_product
click_consultation
```

Sau này có thể biết:

```text
Google search
↓
Product YAS-280
↓
Click Zalo
```

Đây mới là dữ liệu hữu ích để tối ưu website.

Không cần triển khai analytics phức tạp ngay nếu chưa cần.

---

# 38. Recommended implementation order

Agent hãy triển khai theo thứ tự:

## Phase 1 — Foundation

- [ ] Audit current source code.
- [ ] Audit routing.
- [ ] Audit responsive layout.
- [ ] Audit metadata.
- [ ] Audit images.
- [ ] Audit accessibility.
- [ ] Audit performance.
- [ ] Audit existing components.

Không redesign trước khi audit code.

---

## Phase 2 — Product

- [ ] Product card.
- [ ] Product detail.
- [ ] Product gallery.
- [ ] Product specifications.
- [ ] Product condition.
- [ ] Related products.
- [ ] CTA.
- [ ] Product schema.

---

## Phase 3 — Trust

- [ ] About TOPSAX.
- [ ] Store photos.
- [ ] Inspection process.
- [ ] FAQ.
- [ ] Testimonials.
- [ ] Location.
- [ ] Contact.

---

## Phase 4 — SEO

- [ ] Metadata.
- [ ] Canonical.
- [ ] Sitemap.
- [ ] Robots.
- [ ] Schema.
- [ ] Breadcrumb.
- [ ] Internal linking.
- [ ] Image alt.
- [ ] Blog categories.

---

## Phase 5 — Conversion

- [ ] Phone CTA.
- [ ] Zalo CTA.
- [ ] Consultation CTA.
- [ ] Mobile sticky CTA.
- [ ] Product CTA.
- [ ] Blog → product CTA.

---

## Phase 6 — Content

- [ ] Beginner hub.
- [ ] Used saxophone hub.
- [ ] Reed hub.
- [ ] Mouthpiece hub.
- [ ] Buying guides.
- [ ] Comparison articles.

---

# 39. Definition of Done

Website được coi là đạt Phase 1 khi:

### UX

- [ ] Người dùng hiểu TOPSAX bán gì trong vòng 5 giây.
- [ ] Có thể tìm sản phẩm trong tối đa 2–3 clicks.
- [ ] Product detail có CTA rõ ràng.
- [ ] Mobile sử dụng tốt.

### Trust

- [ ] Có thông tin cửa hàng.
- [ ] Có địa chỉ.
- [ ] Có phone.
- [ ] Có Zalo.
- [ ] Có hình ảnh thật.
- [ ] Có quy trình kiểm tra nếu thực tế cửa hàng cung cấp dịch vụ này.

### SEO

- [ ] Mỗi page có title riêng.
- [ ] Meta description.
- [ ] Canonical.
- [ ] Sitemap.
- [ ] Robots.
- [ ] Schema phù hợp.
- [ ] Không có broken links.
- [ ] Images có alt.

### Performance

Target:

```text
LCP < 2.5s
INP < 200ms
CLS < 0.1
```

Ưu tiên mobile.

### Conversion

Mọi product page phải có:

```text
Price
Availability
Call
Zalo
Consultation
```

---

# 40. Agent instructions

Agent phải thực hiện theo nguyên tắc:

### Rule 1

**Không phá bỏ giao diện hiện tại chỉ để redesign.**

Giữ lại những component đang tốt.

### Rule 2

**Không hard-code dữ liệu sản phẩm.**

Chuẩn bị architecture cho Supabase.

### Rule 3

**Không tạo fake content.**

Không tự tạo:

- review.
- số lượng khách hàng.
- năm kinh nghiệm.
- chính sách bảo hành.
- chứng nhận.
- rating.
- địa chỉ khác.
- thông tin cửa hàng không được cung cấp.

Nếu thiếu dữ liệu, tạo placeholder rõ ràng để owner bổ sung.

### Rule 4

**Không dùng stock image nếu có thể sử dụng ảnh sản phẩm thật.**

### Rule 5

**Mobile first.**

### Rule 6

**SEO phải được thiết kế cùng page, không làm sau cùng.**

### Rule 7

**Mỗi page phải có mục đích rõ ràng.**

---

# 41. Recommended priority matrix

| Priority | Task | Impact |
|---|---|---|
| P0 | Product images | Rất cao |
| P0 | Product detail | Rất cao |
| P0 | CTA Phone/Zalo | Rất cao |
| P0 | Trust section | Rất cao |
| P0 | SEO technical audit | Rất cao |
| P1 | Used saxophone landing page | Cao |
| P1 | Blog clusters | Cao |
| P1 | Internal linking | Cao |
| P1 | Mobile optimization | Cao |
| P1 | Local SEO | Cao |
| P2 | Comparison | Trung bình |
| P2 | Search/filter | Trung bình |
| P2 | Testimonials | Trung bình |
| P2 | Advanced analytics | Trung bình |

---

# 42. Final design direction

TOPSAX nên được định vị như:

> **Một cửa hàng chuyên saxophone có kiến thức chuyên môn, giúp khách hàng chọn đúng cây kèn thay vì chỉ đơn giản là bán sản phẩm.**

Website nên trả lời được câu hỏi:

> "Tại sao tôi nên mua saxophone từ TOPSAX thay vì một shop khác?"

Câu trả lời cần đến từ:

**Sản phẩm thật + thông tin thật + quy trình kiểm tra + kiến thức chuyên môn + tư vấn trực tiếp + cửa hàng thực tế.**

Không nên cố cạnh tranh bằng thiết kế quá flashy.

---

# 43. Immediate next step for Agent

Trước khi viết code mới, Agent phải:

1. Scan toàn bộ repository.
2. Liệt kê tất cả routes.
3. Liệt kê tất cả components.
4. Liệt kê database/schema hiện tại.
5. Liệt kê image sources.
6. Kiểm tra responsive.
7. Kiểm tra metadata.
8. Kiểm tra sitemap/robots.
9. Kiểm tra structured data.
10. Kiểm tra Lighthouse/PageSpeed.
11. Kiểm tra accessibility.
12. Chụp/đánh giá từng page.
13. So sánh với audit này.
14. Tạo implementation plan.
15. Chỉ sau đó mới bắt đầu sửa code.

Agent không được tự động thực hiện các thay đổi có thể ảnh hưởng đến dữ liệu sản phẩm hoặc business information nếu chưa có dữ liệu xác thực.

---

# 44. Mục tiêu cuối cùng

Website cuối cùng phải tạo được flow:

```text
Google
   │
   ↓
Blog / Product
   │
   ↓
TOPSAX
   │
   ├── Tôi mới học
   │       ↓
   │   Buying guide
   │       ↓
   │   Recommended saxophone
   │       ↓
   │   Consultation
   │
   ├── Tôi biết model
   │       ↓
   │   Product detail
   │       ↓
   │   Call / Zalo
   │
   └── Tôi muốn mua saxophone cũ
           ↓
       Used saxophone guide
           ↓
       Inspection process
           ↓
       Used products
           ↓
       Call / Zalo
```

**Đây là kiến trúc conversion mà Agent cần hướng tới, thay vì chỉ tiếp tục làm website đẹp hơn.**