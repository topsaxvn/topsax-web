import { createClient } from "@/lib/supabase/client";
import { mapPgError } from "@/lib/supabase/errors";
import type { Database } from "@/types/database";
import type { ProductDetail, ProductSummary } from "@/data-access/products";

const supabase = createClient();

type WithRelations = Database["public"]["Tables"]["products"]["Row"] & {
  category: { id: string; name: string; slug: string; parent: { slug: string } | null } | null;
  brand: { id: string; name: string; slug: string } | null;
  product_images: { url: string; alt_text: string | null; is_thumbnail: boolean; sort_order: number }[];
};

const LIST_SELECT =
  "*, category:categories(id,name,slug,parent:parent_id(slug)), brand:brands(id,name,slug), product_images(url,alt_text,is_thumbnail,sort_order)";

// Khớp 1:1 với toSummary() ở src/data-access/products.ts - trùng lặp có chủ
// đích: bản đó dùng server client (cho site public/SSR), bản này dùng browser
// client cho admin. Đổi 1 bên nhớ đổi bên kia (thumbnail = ảnh is_thumbnail,
// hoặc ảnh đầu tiên theo sort_order nếu chưa đặt thumbnail).
function toSummary(row: WithRelations): ProductSummary {
  const { product_images, ...rest } = row;
  const sorted = [...product_images].sort((a, b) => a.sort_order - b.sort_order);
  const thumbnail = product_images.find((img) => img.is_thumbnail) ?? sorted[0];

  return {
    ...rest,
    thumbnailUrl: thumbnail?.url ?? null,
    images: sorted.map(({ url, alt_text }) => ({ url, alt_text })),
  };
}

export type ProductListFilters = {
  q?: string;
  status?: Database["public"]["Enums"]["product_status"];
  inspectionStatus?: Database["public"]["Enums"]["product_inspection_status"];
  categoryId?: string;
};

export const productsApi = {
  async list(filters: ProductListFilters = {}): Promise<ProductSummary[]> {
    let query = supabase.from("products").select(LIST_SELECT).order("created_at", { ascending: false });
    if (filters.q) query = query.ilike("name", `%${filters.q}%`);
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.inspectionStatus) query = query.eq("inspection_status", filters.inspectionStatus);
    if (filters.categoryId) query = query.eq("category_id", filters.categoryId);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data as unknown as WithRelations[]).map(toSummary);
  },

  async getById(id: string): Promise<ProductDetail | null> {
    const { data, error } = await supabase.from("products").select(LIST_SELECT).eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return toSummary(data as unknown as WithRelations);
  },

  async create(
    row: Database["public"]["Tables"]["products"]["Insert"],
    pendingImages: { url: string; publicId: string }[],
  ): Promise<{ id: string }> {
    const { data, error } = await supabase.from("products").insert(row).select("id").single();
    if (error) throw new Error(mapPgError(error, "Slug đã tồn tại, vui lòng chọn slug khác."));

    if (pendingImages.length > 0) {
      await supabase.from("product_images").insert(
        pendingImages.map((image, index) => ({
          product_id: data.id,
          url: image.url,
          public_id: image.publicId,
          alt_text: null,
          sort_order: index,
          is_thumbnail: index === 0,
        })),
      );
    }

    return data;
  },

  async update(id: string, row: Database["public"]["Tables"]["products"]["Update"]): Promise<void> {
    const { error } = await supabase.from("products").update(row).eq("id", id);
    if (error) throw new Error(mapPgError(error, "Slug đã tồn tại, vui lòng chọn slug khác."));
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  // --- Đề xuất cho khóa học (supabase/migrations/20261114000000_course_products.sql) ---

  /** Các khóa học để chọn trong form. Rỗng khi bảng khóa học / đề xuất chưa có (file SQL chưa chạy). */
  async listCourses(): Promise<{ id: string; title: string }[]> {
    const [courses, links] = await Promise.all([
      supabase.from("courses").select("id,title").order("created_at"),
      supabase.from("course_products").select("course_id").limit(1),
    ]);
    if (courses.error || links.error) return [];
    return courses.data;
  },

  /** Khóa học mà sản phẩm đang được đề xuất. */
  async courseIdsOf(productId: string): Promise<string[]> {
    const { data, error } = await supabase.from("course_products").select("course_id").eq("product_id", productId);
    if (error) return [];
    return data.map((r) => r.course_id);
  },

  /** Đặt lại danh sách khóa học đề xuất sản phẩm này (bỏ tích = xóa khỏi khóa đó). */
  async setCourses(productId: string, courseIds: string[]): Promise<void> {
    const del = supabase.from("course_products").delete().eq("product_id", productId);
    const { error: delError } = courseIds.length ? await del.not("course_id", "in", `(${courseIds.join(",")})`) : await del;
    if (delError) throw new Error(delError.message);
    if (!courseIds.length) return;
    const { error } = await supabase
      .from("course_products")
      .upsert(
        courseIds.map((course_id) => ({ course_id, product_id: productId })),
        { onConflict: "course_id,product_id", ignoreDuplicates: true },
      );
    if (error) throw new Error(error.message);
  },

  async setStatus(id: string, status: Database["public"]["Enums"]["product_status"]): Promise<void> {
    const { error } = await supabase.from("products").update({ status }).eq("id", id);
    if (error) throw new Error(error.message);
  },

  async setInspectionStatus(
    id: string,
    inspection_status: Database["public"]["Enums"]["product_inspection_status"],
  ): Promise<void> {
    const { error } = await supabase.from("products").update({ inspection_status }).eq("id", id);
    if (error) throw new Error(error.message);
  },
};
