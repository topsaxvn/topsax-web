import { createClient } from "@/lib/supabase/server";
import { getCategoryBySlug, getSectionCategoryIds } from "@/data-access/categories";
import type { Database } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

type WithRelations = ProductRow & {
  category: { id: string; name: string; slug: string } | null;
  brand: { id: string; name: string; slug: string } | null;
  product_images: { url: string; alt_text: string | null; is_thumbnail: boolean; sort_order: number }[];
};

export type ProductSummary = ProductRow & {
  category: { id: string; name: string; slug: string } | null;
  brand: { id: string; name: string; slug: string } | null;
  thumbnailUrl: string | null;
  images: { url: string; alt_text: string | null }[];
};

export type ProductDetail = ProductSummary;

const LIST_SELECT =
  "*, category:categories(id,name,slug), brand:brands(id,name,slug), product_images(url,alt_text,is_thumbnail,sort_order)";

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

export type ProductFilters = {
  /** Slug của category lá cụ thể (vd. "alto"). */
  categorySlug?: string;
  /** Slug của category cha (vd. "saxophone" hoặc "phu-kien") - khớp cả category con. */
  sectionSlug?: "saxophone" | "phu-kien";
  brandSlug?: string;
  condition?: ProductRow["condition"];
  featured?: boolean;
  sort?: "newest" | "price_asc" | "price_desc";
  limit?: number;
};

export async function getProducts(filters: ProductFilters = {}): Promise<ProductSummary[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select(LIST_SELECT);

  if (filters.sectionSlug) {
    const ids = await getSectionCategoryIds(filters.sectionSlug);
    if (ids.length === 0) return [];
    query = query.in("category_id", ids);
  }

  if (filters.categorySlug) {
    const category = await getCategoryBySlug(filters.categorySlug);
    if (!category) return [];
    query = query.eq("category_id", category.id);
  }

  if (filters.featured !== undefined) {
    query = query.eq("featured", filters.featured);
  }

  if (filters.brandSlug) {
    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("slug", filters.brandSlug)
      .maybeSingle();
    if (!brand) return [];
    query = query.eq("brand_id", brand.id);
  }

  if (filters.condition) {
    query = query.eq("condition", filters.condition);
  }

  switch (filters.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as WithRelations[]).map(toSummary);
}

export async function getFeaturedProducts(limit = 4): Promise<ProductSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(LIST_SELECT)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as WithRelations[]).map(toSummary);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(LIST_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return toSummary(data as WithRelations);
}

export async function searchProductsAdmin(filters: {
  q?: string;
  status?: ProductRow["status"];
  inspectionStatus?: ProductRow["inspection_status"];
}): Promise<ProductSummary[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select(LIST_SELECT).order("created_at", { ascending: false });

  if (filters.q) {
    query = query.ilike("name", `%${filters.q}%`);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.inspectionStatus) {
    query = query.eq("inspection_status", filters.inspectionStatus);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as WithRelations[]).map(toSummary);
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(LIST_SELECT).eq("id", id).maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return toSummary(data as WithRelations);
}

export async function getRelatedProducts(product: ProductDetail, limit = 4): Promise<ProductSummary[]> {
  if (!product.category_id) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(LIST_SELECT)
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .limit(limit);

  if (error) throw error;
  return (data as WithRelations[]).map(toSummary);
}
