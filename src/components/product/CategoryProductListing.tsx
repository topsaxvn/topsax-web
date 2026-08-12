import { Suspense } from "react";
import { getChildCategories } from "@/data-access/categories";
import { getProducts } from "@/data-access/products";
import { CategoryProductListingClient } from "@/components/product/CategoryProductListingClient";
import { CategoryProductListingFallback } from "@/components/product/CategoryProductListingFallback";

export async function CategoryProductListing({
  sectionSlug,
  basePath,
  initialCategory,
}: {
  sectionSlug: "saxophone" | "phu-kien";
  basePath: string;
  initialCategory?: string;
}) {
  const [categories, products] = await Promise.all([
    getChildCategories(sectionSlug),
    getProducts({ sectionSlug }),
  ]);

  return (
    // useSearchParams() trong CategoryProductListingClient cần Suspense để
    // trang cha vẫn prerender tĩnh được. Fallback render sẵn cùng dữ liệu ở
    // server (trạng thái mặc định) nên không có màn hình trắng lúc hydrate.
    <Suspense
      fallback={
        <CategoryProductListingFallback
          categories={categories}
          products={products}
          basePath={basePath}
          initialCategory={initialCategory}
        />
      }
    >
      <CategoryProductListingClient
        categories={categories}
        products={products}
        basePath={basePath}
        initialCategory={initialCategory}
      />
    </Suspense>
  );
}
