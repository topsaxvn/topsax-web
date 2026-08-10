import { createClient } from "@/lib/supabase/server";

export async function getDashboardCounts() {
  const supabase = await createClient();

  const [products, categories, brands, posts, newMessages] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("brands").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
  ]);

  return {
    products: products.count ?? 0,
    categories: categories.count ?? 0,
    brands: brands.count ?? 0,
    posts: posts.count ?? 0,
    newMessages: newMessages.count ?? 0,
  };
}
