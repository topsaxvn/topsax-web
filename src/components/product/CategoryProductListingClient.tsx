"use client";

import { useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryFilterBar } from "@/components/product/CategoryFilterBar";
import { Spinner } from "@/components/ui/Spinner";
import type { Category } from "@/data-access/categories";
import type { ProductSummary } from "@/data-access/products";
import { filterAndSortProducts, parseSort } from "@/lib/product-filter";
import { cn } from "@/lib/utils/cn";

// Lọc/sắp xếp ở client bằng useSearchParams() thay vì đọc searchParams ở
// server - trang cha (page.tsx) không còn phụ thuộc query string nên có thể
// prerender tĩnh; đổi filter chỉ đổi URL + re-render ở client, không cần
// round-trip lên server. Suspense fallback (CategoryProductListingFallback)
// hiển thị cùng nội dung mặc định trong lúc chờ hydrate.
//
// Điều hướng filter/sort chạy qua router.push() bọc trong useTransition thay
// vì để <Link> tự điều hướng, để có isPending làm mờ lưới sản phẩm trong lúc
// URL/searchParams cập nhật (theo khuyến nghị "Filter with pending feedback"
// trong docs Next.js - node_modules/next/dist/docs/01-app/02-guides/interactive-apps.md).
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const category = searchParams.get("category") ?? initialCategory;
  const sort = parseSort(searchParams.get("sort"));

  const filtered = useMemo(() => filterAndSortProducts(products, category, sort), [products, category, sort]);

  const handleNavigate = (href: string) => {
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  };

  return (
    <>
      <CategoryFilterBar
        categories={categories}
        basePath={basePath}
        activeCategory={category}
        activeSort={sort}
        onNavigate={handleNavigate}
        pending={isPending}
      />
      <div className="relative mt-8">
        <div className={cn("transition-opacity", isPending && "opacity-50")} aria-busy={isPending}>
          <ProductGrid products={filtered} emptyMessage="Chưa có sản phẩm trong danh mục này." />
        </div>
        {isPending && (
          <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-16">
            <Spinner className="h-8 w-8 text-brass-deep" />
          </div>
        )}
      </div>
    </>
  );
}
