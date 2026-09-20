import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/seo";
import {
  FacebookIcon,
  MessengerIcon,
  TiktokIcon,
  YoutubeIcon,
  ZaloIcon,
} from "@/components/ui/SocialIcons";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: `Câu chuyện, cam kết và thông tin liên hệ của ${siteConfig.name} - cửa hàng chuyên saxophone.`,
  alternates: { canonical: absoluteUrl("/gioi-thieu") },
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

const socialLinks = [
  { label: "Messenger", href: siteConfig.messengerUrl, icon: MessengerIcon },
  { label: "Zalo", href: siteConfig.zaloUrl, icon: ZaloIcon },
  { label: "Facebook", href: siteConfig.facebookUrl, icon: FacebookIcon },
  { label: "TikTok", href: siteConfig.tiktokUrl, icon: TiktokIcon },
  { label: "YouTube", href: siteConfig.youtubeUrl, icon: YoutubeIcon },
] as const;

export default function AboutPage() {
  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Giới thiệu"
        title={`Về ${siteConfig.name}`}
        description="Chúng tôi được thành lập để bạn không phải hoang mang khi chọn saxophone."
      />

      <div className="mt-8 max-w-3xl space-y-4 text-ink-soft">
        <p>
          {siteConfig.name} hiểu những gì bạn lo lắng khi chọn cây saxophone đầu tiên và bối rối
          trước một rừng phụ kiện vì chính chúng tôi đã từng trải qua. Vì vậy chúng tôi sẽ đưa bạn
          đến lựa chọn tối ưu nhất từ lựa chọn saxophone mới, saxophone đã qua sử dụng đến phụ kiện đi kèm
          như mouthpiece, reed, ligature và case...
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
        <Button href="#lien-he" variant="outline">
          Liên hệ với chúng tôi
        </Button>
      </div>

      <section id="lien-he" className="mt-16 scroll-mt-24 border-t border-border pt-12">
        <SectionHeading
          eyebrow="Liên hệ"
          title="Bạn quan tâm sản phẩm nào?"
          description="Gọi điện, nhắn Zalo, Messenger hoặc để lại thông tin - chúng tôi sẽ phản hồi sớm nhất."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Button href={siteConfig.phoneHref} variant="brass">
                Gọi ngay {siteConfig.phone}
              </Button>
              <Button href={siteConfig.zaloUrl} variant="outline">
                Nhắn Zalo
              </Button>
              <Button href={siteConfig.messengerUrl} variant="outline">
                <MessengerIcon className="h-4 w-4" />
                Nhắn Messenger
              </Button>
            </div>

            <dl className="space-y-3 rounded-2xl border border-border bg-paper-soft p-6 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Điện thoại</dt>
                <dd className="font-medium text-ink">{siteConfig.phone}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Email</dt>
                <dd className="font-medium text-ink">{siteConfig.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Địa chỉ</dt>
                <dd className="text-right font-medium text-ink">{siteConfig.address}</dd>
              </div>
            </dl>

            <div>
              <p className="text-sm font-medium text-ink">Theo dõi chúng tôi</p>
              <ul className="mt-3 flex flex-wrap gap-3">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink/70 transition-colors hover:border-ink hover:text-ink"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-paper p-6">
            <p className="font-semibold text-ink">Gửi thông tin liên hệ</p>
            <p className="mt-1 text-sm text-muted">
              Để lại thông tin, chúng tôi sẽ gọi lại tư vấn trong thời gian sớm nhất.
            </p>
            <div className="mt-5">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
