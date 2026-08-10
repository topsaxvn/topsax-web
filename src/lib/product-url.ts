const ACCESSORY_CATEGORY_SLUGS = new Set(["phu-kien", "mouthpiece", "reed", "ligature", "case"]);

export function getProductHref(product: { slug: string; category: { slug: string } | null }) {
  const section =
    product.category && ACCESSORY_CATEGORY_SLUGS.has(product.category.slug) ? "phu-kien" : "saxophone";
  return `/${section}/${product.slug}`;
}
