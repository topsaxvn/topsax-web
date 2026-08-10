import { createClient } from "@/lib/supabase/server";
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

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getChildCategories(parentSlug: string): Promise<Category[]> {
  const parent = await getCategoryBySlug(parentSlug);
  if (!parent) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", parent.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

// Id của category cha + toàn bộ category con - dùng để lọc sản phẩm theo
// "khu vực" (saxophone / phụ kiện) vì sản phẩm được gán vào category lá
// (alto, tenor,...) chứ không phải category cha.
export async function getSectionCategoryIds(parentSlug: string): Promise<string[]> {
  const parent = await getCategoryBySlug(parentSlug);
  if (!parent) return [];

  const children = await getChildCategories(parentSlug);
  return [parent.id, ...children.map((c) => c.id)];
}
