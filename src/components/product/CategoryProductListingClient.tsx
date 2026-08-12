"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryFilterBar } from "@/components/product/CategoryFilterBar";
import type { Category } from "@/data-access/categories";
import type { ProductSummary } from "@/data-access/products";
import { filterAndSortProducts, parseSort } from "@/lib/product-filter";

// Lọc/sắp xếp ở client bằng useSearchParams() thay vì đọc searchParams ở
// server - trang cha (page.tsx) không còn phụ thuộc query string nên có thể
// prerender tĩnh; đổi filter chỉ đổi URL + re-render ở client, không cần
// round-trip lên server. Suspense fallback (CategoryProductListingFallback)
// hiển thị cùng nội dung mặc định trong lúc chờ hydrate.
export function CategoryProductListingClient({
  categories,
  products,
  basePath,
  initialCategory,
}: {
  categories: Category[];
  products: ProductSummary[];
  basePath: string;
  initialCategory?: string;
}) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? initialCategory;
  const sort = parseSort(searchParams.get("sort"));

  const filtered = useMemo(() => filterAndSortProducts(products, category, sort), [products, category, sort]);

  return (
    <>
      <CategoryFilterBar categories={categories} basePath={basePath} activeCategory={category} activeSort={sort} />
      <div className="mt-8">
        <ProductGrid products={filtered} emptyMessage="Chưa có sản phẩm trong danh mục này." />
      </div>
    </>
  );
}
