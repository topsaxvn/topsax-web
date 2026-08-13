import type { Metadata } from "next";
import { CategoriesPageClient } from "./CategoriesPageClient";

export const metadata: Metadata = { title: "Danh mục", robots: { index: false, follow: false } };

export default function AdminCategoriesPage() {
  return <CategoriesPageClient />;
}
