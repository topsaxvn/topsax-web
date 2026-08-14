import type { Metadata } from "next";
import { NewCategoryPageClient } from "./NewCategoryPageClient";

export const metadata: Metadata = { title: "Thêm danh mục", robots: { index: false, follow: false } };

export default function NewCategoryPage() {
  return <NewCategoryPageClient />;
}
