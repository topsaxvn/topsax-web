"use client";

import { useEffect, useState } from "react";
import { loadSaxFingerings, type FingeringData } from "@/lib/sax-fingerings";
import { noteNameFromMidi } from "@/lib/music";

// Các thế bấm sax của những nốt bài đang dùng; nốt của chữ đang chọn / phím
// vừa bấm được tô sáng. Bấm vào một thế bấm để nghe lại nốt đó.
export function SongFingeringList({
  writtenNotes,
  activeWritten,
  onPick,
}: {
  writtenNotes: number[];
  activeWritten: number[];
  onPick: (written: number) => void;
}) {
  const [data, setData] = useState<FingeringData | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadSaxFingerings()
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (writtenNotes.length === 0) return null;

  return (
    <div className="mt-4 border-t border-border pt-4">
      <h3 className="text-sm font-semibold text-muted">Các thế bấm dùng trong bài</h3>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {writtenNotes.map((written) => {
          const idx = data ? written - data.baseMidi : -1;
          const src = data && idx >= 0 && idx < data.images.length ? data.images[idx] : null;
          const active = activeWritten.includes(written);
          return (
            <button
              key={written}
              type="button"
              onClick={() => onPick(written)}
              className={`flex w-[65px] flex-col items-center rounded-md border p-1 ${
                active
                  ? "border-brass bg-brass/20 ring-2 ring-brass"
                  : "border-transparent hover:border-border hover:bg-paper-soft"
              }`}
            >
              <span className="mb-1 text-xs font-bold text-brass-deep">{noteNameFromMidi(written, "letter")}</span>
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element -- ảnh base64 data URI, không dùng next/image
                <img src={src} alt={noteNameFromMidi(written, "letter")} className="w-full rounded-md border border-border bg-white" />
              ) : (
                <span className="text-[10px] text-muted">{data ? "ngoài phạm vi" : "..."}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
