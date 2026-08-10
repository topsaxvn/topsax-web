import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getChildCategories } from "@/data-access/categories";
import { getProducts } from "@/data-access/products";
import { cn } from "@/lib/utils/cn";

export async function CategoryProductListing({
  sectionSlug,
  basePath,
  category,
  sort,
}: {
  sectionSlug: "saxophone" | "phu-kien";
  basePath: string;
  category?: string;
  sort?: string;
}) {
  const normalizedSort = sort === "price_asc" || sort === "price_desc" ? sort : "newest";

  const [categories, products] = await Promise.all([
    getChildCategories(sectionSlug),
    getProducts({ sectionSlug, categorySlug: category, sort: normalizedSort }),
  ]);

  const buildHref = (params: { category?: string; sort?: string }) => {
    const search = new URLSearchParams();
    if (params.category) search.set("category", params.category);
    if (params.sort) search.set("sort", params.sort);
    const qs = search.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <FilterLink label="Tất cả" active={!category} href={buildHref({ sort })} />
          {categories.map((c) => (
            <FilterLink
              key={c.slug}
              label={c.name}
              active={category === c.slug}
              href={buildHref({ category: c.slug, sort })}
            />
          ))}
        </div>

        <div className="flex gap-2 text-sm">
          <FilterLink label="Mới nhất" active={normalizedSort === "newest"} href={buildHref({ category })} />
          <FilterLink
            label="Giá thấp → cao"
            active={normalizedSort === "price_asc"}
            href={buildHref({ category, sort: "price_asc" })}
          />
          <FilterLink
            label="Giá cao → thấp"
            active={normalizedSort === "price_desc"}
            href={buildHref({ category, sort: "price_desc" })}
          />
        </div>
      </div>

      <div className="mt-8">
        <ProductGrid products={products} emptyMessage="Chưa có sản phẩm trong danh mục này." />
      </div>
    </>
  );
}

function FilterLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-brass bg-brass text-ink"
          : "border-border text-ink-soft hover:border-brass hover:text-brass-deep",
      )}
    >
      {label}
    </Link>
  );
}
