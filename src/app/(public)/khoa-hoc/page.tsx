import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SignOutButton } from "@/components/course/SignOutButton";
import { getCourseList } from "@/data-access/course";
import { COURSE_LOGIN_PATH, formatCoursePrice } from "@/lib/course";
import { cn } from "@/lib/utils/cn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Khóa học",
  description: "Khóa học saxophone online của TOPSAX.",
};

export default async function CourseListPage() {
  const { courses, user } = await getCourseList();

  return (
    <Container className="py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-deep">Khóa học online</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Học saxophone cùng TOPSAX</h1>
        </div>
        <div className="text-sm text-muted">
          {user ? (
            <SignOutButton email={user.email} />
          ) : (
            <Link href={COURSE_LOGIN_PATH} className="font-medium text-brass-deep underline">
              Đăng nhập / Đăng ký
            </Link>
          )}
        </div>
      </div>

      {courses.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-border px-4 py-12 text-center text-muted">
          Chưa có khóa học nào mở bán. Hãy quay lại sau nhé.
        </p>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(({ course, lessonCount, owned }) => (
            <li key={course.id}>
              <Link
                href={`/khoa-hoc/${course.slug}`}
                className="flex h-full flex-col rounded-2xl border border-border bg-paper p-5 shadow-sm transition-colors hover:border-brass"
              >
                {course.status === "draft" && (
                  <span className="mb-2 self-start rounded-full bg-brass-soft/50 px-2.5 py-0.5 text-xs text-ink">Bản nháp</span>
                )}
                <h2 className="text-lg font-semibold text-ink">{course.title}</h2>
                {course.subtitle && <p className="mt-1 text-sm text-ink-soft">{course.subtitle}</p>}
                <p className="mt-3 line-clamp-3 flex-1 text-sm text-muted">{course.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted">
                    {course.total_days} ngày{lessonCount ? ` · ${lessonCount} bài đã có` : ""}
                  </span>
                  <span className={cn("font-semibold", owned ? "text-green-700" : "text-ink")}>
                    {owned ? "Đã có" : formatCoursePrice(course.price)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
