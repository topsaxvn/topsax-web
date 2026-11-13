import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";
import { Container } from "@/components/ui/Container";
import { CopyButton, PaymentWatch } from "@/components/course/PaymentWatch";
import { getCourseView, getMyLatestOrder } from "@/data-access/course";
import { COURSE_LOGIN_PATH, COURSE_PLAYER_PATH } from "@/lib/course";
import { bankAccountFromEnv, formatDong, vietQrPayload } from "@/lib/payment";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thanh toán khóa học",
  robots: { index: false, follow: false },
};

const BTN =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-brass px-6 py-3 text-sm font-semibold text-ink hover:bg-brass-soft";

export default async function PaymentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const here = `/khoa-hoc/${encodeURIComponent(slug)}`;
  const view = await getCourseView(slug);
  if (!view) notFound();
  if (!view.user) redirect(`${COURSE_LOGIN_PATH}?next=${encodeURIComponent(`${here}/thanh-toan`)}`);

  const { course } = view;
  const hasAccess = view.isAdmin || view.enrolled;
  const order = hasAccess ? null : await getMyLatestOrder(course.id);
  if (!hasAccess && !order) redirect(here);

  if (hasAccess || order?.status === "paid") {
    return (
      <Container className="flex justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-green-200 bg-paper p-6 text-center shadow-sm sm:p-8">
          <p className="text-4xl" aria-hidden>
            🎷
          </p>
          <h1 className="mt-3 text-xl font-semibold text-ink">Khóa học đã mở!</h1>
          <p className="mt-2 text-sm text-muted">
            {course.title} đã có trong tài khoản {view.user.email}. Chúc bạn học vui.
          </p>
          <a href={COURSE_PLAYER_PATH} className={`${BTN} mt-6`}>
            Vào học ngay
          </a>
          <Link href={here} className="mt-3 inline-block text-sm text-muted hover:text-ink">
            Về trang khóa học
          </Link>
        </div>
      </Container>
    );
  }

  const o = order!;
  const account = bankAccountFromEnv();
  const zalo = (
    <>
      Đã chuyển mà chưa mở? Nhắn{" "}
      <a href={siteConfig.zaloUrl} className="font-medium text-brass-deep underline">
        Zalo {siteConfig.phone}
      </a>{" "}
      kèm mã đơn <strong>{o.code}</strong>.
    </>
  );

  if (!account) {
    return (
      <Container className="py-12">
        <p className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Trang thanh toán chưa được cấu hình tài khoản nhận tiền. {zalo}
        </p>
      </Container>
    );
  }

  // QR tạo ngay trên máy chủ từ chuỗi VietQR, không gọi dịch vụ ngoài
  const qr = await QRCode.toString(vietQrPayload(account, o.amount, o.transfer_note), {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#1a1410", light: "#ffffff" },
  });

  const rows: [string, string, boolean][] = [
    ["Ngân hàng", account.bankName, false],
    ["Số tài khoản", account.accountNo, true],
    ["Chủ tài khoản", account.accountName, false],
    ["Số tiền", formatDong(o.amount), false],
    ["Nội dung", o.transfer_note, true],
  ];

  return (
    <Container className="py-10 lg:py-14">
      <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-[300px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="aspect-square w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qr }} />
          <p className="mt-2 text-center text-xs text-muted">Mở app ngân hàng → Quét mã QR</p>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-deep">Thanh toán</p>
          <h1 className="mt-2 text-2xl font-bold text-ink">{course.title}</h1>
          <p className="mt-1 text-sm text-muted">
            Đơn {o.code} · {view.user.email}
          </p>

          <dl className="mt-5 divide-y divide-border rounded-2xl border border-border bg-paper text-sm">
            {rows.map(([k, v, copy]) => (
              <div key={k} className="flex items-center gap-3 px-4 py-2.5">
                <dt className="w-28 shrink-0 text-muted">{k}</dt>
                <dd className="min-w-0 flex-1 break-words font-medium text-ink">{v}</dd>
                {copy && <CopyButton value={v} label={k.toLowerCase()} />}
              </div>
            ))}
          </dl>

          <p className="mt-3 text-sm text-ink-soft">
            Quét mã thì số tiền và nội dung đã điền sẵn. Nếu chuyển tay, hãy <strong>giữ nguyên nội dung</strong> — hệ thống
            nhận ra bạn nhờ mã <strong>{o.code}</strong> ở đầu.
          </p>

          <div className="mt-5">
            <PaymentWatch orderId={o.id} help={zalo} />
          </div>
        </div>
      </div>
    </Container>
  );
}
