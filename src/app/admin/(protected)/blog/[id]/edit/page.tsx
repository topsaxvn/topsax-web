import type { Metadata } from "next";
import { EditPostPageClient } from "./EditPostPageClient";

export const metadata: Metadata = { title: "Sửa bài viết", robots: { index: false, follow: false } };

export default function EditPostPage() {
  return <EditPostPageClient />;
}
