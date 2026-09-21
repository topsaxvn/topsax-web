"use client";

import { useMemo, useState } from "react";
import { PianoKeyboard } from "@/components/admin/PianoKeyboard";
import { noteNameFromMidi, wordNotes, type SongLine, type SongWord } from "@/lib/music";

const START_MIDI_DEFAULT = 48; // C3

function splitLyrics(text: string): SongLine[] {
  return text
    .split("\n")
    .map((line) =>
      line
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((t): SongWord => ({ text: t, note: null })),
    )
    .filter((line) => line.length > 0);
}

// Bấm phím piano để gán nốt tuần tự cho từng từ - thay cho việc phải gõ tay
// số MIDI. "Nốt luyến" cho phép gán nhiều nốt liền nhau cho cùng 1 từ.
export function LyricsNoteEditor({
  value,
  onChange,
}: {
  value: SongLine[];
  onChange: (lines: SongLine[]) => void;
}) {
  const [lyricsDraft, setLyricsDraft] = useState(() =>
    value.map((line) => line.map((w) => w.text).join(" ")).join("\n"),
  );
  const [cursor, setCursor] = useState({ line: 0, word: 0 });
  const [slurMode, setSlurMode] = useState(false);
  const [startMidi, setStartMidi] = useState(START_MIDI_DEFAULT);

  const flatWords = useMemo(
    () => value.flatMap((line, li) => line.map((_, wi) => ({ line: li, word: wi }))),
    [value],
  );

  function updateWord(li: number, wi: number, updater: (w: SongWord) => SongWord) {
    onChange(value.map((line, i) => (i === li ? line.map((w, j) => (j === wi ? updater(w) : w)) : line)));
  }

  function moveCursor(delta: number) {
    const idx = flatWords.findIndex((p) => p.line === cursor.line && p.word === cursor.word);
    const next = flatWords[Math.min(Math.max(idx + delta, 0), flatWords.length - 1)];
    if (next) setCursor(next);
  }

  function handleKeyClick(midi: number) {
    const { line, word } = cursor;
    if (!value[line]?.[word]) return;
    if (slurMode) {
      // wordNotes() (dùng ở toàn bộ phía hiển thị) chỉ đọc slur khi note đã
      // có giá trị - click đầu tiên trong chế độ luyến phải set note gốc,
      // không thì slur bị "câm" (không hiển thị nốt nào cả).
      updateWord(line, word, (w) =>
        w.note == null ? { ...w, note: midi } : { ...w, slur: [...(w.slur ?? []), midi] },
      );
    } else {
      updateWord(line, word, (w) => ({ ...w, note: midi, slur: null }));
      moveCursor(1);
    }
  }

  function handleReparse() {
    const hasNotes = value.some((line) => line.some((w) => w.note != null));
    if (hasNotes && !confirm("Tách lại lời sẽ xoá toàn bộ nốt đã gán cho danh sách từ hiện tại. Tiếp tục?")) return;
    onChange(splitLyrics(lyricsDraft));
    setCursor({ line: 0, word: 0 });
  }

  const currentWord = value[cursor.line]?.[cursor.word];

  return (
    <div className="space-y-4">
      <div>
        <textarea
          rows={4}
          value={lyricsDraft}
          onChange={(e) => setLyricsDraft(e.target.value)}
          placeholder={"Dán lời bài hát vào đây, mỗi dòng 1 câu..."}
          className="w-full rounded-lg border border-border bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brass"
        />
        <button
          type="button"
          onClick={handleReparse}
          className="mt-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:text-ink"
        >
          Tách lời thành từ
        </button>
      </div>

      {value.length > 0 && (
        <>
          <div className="max-h-56 overflow-y-auto rounded-xl border border-border bg-paper-soft p-3">
            <div className="space-y-2">
              {value.map((line, li) => (
                <div key={li} className="flex flex-wrap gap-x-1 gap-y-1">
                  {line.map((w, wi) => {
                    const isCurrent = cursor.line === li && cursor.word === wi;
                    const notes = wordNotes(w);
                    return (
                      <button
                        key={wi}
                        type="button"
                        onClick={() => setCursor({ line: li, word: wi })}
                        className={`flex flex-col items-center rounded px-1.5 py-1 ${
                          isCurrent ? "bg-brass text-ink" : "hover:bg-paper"
                        }`}
                      >
                        <span className="whitespace-nowrap text-sm text-ink">{w.text}</span>
                        <span className="min-h-[1em] whitespace-nowrap text-[10px] font-semibold text-brass-deep">
                          {notes.length > 0 ? notes.map((n) => noteNameFromMidi(n, "letter")).join("-") : "·"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() => moveCursor(-1)}
              className="rounded-full border border-border px-3 py-1.5 text-ink-soft hover:text-ink"
            >
              ← Từ trước
            </button>
            <button
              type="button"
              onClick={() => moveCursor(1)}
              className="rounded-full border border-border px-3 py-1.5 text-ink-soft hover:text-ink"
            >
              Từ sau →
            </button>
            <button
              type="button"
              onClick={() => updateWord(cursor.line, cursor.word, (w) => ({ ...w, note: null, slur: null }))}
              className="rounded-full border border-border px-3 py-1.5 text-ink-soft hover:text-ink"
            >
              Xoá nốt
            </button>
            <label className="ml-auto flex items-center gap-1.5 text-ink-soft">
              <input type="checkbox" checked={slurMode} onChange={(e) => setSlurMode(e.target.checked)} className="h-4 w-4" />
              Nốt luyến (nhiều nốt / 1 từ)
            </label>
          </div>

          <div className="flex items-center justify-between text-xs text-muted">
            <span>
              Đang gán nốt cho: <strong className="text-ink">{currentWord?.text ?? "-"}</strong>
              {slurMode && " (đang thêm nốt luyến, bấm nhiều phím liên tiếp)"}
            </span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setStartMidi((m) => m - 12)} className="rounded-full border border-border px-2 py-1">
                Quãng 8 thấp hơn
              </button>
              <button type="button" onClick={() => setStartMidi((m) => m + 12)} className="rounded-full border border-border px-2 py-1">
                Quãng 8 cao hơn
              </button>
            </div>
          </div>

          <PianoKeyboard startMidi={startMidi} octaves={2} activeMidi={currentWord?.note ?? null} onKeyClick={handleKeyClick} />
        </>
      )}
    </div>
  );
}
