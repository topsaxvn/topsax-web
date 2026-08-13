import type { Metadata } from "next";
import { NewPostPageClient } from "./NewPostPageClient";

export const metadata: Metadata = { title: "Thêm bài viết", robots: { index: false, follow: false } };

export default function NewPostPage() {
  return <NewPostPageClient />;
}
