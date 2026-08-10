# Kế hoạch xây dựng website cửa hàng Saxophone

## 1. Mục tiêu dự án

Xây dựng website giới thiệu và catalog sản phẩm cho cửa hàng chuyên:

-   Saxophone mới
-   Saxophone cũ
-   Phụ kiện saxophone
-   Nội dung hướng dẫn và kiến thức về saxophone

Website ưu tiên:

1.  Chi phí vận hành thấp nhất.
2.  SEO tốt để thu hút khách hàng từ Google.
3.  Giao diện đẹp, chuyên nghiệp, responsive.
4.  Tốc độ tải nhanh.
5.  Dễ quản lý sản phẩm và bài viết.
6.  Không cần thanh toán online ở giai đoạn đầu.
7.  Khách hàng liên hệ trực tiếp qua điện thoại, Zalo, Facebook hoặc
    form liên hệ.
8.  Kiến trúc có thể mở rộng thành website bán hàng hoàn chỉnh trong
    tương lai.

------------------------------------------------------------------------

# 2. Kiến trúc công nghệ

## Frontend

-   Next.js
-   TypeScript
-   Tailwind CSS
-   App Router
-   Server Components khi phù hợp
-   Client Components chỉ khi cần tương tác phía trình duyệt

## Backend / Database

-   Supabase
-   PostgreSQL
-   Supabase Auth cho tài khoản quản trị
-   Row Level Security (RLS)

## Image storage

-   Cloudinary
-   Upload và quản lý ảnh sản phẩm
-   CDN
-   Image transformation
-   WebP/AVIF hoặc định dạng tối ưu nếu phù hợp

## Hosting

-   GitHub để quản lý source code
-   Netlify để deploy frontend
-   Không sử dụng VPS hoặc server riêng

## DNS / Security

-   Cloudflare có thể được sử dụng để quản lý DNS, SSL và các tính năng
    bảo vệ/caching cơ bản.

## Domain

-   Chỉ phát sinh chi phí domain.

------------------------------------------------------------------------

# 3. Nguyên tắc kiến trúc

## 3.1. Không xây hệ thống thương mại điện tử ở giai đoạn đầu

Không cần:

-   Cart
-   Checkout
-   Payment gateway
-   Customer account
-   Order management
-   Shipping calculation

Thay vào đó mỗi sản phẩm có:

-   Giá
-   Tình trạng
-   Mô tả
-   Hình ảnh
-   Thông số
-   Nút gọi điện
-   Nút Zalo
-   Nút Facebook nếu cần
-   Form liên hệ

## 3.2. SEO là ưu tiên chính

Các trang sản phẩm và bài blog phải có URL riêng, metadata riêng và nội
dung có thể được Google index.

Không xây website theo kiểu toàn bộ dữ liệu chỉ được tải bằng
client-side JavaScript nếu điều đó làm giảm khả năng SEO.

Ưu tiên Server Components và server-side data fetching của Next.js.

## 3.3. Database không lưu file ảnh

Supabase chỉ lưu metadata và URL/public_id của ảnh.

Ảnh thực tế được lưu trên Cloudinary.

## 3.4. Admin là một phần của cùng ứng dụng

Không cần xây một backend server riêng.

Admin có thể nằm trong Next.js:

-   /admin/login
-   /admin
-   /admin/products
-   /admin/products/new
-   /admin/products/\[id\]/edit
-   /admin/blog
-   /admin/blog/new
-   /admin/blog/\[id\]/edit

Supabase Auth + RLS bảo vệ quyền quản trị.

------------------------------------------------------------------------

# 4. Cấu trúc website public

## Trang chính

-   `/`
-   `/saxophone`
-   `/saxophone/alto`
-   `/saxophone/tenor`
-   `/saxophone/baritone`
-   `/phu-kien`
-   `/phu-kien/mouthpiece`
-   `/phu-kien/reed`
-   `/phu-kien/ligature`
-   `/phu-kien/case`
-   `/blog`
-   `/blog/[slug]`
-   `/gioi-thieu`
-   `/lien-he`

## Product detail

Có thể dùng URL:

`/san-pham/[slug]`

hoặc phân loại theo category:

`/saxophone/[slug]`

Ưu tiên URL ngắn, dễ đọc và ổn định lâu dài.

Ví dụ:

-   `/saxophone/yamaha-yas-62`
-   `/saxophone/yamaha-yas-480`
-   `/phu-kien/mouthpiece-yamaha-4c`

------------------------------------------------------------------------

# 5. Trang chủ

Trang chủ nên gồm:

1.  Header
2.  Hero section
3.  Giới thiệu ngắn về cửa hàng
4.  Saxophone nổi bật
5.  Saxophone mới/cũ
6.  Phụ kiện nổi bật
7.  Vì sao nên mua tại cửa hàng
8.  Bài viết mới
9.  Call-to-action liên hệ
10. Footer

Hero không nên quá nặng ảnh/video để đảm bảo tốc độ.

------------------------------------------------------------------------

# 6. Trang danh sách sản phẩm

Ví dụ `/saxophone`.

Chức năng:

-   Hiển thị sản phẩm dạng grid
-   Filter theo loại saxophone
-   Filter theo thương hiệu
-   Filter theo tình trạng
-   Filter theo khoảng giá
-   Sort theo giá
-   Sort theo mới nhất
-   Featured products
-   Pagination hoặc load-more nếu số lượng sản phẩm lớn

Không cần search nâng cao ở phiên bản đầu nếu số lượng sản phẩm còn ít.

------------------------------------------------------------------------

# 7. Trang chi tiết sản phẩm

Mỗi sản phẩm nên có:

-   Tên sản phẩm
-   Hãng
-   Model
-   Loại
-   Giá
-   Tình trạng
-   Tình trạng hàng: còn hàng / đã bán / ẩn
-   Ảnh gallery
-   Thumbnail
-   Mô tả
-   Thông số
-   Serial nếu cửa hàng muốn công khai
-   Năm sản xuất nếu biết
-   Tình trạng pad
-   Tình trạng body
-   Tình trạng neck
-   Phụ kiện đi kèm
-   Video test nếu có
-   Sản phẩm liên quan
-   Nút gọi điện
-   Nút Zalo
-   Nút liên hệ

Nếu sản phẩm đã bán:

-   Không xóa trang ngay.
-   Chuyển trạng thái thành `sold`.
-   Hiển thị "Đã bán".
-   Có thể đề xuất sản phẩm tương tự.

Điều này giúp giữ URL và giá trị SEO.

------------------------------------------------------------------------

# 8. Database schema

## 8.1. categories

``` text
categories
-----------
id
name
slug
description
parent_id
sort_order
is_active
created_at
updated_at
```

Cho phép category có parent để mở rộng sau này.

Ví dụ:

``` text
Saxophone
  ├── Alto
  ├── Tenor
  └── Baritone

Phụ kiện
  ├── Mouthpiece
  ├── Reed
  ├── Ligature
  └── Case
```

## 8.2. brands

``` text
brands
-----------
id
name
slug
description
logo_url
is_active
created_at
updated_at
```

## 8.3. products

``` text
products
-----------
id
name
slug
category_id
brand_id
model
sku
description
short_description
price
currency
condition
status
featured
stock_quantity
serial_number
year
specifications
meta_title
meta_description
created_at
updated_at
```

Gợi ý enum:

### condition

-   `new`
-   `used`
-   `like_new`
-   `refurbished`

### status

-   `available`
-   `sold`
-   `hidden`

`specifications` có thể dùng JSONB để lưu thông số linh hoạt.

## 8.4. product_images

``` text
product_images
-----------
id
product_id
url
public_id
alt_text
sort_order
is_thumbnail
created_at
```

## 8.5. blog_categories

``` text
blog_categories
-----------
id
name
slug
description
created_at
updated_at
```

## 8.6. posts

``` text
posts
-----------
id
title
slug
excerpt
content
thumbnail_url
author_id
category_id
status
published_at
meta_title
meta_description
created_at
updated_at
```

Status:

-   `draft`
-   `published`
-   `archived`

## 8.7. contact_messages

Có thể tạo bảng này nếu muốn lưu lead.

``` text
contact_messages
-----------
id
name
phone
email
message
product_id
status
created_at
```

Status:

-   `new`
-   `contacted`
-   `closed`

Nếu muốn tối giản tuyệt đối, form liên hệ có thể được triển khai bằng
external form/email service và chưa cần bảng này.

------------------------------------------------------------------------

# 9. Quan hệ database

``` text
categories
    │
    └──── products
              │
              └──── product_images

brands
    │
    └──── products

blog_categories
    │
    └──── posts

products
    │
    └──── contact_messages
```

------------------------------------------------------------------------

# 10. Supabase RLS

Public user:

-   SELECT published products
-   SELECT active categories
-   SELECT active brands
-   SELECT published posts

Public không được:

-   INSERT products
-   UPDATE products
-   DELETE products
-   INSERT/update/delete blog posts

Admin:

-   Full CRUD trên products
-   Full CRUD trên categories
-   Full CRUD trên brands
-   Full CRUD trên blog
-   Quản lý contact messages

Không được đưa Supabase service-role key vào frontend.

Nếu cần thao tác đặc quyền, thực hiện ở server-side hoặc API/server
action an toàn.

------------------------------------------------------------------------

# 11. Authentication

Dùng Supabase Auth.

Giai đoạn đầu chỉ cần:

-   Email/password hoặc phương thức đăng nhập phù hợp.
-   Một hoặc một vài tài khoản admin.

Không cần:

-   User registration
-   Forgot-password UI phức tạp nếu chưa cần
-   Customer accounts

Middleware/route protection phải bảo vệ `/admin`.

------------------------------------------------------------------------

# 12. Cloudinary

Cloudinary dùng cho:

-   Product images
-   Blog thumbnails
-   Blog inline images nếu cần

Quy trình:

``` text
Admin
  ↓
Upload image
  ↓
Cloudinary
  ↓
Cloudinary URL + public_id
  ↓
Supabase product_images
```

Yêu cầu:

-   Tạo folder rõ ràng.
-   Ví dụ:
    -   `saxophone/products`
    -   `saxophone/blog`
    -   `saxophone/brands`
-   Tạo alt text cho ảnh.
-   Không upload ảnh gốc dung lượng quá lớn nếu không cần.
-   Dùng transformation để phục vụ kích thước phù hợp.
-   Không lưu binary image trong Supabase.

------------------------------------------------------------------------

# 13. Admin Product Management

Admin product list:

-   Search
-   Filter
-   Sort
-   Status
-   Featured
-   Edit
-   Delete/Archive

Create/Edit product:

### General

-   Name
-   Slug
-   Category
-   Brand
-   Model
-   SKU

### Pricing

-   Price
-   Currency

### Condition

-   New/Used/etc.
-   Status

### Description

-   Short description
-   Full description

### Specifications

-   Serial
-   Year
-   Pad condition
-   Body condition
-   Neck condition
-   Accessories
-   Other specs

### Images

-   Upload
-   Preview
-   Drag/drop reorder
-   Set thumbnail
-   Delete image

### SEO

-   Meta title
-   Meta description

------------------------------------------------------------------------

# 14. Admin Blog

Blog editor nên hỗ trợ:

-   Title
-   Slug
-   Excerpt
-   Content
-   Thumbnail
-   Category
-   Status
-   Published date
-   SEO title
-   SEO description

Nên sử dụng Markdown hoặc một rich-text editor ổn định.

Nếu triển khai Markdown:

-   Dễ lưu trong database.
-   Dễ version control.
-   Dễ render.
-   Phù hợp với nội dung blog.

------------------------------------------------------------------------

# 15. SEO

Mỗi product page:

-   Unique title
-   Unique meta description
-   Canonical URL
-   Open Graph
-   Product structured data
-   Image alt text

Mỗi blog:

-   Article structured data
-   Published date
-   Author
-   Thumbnail
-   Canonical URL

Website:

-   `sitemap.xml`
-   `robots.txt`
-   Canonical
-   Open Graph
-   Twitter/X card nếu cần
-   favicon
-   Web manifest nếu cần

Tạo sitemap động từ database.

Không index:

-   `/admin`
-   `/admin/*`
-   trang draft
-   nội dung private

------------------------------------------------------------------------

# 16. Content strategy

Blog nên tập trung vào 5 nhóm:

## Nhóm 1: Chọn saxophone

-   Saxophone cho người mới
-   Alto vs Tenor
-   Saxophone dưới 10 triệu
-   Saxophone dưới 20 triệu
-   Có nên mua saxophone cũ?
-   Cách chọn saxophone cũ

## Nhóm 2: Kiểm tra và sửa chữa

-   Cách kiểm tra saxophone cũ
-   Leak là gì?
-   Khi nào thay pad?
-   Khi nào overhaul?
-   Saxophone thổi nặng
-   Saxophone bị rè

## Nhóm 3: So sánh model

-   YAS-280 vs YAS-480
-   YAS-480 vs YAS-62
-   Yamaha vs Jupiter
-   Yamaha vs Selmer
-   Các đời Yamaha saxophone

## Nhóm 4: Phụ kiện

-   Cách chọn mouthpiece
-   Reed 1.5/2/2.5/3
-   Yamaha 4C
-   Ligature
-   Saxophone case
-   Dây đeo

## Nhóm 5: Hướng dẫn chơi và bảo quản

-   Cách vệ sinh saxophone
-   Cách bảo quản
-   Cách thay reed
-   Cách lắp mouthpiece
-   Cách lấy hơi
-   Các lỗi người mới thường gặp

Ưu tiên các bài có liên quan trực tiếp đến sản phẩm đang bán.

------------------------------------------------------------------------

# 17. Product + Blog SEO strategy

Không chỉ viết bài chung chung.

Ví dụ có sản phẩm:

`Yamaha YAS-62`

Tạo:

``` text
Product:
Yamaha YAS-62

Blog:
Yamaha YAS-62 có đáng mua không?

Blog:
YAS-62 vs YAS-480

Blog:
Cách kiểm tra Yamaha YAS-62 cũ

Blog:
Yamaha YAS-62 dành cho ai?
```

Các bài blog link về product page.

Product page cũng link về các bài liên quan.

Mục tiêu:

``` text
Google
  ↓
Blog
  ↓
Product
  ↓
Contact
```

------------------------------------------------------------------------

# 18. Performance

Ưu tiên:

-   Next.js Server Components
-   Image optimization
-   Cloudinary transformations
-   Lazy loading ảnh
-   Responsive images
-   Không tải JavaScript không cần thiết
-   Không dùng animation nặng
-   Không autoplay video lớn
-   Pagination khi cần
-   Cache dữ liệu phù hợp

Mục tiêu:

-   Lighthouse Performance tốt
-   Core Web Vitals tốt
-   Mobile-first

------------------------------------------------------------------------

# 19. Responsive design

Website phải hoạt động tốt trên:

-   Mobile
-   Tablet
-   Laptop
-   Desktop

Ưu tiên mobile vì phần lớn khách hàng tìm kiếm sản phẩm bằng điện thoại.

Product card trên mobile phải dễ đọc:

``` text
[Image]

Yamaha YAS-62

25.000.000đ

Đã qua sử dụng

[Xem chi tiết]
```

------------------------------------------------------------------------

# 20. UI/UX direction

Phong cách:

-   Premium
-   Musical
-   Clean
-   Professional
-   Không quá nhiều màu
-   Hình ảnh sản phẩm là trung tâm

Không làm website giống marketplace.

Cửa hàng nên tạo cảm giác:

> "Một cửa hàng chuyên saxophone có kiến thức và uy tín."

Không nên:

-   Quá nhiều banner
-   Popup liên tục
-   Animation nặng
-   Flashy effects
-   Quá nhiều màu
-   UI giống Shopee

------------------------------------------------------------------------

# 21. Contact UX

Trên product page nên có CTA rõ ràng:

``` text
Bạn quan tâm sản phẩm này?

[ Gọi ngay ]
[ Nhắn Zalo ]
[ Facebook ]
```

Trên mobile có thể có fixed bottom bar:

``` text
[ Gọi điện ] [ Zalo ] [ Liên hệ ]
```

------------------------------------------------------------------------

# 22. Analytics

Sau khi website chạy ổn định:

-   Google Search Console
-   Google Analytics
-   Theo dõi page views
-   Theo dõi product views
-   Theo dõi click phone
-   Theo dõi click Zalo
-   Theo dõi click contact

Không cần triển khai analytics quá phức tạp ở MVP.

------------------------------------------------------------------------

# 23. GitHub workflow

Repository:

``` text
saxophone-store
```

Branches:

``` text
main
develop
feature/*
```

MVP có thể đơn giản hơn:

``` text
main
```

Mỗi feature nên commit rõ ràng:

``` text
feat: add product listing
feat: add product detail
feat: add admin authentication
feat: add cloudinary upload
fix: product slug validation
```

------------------------------------------------------------------------

# 24. Environment variables

Không commit secrets vào GitHub.

Ví dụ:

``` text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Các secret server-side phải không có prefix `NEXT_PUBLIC_`.

Không expose:

-   Supabase service role key
-   Cloudinary API secret
-   Các secret khác

------------------------------------------------------------------------

# 25. MVP scope

Phiên bản đầu tiên chỉ cần:

### Public

-   Home
-   Product listing
-   Product detail
-   Category
-   Blog listing
-   Blog detail
-   About
-   Contact

### Admin

-   Login
-   Product CRUD
-   Image upload
-   Category management
-   Brand management
-   Blog CRUD

### Backend

-   Supabase database
-   Supabase Auth
-   RLS

### Storage

-   Cloudinary

### Deployment

-   GitHub
-   Netlify
-   Domain
-   Cloudflare DNS nếu cần

### SEO

-   Metadata
-   Sitemap
-   Robots
-   Schema
-   Open Graph

------------------------------------------------------------------------

# 26. Những thứ KHÔNG làm trong MVP

Không triển khai:

-   Payment
-   Shopping cart
-   Order system
-   Customer account
-   Inventory ERP
-   Advanced CRM
-   Chat system
-   Recommendation engine
-   AI chatbot
-   Complex search engine
-   Mobile app
-   Microservices
-   VPS
-   Dedicated backend server

Các tính năng này chỉ làm sau khi website có traffic và nhu cầu thực tế.

------------------------------------------------------------------------

# 27. Roadmap triển khai

## Phase 0 --- Planning

1.  Xác định brand name
2.  Chọn domain
3.  Xác định màu sắc/logo
4.  Xác định danh mục sản phẩm
5.  Xác định thông tin sản phẩm cần lưu

## Phase 1 --- Project setup

1.  Tạo GitHub repository
2.  Tạo Next.js project
3.  Cài TypeScript
4.  Cài Tailwind CSS
5.  Tạo Supabase project
6.  Tạo Cloudinary account
7.  Thiết lập environment variables
8.  Deploy skeleton lên Netlify

## Phase 2 --- Database

1.  Tạo categories
2.  Tạo brands
3.  Tạo products
4.  Tạo product_images
5.  Tạo blog_categories
6.  Tạo posts
7.  Tạo contact_messages nếu cần
8.  Tạo indexes
9.  Tạo constraints
10. Tạo RLS policies

## Phase 3 --- Public frontend

1.  Layout
2.  Header
3.  Footer
4.  Home
5.  Product listing
6.  Product detail
7.  Category pages
8.  Blog listing
9.  Blog detail
10. Contact

## Phase 4 --- Admin

1.  Authentication
2.  Protected routes
3.  Dashboard
4.  Product CRUD
5.  Category CRUD
6.  Brand CRUD
7.  Image upload
8.  Image sorting
9.  Blog CRUD

## Phase 5 --- SEO

1.  Metadata
2.  Dynamic sitemap
3.  Robots
4.  Canonical
5.  Open Graph
6.  Product schema
7.  Article schema
8.  Breadcrumbs
9.  Internal linking

## Phase 6 --- Optimization

1.  Image optimization
2.  Performance
3.  Mobile UX
4.  Accessibility
5.  Error handling
6.  Loading states
7.  Empty states
8.  404 page

## Phase 7 --- Launch

1.  Connect domain
2.  Configure Cloudflare
3.  Configure Netlify
4.  Test production
5.  Google Search Console
6.  Google Analytics
7.  Submit sitemap
8.  Test contact buttons
9.  Test mobile
10. Backup database/configuration

------------------------------------------------------------------------

# 28. Acceptance criteria

Website chỉ được xem là MVP hoàn thành khi:

-   [ ] Website deploy thành công.
-   [ ] Domain hoạt động với HTTPS.
-   [ ] Home hoạt động.
-   [ ] Product listing hoạt động.
-   [ ] Product detail hoạt động.
-   [ ] Category hoạt động.
-   [ ] Blog hoạt động.
-   [ ] Contact hoạt động.
-   [ ] Admin login hoạt động.
-   [ ] Admin tạo sản phẩm được.
-   [ ] Admin sửa sản phẩm được.
-   [ ] Admin chuyển sản phẩm thành sold được.
-   [ ] Admin upload nhiều ảnh được.
-   [ ] Admin thay đổi thứ tự ảnh được.
-   [ ] Admin tạo blog được.
-   [ ] RLS được cấu hình.
-   [ ] Public không thể sửa database.
-   [ ] Admin route được bảo vệ.
-   [ ] Không có secret trong GitHub.
-   [ ] Sitemap hoạt động.
-   [ ] Robots hoạt động.
-   [ ] Product metadata hoạt động.
-   [ ] Blog metadata hoạt động.
-   [ ] Responsive trên mobile.
-   [ ] Không có lỗi console nghiêm trọng.
-   [ ] Lighthouse ở mức tốt.
-   [ ] Google Search Console có thể crawl website.

------------------------------------------------------------------------

# 29. Hướng dẫn cho Antigravity

Antigravity nên triển khai theo từng phase, không tạo toàn bộ hệ thống
trong một lần.

Nguyên tắc:

1.  Đọc toàn bộ kế hoạch này trước khi code.
2.  Kiểm tra project hiện tại trước khi tạo file.
3.  Không tự ý thay đổi architecture.
4.  Không thêm dependency nếu không cần.
5.  Ưu tiên thư viện chính thức và thư viện nhẹ.
6.  Không đưa secret vào source code.
7.  Không sử dụng Supabase service-role key phía client.
8.  Sử dụng TypeScript strict.
9.  Tách component rõ ràng.
10. Tách data-access/server logic khỏi UI.
11. Tạo reusable components.
12. Validate dữ liệu ở cả frontend và server-side.
13. Xử lý loading/error/empty state.
14. Không xóa dữ liệu sản phẩm đã bán nếu có thể giữ URL.
15. Viết code có thể mở rộng sau này.
16. Sau mỗi phase phải kiểm tra build.
17. Không tiếp tục phase kế tiếp nếu phase hiện tại còn lỗi nghiêm
    trọng.

## Thứ tự prompt cho Antigravity

### Prompt 1

Đọc file kế hoạch này và phân tích architecture. Chưa code. Hãy đề xuất
cấu trúc thư mục cuối cùng và các dependency cần thiết.

### Prompt 2

Thiết lập Next.js project theo architecture đã thống nhất. Tạo layout,
design system cơ bản và các route public. Chưa triển khai database.

### Prompt 3

Thiết lập Supabase schema, migration, indexes, constraints và RLS. Không
hard-code secrets.

### Prompt 4

Tạo data-access layer cho products, categories, brands và blog. Ưu tiên
server-side fetching cho các trang SEO.

### Prompt 5

Triển khai product listing, filtering cơ bản và product detail.

### Prompt 6

Triển khai Supabase Auth và protected admin routes.

### Prompt 7

Triển khai admin product CRUD.

### Prompt 8

Triển khai Cloudinary image upload và product image management.

### Prompt 9

Triển khai blog CMS và public blog pages.

### Prompt 10

Triển khai SEO metadata, sitemap, robots, canonical, Open Graph, Product
schema, Article schema và breadcrumbs.

### Prompt 11

Kiểm tra responsive, accessibility, performance và Core Web Vitals.

### Prompt 12

Chuẩn bị production deployment trên Netlify, environment variables,
custom domain và checklist launch.

------------------------------------------------------------------------

# 30. Kiến trúc mục tiêu

``` text
                         DOMAIN
                            |
                        Cloudflare
                            |
                         Netlify
                            |
                         Next.js
                    /                 \
                   /                   \
             Public pages            Admin
                   |                   |
                   |              Supabase Auth
                   |                   |
                   +---------+---------+
                             |
                          Supabase
                         PostgreSQL
                             |
                  +----------+----------+
                  |                     |
              Products                 Blog
                  |
            Product images
                  |
              Cloudinary
```

Mục tiêu cuối cùng:

**Một website catalog saxophone chuyên nghiệp, SEO-first, chi phí vận
hành gần 0đ/tháng ngoài domain, có CMS quản lý sản phẩm/blog và có thể
mở rộng thành e-commerce trong tương lai mà không cần viết lại kiến
trúc.**
