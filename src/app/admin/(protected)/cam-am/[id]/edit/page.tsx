import type { Metadata } from "next";
import { EditSongPageClient } from "./EditSongPageClient";

export const metadata: Metadata = { title: "Sửa bài cảm âm", robots: { index: false, follow: false } };

export default function EditSongPage() {
  return <EditSongPageClient />;
}
