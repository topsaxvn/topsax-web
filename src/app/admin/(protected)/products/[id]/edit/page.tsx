import type { Metadata } from "next";
import { EditProductPageClient } from "./EditProductPageClient";

export const metadata: Metadata = { title: "Sửa sản phẩm", robots: { index: false, follow: false } };

export default function EditProductPage() {
  return <EditProductPageClient />;
}
