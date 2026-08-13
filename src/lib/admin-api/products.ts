import { createClient } from "@/lib/supabase/client";
import { mapPgError } from "@/lib/supabase/errors";
import type { Database } from "@/types/database";
import type { ProductDetail, ProductSummary } from "@/data-access/products";

const supabase = createClient();

type WithRelations = Database["public"]["Tables"]["products"]["Row"] & {
  category: { id: string; name: string; slug: string } | null;
  brand: { id: string; name: string; slug: string } | null;
  product_images: { url: string; alt_text: string | null; is_thumbnail: boolean; sort_order: number }[];
};

const LIST_SELECT =
  "*, category:categories(id,name,slug), brand:brands(id,name,slug), product_images(url,alt_text,is_thumbnail,sort_order)";

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
};

export const productsApi = {
  async list(filters: ProductListFilters = {}): Promise<ProductSummary[]> {
    let query = supabase.from("products").select(LIST_SELECT).order("created_at", { ascending: false });
    if (filters.q) query = query.ilike("name", `%${filters.q}%`);
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.inspectionStatus) query = query.eq("inspection_status", filters.inspectionStatus);

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
