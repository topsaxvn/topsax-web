import type { Metadata } from "next";
import { EditCategoryPageClient } from "./EditCategoryPageClient";

export const metadata: Metadata = { title: "Sửa danh mục", robots: { index: false, follow: false } };

export default function EditCategoryPage() {
  return <EditCategoryPageClient />;
}
