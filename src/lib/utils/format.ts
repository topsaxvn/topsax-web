import type { ProductCondition, ProductInspectionStatus, ProductStatus, PostStatus } from "@/types/database";

export function formatPrice(price: number, currency = "VND") {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency }).format(price);
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
