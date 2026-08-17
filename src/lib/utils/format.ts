import type { ProductCondition, ProductInspectionStatus, ProductStatus, PostStatus } from "@/types/database";

export function formatPrice(price: number, currency = "VND") {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency }).format(price);
}

// Giá 0đ dùng như quy ước "chưa định giá/liên hệ" (vd. sản phẩm mới nhập
// chờ admin cập nhật giá) - không hiển thị "0 ₫" cho khách, thay bằng lời
// mời liên hệ.
export function isContactForPrice(price: number): boolean {
  return price === 0;
}

export function priceLabel(price: number, currency = "VND"): string {
  return isContactForPrice(price) ? "Liên hệ để có giá tốt" : formatPrice(price, currency);
}

export const conditionLabel: Record<ProductCondition, string> = {
  new: "Mới",
  used: "Đã qua sử dụng",
  like_new: "Like new",
  refurbished: "Tân trang",
};

export const statusLabel: Record<ProductStatus, string> = {
  available: "Còn hàng",
  sold: "Đã bán",
  hidden: "Ẩn",
};

export const inspectionStatusLabel: Record<ProductInspectionStatus, string> = {
  pending: "Chờ kiểm tra",
  in_progress: "Đang kiểm tra",
  passed: "Đạt - sẵn sàng bán",
  failed: "Không đạt",
};

export const postStatusLabel: Record<PostStatus, string> = {
  draft: "Nháp",
  published: "Đã xuất bản",
  archived: "Lưu trữ",
};
