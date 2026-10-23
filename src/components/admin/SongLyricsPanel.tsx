"use client";

import {
  noteNameFromMidi,
  transposeForInstrument,
  wordNotes,
  type InstrumentKey,
  type NoteNaming,
  type OctaveStyle,
  type SongLine,
} from "@/lib/music";
import type { ActiveWord } from "@/lib/song-editor";
import { cn } from "@/lib/utils/cn";

const btn =
  "rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-brass hover:text-brass-deep";
const lineBtn =
  "rounded border border-border px-1.5 py-0.5 text-[10px] text-ink-soft opacity-70 hover:opacity-100 disabled:opacity-25";

// Bỏ focus khỏi nút vừa bấm để phím tắt (phím đàn, Ctrl+C/V...) vẫn hoạt động.
function blurThen(fn: () => void) {
  return (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();
    fn();
  };
}

export function SongLyricsPanel({
  lines,
  active,
  instrument,
  naming,
  octaveStyle,
  tempTranspose,
  editing,
  draft,
  hasClipboard,
  clipboardStatus,
  onDraftChange,
  onToggleEdit,
  onClearNotes,
  onSelectWord,
  selectedLines,
  onCopyLine,
  onPasteLine,
  onToggleLineSelection,
  onSelectAllLines,
  onClearLineSelection,
  onCopySelected,
  onTransposeLines,
}: {
  lines: SongLine[];
  active: ActiveWord;
  instrument: InstrumentKey;
  naming: NoteNaming;
  octaveStyle: OctaveStyle;
  tempTranspose: number;
  editing: boolean;
  draft: string;
  hasClipboard: boolean;
  clipboardStatus: string;
  onDraftChange: (text: string) => void;
  onToggleEdit: () => void;
  onClearNotes: () => void;
  onSelectWord: (line: number, word: number) => void;
  onCopyLine: (line: number) => void;
  onPasteLine: (line: number) => void;
  selectedLines: number[];
  onToggleLineSelection: (line: number, range: boolean) => void;
  onSelectAllLines: () => void;
  onClearLineSelection: () => void;
  onCopySelected: () => void;
  onTransposeLines: (lines: number[], semitones: number) => void;
}) {
  const displayNote = (midi: number) =>
    noteNameFromMidi(transposeForInstrument(midi + tempTranspose, instrument), naming, octaveStyle);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted">Lời bài hát</h2>
        <div className="flex flex-wrap items-center gap-2">
          {clipboardStatus && <span className="text-xs text-brass-deep">{clipboardStatus}</span>}
          <button type="button" onClick={onToggleEdit} className={btn}>
            {editing ? "Áp dụng lời" : "Sửa lời"}
          </button>
          <button type="button" onClick={onClearNotes} className={btn}>
            Xoá hết nốt đã gán
          </button>
        </div>
      </div>

      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Dán lời bài hát vào đây, mỗi câu một dòng..."
          className="mt-3 min-h-40 w-full resize-y rounded-lg border border-border bg-paper px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brass"
        />
      ) : lines.length === 0 ? (
        <p className="mt-3 text-xs text-muted">Chưa có lời bài hát. Bấm &quot;Sửa lời&quot; để nhập.</p>
      ) : (
        <>
          <div className="mt-3 flex min-h-9 flex-wrap items-center gap-2 rounded-lg bg-paper-soft px-2.5 py-1.5 text-xs">
            {selectedLines.length > 0 ? (
              <>
                <span className="font-semibold text-ink">Đã chọn {selectedLines.length} câu</span>
                <button type="button" onClick={blurThen(onCopySelected)} className={btn}>
                  Chép {selectedLines.length} câu
                </button>
                <span className="text-muted">Dịch giọng:</span>
                <button
                  type="button"
                  title="Giáng 1 nửa cung các câu đã chọn (đổi nốt, có lưu)"
                  onClick={blurThen(() => onTransposeLines(selectedLines, -1))}
                  className={btn}
                >
                  ♭
                </button>
                <button
                  type="button"
                  title="Thăng 1 nửa cung các câu đã chọn (đổi nốt, có lưu)"
                  onClick={blurThen(() => onTransposeLines(selectedLines, 1))}
                  className={btn}
                >
                  ♯
                </button>
                <button type="button" onClick={blurThen(onClearLineSelection)} className={`${btn} ml-auto`}>
                  Bỏ chọn
                </button>
              </>
            ) : (
              <>
                <span className="text-muted">
                  Tích ô đầu câu để chọn nhiều câu (giữ Shift để chọn cả đoạn), rồi chép hoặc dịch giọng cùng lúc.
                </span>
                <button type="button" onClick={blurThen(onSelectAllLines)} className={`${btn} ml-auto`}>
                  Chọn tất cả
                </button>
              </>
            )}
          </div>
          <div className="mt-2 max-h-[420px] overflow-y-auto pr-1">
            {lines.map((line, li) => {
              const selected = selectedLines.includes(li);
              return (
                <div
                  key={li}
                  className={cn(
                    "mb-2 flex flex-wrap items-end gap-1.5 rounded-lg px-1 py-0.5",
                    selected && "bg-brass/10 ring-1 ring-brass/40",
                  )}
                >
                  <div className="mr-1 flex items-center gap-0.5 self-center">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={selected}
                      aria-label={`Chọn câu ${li + 1}`}
                      title={`Chọn câu ${li + 1} (giữ Shift để chọn cả đoạn)`}
                      disabled={line.length === 0}
                      onClick={(e) => {
                        e.currentTarget.blur();
                        onToggleLineSelection(li, e.shiftKey);
                      }}
                      className={cn(
                        "mr-0.5 flex size-4 items-center justify-center rounded border text-[10px] leading-none disabled:opacity-25",
                        selected ? "border-brass bg-brass text-paper" : "border-border text-transparent hover:border-brass",
                      )}
                    >
                      ✓
                    </button>
                    <button
                      type="button"
                      title={`Sao chép nốt của câu ${li + 1}`}
                      onClick={blurThen(() => onCopyLine(li))}
                      className={lineBtn}
                    >
                      Chép
                    </button>
                    <button
                      type="button"
                      title={`Dán nốt đã sao chép vào câu ${li + 1}`}
                      disabled={!hasClipboard}
                      onClick={blurThen(() => onPasteLine(li))}
                      className={lineBtn}
                    >
                      Dán
                    </button>
                    <button
                      type="button"
                      title={`Giáng 1 nửa cung riêng câu ${li + 1} (đổi nốt, có lưu)`}
                      onClick={blurThen(() => onTransposeLines([li], -1))}
                      className={lineBtn}
                    >
                      ♭
                    </button>
                    <button
                      type="button"
                      title={`Thăng 1 nửa cung riêng câu ${li + 1} (đổi nốt, có lưu)`}
                      onClick={blurThen(() => onTransposeLines([li], 1))}
                      className={lineBtn}
                    >
                      ♯
                    </button>
                  </div>
                  {line.map((word, wi) => {
                    const isActive = active?.line === li && active.word === wi;
                    let shown = wordNotes(word).map(displayNote).join("-");
                    if (shown && isActive && active.slurPending) shown += "-";
                    return (
                      <div
                        key={wi}
                        data-active-word={isActive ? "true" : undefined}
                        onClick={() => onSelectWord(li, wi)}
                        className={cn(
                          "flex min-w-7 cursor-pointer flex-col items-center rounded-md border px-1.5 py-1",
                          isActive ? "border-brass bg-brass/20" : "border-transparent hover:bg-paper-soft",
                        )}
                      >
                        <span className="whitespace-nowrap text-base text-ink">{word.text}</span>
                        <span
                          className={cn(
                            "min-h-[1em] whitespace-nowrap text-[11px]",
                            shown ? "font-semibold text-brass-deep" : "text-muted",
                          )}
                        >
                          {shown || "·"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      )}

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Bấm vào một chữ để chọn, rồi bấm phím đàn để gán nốt cho chữ đó; chữ tiếp theo sẽ tự được chọn. Giữ Shift khi
        bấm phím đàn để luyến: chữ vẫn giữ nguyên và nốt kế tiếp được nối thêm vào chữ đó (C4-D4-E4); bấm phím thường
        để kết thúc và sang chữ tiếp theo. Phím Delete xoá nốt của chữ đang chọn. Sao chép nốt cả câu: bấm &quot;Chép&quot;
        ở đầu câu (hoặc Ctrl+C khi đang chọn một chữ trong câu), rồi bấm &quot;Dán&quot; ở câu khác (hoặc Ctrl+V). Chép
        nhiều câu một lần: tích ô đầu các câu cần chép (giữ Shift khi tích để chọn cả đoạn), bấm &quot;Chép N câu&quot;
        (hoặc Ctrl+C), rồi bấm &quot;Dán&quot; ở câu bắt đầu - các câu được dán lần lượt xuống dưới. Nút ♭ ♯ ở đầu câu
        dịch giọng riêng câu đó (nút ở thanh chọn dịch các câu đã chọn) mà không đổi gam cả bài; Esc để bỏ chọn. Dùng
        phím mũi tên ← → để chuyển sang chữ trước/sau, ↑ ↓ để nhảy giữa các câu.
      </p>
    </div>
  );
}
