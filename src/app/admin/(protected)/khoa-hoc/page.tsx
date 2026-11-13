import type { Metadata } from "next";
import { CoursePageClient } from "./CoursePageClient";

export const metadata: Metadata = { title: "Khóa học", robots: { index: false, follow: false } };

export default function AdminCoursePage() {
  return <CoursePageClient />;
}
