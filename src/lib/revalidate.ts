import { revalidatePath } from "next/cache";

// Server-only: revalidatePath() không tồn tại ở client. Dùng bởi
// route handler /api/admin/revalidate (gọi từ admin-api phía client sau mỗi
// lần ghi dữ liệu) để giữ ISR cache của site public luôn mới.
export function revalidateProductPaths(slug?: string) {
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/saxophone");
  revalidatePath("/phu-kien");
  if (slug) {
    revalidatePath(`/saxophone/${slug}`);
    revalidatePath(`/phu-kien/${slug}`);
  }
}

export function revalidateCategoryPaths() {
  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/saxophone");
  revalidatePath("/phu-kien");
}

export function revalidateBrandPaths() {
  revalidatePath("/admin/brands");
  revalidatePath("/saxophone");
  revalidatePath("/phu-kien");
}

export function revalidatePostPaths(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}
