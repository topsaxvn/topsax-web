import type { ProductSummary } from "@/data-access/products";

export type ProductSort = "newest" | "price_asc" | "price_desc";

export function parseSort(value: string | null | undefined): ProductSort {
  return value === "price_asc" || value === "price_desc" ? value : "newest";
}

export function filterAndSortProducts(
  products: ProductSummary[],
  category: string | null | undefined,
  sort: ProductSort,
): ProductSummary[] {
  const list = category ? products.filter((p) => p.category?.slug === category) : products;

  return [...list].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}
