import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryProductListing } from "@/components/product/CategoryProductListing";

export const metadata: Metadata = {
  title: "Saxophone",
  description: "Danh sách saxophone alto, tenor, baritone - mới và đã qua sử dụng.",
};

export default async function SaxophonePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category, sort } = await searchParams;

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Danh mục"
        title="Saxophone"
        description="Alto, tenor, baritone - saxophone mới và đã qua sử dụng, kiểm tra kỹ trước khi bán."
      />
      <CategoryProductListing sectionSlug="saxophone" basePath="/saxophone" category={category} sort={sort} />
    </Container>
  );
}
