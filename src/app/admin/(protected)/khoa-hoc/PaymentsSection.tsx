"use client";

import { useCallback, useEffect, useState } from "react";
import { courseApi, type CourseAdmin, type OrderAdmin, type PaymentAdmin } from "@/lib/admin-api/course";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDong } from "@/lib/payment";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils/cn";

const CARD = "rounded-2xl border border-border bg-paper p-4 md:p-5";
const PILL = "rounded-full border px-2.5 py-0.5 text-xs font-medium";
const WEBHOOK_PATH = "/api/thanh-toan/bao-co";

const STATUS: Record<OrderAdmin["status"], [string, string]> = {
  pending: ["Chờ tiền", "border-brass bg-brass-soft/40 text-ink"],
  paid: ["Đã trả", "border-green-300 bg-green-50 text-green-800"],
  cancelled: ["Đã hủy", "border-border text-muted"],
};

const RESULT: Record<PaymentAdmin["result"], [string, boolean]> = {
  matched: ["Đã mở khóa", true],
  already_paid: ["Đơn đã trả trước đó", true],
  no_code: ["Không có mã đơn", false],
  no_order: ["Mã đơn không tồn tại", false],
  amount_low: ["Thiếu tiền", false],
  no_amount: ["Không đọc được số tiền", false],
};

function when(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

export function PaymentsSection({ course }: { course: CourseAdmin }) {
  const [orders, setOrders] = useState<OrderAdmin[] | null>(null);
  const [payments, setPayments] = useState<PaymentAdmin[]>([]);
  const [error, setError] = useState("");

  const reload = useCallback(
    () =>
      Promise.all([courseApi.listOrders(course.id), courseApi.listPayments()]).then(
        ([o, p]) => {
          setOrders(o);
          setPayments(p);
        },
        (e: Error) =>
          setError(
            /course_orders|bank_payments|admin_course_orders|schema cache/.test(e.message)
              ? "Chưa chạy file SQL supabase/migrations/20261112000000_course_orders.sql (thanh toán)."
              : e.message,
          ),
      ),
    [course.id],
  );
  useEffect(() => {
    reload();
    // đơn mới và tin báo có tự hiện khi trang đang mở
    const t = setInterval(reload, 20000);
    return () => clearInterval(t);
  }, [reload]);

  const pending = orders?.filter((o) => o.status === "pending").length ?? 0;

  return (
    <section className={CARD}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-ink">Thanh toán</h2>
          <p className="text-sm text-muted">
            Học viên bấm “Mua khóa học”, quét QR chuyển khoản; điện thoại báo tiền về thì khóa học tự mở.
            {pending > 0 && ` · ${pending} đơn đang chờ tiền`}
          </p>
          {course.price <= 0 && (
            <p className="mt-1 text-sm text-red-600">Khóa học chưa có giá: đặt giá ở “Thông tin khóa học” để học viên tự mua được.</p>
          )}
          {course.status !== "published" && (
            <p className="mt-1 text-sm text-muted">Khóa học đang là nháp: học viên chưa mua được cho tới khi “Mở bán”.</p>
          )}
        </div>
        <button type="button" onClick={reload} className="rounded-full border border-border px-3 py-1.5 text-sm text-ink-soft hover:text-ink">
          Làm mới
        </button>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : !orders ? (
        <Skeleton className="mt-4 h-20 w-full rounded-xl" />
      ) : (
        <>
          <h3 className="mt-5 text-sm font-semibold text-ink">Đơn hàng</h3>
          {orders.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Chưa có đơn nào.</p>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-border text-xs uppercase text-muted">
                  <tr>
                    <th className="py-2 pr-3 font-medium">Mã</th>
                    <th className="py-2 pr-3 font-medium">Học viên</th>
                    <th className="py-2 pr-3 font-medium">Số tiền</th>
                    <th className="py-2 pr-3 font-medium">Trạng thái</th>
                    <th className="py-2 pr-3 font-medium">Tạo lúc</th>
                    <th className="py-2 font-medium" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="py-2 pr-3 font-mono text-xs text-ink" title={o.transfer_note}>
                        {o.code}
                      </td>
                      <td className="py-2 pr-3">
                        <span className="text-ink">{o.buyer_name}</span>
                        <span className="block text-xs text-muted">{o.email}</span>
                      </td>
                      <td className="py-2 pr-3 text-ink-soft">{formatDong(o.amount)}</td>
                      <td className="py-2 pr-3">
                        <span className={cn(PILL, STATUS[o.status][1])}>{STATUS[o.status][0]}</span>
                        {o.status === "paid" && (
                          <span className="block text-xs text-muted">
                            {o.paid_by === "admin" ? "xác nhận tay" : "tự động"}
                            {o.paid_at ? ` · ${when(o.paid_at)}` : ""}
                          </span>
                        )}
                      </td>
                      <td className="py-2 pr-3 text-ink-soft">{when(o.created_at)}</td>
                      <td className="space-x-3 whitespace-nowrap py-2 text-right text-xs">
                        {o.status === "pending" && (
                          <>
                            <ConfirmButton
                              confirmMessage={`Đã nhận ${formatDong(o.amount)} cho đơn ${o.code}? Khóa học sẽ mở cho ${o.email}.`}
                              onConfirm={async () => {
                                await courseApi.confirmOrder(o.id);
                                await reload();
                              }}
                              className="text-green-700 hover:underline"
                            >
                              Xác nhận đã nhận tiền
                            </ConfirmButton>
                            <ConfirmButton
                              confirmMessage={`Hủy đơn ${o.code}?`}
                              onConfirm={async () => {
                                await courseApi.cancelOrder(o.id);
                                await reload();
                              }}
                              className="text-red-600 hover:underline"
                            >
                              Hủy
                            </ConfirmButton>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <h3 className="mt-6 text-sm font-semibold text-ink">Tin báo có điện thoại gửi về</h3>
          {payments.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Chưa nhận tin nào.</p>
          ) : (
            <ul className="mt-2 divide-y divide-border text-sm">
              {payments.map((p) => (
                <li key={p.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 py-2">
                  <span className="w-32 shrink-0 text-ink-soft">{when(p.received_at)}</span>
                  <span className="w-28 shrink-0 text-ink">{p.amount === null ? "?" : formatDong(p.amount)}</span>
                  <span className={cn("w-44 shrink-0", RESULT[p.result][1] ? "text-green-700" : "text-red-600")}>
                    {RESULT[p.result][0]}
                    {p.codes.length > 0 && <span className="ml-1 font-mono text-xs text-muted">{p.codes.join(", ")}</span>}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs text-muted" title={p.raw}>
                    {p.raw}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <PhoneSetup />
        </>
      )}
    </section>
  );
}

function PhoneSetup() {
  const [createdAt, setCreatedAt] = useState<string | null | undefined>(undefined);
  const [secret, setSecret] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    courseApi.bankSecretCreatedAt().then(setCreatedAt, () => setCreatedAt(null));
  }, []);

  const url = `${siteConfig.url}${WEBHOOK_PATH}`;

  return (
    <div className="mt-6 rounded-xl bg-paper-soft p-4 text-sm text-ink-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">Điện thoại báo tiền về</p>
          <p>
            {createdAt === undefined
              ? "Đang kiểm tra…"
              : createdAt
                ? `Đã có khóa bí mật (tạo ${when(createdAt)}).`
                : "Chưa có khóa bí mật: điện thoại chưa gửi được tin."}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setOpen(!open)} className="rounded-full border border-border px-3 py-1.5 hover:text-ink">
            {open ? "Ẩn hướng dẫn" : "Hướng dẫn cài"}
          </button>
          <ConfirmButton
            confirmMessage={
              createdAt ? "Tạo khóa mới? Khóa đang dùng trên điện thoại sẽ hết hiệu lực ngay." : "Tạo khóa bí mật cho điện thoại?"
            }
            onConfirm={async () => {
              setSecret(await courseApi.rotateBankSecret());
              setCreatedAt(new Date().toISOString());
              setOpen(true);
            }}
            className="rounded-full bg-ink px-3 py-1.5 text-paper hover:bg-ink-soft"
          >
            {createdAt ? "Tạo khóa mới" : "Tạo khóa bí mật"}
          </ConfirmButton>
        </div>
      </div>

      {secret && (
        <div className="mt-3 rounded-lg border border-brass bg-paper p-3">
          <p className="text-ink">Khóa bí mật (chỉ hiện một lần, hãy chép vào MacroDroid ngay):</p>
          <code className="mt-1 block select-all break-all font-mono text-sm text-ink">{secret}</code>
        </div>
      )}

      {open && (
        <ol className="mt-4 list-decimal space-y-2 pl-5">
          <li>
            Trên điện thoại Android có app <strong>VCB Digibank</strong>: bật thông báo biến động số dư của app, và cho thông báo hiện
            đầy đủ nội dung.
          </li>
          <li>
            Cài <strong>MacroDroid</strong> (Google Play, bản miễn phí đủ dùng). Cho phép “Truy cập thông báo” và tắt tối ưu pin cho
            MacroDroid để nó chạy nền.
          </li>
          <li>
            Tạo macro mới. <em>Trigger</em>: Notification → Notification Received → chọn app VCB Digibank → nội dung chứa{" "}
            <code>+</code>.
          </li>
          <li>
            <em>Action</em>: Connectivity → HTTP Request:
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              <li>
                Method <code>POST</code>, URL <code className="select-all break-all">{url}</code>
              </li>
              <li>
                Header: <code>X-Topsax-Key</code> = khóa bí mật ở trên
              </li>
              <li>
                Body: content type <code>text/plain</code>, nội dung <code>[notification_title] [notification]</code>
              </li>
            </ul>
          </li>
          <li>
            Thử: tự chuyển một khoản nhỏ có mã đơn (tạo đơn bằng một tài khoản học viên thử) rồi xem danh sách “Tin báo có” ở trên.
            Tin không có mã đơn vẫn hiện ở đó để bạn đối chiếu và xác nhận tay.
          </li>
        </ol>
      )}
    </div>
  );
}
