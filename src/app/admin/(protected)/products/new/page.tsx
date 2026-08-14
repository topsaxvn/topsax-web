import type { Metadata } from "next";
import { NewProductPageClient } from "./NewProductPageClient";

export const metadata: Metadata = { title: "Thêm sản phẩm", robots: { index: false, follow: false } };

export default function NewProductPage() {
  return <NewProductPageClient />;
}
