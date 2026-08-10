import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: `Câu chuyện và cam kết của ${siteConfig.name} - cửa hàng chuyên saxophone.`,
};

const commitments = [
  {
    title: "Sản phẩm được kiểm tra kỹ",
    description:
      "Mỗi cây saxophone cũ đều được kiểm tra pad, leak, tình trạng body và neck trước khi lên kệ.",
  },
  {
    title: "Thông tin minh bạch",
    description: "Giá, tình trạng, năm sản xuất và phụ kiện đi kèm được ghi rõ ở từng sản phẩm.",
  },
  {
    title: "Tư vấn theo nhu cầu thực tế",
    description: "Không chạy theo doanh số - chúng tôi tư vấn cây kèn phù hợp với trình độ và ngân sách của bạn.",
  },
];

export default function AboutPage() {
  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Giới thiệu"
        title={`Về ${siteConfig.name}`}
        description="Một cửa hàng chuyên saxophone có kiến thức và uy tín."
      />

      <div className="mt-8 max-w-3xl space-y-4 text-ink-soft">
        <p>
          {siteConfig.name} tập trung vào một lĩnh vực duy nhất: saxophone. Từ saxophone mới,
          saxophone đã qua sử dụng đến phụ kiện đi kèm như mouthpiece, reed, ligature và case,
          mỗi sản phẩm đều được chọn lọc và kiểm tra trước khi giới thiệu đến khách hàng.
        </p>
        <p>
          Chúng tôi tin rằng việc chọn mua một cây saxophone - đặc biệt là saxophone cũ - cần
          nhiều hơn một bảng giá. Đó là lý do chúng tôi xây dựng kho kiến thức về cách chọn,
          kiểm tra và bảo quản saxophone, đồng thời sẵn sàng tư vấn trực tiếp qua điện thoại
          hoặc Zalo cho từng khách hàng.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {commitments.map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-paper-soft p-6">
            <p className="font-semibold text-ink">{item.title}</p>
            <p className="mt-2 text-sm text-muted">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button href="/saxophone" variant="primary">
          Xem sản phẩm
        </Button>
        <Button href="/lien-he" variant="outline">
          Liên hệ với chúng tôi
        </Button>
      </div>
    </Container>
  );
}
