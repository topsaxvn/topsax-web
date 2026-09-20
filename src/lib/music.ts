// Nhạc lý dùng chung cho trang Cảm âm (giữ đồng bộ với view.js của dự án
// virtual-piano - nguồn dữ liệu bảng "songs").

const UUID_SUFFIX = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

// URL cảm âm dùng thẳng cột "slug" của bảng songs.
export function songUrlSlug(song: { slug: string }): string {
  return song.slug;
}

// Trích id UUID từ tham số route cũ (bare id, hoặc slug ghép id kiểu
// `<ten-bai-hat>-<uuid>` dùng tạm trước khi có cột slug) để tra cứu ngược
// và redirect sang URL slug hiện tại.
export function songIdFromUrlParam(param: string): string | null {
  const match = param.match(UUID_SUFFIX);
  return match ? match[1] : null;
}

export type InstrumentKey =
  | "piano"
  | "altoSax"
  | "bariSax"
  | "tenorSax"
  | "sopranoSax"
  | "trumpet"
  | "clarinetBb"
  | "frenchHorn";

export type NoteNaming = "letter" | "solfege";

// Một từ có nốt đầu ở `note`, và nếu là nốt luyến (slur) thì các nốt tiếp
// theo nằm trong `slur` (ví dụ hát "à" trên 3 nốt C4-E4-G4).
export type SongWord = { text: string; note?: number | null; slur?: number[] | null };
export type SongLine = SongWord[];

const NOTE_NAMES_LETTER = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_NAMES_SOLFEGE = ["Đô", "Đô#", "Rê", "Rê#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];

export const INSTRUMENTS: Record<InstrumentKey, { label: string; semitoneShift: number; octaveShift: number }> = {
  piano: { label: "Piano / Concert Pitch", semitoneShift: 0, octaveShift: 0 },
  altoSax: { label: "Alto Saxophone (Eb)", semitoneShift: 9, octaveShift: 0 },
  bariSax: { label: "Baritone Saxophone (Eb)", semitoneShift: 9, octaveShift: 1 },
  tenorSax: { label: "Tenor Saxophone (Bb)", semitoneShift: 2, octaveShift: 1 },
  sopranoSax: { label: "Soprano Saxophone (Bb)", semitoneShift: 2, octaveShift: 0 },
  trumpet: { label: "Trumpet / Cornet (Bb)", semitoneShift: 2, octaveShift: 0 },
  clarinetBb: { label: "Clarinet (Bb)", semitoneShift: 2, octaveShift: 0 },
  frenchHorn: { label: "French Horn (F)", semitoneShift: 7, octaveShift: 0 },
};

export const SAX_FAMILY: InstrumentKey[] = ["altoSax", "bariSax", "tenorSax", "sopranoSax"];

export function pitchClassName(pc: number, naming: NoteNaming): string {
  const arr = naming === "solfege" ? NOTE_NAMES_SOLFEGE : NOTE_NAMES_LETTER;
  return arr[((pc % 12) + 12) % 12];
}

export function noteNameFromMidi(midi: number, naming: NoteNaming): string {
  return `${pitchClassName(midi % 12, naming)}${Math.floor(midi / 12) - 1}`;
}

export function transposeForInstrument(concertMidi: number, instrumentKey: InstrumentKey): number {
  const inst = INSTRUMENTS[instrumentKey] ?? INSTRUMENTS.piano;
  return concertMidi + inst.semitoneShift + 12 * inst.octaveShift;
}

// Tất cả nốt của một từ - nốt đầu cộng các nốt luyến (nếu có), theo đúng thứ tự.
export function wordNotes(word: SongWord): number[] {
  if (word.note === null || word.note === undefined) return [];
  return [word.note, ...(word.slur || [])];
}

// Cao độ (pitch class) của tone bài hát khi viết cho một nhạc cụ cụ thể
// (tone gốc + độ dịch giọng của nhạc cụ đó).
export function toneFor(songKey: number, instrumentKey: InstrumentKey): number {
  return ((songKey || 0) + INSTRUMENTS[instrumentKey].semitoneShift) % 12;
}

export const TONE_FILTERS: { label: string; instrument: InstrumentKey }[] = [
  { label: "Tone gốc", instrument: "piano" },
  { label: "Tone kèn alto", instrument: "altoSax" },
  { label: "Tone kèn soprano", instrument: "sopranoSax" },
];

export function songMetaText(songKey: number): string {
  return [
    `Gốc ${pitchClassName(toneFor(songKey, "piano"), "letter")}`,
    `Alto ${pitchClassName(toneFor(songKey, "altoSax"), "letter")}`,
    `Soprano ${pitchClassName(toneFor(songKey, "sopranoSax"), "letter")}`,
  ].join(" · ");
}

// Bỏ dấu tiếng Việt và viết thường để "hong" tìm ra "Hồng".
export function normalizeText(text: string | null | undefined): string {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase();
}

export function lyricPreview(lines: SongLine[]): string {
  return lines
    .map((line) => line.map((w) => w.text).join(" "))
    .filter(Boolean)
    .slice(0, 2)
    .join(" / ");
}

// Toàn bộ lời bài hát dạng text thuần, dùng cho structured data (JSON-LD).
export function lyricsText(lines: SongLine[]): string {
  return lines
    .map((line) => line.map((w) => w.text).join(" "))
    .filter(Boolean)
    .join("\n");
}
