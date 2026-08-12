import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";

export type Category = Database["public"]["Tables"]["categories"]["Row"];

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

// Bọc cache() để dedupe trong cùng 1 request (vd. trang chủ gọi
// getSectionCategoryIds("saxophone") 2 lần cho sản phẩm nổi bật + mới nhất,
// và generateMetadata/page cùng gọi getCategoryBySlug với slug giống nhau).
export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data;
});

export const getChildCategories = cache(async (parentSlug: string): Promise<Category[]> => {
  const parent = await getCategoryBySlug(parentSlug);
  if (!parent) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", parent.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
});

// Id của category cha + toàn bộ category con - dùng để lọc sản phẩm theo
// "khu vực" (saxophone / phụ kiện) vì sản phẩm được gán vào category lá
// (alto, tenor,...) chứ không phải category cha.
export const getSectionCategoryIds = cache(async (parentSlug: string): Promise<string[]> => {
  const [parent, children] = await Promise.all([getCategoryBySlug(parentSlug), getChildCategories(parentSlug)]);
  if (!parent) return [];

  return [parent.id, ...children.map((c) => c.id)];
});
