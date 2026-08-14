import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/data-access/posts";

export function PostCard({ post }: { post: PostSummary }) {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("vi-VN")
    : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-paper transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video bg-paper-soft">
        {post.thumbnail_url ? (
          <Image
            src={post.thumbnail_url}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Chưa có ảnh
          </div>
        )}
      </div>
      <div className="p-4">
        {post.category && (
          <p className="text-xs font-medium uppercase tracking-wide text-brass-deep">
            {post.category.name}
          </p>
        )}
        <h3 className="mt-1 font-semibold text-ink group-hover:text-brass-deep">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>}
        {publishedDate && <p className="mt-3 text-xs text-muted">{publishedDate}</p>}
      </div>
    </Link>
  );
}
