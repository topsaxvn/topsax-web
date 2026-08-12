import Link from "next/link";
import type { Category } from "@/data-access/categories";
import type { ProductSort } from "@/lib/product-filter";
import { cn } from "@/lib/utils/cn";

// Thanh filter thuần trình bày (không hook) - dùng chung giữa bản fallback
// render ở server và bản tương tác ở client để giao diện khớp nhau tuyệt
// đối, tránh nháy/lệch lúc hydrate.
export function CategoryFilterBar({
  categories,
  basePath,
  activeCategory,
  activeSort,
}: {
  categories: Category[];
  basePath: string;
  activeCategory?: string;
  activeSort: ProductSort;
}) {
  const buildHref = (params: { category?: string; sort?: ProductSort }) => {
    const search = new URLSearchParams();
    if (params.category) search.set("category", params.category);
    if (params.sort && params.sort !== "newest") search.set("sort", params.sort);
    const qs = search.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        <FilterLink label="Tất cả" active={!activeCategory} href={buildHref({ sort: activeSort })} />
        {categories.map((c) => (
          <FilterLink
            key={c.slug}
            label={c.name}
            active={activeCategory === c.slug}
            href={buildHref({ category: c.slug, sort: activeSort })}
          />
        ))}
      </div>

      <div className="flex gap-2 text-sm">
        <FilterLink
          label="Mới nhất"
          active={activeSort === "newest"}
          href={buildHref({ category: activeCategory })}
        />
        <FilterLink
          label="Giá thấp → cao"
          active={activeSort === "price_asc"}
          href={buildHref({ category: activeCategory, sort: "price_asc" })}
        />
        <FilterLink
          label="Giá cao → thấp"
          active={activeSort === "price_desc"}
          href={buildHref({ category: activeCategory, sort: "price_desc" })}
        />
      </div>
    </div>
  );
}

function FilterLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      scroll={false}
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
