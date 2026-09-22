"use client";

import { noteNameFromMidi, type NoteNaming } from "@/lib/music";
import { PIANO_MIDI_MAX, PIANO_MIDI_MIN, isBlackKey, isInScale } from "@/lib/song-editor";

const WHITE_W = 40;
const BLACK_W = 26;

type Props = {
  naming: NoteNaming;
  scaleRoot: number;
  scaleType: string;
  pressed: number[];
  onKeyPress: (midi: number, shift: boolean) => void;
};

function keyClass(midi: number, black: boolean, scaleRoot: number, scaleType: string, isPressed: boolean) {
  const root = ((midi % 12) + 12) % 12 === scaleRoot;
  const inScale = isInScale(midi, scaleRoot, scaleType);
  if (black) {
    const bg = isPressed ? "bg-[#4a86c9]" : root ? "bg-[#ff8c42]" : inScale ? "bg-[#b8860b]" : "bg-[#1c1c1f]";
    return `z-10 h-[110px] w-[26px] text-[#eee] ${bg}`;
  }
  const bg = isPressed
    ? "bg-[#cfe8ff]"
    : root
      ? "bg-[#ff8c42] font-bold text-white shadow-[inset_0_0_0_2px_#d4691e]"
      : inScale
        ? "bg-[#ffdd7a]"
        : "bg-[#f7f5f0]";
  return `z-0 h-[180px] w-[40px] text-[#333] ${bg}`;
}

export function PianoKeyboard({ naming, scaleRoot, scaleType, pressed, onKeyPress }: Props) {
  const whiteKeys: number[] = [];
  const blackKeys: { midi: number; whiteBefore: number }[] = [];
  let whiteCount = 0;

  for (let midi = PIANO_MIDI_MIN; midi <= PIANO_MIDI_MAX; midi++) {
    if (isBlackKey(midi)) blackKeys.push({ midi, whiteBefore: whiteCount });
    else {
      whiteKeys.push(midi);
      whiteCount++;
    }
  }

  const base =
    "absolute top-0 flex select-none items-end justify-center rounded-b-md border border-[#111] pb-1.5 text-[10px] transition-colors duration-75";

  return (
    <div className="overflow-x-auto pb-2">
      <div className="relative h-[180px] select-none" style={{ width: whiteKeys.length * WHITE_W }}>
        {whiteKeys.map((midi, idx) => (
          <div
            key={midi}
            data-midi={midi}
            style={{ left: idx * WHITE_W }}
            onPointerDown={(e) => onKeyPress(midi, e.shiftKey)}
            className={`${base} ${keyClass(midi, false, scaleRoot, scaleType, pressed.includes(midi))}`}
          >
            <span className="pointer-events-none">{noteNameFromMidi(midi, naming)}</span>
          </div>
        ))}
        {blackKeys.map(({ midi, whiteBefore }) => (
          <div
            key={midi}
            data-midi={midi}
            style={{ left: whiteBefore * WHITE_W - BLACK_W / 2 }}
            onPointerDown={(e) => onKeyPress(midi, e.shiftKey)}
            className={`${base} ${keyClass(midi, true, scaleRoot, scaleType, pressed.includes(midi))}`}
          >
            <span className="pointer-events-none">{noteNameFromMidi(midi, naming)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
