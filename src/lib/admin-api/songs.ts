import { createClient } from "@/lib/supabase/client";
import { mapPgError } from "@/lib/supabase/errors";
import type { Database } from "@/types/database";
import type { InstrumentKey, NoteNaming, SongLine } from "@/lib/music";

const supabase = createClient();

type SongRow = Database["public"]["Tables"]["songs"]["Row"];

export type SongAdminSummary = Pick<
  SongRow,
  "id" | "slug" | "title" | "singer" | "song_key" | "song_key_mode" | "published" | "updated_at"
>;

export type SongAdminDetail = Omit<SongRow, "instrument" | "naming" | "lines"> & {
  instrument: InstrumentKey;
  naming: NoteNaming;
  lines: SongLine[];
};

function mapDetail(row: SongRow): SongAdminDetail {
  return {
    ...row,
    instrument: row.instrument as InstrumentKey,
    naming: row.naming as NoteNaming,
    lines: (row.lines as unknown as SongLine[]) ?? [],
  };
}

// Bảng "songs" dùng chung Supabase project với virtual-piano (dự án cảm âm
// gốc) - admin TOPSAX ghi thẳng vào đây qua Supabase client như các resource
// khác, dựa vào RLS của bảng để chỉ tài khoản admin đã đăng nhập mới ghi
// được. Không filter published=true như phía public vì admin cần thấy cả
// bài nháp.
export const songsApi = {
  async list(q?: string): Promise<SongAdminSummary[]> {
    let query = supabase
      .from("songs")
      .select("id,slug,title,singer,song_key,song_key_mode,published,updated_at")
      .order("updated_at", { ascending: false });
    if (q) query = query.ilike("title", `%${q}%`);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  },

  async getById(id: string): Promise<SongAdminDetail | null> {
    const { data, error } = await supabase.from("songs").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapDetail(data) : null;
  },

  async create(row: Database["public"]["Tables"]["songs"]["Insert"]): Promise<void> {
    const { error } = await supabase.from("songs").insert(row);
    if (error) throw new Error(mapPgError(error, "Slug đã tồn tại, vui lòng chọn slug khác."));
  },

  async update(id: string, row: Database["public"]["Tables"]["songs"]["Update"]): Promise<void> {
    const { error } = await supabase.from("songs").update(row).eq("id", id);
    if (error) throw new Error(mapPgError(error, "Slug đã tồn tại, vui lòng chọn slug khác."));
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("songs").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async setPublished(id: string, published: boolean): Promise<void> {
    const { error } = await supabase.from("songs").update({ published }).eq("id", id);
    if (error) throw new Error(error.message);
  },
};
