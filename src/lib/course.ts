// Khóa học saxophone: hằng số và các hàm đọc file bài (.nhac.json) và file
// giáo án (.md) dùng chung cho trang công khai và trang admin.
//
// Màn hình học là app "Tập Sax" (thư mục ky am/sax-tap), build thành web tĩnh
// đặt ở public/khoa-hoc/hoc. Nó đọc cùng các bảng course_* qua Supabase, dùng
// chung phiên đăng nhập (cookie) với trang này. Quy tắc đặt tên file ở đây
// giống sax-tap/scripts/sync-content.mjs (bản Android).

import type { CourseItemKind } from "@/types/database";

export const COURSE_SLUG = "saxophone-co-ban-30-ngay";
export const COURSE_PLAYER_PATH = "/khoa-hoc/hoc";
export const COURSE_LOGIN_PATH = "/khoa-hoc/dang-nhap";

export const ITEM_KINDS: CourseItemKind[] = ["notes", "song", "bonus"];
export const ITEM_KIND_LABEL: Record<CourseItemKind, string> = {
  notes: "Luyện nốt",
  song: "Bài hát",
  bonus: "Bài thêm",
};

/** Thứ tự trong một ngày: luyện nốt, bài hát, rồi bài thêm. */
export function compareItems(
  a: { kind: CourseItemKind; position: number; title: string },
  b: { kind: CourseItemKind; position: number; title: string },
): number {
  return (
    ITEM_KINDS.indexOf(a.kind) - ITEM_KINDS.indexOf(b.kind) ||
    a.position - b.position ||
    a.title.localeCompare(b.title, "vi")
  );
}

export interface ParsedItemFile {
  day: number;
  kind: CourseItemKind;
  title: string;
  subtitle: string;
  fileName: string;
  score: Record<string, unknown>;
}

const KIND_WORDS: [RegExp, CourseItemKind][] = [
  [/^(luyện nốt|notes?)$/i, "notes"],
  [/^(bài hát|song)$/i, "song"],
  [/^(bài thêm|bonus)$/i, "bonus"],
];

/**
 * "Ngày 04 - Luyện nốt - Nốt mới Sol.nhac.json" -> ngày 4, luyện nốt.
 * Cũng nhận "Day 04 - Song - ..." và kiểu cũ "Day 5_ Hot Cross Bun" (= bài hát).
 */
export function parseItemFileName(name: string): { day: number; kind: CourseItemKind; title: string } | null {
  const n = name.normalize("NFC").replace(/\.nhac\.json$|\.json$/i, "");
  const full = /^\s*(?:ngày|day)\s*0*(\d+)\s*-\s*([^-]+?)\s*-\s*(.+)$/i.exec(n);
  if (full) {
    const kind = KIND_WORDS.find(([re]) => re.test(full[2].trim()))?.[1];
    if (kind) return { day: Number(full[1]), kind, title: full[3].trim() };
  }
  const loose = /(?:ngày|day)\s*0*(\d+)/i.exec(n);
  return loose ? { day: Number(loose[1]), kind: "song", title: n.slice(loose.index + loose[0].length).replace(/^[\s:_-]+/, "") } : null;
}

/** Tiêu đề bài trong file, bỏ tiền tố "Day 5:" nếu có. */
export function itemTitleFromScore(score: Record<string, unknown>): string {
  return String(score.title ?? "")
    .replace(/^(?:day|ngày)\s*\d+\s*[:_-]?\s*/i, "")
    .trim();
}

/**
 * Dòng phụ của bài, chỉ giữ phần dặn dò:
 * "30 ngày học Sax · Ngày 4 · luyện nốt · 60 → 72 BPM · Si La Sol lên xuống" -> "Si La Sol lên xuống".
 * (Tên khóa, số ngày và tốc độ thì màn hình học đã hiện.)
 */
export function itemSubtitleFromScore(score: Record<string, unknown>): string {
  return String(score.subtitle ?? "")
    .split("·")
    .map((p) => p.trim())
    .filter((p) => p && !/^30 (ngày|days)|^(ngày|day) \d+|^luyện nốt$|^note practice$|bpm$/i.test(p))
    .join(" · ");
}

/** Đọc một file bài; báo lỗi tiếng Việt nếu không phải bản nhạc của Score Studio. */
export async function parseItemFile(file: File): Promise<ParsedItemFile> {
  const named = parseItemFileName(file.name);
  if (!named) throw new Error(`${file.name}: tên file phải bắt đầu bằng "Ngày <số> - Luyện nốt/Bài hát/Bài thêm - ...".`);

  let score: unknown;
  try {
    score = JSON.parse(await file.text());
  } catch {
    throw new Error(`${file.name}: không đọc được (không phải file .nhac.json).`);
  }
  const s = score as Record<string, unknown>;
  if (!s || typeof s !== "object" || !Array.isArray(s.parts) || !Array.isArray(s.measures)) {
    throw new Error(`${file.name}: không phải bản nhạc của Score Studio.`);
  }
  return {
    day: named.day,
    kind: named.kind,
    title: itemTitleFromScore(s) || named.title,
    subtitle: itemSubtitleFromScore(s),
    fileName: file.name,
    score: s,
  };
}

export interface ParsedGuide {
  day: number;
  title: string;
  body: string;
}

/**
 * File giáo án: mỗi ngày bắt đầu bằng "## Ngày N · Tên ngày", phần dưới là bài
 * giảng. Phần trước ngày đầu tiên (ghi chú cho người soạn) bị bỏ qua, và một
 * tiêu đề "## ..." khác cũng kết thúc ngày đang đọc.
 */
export function parseGuide(text: string): ParsedGuide[] {
  const out: ParsedGuide[] = [];
  let cur: { day: number; title: string; lines: string[] } | null = null;
  const flush = () => {
    if (cur) out.push({ day: cur.day, title: cur.title, body: cur.lines.join("\n").trim() });
    cur = null;
  };
  for (const line of text.normalize("NFC").split(/\r?\n/)) {
    if (/^##\s/.test(line)) {
      flush();
      const m = /^##\s*(?:ngày|day)\s*0*(\d+)\s*(?:[·:.\-–—]\s*(.*))?$/i.exec(line.trim());
      if (m) cur = { day: Number(m[1]), title: (m[2] ?? "").trim(), lines: [] };
    } else cur?.lines.push(line);
  }
  flush();
  return out;
}

export function formatCoursePrice(price: number): string {
  if (!price) return "Miễn phí";
  return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
}
