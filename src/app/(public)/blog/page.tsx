import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostGrid } from "@/components/blog/PostGrid";
import { getPublishedPosts } from "@/data-access/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Kiến thức, hướng dẫn chọn mua, kiểm tra và bảo quản saxophone.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Kiến thức saxophone"
        title="Blog"
        description="Hướng dẫn chọn mua, kiểm tra, sửa chữa, so sánh model và bảo quản saxophone."
      />
      <div className="mt-8">
        <PostGrid posts={posts} emptyMessage="Chưa có bài viết nào." />
      </div>
    </Container>
  );
}
