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
    getChildCategories("saxophone"),
    getProducts({ sectionSlug: "saxophone" }),
  ]);

  return [...categories.map((c) => ({ slug: c.slug })), ...products.map((p) => ({ slug: p.slug }))];
}

// Route dùng chung: khớp cả slug category (alto, tenor, baritone) lẫn slug
// sản phẩm (vd. yamaha-yas-62) - xem ghi chú kiến trúc ở phase trước.
export async function generateMetadata({ params }: PageProps<"/saxophone/[slug]">): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (product) return productMetadata(product, `/saxophone/${slug}`);

  const category = await getCategoryBySlug(slug);
  if (category) return categoryMetadata(category, `/saxophone/${slug}`);

  return {};
}

export default async function SaxophoneSlugPage({ params }: PageProps<"/saxophone/[slug]">) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (category) {
    const crumbs = [
      { name: "Trang chủ", path: "/" },
      { name: "Saxophone", path: "/saxophone" },
      { name: category.name, path: `/saxophone/${slug}` },
    ];
    return (
      <Container className="py-12">
        <JsonLd data={breadcrumbJsonLd(crumbs)} />
        <Breadcrumb items={crumbs} />
        <SectionHeading eyebrow="Saxophone" title={category.name} description={category.description ?? undefined} />
        <CategoryProductListing sectionSlug="saxophone" basePath="/saxophone" initialCategory={slug} />
      </Container>
    );
  }

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const crumbs = [
    { name: "Trang chủ", path: "/" },
    { name: "Saxophone", path: "/saxophone" },
    ...(product.category ? [{ name: product.category.name, path: `/saxophone/${product.category.slug}` }] : []),
    { name: product.name, path: `/saxophone/${slug}` },
  ];
  return (
    <>
      <JsonLd data={productJsonLd(product, `/saxophone/${slug}`)} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <ProductDetailView product={product} related={related} breadcrumb={crumbs} />
    </>
  );
}
