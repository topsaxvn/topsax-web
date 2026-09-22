"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { songsApi, type SongAdminSummary } from "@/lib/admin-api/songs";
import { triggerRevalidate } from "@/lib/admin-api/revalidate";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { songKeyName } from "@/lib/music";

export function CamAmPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? undefined;

  const [songs, setSongs] = useState<SongAdminSummary[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    songsApi.list(q).then((data) => {
      if (!cancelled) setSongs(data);
    });
    return () => {
      cancelled = true;
    };
  }, [q]);

  async function handleDelete(song: SongAdminSummary) {
    setSongs((prev) => prev?.filter((s) => s.id !== song.id) ?? prev);
    await songsApi.remove(song.id);
    triggerRevalidate({ resource: "song", slug: song.slug });
  }

  async function handleTogglePublished(song: SongAdminSummary) {
    const next = !song.published;
    setSongs((prev) => prev?.map((s) => (s.id === song.id ? { ...s, published: next } : s)) ?? prev);
    await songsApi.setPublished(song.id, next);
    triggerRevalidate({ resource: "song", slug: song.slug });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-ink">Cảm âm</h1>
        <Link
          href="/admin/cam-am/new"
          className="rounded-full bg-brass px-4 py-2 text-sm font-semibold text-ink hover:bg-brass-soft"
        >
          + Thêm bài hát
        </Link>
      </div>

      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const value = formData.get("q")?.toString();
          router.push(value ? `/admin/cam-am?q=${encodeURIComponent(value)}` : "/admin/cam-am");
        }}
      >
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Tìm theo tên bài..."
          className="rounded-lg border border-border bg-paper px-3.5 py-2 text-sm text-ink outline-none focus:border-brass"
        />
        <button type="submit" className="rounded-lg border border-border px-3.5 py-2 text-sm text-ink-soft hover:text-ink">
          Tìm
        </button>
      </form>

      {!songs ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-2xl" />
          ))}
        </div>
      ) : songs.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-paper px-4 py-10 text-center text-sm text-muted">
          Chưa có bài cảm âm nào.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border bg-paper md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Bài hát</th>
                  <th className="px-4 py-3 font-medium">Tone gốc</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {songs.map((song) => (
                  <tr key={song.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{song.title}</p>
                      <p className="text-xs text-muted">
                        {song.singer ? `${song.singer} · ` : ""}/cam-am/{song.slug}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{songKeyName(song.song_key, song.song_key_mode, "letter")}</td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => handleTogglePublished(song)} className="text-ink-soft hover:underline">
                        {song.published ? "Đã xuất bản" : "Nháp"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <SongActions song={song} onDelete={handleDelete} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 space-y-3 md:hidden">
            {songs.map((song) => (
              <div key={song.id} className="rounded-2xl border border-border bg-paper p-3">
                <p className="font-medium text-ink">{song.title}</p>
                <p className="text-xs text-muted">
                  {song.singer ? `${song.singer} · ` : ""}/cam-am/{song.slug}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  <span className="rounded-full border border-border px-2 py-0.5 text-ink-soft">
                    {songKeyName(song.song_key, song.song_key_mode, "letter")}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTogglePublished(song)}
                    className="rounded-full border border-border px-2 py-0.5 text-ink-soft"
                  >
                    {song.published ? "Đã xuất bản" : "Nháp"}
                  </button>
                </div>
                <div className="mt-3 border-t border-border pt-2">
                  <SongActions song={song} onDelete={handleDelete} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SongActions({
  song,
  onDelete,
}: {
  song: SongAdminSummary;
  onDelete: (song: SongAdminSummary) => void | Promise<void>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
      <Link href={`/admin/cam-am/${song.id}/edit`} className="text-brass-deep hover:underline">
        Sửa
      </Link>
      <ConfirmButton
        confirmMessage={`Xóa bài "${song.title}"?`}
        onConfirm={() => onDelete(song)}
        className="text-red-600 hover:underline"
      >
        Xóa
      </ConfirmButton>
    </div>
  );
}
