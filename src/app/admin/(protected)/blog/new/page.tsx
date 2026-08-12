import type { Metadata } from "next";
import { PostForm } from "@/components/admin/PostForm";
import { getBlogCategories } from "@/data-access/posts";
import { createPost } from "@/app/admin/(protected)/blog/actions";

export const metadata: Metadata = { title: "Thêm bài viết", robots: { index: false, follow: false } };

export default async function NewPostPage() {
  const categories = await getBlogCategories();

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Thêm bài viết</h1>
      <div className="mt-6">
        <PostForm action={createPost} categories={categories} submitLabel="Tạo bài viết" />
      </div>
    </div>
  );
}
