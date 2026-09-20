"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { SongForm } from "@/components/admin/SongForm";
import { songsApi, type SongAdminDetail } from "@/lib/admin-api/songs";
import { Skeleton } from "@/components/ui/Skeleton";

export function EditSongPageClient() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [song, setSong] = useState<SongAdminDetail | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    songsApi.getById(id).then((data) => {
      if (!cancelled) setSong(data);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (song === null) notFound();

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Sửa bài cảm âm</h1>
      <div className="mt-6">
        {song ? (
          <SongForm song={song} submitLabel="Lưu thay đổi" />
        ) : (
          <div className="max-w-3xl space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
