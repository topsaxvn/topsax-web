import { z } from "zod";
import { emptyToNull } from "@/lib/validation/utils";

export const postSchema = z.object({
  title: z.string().trim().min(2, "Tiêu đề bắt buộc."),
  slug: z
    .string()
    .trim()
    .min(2, "Slug bắt buộc.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu -."),
  excerpt: z.string().nullable(),
  content: z.string().trim().min(1, "Nội dung bắt buộc."),
  thumbnail_url: z.string().nullable(),
  category_id: z.string().nullable(),
  status: z.enum(["draft", "published", "archived"]),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
});

export type PostFormValues = z.infer<typeof postSchema>;

export function parsePostForm(formData: FormData) {
  return postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: emptyToNull(formData.get("excerpt")),
    content: formData.get("content"),
    thumbnail_url: emptyToNull(formData.get("thumbnail_url")),
    category_id: emptyToNull(formData.get("category_id")),
    status: formData.get("status"),
    meta_title: emptyToNull(formData.get("meta_title")),
    meta_description: emptyToNull(formData.get("meta_description")),
  });
}

// Giữ nguyên logic gốc: published_at được set khi CHUYỂN sang "published" lần
// đầu, giữ nguyên nếu sửa bài đã xuất bản, và GIỮ NGUYÊN (không xoá) nếu bài
// từng xuất bản rồi chuyển trạng thái khác - chỉ null nếu chưa từng xuất bản.
export function computePublishedAt(
  status: PostFormValues["status"],
  existing: { status: string; published_at: string | null } | null,
): string | null {
  if (status === "published") {
    return existing?.published_at ?? new Date().toISOString();
  }
  return existing?.status === "published" ? existing.published_at : null;
}
