// Thông tin cửa hàng dùng chung cho Header, Footer, trang Liên hệ, metadata SEO.
// TODO: thay các giá trị placeholder bằng thông tin thật của cửa hàng trước khi launch.
export const siteConfig = {
  name: "TOPSAX",
  tagline: "Chuyên saxophone mới, cũ và phụ kiện",
  description:
    "TOPSAX - cửa hàng chuyên saxophone mới, saxophone cũ và phụ kiện. Tư vấn tận tâm, sản phẩm được kiểm tra kỹ trước khi bán.",
  url: "https://topsax.example.com",
  phone: "0000 000 000",
  phoneHref: "tel:+840000000000",
  zaloUrl: "https://zalo.me/0000000000",
  facebookUrl: "https://facebook.com/topsax",
  email: "contact@topsax.example.com",
  address: "Đang cập nhật địa chỉ cửa hàng",
} as const;

export const mainNav = [
  { label: "Saxophone", href: "/saxophone" },
  { label: "Phụ kiện", href: "/phu-kien" },
  { label: "Blog", href: "/blog" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Liên hệ", href: "/lien-he" },
] as const;
