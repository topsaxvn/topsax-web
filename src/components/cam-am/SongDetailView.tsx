"use client";

import { useEffect, useMemo, useState } from "react";
import type { SongDetail } from "@/data-access/songs";
import { loadSaxFingerings, type FingeringData } from "@/lib/sax-fingerings";
import {
  INSTRUMENTS,
  SAX_FAMILY,
  noteNameFromMidi,
  songMetaText,
  transposeForInstrument,
  wordNotes,
  type InstrumentKey,
  type NoteNaming,
} from "@/lib/music";

const fieldClass =
  "rounded-lg border border-border bg-paper px-3.5 py-2 text-sm text-ink outline-none focus:border-brass";

export function SongDetailView({ song }: { song: SongDetail }) {
  // Mặc định mở bài ở tone kèn alto sax (nhạc cụ chủ lực của TOPSAX) thay vì
  // tone gốc lưu trong DB (thường là piano/concert pitch).
  const [instrument, setInstrument] = useState<InstrumentKey>("altoSax");
  const [naming, setNaming] = useState<NoteNaming>(song.naming);
  const [temp, setTemp] = useState(0);
  const [fingerings, setFingerings] = useState<FingeringData | null>(null);
  const [activeWord, setActiveWord] = useState<string | null>(null);

  const isSaxFamily = SAX_FAMILY.includes(instrument);

  const displayNote = (midi: number) =>
    noteNameFromMidi(transposeForInstrument(midi + temp, instrument), naming);

  useEffect(() => {
    if (!isSaxFamily || fingerings) return;
    let cancelled = false;
    loadSaxFingerings()
      .then((data) => {
        if (!cancelled) setFingerings(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isSaxFamily, fingerings]);

  function fingeringSrcForWritten(written: number): string | null {
    if (!fingerings) return null;
    const idx = written - fingerings.baseMidi;
    return idx >= 0 && idx < fingerings.images.length ? fingerings.images[idx] : null;
  }

  function fingeringSrc(concertMidi: number): string | null {
    return fingeringSrcForWritten(transposeForInstrument(concertMidi + temp, instrument));
  }

  // Cao độ đã viết (tăng dần) mà bài dùng cho nhạc cụ đang chọn - dùng để
  // liệt kê sẵn các thế bấm của cả bài, bên cạnh việc xem từng nốt khi hover.
  const usedWrittenNotes = useMemo(() => {
    if (!isSaxFamily) return [];
    const written = new Set<number>();
    song.lines.forEach((line) =>
      line.forEach((word) => {
        wordNotes(word).forEach((n) => written.add(transposeForInstrument(n + temp, instrument)));
      }),
    );
    return [...written].sort((a, b) => a - b);
  }, [song.lines, isSaxFamily, instrument, temp]);

  return (
    <div>
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{song.title}</h1>
        {song.singer && <p className="text-sm text-ink">Ca sĩ: {song.singer}</p>}
        <p className="text-xs font-semibold text-brass-deep">{songMetaText(song.song_key, song.song_key_mode)}</p>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-paper-soft p-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Nhạc cụ</span>
          <select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value as InstrumentKey)}
            className={fieldClass}
          >
            {Object.entries(INSTRUMENTS).map(([key, inst]) => (
              <option key={key} value={key}>
                {inst.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Tên nốt</span>
          <select
            value={naming}
            onChange={(e) => setNaming(e.target.value as NoteNaming)}
            className={fieldClass}
          >
            <option value="letter">Chữ (C, D, E...)</option>
            <option value="solfege">Do Re Mi (Đô Rê Mi...)</option>
          </select>
        </label>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Thăng/giáng tạm thời (chỉ xem)</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Giáng 1 nửa cung (chỉ xem)"
              onClick={() => setTemp((t) => t - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink hover:border-brass"
            >
              ♭
            </button>
            <span className="w-6 text-center text-sm font-semibold text-ink">
              {temp > 0 ? `+${temp}` : temp}
            </span>
            <button
              type="button"
              title="Thăng 1 nửa cung (chỉ xem)"
              onClick={() => setTemp((t) => t + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink hover:border-brass"
            >
              ♯
            </button>
          </div>
        </div>
      </div>

      {isSaxFamily && (
        <p className="mt-4 text-xs text-muted">Di chuột (hoặc chạm) vào nốt để xem thế bấm.</p>
      )}

      <div className="mt-4 space-y-3">
        {song.lines.map((line, i) => (
          <div key={i} className="flex flex-wrap items-start gap-1.5">
            {line.map((word, j) => {
              const key = `${i}-${j}`;
              const notes = wordNotes(word);
              const noted = notes.length > 0;
              const srcs = isSaxFamily ? notes.map(fingeringSrc).filter((s): s is string => s !== null) : [];

              return (
                <div
                  key={j}
                  className="relative flex flex-col items-center px-1"
                  {...(srcs.length > 0
                    ? {
                        tabIndex: 0,
                        onMouseEnter: () => setActiveWord(key),
                        onMouseLeave: () => setActiveWord((k) => (k === key ? null : k)),
                        onFocus: () => setActiveWord(key),
                        onBlur: () => setActiveWord((k) => (k === key ? null : k)),
                      }
                    : {})}
                >
                  <span className="whitespace-nowrap text-base text-ink">{word.text}</span>
                  <span
                    className={`min-h-[1em] whitespace-nowrap text-xs font-semibold ${
                      noted ? "text-brass-deep" : "text-transparent"
                    } ${srcs.length > 0 ? "cursor-help" : ""}`}
                  >
                    {noted ? notes.map(displayNote).join("-") : "·"}
                  </span>

                  {srcs.length > 0 && activeWord === key && (
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-20 flex -translate-x-1/2 gap-1 pb-2">
                      {srcs.map((src, k) => (
                        // eslint-disable-next-line @next/next/no-img-element -- ảnh base64 data URI, không dùng next/image
                        <img key={k} src={src} alt="" className="w-20 max-w-none rounded-md bg-paper drop-shadow-xl sm:w-24" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {song.description && (
        <div className="mt-10 rounded-2xl border border-border bg-paper-soft p-4">
          <p className="whitespace-pre-line text-sm text-ink">{song.description}</p>
        </div>
      )}

      {usedWrittenNotes.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-muted">Thế bấm dùng trong bài</h2>
          <div className="mt-3 flex flex-wrap gap-4">
            {usedWrittenNotes.map((written) => {
              const src = fingeringSrcForWritten(written);
              return (
                <div key={written} className="flex flex-col items-center gap-1">
                  <p className="text-sm font-semibold text-ink">{noteNameFromMidi(written, "letter")}</p>
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element -- ảnh base64 data URI, không dùng next/image
                    <img src={src} alt="" className="w-14 max-w-none" />
                  ) : (
                    <p className="text-xs text-muted">ngoài phạm vi</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
