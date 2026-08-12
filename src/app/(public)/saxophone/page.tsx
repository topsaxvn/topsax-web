import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryProductListing } from "@/components/product/CategoryProductListing";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Saxophone",
  description: "Danh sách saxophone alto, tenor, baritone - mới và đã qua sử dụng.",
  alternates: { canonical: absoluteUrl("/saxophone") },
};

export default function SaxophonePage() {
  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Danh mục"
        title="Saxophone"
        description="Alto, tenor, baritone - saxophone mới và đã qua sử dụng, kiểm tra kỹ trước khi bán."
      />
      <CategoryProductListing sectionSlug="saxophone" basePath="/saxophone" />
    </Container>
  );
}
