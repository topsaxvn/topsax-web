import Link from "next/link";
import type { SongSummary } from "@/data-access/songs";
import { lyricPreview, songMetaText } from "@/lib/music";

export function SongCard({ song }: { song: SongSummary }) {
  return (
    <Link
      href={`/cam-am/${song.id}`}
      className="group flex flex-col gap-2 rounded-2xl border border-border bg-paper p-5 transition-shadow hover:shadow-md"
    >
      <h3 className="font-semibold text-ink group-hover:text-brass-deep">{song.title}</h3>
      {song.singer && <p className="text-sm text-ink">{song.singer}</p>}
      {song.lines.length > 0 && (
        <p className="line-clamp-2 text-sm text-muted">{lyricPreview(song.lines)}</p>
      )}
      <p className="mt-1 text-xs font-semibold text-brass-deep">{songMetaText(song.song_key)}</p>
    </Link>
  );
}
