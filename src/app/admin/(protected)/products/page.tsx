import { Suspense } from "react";
import type { Metadata } from "next";
import AdminLoading from "@/app/admin/(protected)/loading";
import { ProductsPageClient } from "./ProductsPageClient";

export const metadata: Metadata = { title: "Sản phẩm", robots: { index: false, follow: false } };

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <ProductsPageClient />
    </Suspense>
  );
}
