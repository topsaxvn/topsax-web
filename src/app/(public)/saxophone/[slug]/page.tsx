import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryProductListing } from "@/components/product/CategoryProductListing";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { getCategoryBySlug } from "@/data-access/categories";
import { getProductBySlug, getRelatedProducts } from "@/data-access/products";

// Route dùng chung: khớp cả slug category (alto, tenor, baritone) lẫn slug
// sản phẩm (vd. yamaha-yas-62) - xem ghi chú kiến trúc ở phase trước.
export async function generateMetadata({ params }: PageProps<"/saxophone/[slug]">): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (product) {
    return {
      title: product.meta_title ?? product.name,
      description: product.meta_description ?? product.short_description ?? undefined,
    };
  }

  const category = await getCategoryBySlug(slug);
  if (category) {
    return { title: category.name, description: category.description ?? undefined };
  }

  return {};
}

export default async function SaxophoneSlugPage({ params }: PageProps<"/saxophone/[slug]">) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (category) {
    return (
      <Container className="py-12">
        <SectionHeading eyebrow="Saxophone" title={category.name} description={category.description ?? undefined} />
        <CategoryProductListing sectionSlug="saxophone" basePath="/saxophone" category={slug} />
      </Container>
    );
  }

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  return <ProductDetailView product={product} related={related} />;
}
