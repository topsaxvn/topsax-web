export type ProductSection = "saxophone" | "phu-kien";

type CategoryRef = { slug: string; parent?: { slug: string } | null } | null;

// Khu vực của sản phẩm xác định theo category gốc trong cây danh mục (giống
// sitemap.ts), không theo danh sách slug cố định - category phụ kiện mới thêm
// trong admin vẫn ra đúng /phu-kien/... Sản phẩm chưa gán category mặc định
// thuộc /saxophone.
export function getProductSection(category: CategoryRef): ProductSection {
  const rootSlug = category?.parent?.slug ?? category?.slug;
  return rootSlug === "phu-kien" ? "phu-kien" : "saxophone";
}

export function getProductHref(product: { slug: string; category: CategoryRef }) {
  return `/${getProductSection(product.category)}/${product.slug}`;
}
