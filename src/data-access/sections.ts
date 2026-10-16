import { cache } from "react";
import { getChildCategories, type Category } from "@/data-access/categories";
import { getProductBySlug, type ProductDetail } from "@/data-access/products";
import { getProductHref, getProductSection, type ProductSection } from "@/lib/product-url";

export type SectionEntry =
  | { kind: "category"; category: Category }
  | { kind: "product"; product: ProductDetail }
  | { kind: "redirect"; href: string };

// /saxophone/[slug] và /phu-kien/[slug] dùng chung 1 route cho cả category
// con lẫn sản phẩm. Slug chỉ hợp lệ ở đúng khu vực của nó - nếu không, mỗi
// sản phẩm/category mở được ở 2 URL (vd. /saxophone/<slug-reed>) và URL nào
// cũng tự khai canonical chính nó => nội dung trùng lặp trong mắt Google.
// Slug có thật nhưng sai khu vực thì redirect về URL chuẩn (giữ link cũ đã
// được index); category gốc (/saxophone/phu-kien) không phải category con
// của khu vực nào nên trả null => 404.
//
// cache(): generateMetadata() và page component cùng gọi trong 1 request.
export const resolveSectionSlug = cache(
  async (section: ProductSection, slug: string): Promise<SectionEntry | null> => {
    const otherSection: ProductSection = section === "saxophone" ? "phu-kien" : "saxophone";
    const [children, otherChildren] = await Promise.all([
      getChildCategories(section),
      getChildCategories(otherSection),
    ]);

    const category = children.find((c) => c.slug === slug);
    if (category) return { kind: "category", category };
    if (otherChildren.some((c) => c.slug === slug)) return { kind: "redirect", href: `/${otherSection}/${slug}` };

    const product = await getProductBySlug(slug);
    if (!product) return null;
    if (getProductSection(product.category) === section) return { kind: "product", product };
    return { kind: "redirect", href: getProductHref(product) };
  },
);
