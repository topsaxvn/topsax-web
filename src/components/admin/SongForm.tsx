"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { SongAdminDetail } from "@/lib/admin-api/songs";
import { songsApi } from "@/lib/admin-api/songs";
import { parseSongForm } from "@/lib/validation/song";
import { zodFieldErrors } from "@/lib/validation/utils";
import { triggerRevalidate } from "@/lib/admin-api/revalidate";
import { slugify } from "@/lib/utils/slugify";
import { Field, FormSection, inputClass } from "@/components/admin/form-fields";
import { LyricsNoteEditor } from "@/components/admin/LyricsNoteEditor";
import { INSTRUMENTS, pitchClassName, type SongLine } from "@/lib/music";

const KEY_OPTIONS = Array.from({ length: 12 }, (_, i) => ({ value: i, label: pitchClassName(i, "letter") }));

const DEFAULT_LINES: SongLine[] = [];

export function SongForm({ song, submitLabel }: { song?: SongAdminDetail; submitLabel: string }) {
  const router = useRouter();
  const [slug, setSlug] = useState(song?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(song));
  const [linesJson, setLinesJson] = useState(() => JSON.stringify(song?.lines ?? DEFAULT_LINES, null, 2));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const error = (field: string) => fieldErrors[field];

  const parsedLines = useMemo<SongLine[]>(() => {
    try {
      const parsed = JSON.parse(linesJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [linesJson]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = parseSongForm(new FormData(e.currentTarget));
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error));
      setMessage("Vui lòng kiểm tra lại thông tin.");
      return;
    }
    setFieldErrors({});
    setPending(true);
    setMessage("");
    try {
      if (song) {
        await songsApi.update(song.id, parsed.data);
      } else {
        await songsApi.create(parsed.data);
      }
      triggerRevalidate({ resource: "song", slug: parsed.data.slug });
      router.push("/admin/cam-am");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <FormSection title="Thông tin bài hát">
        <Field label="Tên bài hát" error={error("title")}>
          <input
            name="title"
            required
            defaultValue={song?.title}
            onChange={(e) => {
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className={inputClass}
          />
        </Field>
        <Field label="Slug" error={error("slug")}>
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
          />
        </Field>
        <Field label="Ca sĩ thể hiện">
          <input name="singer" defaultValue={song?.singer ?? ""} className={inputClass} />
        </Field>
        <Field label="Mô tả (link sản phẩm, ghi chú...)">
          <textarea name="description" rows={3} defaultValue={song?.description ?? ""} className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="published" defaultChecked={song?.published ?? false} className="h-4 w-4" />
          Xuất bản (hiển thị công khai trên /cam-am)
        </label>
      </FormSection>

      <FormSection title="Nhạc lý">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Tone gốc (song_key)" error={error("song_key")}>
            <select name="song_key" defaultValue={song?.song_key ?? 0} className={inputClass}>
              {KEY_OPTIONS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Scale root" error={error("scale_root")}>
            <select name="scale_root" defaultValue={song?.scale_root ?? 0} className={inputClass}>
              {KEY_OPTIONS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Loại gam (scale_type)" error={error("scale_type")}>
            <input name="scale_type" defaultValue={song?.scale_type ?? "major"} className={inputClass} />
          </Field>
          <Field label="Nhạc cụ mặc định" error={error("instrument")}>
            <select name="instrument" defaultValue={song?.instrument ?? "piano"} className={inputClass}>
              {Object.entries(INSTRUMENTS).map(([key, inst]) => (
                <option key={key} value={key}>
                  {inst.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Cách gọi tên nốt" error={error("naming")}>
            <select name="naming" defaultValue={song?.naming ?? "letter"} className={inputClass}>
              <option value="letter">Chữ (C, D, E...)</option>
              <option value="solfege">Do Re Mi (Đô Rê Mi...)</option>
            </select>
          </Field>
        </div>
      </FormSection>

      <FormSection title="Lời + tên nốt">
        <p className="text-xs text-muted">
          Dán lời bài hát, bấm &quot;Tách lời thành từ&quot;, rồi bấm phím đàn để gán nốt lần lượt cho từng từ - giống
          cách nhập của virtual piano.
        </p>
        <LyricsNoteEditor value={parsedLines} onChange={(lines) => setLinesJson(JSON.stringify(lines, null, 2))} />
        {(error("lines_json") || error("lines")) && (
          <p className="text-xs text-red-600">{error("lines_json") || error("lines")}</p>
        )}

        <details className="rounded-xl border border-border bg-paper-soft p-3">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-muted">
            Chỉnh JSON trực tiếp (nâng cao)
          </summary>
          <p className="mt-2 text-xs text-muted">
            Mảng các dòng, mỗi dòng là mảng các từ <code className="rounded bg-paper px-1">{"{ text, note, slur? }"}</code>.{" "}
            <code>note</code> là số MIDI cao độ thật (concert pitch). Sửa ở đây thì khung nhập lời phía trên có thể
            không tự đồng bộ lại - dùng nút &quot;Tách lời thành từ&quot; nếu muốn đồng bộ.
          </p>
          <textarea
            name="lines_json"
            rows={10}
            value={linesJson}
            onChange={(e) => setLinesJson(e.target.value)}
            className={`${inputClass} mt-2 font-mono text-xs`}
            spellCheck={false}
          />
        </details>
      </FormSection>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper hover:bg-ink-soft disabled:opacity-60"
        >
          {pending ? "Đang lưu..." : submitLabel}
        </button>
        {message && <p className="text-sm text-red-600">{message}</p>}
      </div>
    </form>
  );
}
