import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SignOutButton } from "@/components/course/SignOutButton";
import { getCourseView } from "@/data-access/course";
import { COURSE_LOGIN_PATH, COURSE_PLAYER_PATH, formatCoursePrice } from "@/lib/course";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils/cn";
import { buyCourse } from "../actions";

// Nội dung đổi theo người xem (đã mua chưa, tiến độ): luôn render mới.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Khóa học saxophone",
  description: "Khóa saxophone cơ bản 30 ngày: app nghe tiếng kèn của bạn, thổi đúng cao độ nhạc mới chạy tiếp.",
};

const PLAYER_BTN =
  "inline-flex items-center justify-center gap-2 rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink hover:bg-brass-soft";

const BUY_ERRORS: Record<string, string> = {
  "da-co": "Bạn đã có khóa học này.",
  "chua-gia": "Khóa học chưa có giá. Hãy nhắn TOPSAX để đăng ký.",
  "chua-ban": "Khóa học chưa mở bán.",
  loi: "Chưa tạo được đơn. Hãy thử lại hoặc nhắn TOPSAX.",
};

export default async function CoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ loi?: string }>;
}) {
  const { slug } = await params;
  const { loi } = await searchParams;
  const view = await getCourseView(slug);
  if (!view) notFound();
  const { course, lessons, user, isAdmin, enrolled, pendingOrder } = view;
  const canBuy = course.status === "published" && course.price > 0;
  const here = `/khoa-hoc/${course.slug}`;
  const hasAccess = isAdmin || enrolled;
  // giá 0đ: khóa học mở cho mọi người, không cần mua (supabase/migrations/20261113000000_free_course.sql)
  const freeCourse = course.price <= 0;
  const openToMe = hasAccess || freeCourse;
  // phải đăng nhập (Google) mới học được
  const loginToLearn = `${COURSE_LOGIN_PATH}?next=${encodeURIComponent(COURSE_PLAYER_PATH)}`;
  const byDay = new Map(lessons.map((l) => [l.day, l]));
  const done = lessons.filter((l) => l.stars !== null).length;
  const freeDays = lessons.filter((l) => l.is_free).map((l) => l.day);

  return (
    <Container className="py-10 lg:py-14">
      {course.status === "draft" && (
        <p className="mb-6 rounded-xl border border-brass/40 bg-brass-soft/30 px-4 py-2.5 text-sm text-ink">
          Bản nháp — chỉ admin và học viên đã được mở khóa mới thấy trang này.
          {isAdmin && (
            <>
              {" "}
              <Link href="/admin/khoa-hoc" className="font-medium underline">
                Quản lý khóa học
              </Link>
            </>
          )}
        </p>
      )}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-deep">Khóa học online</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{course.title}</h1>
          {course.subtitle && <p className="mt-2 text-lg text-ink-soft">{course.subtitle}</p>}
          {course.description && <p className="mt-5 max-w-2xl whitespace-pre-line text-muted">{course.description}</p>}

          <ul className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["Nghe tiếng kèn", "Micro điện thoại hoặc máy tính nghe bạn thổi, không cần thiết bị riêng."],
              ["Nhạc chờ bạn", "Thổi đúng cao độ nhạc mới chạy tiếp, sai thì đứng chờ."],
              ["Thế bấm từng nốt", "Hình kèn chỉ phím cần bấm, kim báo cao hay thấp."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-border bg-paper p-4">
                <p className="font-semibold text-ink">{t}</p>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-xl font-semibold text-ink">
            {course.total_days} ngày học
            <span className="ml-2 text-sm font-normal text-muted">
              {lessons.length < course.total_days ? `· đã có ${lessons.length} bài` : ""}
            </span>
          </h2>
          <ol className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-10">
            {Array.from({ length: course.total_days }, (_, k) => k + 1).map((day) => {
              const l = byDay.get(day);
              const open = l && (openToMe || l.is_free);
              return (
                <li
                  key={day}
                  title={l ? `Ngày ${day}${l.title ? `: ${l.title}` : ""}` : `Ngày ${day}: đang soạn`}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center rounded-xl border text-sm font-semibold",
                    !l && "border-dashed border-border text-muted/60",
                    l && l.stars !== null && "border-green-300 bg-green-50 text-green-800",
                    l && l.stars === null && open && "border-brass/50 bg-paper text-ink",
                    l && !open && "border-border bg-paper-soft text-muted",
                  )}
                >
                  {day}
                  {l?.stars != null && <span className="text-[10px] leading-none">{"★".repeat(l.stars)}</span>}
                  {l && !open && <span className="text-[10px] font-normal leading-none">khóa</span>}
                  {l && l.is_free && !openToMe && <span className="text-[10px] font-normal leading-none">thử</span>}
                </li>
              );
            })}
          </ol>

          {lessons.some((l) => l.items.length) && (
            <>
              <h2 className="mt-10 text-xl font-semibold text-ink">Nội dung từng ngày</h2>
              <p className="mt-1 text-sm text-muted">Mỗi ngày một bài luyện nốt và một bài hát, có bài giảng và video hướng dẫn.</p>
              <ol className="mt-4 max-w-2xl divide-y divide-border rounded-2xl border border-border bg-paper">
                {lessons.map((l) => (
                  <li key={l.id} className="flex gap-4 px-4 py-3">
                    <span className="w-14 shrink-0 text-sm font-semibold text-brass-deep">Ngày {l.day}</span>
                    <div className="min-w-0 text-sm">
                      <p className="font-medium text-ink">
                        {l.title || l.items.find((i) => i.kind === "song")?.title}
                        {l.is_free && !openToMe && (
                          <span className="ml-2 rounded-full bg-brass-soft/50 px-2 py-0.5 text-xs font-normal">học thử</span>
                        )}
                      </p>
                      <p className="mt-0.5 text-muted">
                        {l.items
                          .filter((i) => i.kind !== "notes")
                          .map((i) => i.title)
                          .join(" · ")}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-paper p-5 shadow-sm">
            {hasAccess ? (
              <>
                <p className="text-sm text-muted">
                  {isAdmin && !enrolled ? "Bạn là admin" : freeCourse ? "Bạn đang học khóa này" : "Bạn đã có khóa học này"}
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  {done}/{lessons.length} ngày đã học
                </p>
                <a href={COURSE_PLAYER_PATH} className={cn(PLAYER_BTN, "mt-5 w-full")}>
                  Vào học
                </a>
              </>
            ) : freeCourse ? (
              <>
                <p className="text-sm text-muted">Học phí</p>
                <p className="mt-1 text-3xl font-bold text-ink">Miễn phí</p>
                <p className="mt-1 text-sm text-muted">Mở cả {course.total_days} ngày, học trên điện thoại và máy tính.</p>
                {user ? (
                  <>
                    <a href={COURSE_PLAYER_PATH} className={cn(PLAYER_BTN, "mt-5 w-full")}>
                      Bắt đầu học
                    </a>
                    <p className="mt-3 text-sm text-muted">Tiến độ được lưu vào tài khoản {user.email}.</p>
                  </>
                ) : (
                  <>
                    <Link href={loginToLearn} className={cn(PLAYER_BTN, "mt-5 w-full")}>
                      Đăng nhập bằng Google để học
                    </Link>
                    <p className="mt-3 text-sm text-muted">Miễn phí. Dùng tài khoản Google, không cần tạo mật khẩu.</p>
                  </>
                )}
              </>
            ) : (
              <>
                <p className="text-sm text-muted">Học phí</p>
                <p className="mt-1 text-3xl font-bold text-ink">{formatCoursePrice(course.price)}</p>
                <p className="mt-1 text-sm text-muted">Học trọn đời, trên điện thoại và máy tính.</p>
                {loi && BUY_ERRORS[loi] && (
                  <p aria-live="polite" className="mt-3 text-sm text-red-600">
                    {BUY_ERRORS[loi]}
                  </p>
                )}
                {canBuy &&
                  (pendingOrder ? (
                    <Link href={`${here}/thanh-toan`} className={cn(PLAYER_BTN, "mt-5 w-full bg-ink text-paper hover:bg-ink-soft")}>
                      Tiếp tục thanh toán
                    </Link>
                  ) : user ? (
                    <form action={buyCourse.bind(null, course.slug)} className="mt-5">
                      <button type="submit" className={cn(PLAYER_BTN, "w-full bg-ink text-paper hover:bg-ink-soft")}>
                        Mua khóa học
                      </button>
                    </form>
                  ) : (
                    <Link
                      href={`${COURSE_LOGIN_PATH}?che-do=dang-ky&next=${encodeURIComponent(here)}`}
                      className={cn(PLAYER_BTN, "mt-5 w-full bg-ink text-paper hover:bg-ink-soft")}
                    >
                      Đăng nhập bằng Google để mua
                    </Link>
                  ))}
                {freeDays.length > 0 && (
                  <a href={user ? COURSE_PLAYER_PATH : loginToLearn} className={cn(PLAYER_BTN, "mt-3 w-full")}>
                    Học thử ngày {freeDays.join(", ")}
                  </a>
                )}
                <div className="mt-5 rounded-xl bg-paper-soft p-4 text-sm text-ink-soft">
                  <p className="font-semibold text-ink">Cách đăng ký</p>
                  {canBuy ? (
                    <ol className="mt-2 list-decimal space-y-1 pl-4">
                      <li>{user ? <>Đã đăng nhập: {user.email}</> : <>Đăng nhập bằng tài khoản Google.</>}</li>
                      <li>Bấm “Mua khóa học”, quét mã QR bằng app ngân hàng.</li>
                      <li>Khóa học tự mở khi tiền về, thường trong 1–2 phút.</li>
                    </ol>
                  ) : (
                    <p className="mt-2">
                      Nhắn{" "}
                      <a href={siteConfig.zaloUrl} className="font-medium text-brass-deep underline">
                        Zalo {siteConfig.phone}
                      </a>{" "}
                      để đăng ký khóa học.
                    </p>
                  )}
                </div>
              </>
            )}
            {/* khóa miễn phí: nút chính đã là "Đăng nhập bằng Google để học", không lặp lại */}
            {(user || !freeCourse) && (
              <div className="mt-4 text-center text-sm text-muted">
                {user ? (
                  <SignOutButton email={user.email} />
                ) : (
                  <Link href={`${COURSE_LOGIN_PATH}?next=${encodeURIComponent(here)}`} className="hover:text-ink">
                    Đăng nhập bằng Google
                  </Link>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </Container>
  );
}
