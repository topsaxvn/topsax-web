import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

// Xử lý các URL hoàn toàn không khớp route nào (Next.js chỉ dùng
// app/not-found.tsx gốc cho trường hợp này, không đi qua layout của
// route group (public)) nên header/footer được import trực tiếp ở đây.
export default function GlobalNotFound() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <Container className="flex flex-col items-center gap-6 py-24 text-center">
          <p className="text-sm font-semibold tracking-wide text-brass-deep">404</p>
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
            Không tìm thấy trang này
          </h1>
          <p className="max-w-md text-sm text-muted">
            Đường dẫn bạn truy cập không tồn tại. Hãy quay lại trang chủ hoặc
            liên hệ với {siteConfig.name} để được hỗ trợ.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="/">Về trang chủ</Button>
            <Button href="/saxophone" variant="outline">
              Xem saxophone
            </Button>
            <Button href="/lien-he" variant="ghost">
              Liên hệ
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
