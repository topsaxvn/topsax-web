import type { Metadata } from "next";
import { EditBrandPageClient } from "./EditBrandPageClient";

export const metadata: Metadata = { title: "Sửa thương hiệu", robots: { index: false, follow: false } };

export default function EditBrandPage() {
  return <EditBrandPageClient />;
}
