"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { SongDetail } from "@/data-access/songs";
import { siteConfig } from "@/lib/site-config";
import {
  INSTRUMENTS,
  noteNameFromMidi,
  octaveLegend,
  songKeyName,
  transposeForInstrument,
  wordNotes,
  type InstrumentKey,
  type NoteNaming,
  type OctaveStyle,
} from "@/lib/music";

export const PRINT_SHEET_CLASS = "song-print-sheet";

export type PrintFingering = { written: number; src: string | null };

const subscribe = () => () => {};
const pitchClass = (n: number) => ((n % 12) + 12) % 12;

// Tờ A4 của bài cảm âm dùng cho "In / Lưu PDF" (và cả Ctrl+P). Gắn thẳng vào
// <body> để CSS @media print trong globals.css ẩn được mọi thứ khác của trang,
// chỉ in tờ này. Trên màn hình tờ này luôn ẩn.
export function SongPrintSheet({
  song,
  instrument,
  naming,
  octaveStyle,
  temp,
  fingerings,
}: {
  song: SongDetail;
  instrument: InstrumentKey;
  naming: NoteNaming;
  octaveStyle: OctaveStyle;
  temp: number;
  fingerings: PrintFingering[];
}) {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  if (!isClient) return null;

  const inst = INSTRUMENTS[instrument];
  const keyName = (pc: number) => songKeyName(pc, song.song_key_mode, naming);
  const concertKey = pitchClass(song.song_key + temp);
  const writtenKey = pitchClass(concertKey + inst.semitoneShift);
  const songUrl = `${siteConfig.url.replace(/^https?:\/\//, "")}/cam-am/${song.slug}`;

  const info: [string, string][] = [
    ["Nhạc cụ", inst.label],
    [instrument === "piano" ? "Tone" : "Tone theo nhạc cụ", keyName(writtenKey)],
  ];
  if (instrument !== "piano") info.push(["Tone gốc (concert)", keyName(concertKey)]);
  if (temp !== 0) {
    info.push([
      "Dịch giọng",
      `${temp > 0 ? "+" : ""}${temp} nửa cung so với bản gốc ${keyName(pitchClass(song.song_key))}`,
    ]);
  }
  info.push(["Ký hiệu nốt", naming === "solfege" ? "Đô Rê Mi" : "Chữ (C D E)"]);

  return createPortal(
    <div className={`${PRINT_SHEET_CLASS} hidden bg-white text-black [print-color-adjust:exact] print:block`}>
      <header className="flex items-center justify-between gap-4 border-b-2 border-brass pb-2.5">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- bản in, không cần tối ưu ảnh */}
          <img src="/brand/topsax-icon.png" alt="" className="h-9 w-auto invert" />
          <div>
            <p className="text-lg font-bold leading-none tracking-wide">{siteConfig.name}</p>
            <p className="mt-1 text-[10px] text-neutral-600">{siteConfig.tagline}</p>
          </div>
        </div>
        <div className="text-right text-[10px] leading-snug text-neutral-600">
          <p>{siteConfig.url.replace(/^https?:\/\//, "")}</p>
          <p>{siteConfig.phone}</p>
        </div>
      </header>

      <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brass-deep">Cảm âm</p>
      <h1 className="mt-1 text-[26px] font-bold leading-tight">{song.title}</h1>
      {song.singer && <p className="mt-1 text-sm text-neutral-700">Ca sĩ: {song.singer}</p>}

      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 rounded-lg border border-neutral-300 px-4 py-2.5">
        {info.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[9px] font-medium uppercase tracking-wide text-neutral-500">{label}</dt>
            <dd className="text-sm font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
      {octaveStyle === "mark" && (
        <p className="mt-2 text-[10px] leading-snug text-neutral-600">{octaveLegend(naming, instrument)}</p>
      )}

      <div className="mt-6 space-y-2.5">
        {song.lines.map((line, i) => (
          <div key={i} className="flex break-inside-avoid flex-wrap items-start gap-x-1.5 gap-y-1">
            {line.map((word, j) => {
              const notes = wordNotes(word);
              return (
                <div key={j} className="flex flex-col items-center px-0.5">
                  <span className="whitespace-nowrap text-[15px]">{word.text}</span>
                  <span className="min-h-[1em] whitespace-nowrap text-[11px] font-bold text-brass-deep">
                    {notes.length > 0
                      ? notes.map((n) => noteNameFromMidi(transposeForInstrument(n + temp, instrument), naming, octaveStyle)).join("-")
                      : ""}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {fingerings.length > 0 && (
        <section className="mt-8 break-inside-avoid">
          <h2 className="border-b border-neutral-300 pb-1.5 text-sm font-bold">
            Thế bấm dùng trong bài · {inst.label}
          </h2>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-4">
            {fingerings.map(({ written, src }) => (
              <div key={written} className="flex w-[15mm] flex-col items-center gap-1">
                <p className="text-[11px] font-bold">{noteNameFromMidi(written, naming, octaveStyle)}</p>
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element -- ảnh base64 data URI, không dùng next/image
                  <img src={src} alt="" className="w-full" />
                ) : (
                  <p className="text-[9px] text-neutral-500">ngoài phạm vi</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {song.description && (
        <p className="mt-8 whitespace-pre-line text-xs text-neutral-700">{song.description}</p>
      )}

      <footer className="mt-8 break-inside-avoid border-t border-neutral-300 pt-2 text-[10px] text-neutral-600">
        Xem bài, đổi nhạc cụ / tone và tra thế bấm tại {songUrl} · Mua kèn & phụ kiện: {siteConfig.name} – {siteConfig.phone}
      </footer>
    </div>,
    document.body,
  );
}
