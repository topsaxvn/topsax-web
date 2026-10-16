import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CategoryProductListing } from "@/components/product/CategoryProductListing";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getChildCategories } from "@/data-access/categories";
import { getProducts, getRelatedProducts } from "@/data-access/products";
import { resolveSectionSlug } from "@/data-access/sections";
import { breadcrumbJsonLd, categoryMetadata, productJsonLd, productMetadata } from "@/lib/seo";

export const revalidate = 1800;

export async function generateStaticParams() {
  const [categories, products] = await Promise.all([
    getChildCategories("saxophone"),
    getProducts({ sectionSlug: "saxophone" }),
  ]);

  return [...categories.map((c) => ({ slug: c.slug })), ...products.map((p) => ({ slug: p.slug }))];
}

// Route dùng chung: khớp cả slug category (alto, tenor, baritone) lẫn slug
// sản phẩm (vd. yamaha-yas-62) - xem ghi chú kiến trúc ở phase trước.
export async function generateMetadata({ params }: PageProps<"/saxophone/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = await resolveSectionSlug("saxophone", slug);

  if (entry?.kind === "product") return productMetadata(entry.product, `/saxophone/${slug}`);
  if (entry?.kind === "category") return categoryMetadata(entry.category, `/saxophone/${slug}`);
  return {};
}

export default async function SaxophoneSlugPage({ params }: PageProps<"/saxophone/[slug]">) {
  const { slug } = await params;
  const entry = await resolveSectionSlug("saxophone", slug);
  if (!entry) notFound();
  if (entry.kind === "redirect") permanentRedirect(entry.href);

  if (entry.kind === "category") {
    const { category } = entry;
    const crumbs = [
      { name: "Trang chủ", path: "/" },
      { name: "Saxophone", path: "/saxophone" },
      { name: category.name, path: `/saxophone/${slug}` },
    ];
    return (
      <Container className="py-12">
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <Breadcrumb items={crumbs} />
        <SectionHeading
          as="h1"
          eyebrow="Saxophone"
          title={category.name}
          description={category.description ?? undefined}
        />
        <CategoryProductListing sectionSlug="saxophone" basePath="/saxophone" initialCategory={slug} />
      </Container>
    );
  }

  const { product } = entry;
  const related = await getRelatedProducts(product, 4);
  const crumbs = [
    { name: "Trang chủ", path: "/" },
    { name: "Saxophone", path: "/saxophone" },
    // Sản phẩm gán thẳng vào category gốc thì không có trang category con để trỏ tới.
    ...(product.category?.parent ? [{ name: product.category.name, path: `/saxophone/${product.category.slug}` }] : []),
    { name: product.name, path: `/saxophone/${slug}` },
  ];
  const productLd = productJsonLd(product, `/saxophone/${slug}`);
  return (
    <>
      {productLd && <JsonLd data={productLd} />}
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <ProductDetailView product={product} related={related} breadcrumb={crumbs} />
    </>
  );
}
