"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

// Next.js 16 đổi tên prop reset -> retry cho error.tsx.
export default function GlobalError({
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
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <Container className="flex flex-col items-center gap-6 py-24 text-center">
          <p className="text-sm font-semibold tracking-wide text-brass-deep">
            Đã có lỗi xảy ra
          </p>
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
            Không thể tải trang này
          </h1>
          <p className="max-w-md text-sm text-muted">
            Vui lòng thử lại. Nếu lỗi vẫn tiếp diễn, hãy liên hệ với chúng tôi
            để được hỗ trợ.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => retry()}>Thử lại</Button>
            <Button href="/" variant="outline">
              Về trang chủ
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
