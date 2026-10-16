import type { MetadataRoute } from "next";
import { songUrlSlug } from "@/lib/music";
import { siteConfig } from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";

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

function latest(routes: MetadataRoute.Sitemap): Date | undefined {
  const times = routes.flatMap((r) => (r.lastModified ? [new Date(r.lastModified).getTime()] : []));
  return times.length > 0 ? new Date(Math.max(...times)) : undefined;
}

// Sitemap động - đọc trực tiếp từ Supabase để index toàn bộ category,
// sản phẩm (kể cả đã bán, giữ giá trị SEO) và bài blog đã publish.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: categories }, { data: products }, { data: posts }, { data: songs }] = await Promise.all([
    supabase.from("categories").select("id,slug,parent_id,updated_at").eq("is_active", true),
    supabase.from("products").select("slug,category_id,updated_at").neq("status", "hidden"),
    supabase.from("posts").select("slug,updated_at").eq("status", "published"),
    supabase.from("songs").select("slug,updated_at").eq("published", true),
  ]);

  const categoryById = new Map((categories ?? []).map((c) => [c.id, c]));

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

  const songRoutes: MetadataRoute.Sitemap = (songs ?? []).map((s) => ({
    url: `${siteConfig.url}/cam-am/${songUrlSlug(s)}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
  }));

  // lastModified của trang tĩnh = lần cập nhật mới nhất của nội dung nó liệt
  // kê, thay vì new Date() - ngày luôn đổi mỗi lần build/revalidate khiến
  // Google không còn tin vào lastmod của cả sitemap. Trang giới thiệu là nội
  // dung tĩnh trong code nên bỏ trống lastModified.
  const sectionRoutes = (section: string) =>
    [...categoryRoutes, ...productRoutes].filter((r) => r.url.startsWith(`${siteConfig.url}/${section}/`));
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: latest([...categoryRoutes, ...productRoutes, ...postRoutes, ...songRoutes]) },
    { url: `${siteConfig.url}/saxophone`, lastModified: latest(sectionRoutes("saxophone")) },
    { url: `${siteConfig.url}/phu-kien`, lastModified: latest(sectionRoutes("phu-kien")) },
    { url: `${siteConfig.url}/cam-am`, lastModified: latest(songRoutes) },
    { url: `${siteConfig.url}/blog`, lastModified: latest(postRoutes) },
    { url: `${siteConfig.url}/gioi-thieu` },
  ];

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...postRoutes, ...songRoutes];
}
