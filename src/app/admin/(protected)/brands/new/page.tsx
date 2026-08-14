import type { Metadata } from "next";
import { NewBrandPageClient } from "./NewBrandPageClient";

export const metadata: Metadata = { title: "Thêm thương hiệu", robots: { index: false, follow: false } };

export default function NewBrandPage() {
  return <NewBrandPageClient />;
}
