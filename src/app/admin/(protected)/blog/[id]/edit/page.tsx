import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostForm } from "@/components/admin/PostForm";
import { getBlogCategories, getPostById } from "@/data-access/posts";
import { updatePost } from "@/app/admin/(protected)/blog/actions";

export const metadata: Metadata = { title: "Sửa bài viết", robots: { index: false, follow: false } };

export default async function EditPostPage({ params }: PageProps<"/admin/blog/[id]/edit">) {
  const { id } = await params;
  const [categories, post] = await Promise.all([getBlogCategories(), getPostById(id)]);

  if (!post) notFound();

  const boundUpdate = updatePost.bind(null, id);

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Sửa bài viết</h1>
      <div className="mt-6">
        <PostForm action={boundUpdate} categories={categories} post={post} submitLabel="Lưu thay đổi" />
      </div>
    </div>
  );
}
