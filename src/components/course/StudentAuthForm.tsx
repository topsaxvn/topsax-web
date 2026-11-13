"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

/** Chỉ cho quay về trang trong site (chặn ?next=https://... trỏ ra ngoài). */
function safeNext(raw: string | null): string {
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/khoa-hoc";
}

/**
 * Học viên chỉ đăng nhập bằng Google: không cần mật khẩu, không cần thư xác
 * nhận. Tài khoản tự tạo ở lần đăng nhập đầu. (Admin vẫn đăng nhập bằng email
 * ở /admin/login.)
 */
export function StudentAuthForm() {
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(
    params.get("loi") ? "Đăng nhập chưa thành công hoặc đã hết hạn. Hãy thử lại." : null,
  );

  // Supabase chuyển sang trang đăng nhập Google rồi quay về /khoa-hoc/xac-thuc?code=...
  async function signInWithGoogle() {
    setPending(true);
    setMessage(null);
    // signInWithOAuth chuyển thẳng sang Supabase; nếu provider chưa bật, người
    // dùng sẽ thấy một trang JSON lỗi. Hỏi trước xem Google đã bật chưa.
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
      });
      const settings = (await r.json()) as { external?: { google?: boolean } };
      if (!settings.external?.google) {
        setPending(false);
        setMessage("Đăng nhập bằng Google đang tạm ngưng. Hãy thử lại sau hoặc nhắn TOPSAX.");
        return;
      }
    } catch {
      // không hỏi được thì cứ thử chuyển sang Google
    }
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/khoa-hoc/xac-thuc?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setPending(false);
      setMessage(error.message);
    }
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-ink">Đăng nhập để học</h1>
      <p className="mt-1 text-sm text-muted">
        Khóa học saxophone TOPSAX dùng tài khoản Google: không cần tạo mật khẩu, tiến độ được lưu để học tiếp trên mọi máy.
      </p>

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={pending}
        className={cn(
          "mt-6 flex w-full items-center justify-center gap-2.5 rounded-full border border-border bg-paper px-5 py-3 text-sm font-medium text-ink hover:border-ink-soft",
          pending && "opacity-60",
        )}
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        {pending ? "Đang chuyển sang Google…" : "Đăng nhập bằng Google"}
      </button>

      {message && (
        <p aria-live="polite" className="mt-4 text-sm text-red-600">
          {message}
        </p>
      )}
      <p className="mt-6 text-xs text-muted">
        TOPSAX chỉ nhận tên và email từ Google để lưu tiến độ học của bạn.
      </p>
    </div>
  );
}
