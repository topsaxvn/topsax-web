import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { marked } from "marked";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { getPostBySlug, getPublishedPosts } from "@/data-access/posts";
import { articleJsonLd, breadcrumbJsonLd, postMetadata } from "@/lib/seo";

export const revalidate = 1800;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return postMetadata(post, `/blog/${slug}`);
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("vi-VN")
    : null;

  // Nội dung blog chỉ do admin tạo qua trang quản trị (không phải nội dung
  // người dùng gửi), nên render trực tiếp HTML từ Markdown mà không cần
  // sanitize thêm.
  const contentHtml = marked.parse(post.content, { async: false });
  const crumbs = [
    { name: "Trang chủ", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${slug}` },
  ];

  return (
    <Container className="py-12">
      <JsonLd data={articleJsonLd(post, `/blog/${slug}`)} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumb items={crumbs} />
      <article className="mx-auto max-w-3xl">
        {post.category && (
          <p className="text-xs font-semibold uppercase tracking-wide text-brass-deep">
            {post.category.name}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">{post.title}</h1>
        {publishedDate && <p className="mt-2 text-sm text-muted">{publishedDate}</p>}

        <div
          className="prose prose-neutral mt-8 max-w-none prose-headings:text-ink prose-a:text-brass-deep"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </Container>
  );
}
