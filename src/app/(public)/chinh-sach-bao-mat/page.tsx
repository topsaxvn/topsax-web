import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Chính sách bảo mật",
  description: `${siteConfig.name} thu thập những thông tin gì, dùng để làm gì và cách yêu cầu xoá.`,
  alternates: { canonical: absoluteUrl("/chinh-sach-bao-mat") },
};

const UPDATED = "13/11/2026";

const sections = [
  {
    title: "Thông tin chúng tôi thu thập",
    items: [
      "Khi bạn đăng nhập khóa học bằng Google: họ tên, địa chỉ email và ảnh đại diện mà Google cung cấp. Chúng tôi không nhận mật khẩu Google của bạn và không truy cập Gmail, Drive hay dữ liệu nào khác trong tài khoản Google.",
      "Khi bạn học: bài đã tập, số sao và thời điểm hoàn thành, để lưu tiến độ và cho bạn học tiếp trên máy khác.",
      "Khi bạn gửi form liên hệ: họ tên, số điện thoại và nội dung bạn nhập.",
      "Thống kê truy cập ẩn danh (số lượt xem trang, loại thiết bị) qua Vercel Analytics, không dùng cookie theo dõi và không gắn với danh tính của bạn.",
    ],
  },
  {
    title: "Chúng tôi dùng thông tin để làm gì",
    items: [
      "Cho bạn đăng nhập, mở bài học và lưu tiến độ học.",
      "Liên hệ tư vấn khi bạn để lại số điện thoại.",
      "Hỗ trợ khi bạn gặp lỗi trong lúc học.",
    ],
  },
  {
    title: "Chia sẻ và lưu trữ",
    items: [
      `${siteConfig.name} không bán, không cho thuê và không chia sẻ thông tin của bạn cho bên thứ ba để quảng cáo.`,
      "Dữ liệu được lưu trên Supabase (cơ sở dữ liệu) và trang web chạy trên Vercel. Hai dịch vụ này chỉ xử lý dữ liệu để vận hành trang web.",
      "Dữ liệu được giữ cho đến khi bạn yêu cầu xoá.",
    ],
  },
  {
    title: "Quyền của bạn",
    items: [
      `Bạn có thể yêu cầu xem, sửa hoặc xoá tài khoản và toàn bộ tiến độ học bằng cách gửi email tới ${siteConfig.email} hoặc gọi ${siteConfig.phone}. Chúng tôi xử lý trong vòng 7 ngày.`,
      "Bạn có thể gỡ quyền truy cập của TOPSAX bất cứ lúc nào tại trang Bảo mật của tài khoản Google (myaccount.google.com/permissions).",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <Container className="py-12">
      <SectionHeading
        as="h1"
        eyebrow="Chính sách"
        title="Chính sách bảo mật"
        description={`Cập nhật ngày ${UPDATED}. Áp dụng cho trang ${siteConfig.url.replace(/^https?:\/\//, "")} và khóa học saxophone trực tuyến của ${siteConfig.name}.`}
      />

      <div className="mt-8 max-w-3xl space-y-10 text-ink-soft">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-semibold text-ink">{s.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}

        <section>
          <h2 className="text-lg font-semibold text-ink">Liên hệ</h2>
          <p className="mt-3">
            {siteConfig.name} · {siteConfig.address} · {siteConfig.phone} ·{" "}
            <a href={`mailto:${siteConfig.email}`} className="underline">
              {siteConfig.email}
            </a>
          </p>
        </section>
      </div>
    </Container>
  );
}
