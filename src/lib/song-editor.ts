import { wordNotes, type SongLine, type SongWord } from "@/lib/music";

// Logic thuần (không phụ thuộc React) của trình soạn cảm âm, port từ dự án
// virtual-piano (app.js) - giữ nguyên hành vi để dữ liệu hai bên tương thích.

export const SCALES: Record<string, { label: string; steps: number[] }> = {
  major: { label: "Major (Trưởng)", steps: [0, 2, 4, 5, 7, 9, 11] },
  natMinor: { label: "Natural Minor (Thứ tự nhiên)", steps: [0, 2, 3, 5, 7, 8, 10] },
  harMinor: { label: "Harmonic Minor (Thứ hòa âm)", steps: [0, 2, 3, 5, 7, 8, 11] },
  melMinor: { label: "Melodic Minor (Thứ giai điệu)", steps: [0, 2, 3, 5, 7, 9, 11] },
  majPent: { label: "Major Pentatonic", steps: [0, 2, 4, 7, 9] },
  minPent: { label: "Minor Pentatonic", steps: [0, 3, 5, 7, 10] },
  blues: { label: "Blues", steps: [0, 3, 5, 6, 7, 10] },
  dorian: { label: "Dorian", steps: [0, 2, 3, 5, 7, 9, 10] },
  phrygian: { label: "Phrygian", steps: [0, 1, 3, 5, 7, 8, 10] },
  lydian: { label: "Lydian", steps: [0, 2, 4, 6, 7, 9, 11] },
  mixolydian: { label: "Mixolydian", steps: [0, 2, 4, 5, 7, 9, 10] },
  locrian: { label: "Locrian", steps: [0, 1, 3, 5, 6, 8, 10] },
  chromatic: { label: "Chromatic (Tất cả)", steps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
};

export const PIANO_MIDI_MIN = 48; // C3
export const PIANO_MIDI_MAX = 84; // C6

// Phím máy tính -> số nửa cung so với bát độ gốc (phím A = nốt gốc).
export const COMPUTER_KEY_OFFSETS: Record<string, number> = {
  a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6,
  g: 7, y: 8, h: 9, u: 10, j: 11, k: 12,
  o: 13, l: 14, p: 15, ";": 16,
};

export function isBlackKey(midi: number): boolean {
  return [1, 3, 6, 8, 10].includes(midi % 12);
}

export function isInScale(midi: number, root: number, scaleType: string): boolean {
  const rel = ((((midi % 12) - root) % 12) + 12) % 12;
  return (SCALES[scaleType]?.steps ?? []).includes(rel);
}

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function newSongId(): string {
  return `song_${Date.now()}`;
}

export function uniqueSlug(base: string, existing: string[]): string {
  const root = base || "bai-hat";
  let slug = root;
  let n = 2;
  while (existing.includes(slug)) slug = `${root}-${n++}`;
  return slug;
}

// ---------- Lời bài hát ----------

export function parseLyricsText(text: string): SongLine[] {
  return text
    .split("\n")
    .filter((l) => l.trim().length > 0)
    .map((line) =>
      line
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((t): SongWord => ({ text: t, note: null })),
    );
}

export function lyricsToText(lines: SongLine[]): string {
  return lines.map((line) => line.map((w) => w.text).join(" ")).join("\n");
}

// Sửa lời nhưng giữ nốt của những chữ không đổi (cùng vị trí, cùng nội dung).
export function applyLyricsPreservingNotes(oldLines: SongLine[], text: string): SongLine[] {
  const next = parseLyricsText(text);
  return next.map((line, li) =>
    line.map((word, wi) => {
      const old = oldLines[li]?.[wi];
      if (old && old.text === word.text) return { ...old };
      return word;
    }),
  );
}

export function withNotes(word: SongWord, notes: number[]): SongWord {
  if (notes.length === 0) return { text: word.text, note: null };
  return notes.length > 1
    ? { text: word.text, note: notes[0], slur: notes.slice(1) }
    : { text: word.text, note: notes[0] };
}

// Dịch giọng thật: đổi luôn nốt đã gán (khác với thăng/giáng tạm thời chỉ để xem).
export function transposeLines(lines: SongLine[], semitones: number): SongLine[] {
  return lines.map((line) =>
    line.map((w) => {
      const next: SongWord = { ...w };
      if (w.note !== null && w.note !== undefined) next.note = w.note + semitones;
      if (w.slur) next.slur = w.slur.map((m) => m + semitones);
      return next;
    }),
  );
}

// ---------- Chữ đang chọn ----------

export type ActiveWord = { line: number; word: number; slurPending?: boolean } | null;

export function advanceActive(lines: SongLine[], active: NonNullable<ActiveWord>): ActiveWord {
  const { line, word } = active;
  if (word + 1 < lines[line].length) return { line, word: word + 1 };
  if (line + 1 < lines.length && lines[line + 1].length > 0) return { line: line + 1, word: 0 };
  return null;
}

function findLastNonEmpty(lines: SongLine[]): number {
  for (let i = lines.length - 1; i >= 0; i--) if (lines[i].length > 0) return i;
  return -1;
}

export function moveHorizontal(lines: SongLine[], active: ActiveWord, dir: 1 | -1): ActiveWord {
  if (!active) {
    const li = dir > 0 ? lines.findIndex((l) => l.length > 0) : findLastNonEmpty(lines);
    if (li === -1) return null;
    return { line: li, word: dir > 0 ? 0 : lines[li].length - 1 };
  }
  const { line, word } = active;
  if (dir > 0) {
    if (word + 1 < lines[line].length) return { line, word: word + 1 };
    for (let li = line + 1; li < lines.length; li++) {
      if (lines[li].length > 0) return { line: li, word: 0 };
    }
  } else {
    if (word - 1 >= 0) return { line, word: word - 1 };
    for (let li = line - 1; li >= 0; li--) {
      if (lines[li].length > 0) return { line: li, word: lines[li].length - 1 };
    }
  }
  return { line, word };
}

export function moveVertical(lines: SongLine[], active: ActiveWord, dir: 1 | -1): ActiveWord {
  if (!active) {
    const li = dir > 0 ? lines.findIndex((l) => l.length > 0) : findLastNonEmpty(lines);
    return li === -1 ? null : { line: li, word: 0 };
  }
  const { line, word } = active;
  for (let li = line + dir; li >= 0 && li < lines.length; li += dir) {
    if (lines[li].length > 0) return { line: li, word: Math.min(word, lines[li].length - 1) };
  }
  return { line, word };
}

// ---------- Sao chép / dán nốt cả câu ----------

export type NoteClipboard = { line: number; items: number[][] };

export function lineNoteItems(line: SongLine): number[][] {
  return line.map(wordNotes);
}

export function pasteWouldOverwrite(target: SongLine, items: number[][]): boolean {
  const n = Math.min(target.length, items.length);
  return target.slice(0, n).some((w, i) => {
    const existing = wordNotes(w);
    return existing.length > 0 && String(existing) !== String(items[i]);
  });
}

// Chữ thứ i của câu đích nhận nốt của chữ thứ i của câu nguồn; chữ thừa ở
// hai bên được giữ nguyên.
export function pasteNoteItems(target: SongLine, items: number[][]): SongLine {
  return target.map((w, i) => (i < items.length ? withNotes(w, items[i]) : w));
}
