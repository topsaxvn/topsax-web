import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";

const staticPaths = ["", "/saxophone", "/phu-kien", "/blog", "/gioi-thieu", "/lien-he"];

type CategoryRow = { id: string; slug: string; parent_id: string | null; updated_at: string | null };

function rootSlugFor(categoryId: string | null, categoryById: Map<string, CategoryRow>): "saxophone" | "phu-kien" | null {
  if (!categoryId) return null;
  let current = categoryById.get(categoryId);
  const visited = new Set<string>();

  while (current) {
    if (current.parent_id === null) {
      return current.slug === "saxophone" || current.slug === "phu-kien" ? current.slug : null;
    }
    if (visited.has(current.id)) return null;
    visited.add(current.id);
    current = categoryById.get(current.parent_id);
  }
  return null;
}

// Sitemap động - đọc trực tiếp từ Supabase để index toàn bộ category,
// sản phẩm (kể cả đã bán, giữ giá trị SEO) và bài blog đã publish.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: categories }, { data: products }, { data: posts }] = await Promise.all([
    supabase.from("categories").select("id,slug,parent_id,updated_at").eq("is_active", true),
    supabase.from("products").select("slug,category_id,updated_at").neq("status", "hidden"),
    supabase.from("posts").select("slug,updated_at").eq("status", "published"),
  ]);

  const categoryById = new Map((categories ?? []).map((c) => [c.id, c]));

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? [])
    .filter((c) => c.parent_id !== null)
    .flatMap((c) => {
      const root = rootSlugFor(c.id, categoryById);
      if (!root) return [];
      return [{ url: `${siteConfig.url}/${root}/${c.slug}`, lastModified: c.updated_at ? new Date(c.updated_at) : new Date() }];
    });

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).flatMap((p) => {
    const root = rootSlugFor(p.category_id, categoryById);
    if (!root) return [];
    return [{ url: `${siteConfig.url}/${root}/${p.slug}`, lastModified: p.updated_at ? new Date(p.updated_at) : new Date() }];
  });

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...postRoutes];
}
