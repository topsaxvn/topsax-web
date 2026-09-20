"use client";

import { useMemo, useState } from "react";
import type { SongSummary } from "@/data-access/songs";
import { SongCard } from "@/components/cam-am/SongCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { TONE_FILTERS, normalizeText, pitchClassName, toneFor } from "@/lib/music";

const fieldClass =
  "rounded-lg border border-border bg-paper px-3.5 py-2 text-sm text-ink outline-none focus:border-brass";

const PITCH_OPTIONS = Array.from({ length: 12 }, (_, pc) => ({
  value: String(pc),
  label: `${pitchClassName(pc, "letter")} / ${pitchClassName(pc, "solfege")}`,
}));

export function CamAmBrowser({ songs }: { songs: SongSummary[] }) {
  const [search, setSearch] = useState("");
  const [toneValues, setToneValues] = useState<string[]>(TONE_FILTERS.map(() => ""));

  const shown = useMemo(() => {
    const tokens = normalizeText(search).split(/\s+/).filter(Boolean);
    return songs.filter((song) => {
      const haystack = normalizeText(`${song.title} ${song.singer || ""}`);
      if (!tokens.every((t) => haystack.includes(t))) return false;
      return TONE_FILTERS.every(
        (f, i) => toneValues[i] === "" || toneFor(song.song_key, f.instrument) === Number(toneValues[i]),
      );
    });
  }, [songs, search, toneValues]);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex min-w-[220px] flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Tìm theo tên bài / ca sĩ</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tên bài hát hoặc ca sĩ..."
            className={fieldClass}
          />
        </label>
        {TONE_FILTERS.map((f, i) => (
          <label key={f.label} className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">{f.label}</span>
            <select
              value={toneValues[i]}
              onChange={(e) =>
                setToneValues((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
              }
              className={fieldClass}
            >
              <option value="">Tất cả</option>
              {PITCH_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            message={songs.length ? "Không tìm thấy bài hát nào." : "Chưa có cảm âm nào được xuất bản."}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}
