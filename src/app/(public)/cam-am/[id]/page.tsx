import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SongDetailView } from "@/components/cam-am/SongDetailView";
import { getPublishedSongById } from "@/data-access/songs";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps<"/cam-am/[id]">): Promise<Metadata> {
  const { id } = await params;
  const song = await getPublishedSongById(id);
  if (!song) return {};

  const title = `${song.title}${song.singer ? ` - ${song.singer}` : ""} | Cảm âm`;
  const description = `Cảm âm ${song.title}${song.singer ? ` - ${song.singer}` : ""}: lời bài hát kèm tên nốt, tự chuyển tone theo nhạc cụ.`;
  const url = absoluteUrl(`/cam-am/${id}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title, description },
  };
}

export default async function CamAmDetailPage({ params }: PageProps<"/cam-am/[id]">) {
  const { id } = await params;
  const song = await getPublishedSongById(id);
  if (!song) notFound();

  const crumbs = [
    { name: "Trang chủ", path: "/" },
    { name: "Cảm âm", path: "/cam-am" },
    { name: song.title, path: `/cam-am/${id}` },
  ];

  return (
    <div>
      <Breadcrumb items={crumbs} />
      <div className="max-w-3xl">
        <SongDetailView song={song} />
      </div>
    </div>
  );
}
