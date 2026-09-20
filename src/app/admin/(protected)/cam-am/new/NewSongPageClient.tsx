"use client";

import { SongForm } from "@/components/admin/SongForm";

export function NewSongPageClient() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Thêm bài cảm âm</h1>
      <div className="mt-6">
        <SongForm submitLabel="Tạo bài hát" />
      </div>
    </div>
  );
}
