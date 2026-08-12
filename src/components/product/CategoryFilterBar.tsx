"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import type { Category } from "@/data-access/categories";
import type { ProductSort } from "@/lib/product-filter";
import { cn } from "@/lib/utils/cn";

// Thanh filter dùng chung giữa bản fallback render ở server (trước khi
// hydrate) và bản tương tác ở client, để giao diện khớp nhau tuyệt đối và
// tránh nháy/lệch lúc hydrate. `onNavigate`/`pending` chỉ được truyền ở bản
// client (xem CategoryProductListingClient) để hiện trạng thái đang tải khi
// đổi filter/sắp xếp; khi không có onNavigate, link hoạt động bình thường
// (không cần JS).
export function CategoryFilterBar({
  categories,
  basePath,
  activeCategory,
  activeSort,
  onNavigate,
  pending,
}: {
  categories: Category[];
  basePath: string;
  activeCategory?: string;
  activeSort: ProductSort;
  onNavigate?: (href: string) => void;
  pending?: boolean;
}) {
  const buildHref = (params: { category?: string; sort?: ProductSort }) => {
    const search = new URLSearchParams();
    if (params.category) search.set("category", params.category);
    if (params.sort && params.sort !== "newest") search.set("sort", params.sort);
    const qs = search.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className={cn("mt-8 flex flex-wrap items-center justify-between gap-4", pending && "cursor-wait")}>
      <div className="flex flex-wrap gap-2">
        <FilterLink
          label="Tất cả"
          active={!activeCategory}
          href={buildHref({ sort: activeSort })}
          onNavigate={onNavigate}
          pending={pending}
        />
        {categories.map((c) => (
          <FilterLink
            key={c.slug}
            label={c.name}
            active={activeCategory === c.slug}
            href={buildHref({ category: c.slug, sort: activeSort })}
            onNavigate={onNavigate}
            pending={pending}
          />
        ))}
      </div>

      <div className="flex gap-2 text-sm">
        <FilterLink
          label="Mới nhất"
          active={activeSort === "newest"}
          href={buildHref({ category: activeCategory })}
          onNavigate={onNavigate}
          pending={pending}
        />
        <FilterLink
          label="Giá thấp → cao"
          active={activeSort === "price_asc"}
          href={buildHref({ category: activeCategory, sort: "price_asc" })}
          onNavigate={onNavigate}
          pending={pending}
        />
        <FilterLink
          label="Giá cao → thấp"
          active={activeSort === "price_desc"}
          href={buildHref({ category: activeCategory, sort: "price_desc" })}
          onNavigate={onNavigate}
          pending={pending}
        />
      </div>
    </div>
  );
}

function FilterLink({
  label,
  href,
  active,
  onNavigate,
  pending,
}: {
  label: string;
  href: string;
  active: boolean;
  onNavigate?: (href: string) => void;
  pending?: boolean;
}) {
  const handleClick = onNavigate
    ? (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        onNavigate(href);
      }
    : undefined;

  return (
    <Link
      href={href}
      scroll={false}
      onClick={handleClick}
      aria-disabled={pending}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-brass bg-brass text-ink"
          : "border-border text-ink-soft hover:border-brass hover:text-brass-deep",
        pending && "pointer-events-none opacity-70",
      )}
    >
      {label}
    </Link>
  );
}
