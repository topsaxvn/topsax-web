"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { SongEditor } from "@/components/admin/SongEditor";
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

  // key theo id: chuyển sang bài khác thì editor được dựng lại với dữ liệu mới.
  return song && song.id === id ? (
    <SongEditor key={song.id} song={song} />
  ) : (
    <div className="space-y-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
