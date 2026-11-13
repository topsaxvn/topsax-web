"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const EVERY_MS = 4000;
const GIVE_UP_MS = 30 * 60 * 1000;

/** Hỏi trạng thái đơn vài giây một lần; tiền về (đơn "paid") thì tải lại trang để hiện "đã mở khóa". */
export function PaymentWatch({ orderId, help }: { orderId: string; help: ReactNode }) {
  const router = useRouter();
  const [waitedLong, setWaitedLong] = useState(false);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const started = Date.now();
    let timer: ReturnType<typeof setTimeout>;
    let live = true;
    const tick = async () => {
      const { data } = await supabase.from("course_orders").select("status").eq("id", orderId).maybeSingle();
      if (!live) return;
      if (data?.status === "paid") {
        router.refresh();
        return;
      }
      const waited = Date.now() - started;
      if (waited > 5 * 60 * 1000) setWaitedLong(true);
      if (waited > GIVE_UP_MS) {
        setStopped(true);
        return;
      }
      timer = setTimeout(tick, document.hidden ? EVERY_MS * 3 : EVERY_MS);
    };
    timer = setTimeout(tick, EVERY_MS);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [orderId, router]);

  return (
    <div aria-live="polite" className="rounded-xl bg-paper-soft px-4 py-3 text-sm text-ink-soft">
      {stopped ? (
        <p>Trang đã ngừng tự kiểm tra. Tải lại trang để xem khóa học đã mở chưa.</p>
      ) : (
        <p className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-brass" aria-hidden />
          Đang chờ tiền về… Trang sẽ tự chuyển khi khóa học được mở.
        </p>
      )}
      {waitedLong && <p className="mt-2">{help}</p>}
    </div>
  );
}

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Sao chép ${label}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          // trình duyệt không cho dùng clipboard: người dùng tự chọn chữ
        }
      }}
      className="shrink-0 rounded-full border border-border px-2.5 py-0.5 text-xs text-ink-soft hover:border-brass hover:text-ink"
    >
      {done ? "Đã chép" : "Chép"}
    </button>
  );
}
