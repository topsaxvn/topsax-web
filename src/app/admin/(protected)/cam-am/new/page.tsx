import type { Metadata } from "next";
import { NewSongPageClient } from "./NewSongPageClient";

export const metadata: Metadata = { title: "Thêm bài cảm âm", robots: { index: false, follow: false } };

export default function NewSongPage() {
  return <NewSongPageClient />;
}
