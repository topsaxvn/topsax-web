import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryFilterBar } from "@/components/product/CategoryFilterBar";
import type { Category } from "@/data-access/categories";
import type { ProductSummary } from "@/data-access/products";
import { filterAndSortProducts } from "@/lib/product-filter";

// Suspense fallback cho CategoryProductListingClient - render sẵn ở server
// (không cần JS) với danh mục/sắp xếp mặc định, để trang vẫn prerender tĩnh
// và có nội dung thật ngay cả khi JS chưa chạy (bot, người dùng mạng chậm).
// Trùng khớp UI với bản client ở trạng thái mặc định nên không bị nháy lúc
// hydrate.
export function CategoryProductListingFallback({
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
  const filtered = filterAndSortProducts(products, initialCategory, "newest");

  return (
    <>
      <CategoryFilterBar
        categories={categories}
        basePath={basePath}
        activeCategory={initialCategory}
        activeSort="newest"
      />
      <div className="mt-8">
        <ProductGrid products={filtered} emptyMessage="Chưa có sản phẩm trong danh mục này." />
      </div>
    </>
  );
}
