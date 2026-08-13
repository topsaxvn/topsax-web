import { Suspense } from "react";
import type { Metadata } from "next";
import AdminLoading from "@/app/admin/(protected)/loading";
import { BlogPageClient } from "./BlogPageClient";

export const metadata: Metadata = { title: "Blog", robots: { index: false, follow: false } };

export default function AdminBlogPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <BlogPageClient />
    </Suspense>
  );
}
