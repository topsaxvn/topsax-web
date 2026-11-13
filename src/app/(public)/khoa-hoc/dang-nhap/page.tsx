import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { StudentAuthForm } from "@/components/course/StudentAuthForm";

export const metadata: Metadata = {
  title: "Đăng nhập khóa học",
  robots: { index: false, follow: false },
};

export default function CourseLoginPage() {
  return (
    <Container className="flex justify-center py-12">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-paper p-6 shadow-sm sm:p-8">
        <Suspense>
          <StudentAuthForm />
        </Suspense>
      </div>
    </Container>
  );
}
