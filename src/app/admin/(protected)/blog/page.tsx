import Link from "next/link";
import type { Metadata } from "next";
import { searchPostsAdmin } from "@/data-access/posts";
import { deletePost, setPostStatus } from "@/app/admin/(protected)/blog/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { postStatusLabel } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { PostStatus } from "@/types/database";

export const metadata: Metadata = { title: "Blog", robots: { index: false, follow: false } };

const statusTabs: { value: PostStatus | undefined; label: string }[] = [
  { value: undefined, label: "Tất cả" },
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Đã xuất bản" },
  { value: "archived", label: "Lưu trữ" },
];

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const validStatus = status === "draft" || status === "published" || status === "archived" ? status : undefined;

  const posts = await searchPostsAdmin({ q, status: validStatus });

  const buildHref = (params: { status?: string; q?: string }) => {
    const search = new URLSearchParams();
    if (params.status) search.set("status", params.status);
    if (params.q) search.set("q", params.q);
    const qs = search.toString();
    return qs ? `/admin/blog?${qs}` : "/admin/blog";
  };

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

        <form className="flex gap-2">
          {validStatus && <input type="hidden" name="status" value={validStatus} />}
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

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-paper">
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
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href={`/admin/blog/${post.id}/edit`} className="text-brass-deep hover:underline">
                      Sửa
                    </Link>
                    {post.status !== "published" && (
                      <form action={setPostStatus.bind(null, post.id, post.slug, "published")}>
                        <button type="submit" className="text-ink-soft hover:underline">
                          Xuất bản
                        </button>
                      </form>
                    )}
                    {post.status !== "archived" && (
                      <form action={setPostStatus.bind(null, post.id, post.slug, "archived")}>
                        <button type="submit" className="text-ink-soft hover:underline">
                          Lưu trữ
                        </button>
                      </form>
                    )}
                    <form action={deletePost.bind(null, post.id, post.slug)}>
                      <ConfirmButton
                        confirmMessage={`Xóa bài viết "${post.title}"?`}
                        className="text-red-600 hover:underline"
                      >
                        Xóa
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Không có bài viết nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
