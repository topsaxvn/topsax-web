import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import type { SongDetail } from "@/data-access/songs";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SongDetailView } from "@/components/cam-am/SongDetailView";
import { getPublishedSongById, getPublishedSongBySlug } from "@/data-access/songs";
import { songIdFromUrlParam, songUrlSlug } from "@/lib/music";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 300;

// Tra theo slug trước; nếu không có (liên kết cũ trước khi có cột slug) thì
// thử tra theo id để còn redirect sang URL slug hiện tại thay vì báo lỗi.
async function resolveSong(param: string): Promise<SongDetail | null> {
  const bySlug = await getPublishedSongBySlug(param);
  if (bySlug) return bySlug;

  const id = songIdFromUrlParam(param);
  return id ? getPublishedSongById(id) : null;
}

export async function generateMetadata({ params }: PageProps<"/cam-am/[id]">): Promise<Metadata> {
  const { id } = await params;
  const song = await resolveSong(id);
  if (!song) return {};

  const title = `${song.title}${song.singer ? ` - ${song.singer}` : ""} | Cảm âm`;
  const description = `Cảm âm ${song.title}${song.singer ? ` - ${song.singer}` : ""}: lời bài hát kèm tên nốt, tự chuyển tone theo nhạc cụ.`;
  const url = absoluteUrl(`/cam-am/${songUrlSlug(song)}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title, description },
  };
}

export default async function CamAmDetailPage({ params }: PageProps<"/cam-am/[id]">) {
  const { id } = await params;
  const song = await resolveSong(id);
  if (!song) notFound();

  const canonicalSlug = songUrlSlug(song);
  if (id !== canonicalSlug) redirect(`/cam-am/${canonicalSlug}`);

  const crumbs = [
    { name: "Trang chủ", path: "/" },
    { name: "Cảm âm", path: "/cam-am" },
    { name: song.title, path: `/cam-am/${canonicalSlug}` },
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
