import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CategoryProductListing } from "@/components/product/CategoryProductListing";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCategoryBySlug, getChildCategories } from "@/data-access/categories";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/data-access/products";
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

  const product = await getProductBySlug(slug);
  if (product) return productMetadata(product, `/phu-kien/${slug}`);

  const category = await getCategoryBySlug(slug);
  if (category) return categoryMetadata(category, `/phu-kien/${slug}`);

  return {};
}

export default async function PhuKienSlugPage({ params }: PageProps<"/phu-kien/[slug]">) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (category) {
    const crumbs = [
      { name: "Trang chủ", path: "/" },
      { name: "Phụ kiện", path: "/phu-kien" },
      { name: category.name, path: `/phu-kien/${slug}` },
    ];
    return (
      <Container className="py-12">
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <Breadcrumb items={crumbs} />
        <SectionHeading eyebrow="Phụ kiện" title={category.name} description={category.description ?? undefined} />
        <CategoryProductListing sectionSlug="phu-kien" basePath="/phu-kien" initialCategory={slug} />
      </Container>
    );
  }

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const crumbs = [
    { name: "Trang chủ", path: "/" },
    { name: "Phụ kiện", path: "/phu-kien" },
    ...(product.category ? [{ name: product.category.name, path: `/phu-kien/${product.category.slug}` }] : []),
    { name: product.name, path: `/phu-kien/${slug}` },
  ];
  return (
    <>
      <JsonLd data={productJsonLd(product, `/phu-kien/${slug}`)} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <ProductDetailView product={product} related={related} breadcrumb={crumbs} />
    </>
  );
}
