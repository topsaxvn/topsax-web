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

// Chữ Hàn / Hán / Nhật viết liền cả từ nhưng mỗi âm tiết là một nốt, nên tách
// riêng từng ký tự; dấu câu dính kèm ký tự đứng cạnh, chữ Latin/số giữ nguyên cụm.
const SYLLABLE_CHAR = /[\p{Script=Hangul}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u;
const WORD_CHAR = /[\p{L}\p{N}]/u;

function splitSyllables(token: string): string[] {
  const parts: string[] = [];
  let current = "";
  let hasSyllable = false;
  for (const ch of token) {
    const isSyllable = SYLLABLE_CHAR.test(ch);
    const startsNew = isSyllable ? hasSyllable || WORD_CHAR.test(current) : hasSyllable && WORD_CHAR.test(ch);
    if (startsNew) {
      parts.push(current);
      current = "";
      hasSyllable = false;
    }
    current += ch;
    if (isSyllable) hasSyllable = true;
  }
  if (current) parts.push(current);
  return parts;
}

export function parseLyricsText(text: string): SongLine[] {
  return text
    .split("\n")
    .filter((l) => l.trim().length > 0)
    .map((line) =>
      line
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .flatMap(splitSyllables)
        .map((t): SongWord => ({ text: t, note: null })),
    );
}

export function lyricsToText(lines: SongLine[]): string {
  return lines.map((line) => line.map((w) => w.text).join(" ")).join("\n");
}

// Bài lưu từ trước khi tách âm tiết có thể còn chữ gộp ("어두운"): tách ra và
// chia nốt - đủ mỗi âm tiết một nốt thì chia đều, không thì âm tiết đầu giữ cả.
function splitWordSyllables(word: SongWord): SongWord[] {
  const parts = splitSyllables(word.text);
  if (parts.length <= 1) return [word];
  const notes = wordNotes(word);
  return parts.map((text, i) =>
    notes.length === parts.length
      ? withNotes({ text, note: null }, [notes[i]])
      : withNotes({ text, note: null }, i === 0 ? notes : []),
  );
}

// Sửa lời nhưng giữ nốt của những chữ không đổi (cùng vị trí, cùng nội dung).
export function applyLyricsPreservingNotes(oldLines: SongLine[], text: string): SongLine[] {
  const next = parseLyricsText(text);
  const oldSplit = oldLines.map((line) => line.flatMap(splitWordSyllables));
  return next.map((line, li) =>
    line.map((word, wi) => {
      const old = oldSplit[li]?.[wi];
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
// Truyền `only` để chỉ dịch những câu có chỉ số trong đó.
export function transposeLines(lines: SongLine[], semitones: number, only?: readonly number[]): SongLine[] {
  return lines.map((line, li) =>
    only && !only.includes(li)
      ? line
      : line.map((w) => {
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

// `lines`: chỉ số các câu nguồn (đã sắp xếp), `items[k]`: nốt từng chữ của câu lines[k].
export type NoteClipboard = { lines: number[]; items: number[][][] };

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

// Dán nhiều câu: câu nguồn thứ k vào câu start + k. Câu nguồn vượt quá cuối
// bài thì bỏ qua.
export function pasteLineItems(lines: SongLine[], start: number, items: number[][][]): SongLine[] {
  return lines.map((line, li) => {
    const k = li - start;
    return k >= 0 && k < items.length ? pasteNoteItems(line, items[k]) : line;
  });
}

export function pasteLinesWouldOverwrite(lines: SongLine[], start: number, items: number[][][]): boolean {
  return items.some((lineItems, k) => {
    const target = lines[start + k];
    return target !== undefined && pasteWouldOverwrite(target, lineItems);
  });
}
