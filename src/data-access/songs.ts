import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/types/database";
import type { InstrumentKey, NoteNaming, SongLine } from "@/lib/music";

type SongRow = Database["public"]["Tables"]["songs"]["Row"];

export type SongSummary = Pick<
  SongRow,
  "id" | "slug" | "title" | "singer" | "instrument" | "song_key" | "updated_at"
> & {
  lines: SongLine[];
};

export type SongDetail = Omit<SongRow, "instrument" | "naming" | "lines"> & {
  instrument: InstrumentKey;
  naming: NoteNaming;
  lines: SongLine[];
};

// Chỉ đọc các bài cảm âm đã published từ project virtual-piano (dùng chung
// Supabase project với TOPSAX). Không có admin CRUD cho bảng này ở đây.
export async function getPublishedSongs(limit?: number): Promise<SongSummary[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("songs")
    // Chỉ lấy 2 dòng lời đầu để preview card, không tải cả bài.
    .select("id,slug,title,singer,instrument,song_key,updated_at,first:lines->0,second:lines->1")
    .eq("published", true)
    .order("updated_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) throw error;

  return (data as unknown as Array<SongRow & { first: SongLine | null; second: SongLine | null }>).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    singer: row.singer,
    instrument: row.instrument as InstrumentKey,
    song_key: row.song_key,
    updated_at: row.updated_at,
    lines: [row.first, row.second].filter((l): l is SongLine => Boolean(l)),
  }));
}

function mapSongDetail(data: SongRow): SongDetail {
  return {
    ...data,
    instrument: data.instrument as InstrumentKey,
    naming: data.naming as NoteNaming,
    lines: (data.lines as unknown as SongLine[]) ?? [],
  };
}

export const getPublishedSongBySlug = cache(async (slug: string): Promise<SongDetail | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data ? mapSongDetail(data) : null;
});

// Giữ lại để hỗ trợ các liên kết cũ trỏ thẳng vào id (trước khi có cột slug).
export const getPublishedSongById = cache(async (id: string): Promise<SongDetail | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data ? mapSongDetail(data) : null;
});
