import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryProductListing } from "@/components/product/CategoryProductListing";

export const metadata: Metadata = {
  title: "Phụ kiện",
  description: "Mouthpiece, reed, ligature, case và phụ kiện saxophone chính hãng.",
};

export default async function PhuKienPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category, sort } = await searchParams;

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Danh mục"
        title="Phụ kiện"
        description="Mouthpiece, reed, ligature, case và các phụ kiện saxophone khác."
      />
      <CategoryProductListing sectionSlug="phu-kien" basePath="/phu-kien" category={category} sort={sort} />
    </Container>
  );
}
