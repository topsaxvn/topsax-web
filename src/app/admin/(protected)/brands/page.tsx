import type { Metadata } from "next";
import { BrandsPageClient } from "./BrandsPageClient";

export const metadata: Metadata = { title: "Thương hiệu", robots: { index: false, follow: false } };

export default function AdminBrandsPage() {
  return <BrandsPageClient />;
}
