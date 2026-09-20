import type { Metadata } from "next";
import { CamAmPageClient } from "./CamAmPageClient";

export const metadata: Metadata = { title: "Cảm âm", robots: { index: false, follow: false } };

export default function AdminCamAmPage() {
  return <CamAmPageClient />;
}
