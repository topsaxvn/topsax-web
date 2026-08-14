"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { postsApi } from "@/lib/admin-api/posts";
import { triggerRevalidate } from "@/lib/admin-api/revalidate";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { postStatusLabel } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { PostSummary } from "@/data-access/posts";
import type { PostStatus } from "@/types/database";

const statusTabs: { value: PostStatus | undefined; label: string }[] = [
  { value: undefined, label: "Tất cả" },
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Đã xuất bản" },
  { value: "archived", label: "Lưu trữ" },
];

export function BlogPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") ?? undefined;
  const statusParam = searchParams.get("status");
  const validStatus = statusParam === "draft" || statusParam === "published" || statusParam === "archived" ? statusParam : undefined;

  const [posts, setPosts] = useState<PostSummary[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    postsApi.list({ q, status: validStatus }).then((data) => {
      if (!cancelled) setPosts(data);
    });
    return () => {
      cancelled = true;
    };
  }, [q, validStatus]);

  const buildHref = (params: { status?: string; q?: string }) => {
    const search = new URLSearchParams();
    if (params.status) search.set("status", params.status);
    if (params.q) search.set("q", params.q);
    const qs = search.toString();
    return qs ? `/admin/blog?${qs}` : "/admin/blog";
  };

  async function handleDelete(post: PostSummary) {
    setPosts((prev) => prev?.filter((p) => p.id !== post.id) ?? prev);
    await postsApi.remove(post.id);
    triggerRevalidate({ resource: "post", slug: post.slug });
  }

  async function handleSetStatus(post: PostSummary, status: PostStatus) {
    setPosts((prev) => prev?.map((p) => (p.id === post.id ? { ...p, status } : p)) ?? prev);
    await postsApi.setStatus(post.id, status);
    triggerRevalidate({ resource: "post", slug: post.slug });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-ink">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-full bg-brass px-4 py-2 text-sm font-semibold text-ink hover:bg-brass-soft"
        >
          + Thêm bài viết
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {statusTabs.map((tab) => (
            <Link
              key={tab.label}
              href={buildHref({ status: tab.value, q })}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                validStatus === tab.value
                  ? "border-brass bg-brass text-ink"
                  : "border-border text-ink-soft hover:border-brass hover:text-brass-deep",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            router.push(buildHref({ status: validStatus, q: formData.get("q")?.toString() }));
          }}
        >
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Tìm theo tiêu đề..."
            className="rounded-lg border border-border bg-paper px-3.5 py-2 text-sm text-ink outline-none focus:border-brass"
          />
          <button type="submit" className="rounded-lg border border-border px-3.5 py-2 text-sm text-ink-soft hover:text-ink">
            Tìm
          </button>
        </form>
      </div>

      {!posts ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-paper px-4 py-10 text-center text-sm text-muted">
          Không có bài viết nào.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border bg-paper md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Bài viết</th>
                  <th className="px-4 py-3 font-medium">Chuyên mục</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Ngày đăng</th>
                  <th className="px-4 py-3 font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{post.title}</p>
                      <p className="text-xs text-muted">/blog/{post.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{post.category?.name ?? "-"}</td>
                    <td className="px-4 py-3 text-ink-soft">{postStatusLabel[post.status]}</td>
                    <td className="px-4 py-3 text-ink-soft">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString("vi-VN") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <PostActions post={post} onDelete={handleDelete} onSetStatus={handleSetStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 space-y-3 md:hidden">
            {posts.map((post) => (
              <div key={post.id} className="rounded-2xl border border-border bg-paper p-3">
                <p className="font-medium text-ink">{post.title}</p>
                <p className="text-xs text-muted">/blog/{post.slug}</p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <span className="rounded-full border border-border px-2 py-0.5 text-ink-soft">
                    {post.category?.name ?? "Chưa phân loại"}
                  </span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-ink-soft">
                    {postStatusLabel[post.status]}
                  </span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-ink-soft">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString("vi-VN") : "Chưa đăng"}
                  </span>
                </div>
                <div className="mt-3 border-t border-border pt-2">
                  <PostActions post={post} onDelete={handleDelete} onSetStatus={handleSetStatus} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PostActions({
  post,
  onDelete,
  onSetStatus,
}: {
  post: PostSummary;
  onDelete: (post: PostSummary) => void | Promise<void>;
  onSetStatus: (post: PostSummary, status: PostStatus) => void | Promise<void>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
      <Link href={`/admin/blog/${post.id}/edit`} className="text-brass-deep hover:underline">
        Sửa
      </Link>
      {post.status !== "published" && (
        <button type="button" onClick={() => onSetStatus(post, "published")} className="text-ink-soft hover:underline">
          Xuất bản
        </button>
      )}
      {post.status !== "archived" && (
        <button type="button" onClick={() => onSetStatus(post, "archived")} className="text-ink-soft hover:underline">
          Lưu trữ
        </button>
      )}
      <ConfirmButton
        confirmMessage={`Xóa bài viết "${post.title}"?`}
        onConfirm={() => onDelete(post)}
        className="text-red-600 hover:underline"
      >
        Xóa
      </ConfirmButton>
    </div>
  );
}
