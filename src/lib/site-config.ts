// Thông tin cửa hàng dùng chung cho Header, Footer, trang Liên hệ, metadata SEO.
// TODO: thay các giá trị placeholder bằng thông tin thật của cửa hàng trước khi launch.
export const siteConfig = {
  name: "TOPSAX",
  tagline: "Chuyên saxophone mới, cũ và phụ kiện",
  description:
    "TOPSAX - cửa hàng chuyên saxophone mới, saxophone cũ và phụ kiện. Tư vấn tận tâm, sản phẩm chất lượng, giá cả hợp lý",
  url: "https://topsax.example.com",
  phone: "0948 364 640",
  phoneHref: "tel:+84 948 364 640",
  zaloUrl: "https://zalo.me/0948364640",
  facebookUrl: "https://www.facebook.com/hoang.trung.514918",
  // TODO: đổi thành đúng username Fanpage/Facebook để link m.me hoạt động chính xác.
  messengerUrl: "https://m.me/hoang.trung.514918",
  // TODO: thay bằng link TikTok/YouTube thật của cửa hàng.
  tiktokUrl: "https://www.tiktok.com/@topsax",
  youtubeUrl: "https://www.youtube.com/@topsax",
  email: "topsax.vn@gmail.com",
  address: "174 Ngô Quyền, Hà Đông, Hà Nội",
} as const;

export const mainNav = [
  { label: "Saxophone", href: "/saxophone" },
  { label: "Phụ kiện", href: "/phu-kien" },
  { label: "Blog", href: "/blog" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Liên hệ", href: "/lien-he" },
] as const;
