import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SignOutButton } from "@/components/course/SignOutButton";
import { getCourseView } from "@/data-access/course";
import { COURSE_LOGIN_PATH, COURSE_PLAYER_PATH, formatCoursePrice, ITEM_KIND_LABEL } from "@/lib/course";
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

function StarRow({ n, small, label }: { n: number; small?: boolean; label: string }) {
  return (
    <span aria-label={label} title={label} className={cn("shrink-0 tracking-tight", small ? "text-xs" : "text-sm")}>
      {[1, 2, 3].map((k) => (
        <span key={k} aria-hidden className={k <= n ? "text-brass-deep" : "text-border"}>
          ★
        </span>
      ))}
    </span>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

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
  const done = lessons.filter((l) => l.stars !== null).length;
  const freeDays = lessons.filter((l) => l.is_free).map((l) => l.day);
  // người học của khóa này (đã đăng nhập và học được): thấy tiến độ, bấm vào từng ngày / bài
  const learner = Boolean(user) && openToMe;
  // ngày đang học: ngày đã mở đầu tiên chưa xong
  const current = lessons.find((l) => l.open && l.stars === null) ?? null;
  // màn hình học mở thẳng ngày / bài (sax-tap/src/App.tsx openFromLink)
  const dayHref = (day: number) => `${COURSE_PLAYER_PATH}?ngay=${day}`;
  const pieceHref = (day: number, item: string) => `${COURSE_PLAYER_PATH}?ngay=${day}&bai=${item}`;
  const previousDay = (day: number) => [...lessons].reverse().find((l) => l.day < day)?.day ?? day - 1;
  const learnHref = current ? dayHref(current.day) : COURSE_PLAYER_PATH;

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

          <section id="noi-dung" className="mt-10 max-w-3xl scroll-mt-24">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div>
                <h2 className="text-xl font-semibold text-ink">Nội dung từng ngày</h2>
                <p className="mt-1 text-sm text-muted">
                  Mỗi ngày một bài luyện nốt và một bài hát, kèm bài giảng. Học lần lượt: xong ngày trước mới mở ngày sau.
                </p>
              </div>
            </div>

            {learner && (
              <div className="mt-5 rounded-2xl border border-brass/40 bg-brass-soft/20 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted">Tiến độ của bạn</p>
                    <p className="mt-0.5 text-lg font-semibold text-ink">
                      Đã xong {done}/{lessons.length} ngày
                    </p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={lessons.length}>
                      <div className="h-full rounded-full bg-brass" style={{ width: `${lessons.length ? (100 * done) / lessons.length : 0}%` }} />
                    </div>
                  </div>
                  {current && (
                    <a href={dayHref(current.day)} className={cn(PLAYER_BTN, "shrink-0")}>
                      {done ? "Học tiếp" : "Bắt đầu"}: Ngày {current.day}
                    </a>
                  )}
                </div>
              </div>
            )}

            <ol className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-paper">
              {lessons.map((l) => {
                const name = l.title || l.items.find((i) => i.kind === "song")?.title || "";
                const isCurrent = learner && current?.id === l.id;
                const waiting = learner && !l.open;
                return (
                  <li key={l.id} className={cn("flex gap-3 px-4 py-4 sm:gap-4 sm:px-5", isCurrent && "bg-brass-soft/15")}>
                    {/* số ngày: xong = xanh, đang học = vàng, chưa mở = khóa */}
                    <span
                      aria-hidden
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                        l.stars !== null && learner
                          ? "border-green-300 bg-green-50 text-green-700"
                          : isCurrent
                            ? "border-brass bg-brass text-ink"
                            : waiting
                              ? "border-border bg-paper-soft text-muted"
                              : "border-border text-ink-soft",
                      )}
                    >
                      {l.stars !== null && learner ? "✓" : waiting ? <LockIcon /> : l.day}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <p className="min-w-0 font-semibold text-ink">
                          <span className="mr-1.5 text-sm font-semibold text-brass-deep">Ngày {l.day}</span>
                          {l.open ? (
                            <a href={dayHref(l.day)} className="hover:text-brass-deep hover:underline">
                              {name}
                            </a>
                          ) : (
                            name
                          )}
                          {l.is_free && !openToMe && (
                            <span className="ml-2 rounded-full bg-brass-soft/50 px-2 py-0.5 text-xs font-normal">học thử</span>
                          )}
                        </p>
                        {learner &&
                          (l.stars !== null ? (
                            <StarRow n={l.stars} label={`Ngày ${l.day} đã xong, ${l.stars} sao`} />
                          ) : isCurrent ? (
                            <span className="text-xs font-semibold uppercase tracking-wide text-brass-deep">Đang học</span>
                          ) : waiting && l.day > 1 ? (
                            <span className="text-xs text-muted">Học xong ngày {previousDay(l.day)} để mở</span>
                          ) : null)}
                      </div>

                      {l.items.length > 0 && (
                        <ul className="mt-2 space-y-1 text-sm">
                          {l.items.map((i) => (
                            <li key={i.id} className="flex items-center justify-between gap-3">
                              <span className="min-w-0 text-ink-soft">
                                <span className="text-muted">{ITEM_KIND_LABEL[i.kind]}: </span>
                                {l.open ? (
                                  <a
                                    href={pieceHref(l.day, i.id)}
                                    className="text-ink underline decoration-border underline-offset-4 hover:text-brass-deep hover:decoration-brass"
                                  >
                                    {i.title}
                                  </a>
                                ) : (
                                  i.title
                                )}
                              </span>
                              {learner && i.stars !== null ? (
                                <StarRow n={i.stars} small label={`${i.stars} sao`} />
                              ) : (
                                l.open && (
                                  <a
                                    href={pieceHref(l.day, i.id)}
                                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brass/50 px-2.5 py-0.5 text-xs font-semibold text-brass-deep hover:bg-brass-soft/40"
                                  >
                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                      <path d="M6 4l14 8-14 8z" />
                                    </svg>
                                    Tập
                                  </a>
                                )
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
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
                <a href={learnHref} className={cn(PLAYER_BTN, "mt-5 w-full")}>
                  {current ? `Học tiếp: Ngày ${current.day}` : "Vào học"}
                </a>
              </>
            ) : freeCourse ? (
              <>
                <p className="text-sm text-muted">Học phí</p>
                <p className="mt-1 text-3xl font-bold text-ink">Miễn phí</p>
                <p className="mt-1 text-sm text-muted">Mở cả {course.total_days} ngày, học trên điện thoại và máy tính.</p>
                {user ? (
                  <>
                    <a href={learnHref} className={cn(PLAYER_BTN, "mt-5 w-full")}>
                      {!current ? "Vào học" : done ? `Học tiếp: Ngày ${current.day}` : "Bắt đầu học"}
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
