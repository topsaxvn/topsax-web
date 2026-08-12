import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryProductListing } from "@/components/product/CategoryProductListing";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Phụ kiện",
  description: "Mouthpiece, reed, ligature, case và phụ kiện saxophone chính hãng.",
  alternates: { canonical: absoluteUrl("/phu-kien") },
};

export default function PhuKienPage() {
  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Danh mục"
        title="Phụ kiện"
        description="Mouthpiece, reed, ligature, case và các phụ kiện saxophone khác."
      />
      <CategoryProductListing sectionSlug="phu-kien" basePath="/phu-kien" />
    </Container>
  );
}
