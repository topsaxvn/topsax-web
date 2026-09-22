"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { songsApi, type SongAdminDetail, type SongAdminSummary } from "@/lib/admin-api/songs";
import { triggerRevalidate } from "@/lib/admin-api/revalidate";
import { songLinesSchema, songSchema } from "@/lib/validation/song";
import { zodFieldErrors } from "@/lib/validation/utils";
import { slugify } from "@/lib/utils/slugify";
import {
  INSTRUMENTS,
  SAX_FAMILY,
  transposeForInstrument,
  wordNotes,
  type InstrumentKey,
  type NoteNaming,
  type SongLine,
  type SongWord,
} from "@/lib/music";
import {
  COMPUTER_KEY_OFFSETS,
  PIANO_MIDI_MAX,
  PIANO_MIDI_MIN,
  advanceActive,
  applyLyricsPreservingNotes,
  lineNoteItems,
  lyricsToText,
  moveHorizontal,
  moveVertical,
  newSongId,
  pasteNoteItems,
  pasteWouldOverwrite,
  transposeLines,
  uniqueSlug,
  type ActiveWord,
  type NoteClipboard,
} from "@/lib/song-editor";
import { playNote } from "@/lib/piano-audio";
import { Field, inputClass } from "@/components/admin/form-fields";
import { SongEditorSidebar } from "@/components/admin/SongEditorSidebar";
import { SongLyricsPanel } from "@/components/admin/SongLyricsPanel";
import { SongFingeringList } from "@/components/admin/SongFingeringList";
import { SongPianoPanel } from "@/components/admin/SongPianoPanel";

type Values = {
  title: string;
  singer: string;
  slug: string;
  description: string;
  published: boolean;
  scaleRoot: number;
  scaleType: string;
  instrument: InstrumentKey;
  naming: NoteNaming;
  songKey: number;
  lines: SongLine[];
};

const EMPTY_VALUES: Values = {
  title: "",
  singer: "",
  slug: "",
  description: "",
  published: false,
  scaleRoot: 0,
  scaleType: "major",
  instrument: "piano",
  naming: "letter",
  songKey: 0,
  lines: [],
};

function valuesFromSong(song?: SongAdminDetail): Values {
  if (!song) return EMPTY_VALUES;
  return {
    title: song.title,
    singer: song.singer ?? "",
    slug: song.slug,
    description: song.description ?? "",
    published: song.published,
    scaleRoot: song.scale_root,
    scaleType: song.scale_type,
    instrument: song.instrument,
    naming: song.naming,
    songKey: song.song_key || 0,
    lines: JSON.parse(JSON.stringify(song.lines)) as SongLine[],
  };
}

// Ảnh chụp mọi thứ sẽ được lưu (kèm phần lời đang gõ dở chưa áp dụng) để
// biết bài có thay đổi chưa lưu hay không. Từ được chuẩn hoá thành tuple vì
// thứ tự key khác nhau giữa dữ liệu từ DB và dữ liệu mới gõ.
function buildSnapshot(v: Values, pendingLyrics: string | null): string {
  return JSON.stringify({
    ...v,
    lines: v.lines.map((line) => line.map((w) => [w.text, w.note ?? null, w.slur ?? []])),
    pendingLyrics,
  });
}

const DISCARD_MESSAGE = "Bài hát hiện tại chưa được lưu. Nếu chuyển sang bài khác, các thay đổi sẽ bị mất.\n\nBạn có muốn tiếp tục?";

// Giữ ở cấp module để còn sao chép nốt từ bài này sang bài khác khi chuyển bài.
const clipboardStore: { value: NoteClipboard | null } = { value: null };

const headerBtn =
  "rounded-full border border-border px-4 py-2 text-sm font-medium text-ink-soft hover:border-brass hover:text-brass-deep disabled:opacity-50";

export function SongEditor({ song }: { song?: SongAdminDetail }) {
  const router = useRouter();
  const [initial] = useState(() => valuesFromSong(song));
  const [values, setValues] = useState<Values>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(song));
  const [active, setActive] = useState<ActiveWord>(null);
  const [pressedHighlight, setPressedHighlight] = useState<number[] | null>(null);
  const [editingLyrics, setEditingLyrics] = useState(initial.lines.length === 0);
  const [lyricsDraft, setLyricsDraft] = useState(() => lyricsToText(initial.lines));
  const [tempTranspose, setTempTranspose] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [baseOctave, setBaseOctave] = useState(60);
  const [pressed, setPressed] = useState<number[]>([]);
  const [clipboard, setClipboard] = useState<NoteClipboard | null>(clipboardStore.value);
  const [clipboardStatus, setClipboardStatus] = useState("");
  const [songs, setSongs] = useState<SongAdminSummary[] | null>(null);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState(() => buildSnapshot(initial, null));

  const savedSlug = useRef<string | null>(song?.slug ?? null);
  const scrollToActive = useRef(false);
  const slurTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const keyHandlerRef = useRef<(e: KeyboardEvent) => void>(() => {});

  const songId = song?.id ?? null;
  const { lines } = values;

  const pendingLyrics = editingLyrics && lyricsDraft !== lyricsToText(lines) ? lyricsDraft : null;
  const dirty = buildSnapshot(values, pendingLyrics) !== savedSnapshot;

  const isSax = SAX_FAMILY.includes(values.instrument);
  const activeWordData = active ? lines[active.line]?.[active.word] : undefined;
  const highlightConcert = pressedHighlight ?? (activeWordData ? wordNotes(activeWordData) : []);
  const activeWritten = isSax ? highlightConcert.map((m) => transposeForInstrument(m, values.instrument)) : [];

  const writtenNotes = useMemo(() => {
    if (!isSax) return [];
    const set = new Set<number>();
    lines.forEach((line) =>
      line.forEach((w) => wordNotes(w).forEach((m) => set.add(transposeForInstrument(m, values.instrument)))),
    );
    return [...set].sort((a, b) => a - b);
  }, [lines, isSax, values.instrument]);

  const patch = (p: Partial<Values>) => setValues((v) => ({ ...v, ...p }));

  const refreshSongs = useCallback(() => {
    songsApi
      .list()
      .then(setSongs)
      .catch(() => setSongs([]));
  }, []);

  useEffect(() => {
    refreshSongs();
  }, [refreshSongs]);

  useEffect(() => {
    if (!message || message.error) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  useEffect(() => {
    const timers = slurTimers.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!scrollToActive.current) return;
    scrollToActive.current = false;
    document.querySelector('[data-active-word="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  // ---------- Thông tin bài ----------

  function changeTitle(title: string) {
    setValues((v) => ({ ...v, title, slug: slugTouched ? v.slug : slugify(`${title} ${v.singer}`) }));
  }

  function changeSinger(singer: string) {
    setValues((v) => ({ ...v, singer, slug: slugTouched ? v.slug : slugify(`${v.title} ${singer}`) }));
  }

  // ---------- Âm thanh / hiệu ứng phím ----------

  function flash(midi: number) {
    setPressed((prev) => (prev.includes(midi) ? prev : [...prev, midi]));
    setTimeout(() => setPressed((prev) => prev.filter((m) => m !== midi)), 150);
  }

  // Chữ luyến: phát lần lượt từng nốt cách nhau 350ms.
  function playWordNotes(notes: number[]) {
    slurTimers.current.forEach(clearTimeout);
    slurTimers.current = [];
    notes.forEach((midi, i) => {
      const play = () => {
        playNote(midi, volume);
        flash(midi);
      };
      if (i === 0) play();
      else slurTimers.current.push(setTimeout(play, i * 350));
    });
  }

  // ---------- Gán nốt ----------

  function commitLines(newLines: SongLine[], nextActive: ActiveWord) {
    patch({ lines: newLines });
    setActive(nextActive);
    setPressedHighlight(null);
  }

  function replaceWord(li: number, wi: number, word: SongWord): SongLine[] {
    return lines.map((line, i) => (i === li ? line.map((w, j) => (j === wi ? word : w)) : line));
  }

  function assignNote(midi: number, slurNext: boolean) {
    if (!active) return;
    const { line, word, slurPending } = active;
    const w = lines[line]?.[word];
    if (!w) return;
    const updated: SongWord =
      slurPending && wordNotes(w).length > 0
        ? { ...w, slur: [...(w.slur ?? []), midi] }
        : { text: w.text, note: midi };
    const newLines = replaceWord(line, word, updated);
    commitLines(newLines, slurNext ? { line, word, slurPending: true } : advanceActive(newLines, { line, word }));
  }

  // Phím thường: gán nốt rồi sang chữ tiếp theo. Shift: giữ nguyên chữ, nốt kế
  // tiếp sẽ được nối thêm vào (luyến).
  function pressKey(midi: number, slurNext: boolean) {
    playNote(midi, volume);
    flash(midi);
    if (active) assignNote(midi, slurNext);
    setPressedHighlight([midi]);
  }

  function selectWord(li: number, wi: number) {
    setActive({ line: li, word: wi });
    setPressedHighlight(null);
    const w = lines[li]?.[wi];
    if (w) playWordNotes(wordNotes(w));
  }

  function clearActiveWord() {
    if (!active) return;
    const w = lines[active.line]?.[active.word];
    if (!w) return;
    commitLines(replaceWord(active.line, active.word, { text: w.text, note: null }), {
      line: active.line,
      word: active.word,
    });
  }

  // ---------- Lời ----------

  function toggleEditLyrics() {
    if (!editingLyrics) {
      setLyricsDraft(lyricsToText(lines));
      setEditingLyrics(true);
      return;
    }
    patch({ lines: applyLyricsPreservingNotes(lines, lyricsDraft) });
    setActive(null);
    setEditingLyrics(false);
  }

  function clearAllNotes() {
    if (!confirm("Xoá hết nốt đã gán cho lời bài hát này?")) return;
    commitLines(
      lines.map((line) => line.map((w): SongWord => ({ text: w.text, note: null }))),
      null,
    );
  }

  function transpose(semitones: number) {
    patch({ lines: transposeLines(lines, semitones), scaleRoot: (((values.scaleRoot + semitones) % 12) + 12) % 12 });
  }

  function changeOctave(delta: number) {
    setBaseOctave((b) => Math.min(Math.max(b + delta, PIANO_MIDI_MIN), PIANO_MIDI_MAX - 12));
  }

  // ---------- Sao chép / dán nốt cả câu ----------

  function copyLine(li: number) {
    const items = lineNoteItems(lines[li]);
    const count = items.filter((n) => n.length > 0).length;
    if (count === 0) {
      setClipboardStatus(`Câu ${li + 1} chưa có nốt nào để sao chép.`);
      return;
    }
    const next = { line: li, items };
    clipboardStore.value = next;
    setClipboard(next);
    setClipboardStatus(`Đã sao chép nốt của câu ${li + 1} (${count} chữ có nốt). Bấm "Dán" ở câu khác để dán.`);
  }

  function pasteLine(li: number) {
    if (!clipboard) return;
    const target = lines[li];
    const { items } = clipboard;
    if (pasteWouldOverwrite(target, items) && !confirm(`Câu ${li + 1} đã có nốt khác. Dán sẽ ghi đè các nốt đó. Tiếp tục?`)) {
      return;
    }
    const n = Math.min(target.length, items.length);
    commitLines(
      lines.map((line, i) => (i === li ? pasteNoteItems(line, items) : line)),
      active ? { line: active.line, word: active.word } : null,
    );
    setClipboardStatus(
      items.length === target.length
        ? `Đã dán nốt vào câu ${li + 1}.`
        : `Đã dán ${n} chữ vào câu ${li + 1} (câu nguồn ${items.length} chữ, câu này ${target.length} chữ).`,
    );
  }

  function pickFingering(written: number) {
    const inst = INSTRUMENTS[values.instrument];
    const concert = written - (inst.semitoneShift + 12 * inst.octaveShift);
    playNote(concert, volume);
    setPressedHighlight([concert]);
  }

  // ---------- Bàn phím máy tính ----------

  function handleKeyDown(e: KeyboardEvent) {
    if (e.repeat) return;
    const tag = (document.activeElement as HTMLElement | null)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    let key = e.key.toLowerCase();
    // Khi giữ Shift, e.key của ";" thành ":" nên dùng phím vật lý.
    if (e.shiftKey && !Object.hasOwn(COMPUTER_KEY_OFFSETS, key) && e.code === "Semicolon") key = ";";

    if (key === "arrowleft" || key === "arrowright" || key === "arrowup" || key === "arrowdown") {
      e.preventDefault();
      const next =
        key === "arrowright"
          ? moveHorizontal(lines, active, 1)
          : key === "arrowleft"
            ? moveHorizontal(lines, active, -1)
            : key === "arrowdown"
              ? moveVertical(lines, active, 1)
              : moveVertical(lines, active, -1);
      scrollToActive.current = true;
      setActive(next);
      setPressedHighlight(null);
      const w = next ? lines[next.line]?.[next.word] : undefined;
      if (w) playWordNotes(wordNotes(w));
      return;
    }

    if ((e.ctrlKey || e.metaKey) && (key === "c" || key === "v")) {
      if (!active || window.getSelection()?.toString()) return;
      e.preventDefault();
      if (key === "c") copyLine(active.line);
      else pasteLine(active.line);
      return;
    }

    if (key === "delete") {
      if (!active) return;
      e.preventDefault();
      clearActiveWord();
      return;
    }

    if (Object.hasOwn(COMPUTER_KEY_OFFSETS, key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const midi = baseOctave + COMPUTER_KEY_OFFSETS[key];
      if (midi >= PIANO_MIDI_MIN && midi <= PIANO_MIDI_MAX) pressKey(midi, e.shiftKey);
    }
  }

  useEffect(() => {
    keyHandlerRef.current = handleKeyDown;
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => keyHandlerRef.current(e);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ---------- Lưu / xoá / xuất / nhập / chuyển bài ----------

  async function handleSave() {
    const finalLines =
      pendingLyrics !== null ? applyLyricsPreservingNotes(lines, lyricsDraft) : lines;
    const parsed = songSchema.safeParse({
      title: values.title,
      slug: values.slug,
      singer: values.singer,
      description: values.description,
      song_key: values.songKey,
      scale_root: values.scaleRoot,
      scale_type: values.scaleType,
      instrument: values.instrument,
      naming: values.naming,
      published: values.published,
      lines: finalLines,
    });
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error));
      setMessage({ text: "Vui lòng kiểm tra lại thông tin.", error: true });
      return;
    }
    setFieldErrors({});
    setSaving(true);
    setMessage(null);
    try {
      const updated_at = new Date().toISOString();
      let id = songId;
      if (song) {
        await songsApi.update(song.id, { ...parsed.data, updated_at });
      } else {
        id = newSongId();
        await songsApi.create({ ...parsed.data, id, updated_at });
      }
      triggerRevalidate({ resource: "song", slug: parsed.data.slug });
      if (savedSlug.current && savedSlug.current !== parsed.data.slug) {
        triggerRevalidate({ resource: "song", slug: savedSlug.current });
      }
      savedSlug.current = parsed.data.slug;

      const saved = { ...values, lines: finalLines };
      setValues(saved);
      setLyricsDraft(lyricsToText(finalLines));
      setSavedSnapshot(buildSnapshot(saved, null));
      setMessage({ text: "Đã lưu bài hát.", error: false });
      if (!song) router.replace(`/admin/cam-am/${id}/edit`);
      else refreshSongs();
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.", error: true });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!song) return;
    if (!confirm(`Xoá bài "${values.title}"?`)) return;
    try {
      await songsApi.remove(song.id);
      triggerRevalidate({ resource: "song", slug: song.slug });
      router.push("/admin/cam-am");
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : "Không xoá được bài hát.", error: true });
    }
  }

  function handleExport() {
    const data = {
      id: songId,
      title: values.title,
      singer: values.singer,
      slug: values.slug,
      description: values.description,
      lines,
      scaleRoot: values.scaleRoot,
      scaleType: values.scaleType,
      instrument: values.instrument,
      naming: values.naming,
      songKey: values.songKey,
      published: values.published,
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(values.title) || "bai-hat"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (dirty && !confirm(DISCARD_MESSAGE)) return;
    try {
      const data = JSON.parse(await file.text()) as Record<string, unknown>;
      const linesResult = songLinesSchema.safeParse(data.lines);
      if (!linesResult.success || typeof data.title !== "string") {
        throw new Error("File không đúng định dạng bài cảm âm.");
      }
      const title = data.title.trim() || "Bài hát mới";
      const singer = typeof data.singer === "string" ? data.singer.trim() : "";
      const slug = uniqueSlug(slugify(`${title} ${singer}`), (songs ?? []).map((s) => s.slug));
      const id = newSongId();
      await songsApi.create({
        id,
        slug,
        title,
        singer,
        description: typeof data.description === "string" ? data.description : "",
        lines: linesResult.data,
        scale_root: Number(data.scaleRoot) || 0,
        scale_type: typeof data.scaleType === "string" && data.scaleType ? data.scaleType : "major",
        instrument: typeof data.instrument === "string" && data.instrument ? data.instrument : "piano",
        naming: data.naming === "solfege" ? "solfege" : "letter",
        song_key: Number(data.songKey) || 0,
        published: false,
        updated_at: new Date().toISOString(),
      });
      triggerRevalidate({ resource: "song", slug });
      router.push(`/admin/cam-am/${id}/edit`);
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : "Không nhập được file.", error: true });
    }
  }

  function selectSong(id: string) {
    if (id === songId) return;
    if (dirty && !confirm(DISCARD_MESSAGE)) return;
    router.push(`/admin/cam-am/${id}/edit`);
  }

  function newSong() {
    if (dirty && !confirm(DISCARD_MESSAGE)) return;
    if (song) {
      router.push("/admin/cam-am/new");
      return;
    }
    setValues(EMPTY_VALUES);
    setSlugTouched(false);
    setActive(null);
    setPressedHighlight(null);
    setEditingLyrics(true);
    setLyricsDraft("");
    setTempTranspose(0);
    setSavedSnapshot(buildSnapshot(EMPTY_VALUES, null));
  }

  const indicator = activeWordData
    ? active?.slurPending
      ? `Đang luyến "${activeWordData.text}" — bấm nốt tiếp theo để nối (giữ Shift để nối tiếp nữa)`
      : `Đang chọn: "${activeWordData.text}" — bấm phím đàn để gán nốt (Shift + phím: luyến)`
    : "";

  const publicHref = values.published && values.slug ? `/cam-am/${values.slug}` : "/cam-am";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-xl font-semibold text-ink">
          {song ? "Sửa bài cảm âm" : "Thêm bài cảm âm"}
          {dirty && <span className="ml-2 text-sm font-normal text-brass-deep">(chưa lưu)</span>}
        </h1>
        {message && (
          <span className={message.error ? "text-sm text-red-600" : "text-sm text-brass-deep"}>{message.text}</span>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper hover:bg-ink-soft disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
        <button type="button" onClick={newSong} className={headerBtn}>
          + Mới
        </button>
        <button type="button" onClick={handleDelete} disabled={!song} className={`${headerBtn} hover:!border-red-500 hover:!text-red-600`}>
          Xoá
        </button>
        <button type="button" onClick={handleExport} className={headerBtn}>
          Xuất
        </button>
        <label className={`${headerBtn} cursor-pointer`}>
          Nhập
          <input type="file" accept="application/json" hidden onChange={handleImport} />
        </label>
        <Link href={publicHref} target="_blank" className="text-sm text-brass-deep hover:underline">
          Trang xem
        </Link>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
        <SongEditorSidebar songs={songs} currentId={songId} onSelect={selectSong} onNew={newSong} />

        <div className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-border bg-paper p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tên bài hát" error={fieldErrors.title}>
                <input value={values.title} onChange={(e) => changeTitle(e.target.value)} placeholder="Tên bài hát..." className={inputClass} />
              </Field>
              <Field label="Ca sĩ">
                <input value={values.singer} onChange={(e) => changeSinger(e.target.value)} placeholder="Ca sĩ..." className={inputClass} />
              </Field>
              <Field label="Slug (đường dẫn /cam-am/...)" error={fieldErrors.slug}>
                <input
                  value={values.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    patch({ slug: e.target.value });
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label="Trạng thái xuất bản">
                <select
                  value={values.published ? "published" : "draft"}
                  onChange={(e) => patch({ published: e.target.value === "published" })}
                  className={inputClass}
                >
                  <option value="draft">Nháp</option>
                  <option value="published">Đã xuất bản (hiện trên /cam-am)</option>
                </select>
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Mô tả (hiển thị dưới lời bài hát - link sản phẩm, ghi chú...)">
                <textarea
                  rows={3}
                  value={values.description}
                  onChange={(e) => patch({ description: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-paper p-4">
            <SongLyricsPanel
              lines={lines}
              active={active}
              instrument={values.instrument}
              naming={values.naming}
              tempTranspose={tempTranspose}
              editing={editingLyrics}
              draft={lyricsDraft}
              hasClipboard={clipboard !== null}
              clipboardStatus={clipboardStatus}
              onDraftChange={setLyricsDraft}
              onToggleEdit={toggleEditLyrics}
              onClearNotes={clearAllNotes}
              onSelectWord={selectWord}
              onCopyLine={copyLine}
              onPasteLine={pasteLine}
            />
            {isSax && (
              <SongFingeringList writtenNotes={writtenNotes} activeWritten={activeWritten} onPick={pickFingering} />
            )}
          </div>

          <div className="rounded-2xl border border-border bg-paper p-4">
            <SongPianoPanel
              scaleRoot={values.scaleRoot}
              scaleType={values.scaleType}
              instrument={values.instrument}
              songKey={values.songKey}
              naming={values.naming}
              volume={volume}
              tempTranspose={tempTranspose}
              baseOctave={baseOctave}
              pressed={pressed}
              indicator={indicator}
              onScaleRoot={(scaleRoot) => patch({ scaleRoot })}
              onScaleType={(scaleType) => patch({ scaleType })}
              onInstrument={(instrument) => patch({ instrument })}
              onSongKey={(songKey) => patch({ songKey })}
              onNaming={(naming) => patch({ naming })}
              onVolume={setVolume}
              onTranspose={transpose}
              onTempTranspose={(d) => setTempTranspose((t) => t + d)}
              onOctave={changeOctave}
              onKeyPress={pressKey}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
