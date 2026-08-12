import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];

export type PostSummary = PostRow & {
  category: { id: string; name: string; slug: string } | null;
};

const SELECT = "*, category:blog_categories(id,name,slug)";

export async function getPublishedPosts(limit?: number): Promise<PostSummary[]> {
  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select(SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return data as PostSummary[];
}

export async function getPostBySlug(slug: string): Promise<PostSummary | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw error;
  return data as PostSummary | null;
}

export type BlogCategory = Database["public"]["Tables"]["blog_categories"]["Row"];

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("blog_categories").select("*").order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function searchPostsAdmin(filters: { q?: string; status?: PostRow["status"] }): Promise<PostSummary[]> {
  const supabase = await createClient();
  let query = supabase.from("posts").select(SELECT).order("created_at", { ascending: false });

  if (filters.q) query = query.ilike("title", `%${filters.q}%`);
  if (filters.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) throw error;
  return data as PostSummary[];
}

export async function getPostById(id: string): Promise<PostSummary | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select(SELECT).eq("id", id).maybeSingle();

  if (error) throw error;
  return data as PostSummary | null;
}
