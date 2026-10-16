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
    getChildCategories("phu-kien"),
    getProducts({ sectionSlug: "phu-kien" }),
  ]);

  return [...categories.map((c) => ({ slug: c.slug })), ...products.map((p) => ({ slug: p.slug }))];
}

// Route dùng chung: khớp cả slug category (mouthpiece, reed,...) lẫn slug
// sản phẩm phụ kiện.
export async function generateMetadata({ params }: PageProps<"/phu-kien/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = await resolveSectionSlug("phu-kien", slug);

  if (entry?.kind === "product") return productMetadata(entry.product, `/phu-kien/${slug}`);
  if (entry?.kind === "category") return categoryMetadata(entry.category, `/phu-kien/${slug}`);
  return {};
}

export default async function PhuKienSlugPage({ params }: PageProps<"/phu-kien/[slug]">) {
  const { slug } = await params;
  const entry = await resolveSectionSlug("phu-kien", slug);
  if (!entry) notFound();
  if (entry.kind === "redirect") permanentRedirect(entry.href);

  if (entry.kind === "category") {
    const { category } = entry;
    const crumbs = [
      { name: "Trang chủ", path: "/" },
      { name: "Phụ kiện", path: "/phu-kien" },
      { name: category.name, path: `/phu-kien/${slug}` },
    ];
    return (
      <Container className="py-12">
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <Breadcrumb items={crumbs} />
        <SectionHeading
          as="h1"
          eyebrow="Phụ kiện"
          title={category.name}
          description={category.description ?? undefined}
        />
        <CategoryProductListing sectionSlug="phu-kien" basePath="/phu-kien" initialCategory={slug} />
      </Container>
    );
  }

  const { product } = entry;
  const related = await getRelatedProducts(product, 4);
  const crumbs = [
    { name: "Trang chủ", path: "/" },
    { name: "Phụ kiện", path: "/phu-kien" },
    // Sản phẩm gán thẳng vào category gốc thì không có trang category con để trỏ tới.
    ...(product.category?.parent ? [{ name: product.category.name, path: `/phu-kien/${product.category.slug}` }] : []),
    { name: product.name, path: `/phu-kien/${slug}` },
  ];
  const productLd = productJsonLd(product, `/phu-kien/${slug}`);
  return (
    <>
      {productLd && <JsonLd data={productLd} />}
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <ProductDetailView product={product} related={related} breadcrumb={crumbs} />
    </>
  );
}
