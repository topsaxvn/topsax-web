"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-paper px-6 py-16 text-center">
      <p className="text-sm font-semibold text-brass-deep">Đã có lỗi xảy ra</p>
      <h1 className="text-xl font-semibold text-ink">Không thể tải trang này</h1>
      <p className="max-w-md text-sm text-muted">
        Vui lòng thử lại. Nếu lỗi vẫn tiếp diễn, hãy kiểm tra kết nối hoặc liên
        hệ quản trị hệ thống.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => retry()}>Thử lại</Button>
        <Button href="/admin" variant="outline">
          Về Dashboard
        </Button>
      </div>
    </div>
  );
}
