"use client";

import { noteNameFromMidi } from "@/lib/music";

// Nốt trắng trong 1 quãng 8, theo thứ tự C D E F G A B (offset nửa cung so
// với gốc C).
const WHITE_SEMITONES = [0, 2, 4, 5, 7, 9, 11];
// Nốt đen nằm ngay sau nốt trắng ở các vị trí index này (C#, D#, F#, G#, A#
// - không có nốt đen sau E và sau B).
const BLACK_AFTER_WHITE_INDEX = [0, 1, 3, 4, 5];

export function PianoKeyboard({
  startMidi,
  octaves,
  activeMidi,
  onKeyClick,
}: {
  startMidi: number;
  octaves: number;
  activeMidi?: number | null;
  onKeyClick: (midi: number) => void;
}) {
  const totalWhite = octaves * 7;
  const whiteKeys: { midi: number }[] = [];
  const blackKeys: { midi: number; afterWhiteIndex: number }[] = [];

  for (let oct = 0; oct < octaves; oct++) {
    WHITE_SEMITONES.forEach((semi) => whiteKeys.push({ midi: startMidi + oct * 12 + semi }));
    BLACK_AFTER_WHITE_INDEX.forEach((wi) => {
      blackKeys.push({ midi: startMidi + oct * 12 + WHITE_SEMITONES[wi] + 1, afterWhiteIndex: oct * 7 + wi });
    });
  }

  return (
    <div className="relative flex h-28 w-full select-none">
      {whiteKeys.map((k) => (
        <button
          key={k.midi}
          type="button"
          onClick={() => onKeyClick(k.midi)}
          className={`flex flex-1 items-end justify-center border border-l-0 border-border pb-1 text-[10px] font-medium first:rounded-l-md first:border-l last:rounded-r-md ${
            activeMidi === k.midi ? "bg-brass text-ink" : "bg-white text-ink-soft hover:bg-paper-soft"
          }`}
        >
          {noteNameFromMidi(k.midi, "letter")}
        </button>
      ))}
      {blackKeys.map((k) => (
        <button
          key={k.midi}
          type="button"
          onClick={() => onKeyClick(k.midi)}
          style={{
            left: `${((k.afterWhiteIndex + 1) / totalWhite) * 100}%`,
            width: `${(1 / totalWhite) * 62}%`,
          }}
          className={`absolute top-0 z-10 h-[60%] -translate-x-1/2 rounded-b-md ${
            activeMidi === k.midi ? "bg-brass-deep" : "bg-ink hover:bg-ink-soft"
          }`}
        />
      ))}
    </div>
  );
}
