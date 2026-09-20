import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CamAmBrowser } from "@/components/cam-am/CamAmBrowser";
import { getPublishedSongs } from "@/data-access/songs";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Cảm âm",
  description: "Cảm âm saxophone: lời bài hát kèm tên nốt, tự chuyển tone theo alto/tenor/soprano sax.",
  alternates: { canonical: absoluteUrl("/cam-am") },
};

export default async function CamAmPage() {
  const songs = await getPublishedSongs();

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Kho cảm âm"
        title="Cảm âm"
        description="Lời bài hát kèm tên nốt, tự động chuyển tone theo từng loại kèn - kèm bảng thế bấm sax cho từng nốt."
      />
      <div className="mt-8">
        <CamAmBrowser songs={songs} />
      </div>
    </Container>
  );
}
