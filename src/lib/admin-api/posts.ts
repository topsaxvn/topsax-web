import { createClient } from "@/lib/supabase/client";
import { mapPgError } from "@/lib/supabase/errors";
import { computePublishedAt } from "@/lib/validation/post";
import type { Database } from "@/types/database";
import type { BlogCategory, PostSummary } from "@/data-access/posts";

const supabase = createClient();

const SELECT = "*, category:blog_categories(id,name,slug)";

export type PostListFilters = {
  q?: string;
  status?: Database["public"]["Enums"]["post_status"];
};

export const postsApi = {
  async list(filters: PostListFilters = {}): Promise<PostSummary[]> {
    let query = supabase.from("posts").select(SELECT).order("created_at", { ascending: false });
    if (filters.q) query = query.ilike("title", `%${filters.q}%`);
    if (filters.status) query = query.eq("status", filters.status);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data as unknown as PostSummary[];
  },

  async getById(id: string): Promise<PostSummary | null> {
    const { data, error } = await supabase.from("posts").select(SELECT).eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data as unknown as PostSummary | null;
  },

  async create(
    values: Database["public"]["Tables"]["posts"]["Insert"],
  ): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const row: Database["public"]["Tables"]["posts"]["Insert"] = {
      ...values,
      author_id: user?.id ?? null,
      published_at: values.status === "published" ? new Date().toISOString() : null,
    };

    const { error } = await supabase.from("posts").insert(row);
    if (error) throw new Error(mapPgError(error, "Slug đã tồn tại, vui lòng chọn slug khác."));
  },

  async update(id: string, values: Database["public"]["Tables"]["posts"]["Update"]): Promise<void> {
    const { data: existing } = await supabase.from("posts").select("status,published_at").eq("id", id).maybeSingle();

    const row: Database["public"]["Tables"]["posts"]["Update"] = {
      ...values,
      published_at: computePublishedAt(values.status ?? "draft", existing),
    };

    const { error } = await supabase.from("posts").update(row).eq("id", id);
    if (error) throw new Error(mapPgError(error, "Slug đã tồn tại, vui lòng chọn slug khác."));
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async setStatus(id: string, status: Database["public"]["Enums"]["post_status"]): Promise<void> {
    const { data: existing } = await supabase.from("posts").select("status,published_at").eq("id", id).maybeSingle();

    const { error } = await supabase
      .from("posts")
      .update({ status, published_at: computePublishedAt(status, existing) })
      .eq("id", id);
    if (error) throw new Error(error.message);
  },
};

export const blogCategoriesApi = {
  async listAll(): Promise<BlogCategory[]> {
    const { data, error } = await supabase.from("blog_categories").select("*").order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  },
};
