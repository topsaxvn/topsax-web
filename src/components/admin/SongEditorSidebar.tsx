"use client";

import { useState } from "react";
import type { SongAdminSummary } from "@/lib/admin-api/songs";
import { normalizeText } from "@/lib/music";
import { cn } from "@/lib/utils/cn";

// Danh sách bài hát bên trái (nháp lên trước, đã xuất bản sau), có ô tìm
// không phân biệt dấu tiếng Việt.
export function SongEditorSidebar({
  songs,
  currentId,
  onSelect,
  onNew,
}: {
  songs: SongAdminSummary[] | null;
  currentId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const [search, setSearch] = useState("");

  const tokens = normalizeText(search).split(/\s+/).filter(Boolean);
  const filtered = (songs ?? []).filter((s) => {
    const haystack = normalizeText(`${s.title} ${s.singer}`);
    return tokens.every((t) => haystack.includes(t));
  });
  const total = songs?.length ?? 0;

  const groups: [string, boolean, SongAdminSummary[]][] = [
    ["Chưa xuất bản", false, filtered.filter((s) => !s.published)],
    ["Đã xuất bản", true, filtered.filter((s) => s.published)],
  ];

  return (
    <aside className="flex flex-col rounded-2xl border border-border bg-paper p-3 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]">
      <h2 className="px-1 text-sm font-semibold text-muted">
        Bài hát {total > 0 && (tokens.length ? `(${filtered.length}/${total})` : `(${total})`)}
      </h2>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm tên bài hoặc ca sĩ..."
        autoComplete="off"
        className="mt-2 w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-brass"
      />

      <div className="mt-2 min-h-0 max-h-56 flex-1 overflow-y-auto lg:max-h-none">
        {currentId === null && (
          <div className="mb-1 rounded-lg border border-brass bg-brass/15 px-2.5 py-2 text-sm text-ink">
            Bài mới (chưa lưu)
          </div>
        )}
        {songs === null ? (
          <p className="px-1 py-2 text-xs text-muted">Đang tải...</p>
        ) : total === 0 ? (
          <p className="px-1 py-2 text-xs text-muted">Chưa có bài hát nào.</p>
        ) : filtered.length === 0 ? (
          <p className="px-1 py-2 text-xs text-muted">Không tìm thấy bài hát nào.</p>
        ) : (
          groups.map(
            ([label, published, items]) =>
              items.length > 0 && (
                <div key={label}>
                  <h3
                    className={cn(
                      "mb-1.5 mt-3 px-1 text-[11px] font-semibold uppercase tracking-wide",
                      published ? "text-muted" : "text-brass-deep",
                    )}
                  >
                    {label} ({items.length})
                  </h3>
                  {items.map((song) => (
                    <button
                      key={song.id}
                      type="button"
                      title={song.title}
                      onClick={() => onSelect(song.id)}
                      className={cn(
                        "mb-1 flex w-full flex-col items-start rounded-lg border px-2.5 py-1.5 text-left",
                        song.id === currentId
                          ? "border-brass bg-brass/15"
                          : "border-transparent hover:bg-paper-soft",
                      )}
                    >
                      <span className="w-full truncate text-sm text-ink">{song.title}</span>
                      {song.singer && <span className="w-full truncate text-xs text-muted">{song.singer}</span>}
                    </button>
                  ))}
                </div>
              ),
          )
        )}
      </div>

      <button
        type="button"
        onClick={onNew}
        className="mt-3 rounded-lg border border-border px-3 py-2 text-sm font-medium text-ink-soft hover:border-brass hover:text-brass-deep"
      >
        + Bài mới
      </button>
    </aside>
  );
}
