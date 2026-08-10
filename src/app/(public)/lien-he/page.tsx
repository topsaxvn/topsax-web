import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: `Liên hệ ${siteConfig.name} qua điện thoại, Zalo, Facebook hoặc form liên hệ.`,
};

export default function ContactPage() {
  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Liên hệ"
        title="Bạn quan tâm sản phẩm nào?"
        description="Gọi điện, nhắn Zalo, Facebook hoặc để lại thông tin - chúng tôi sẽ phản hồi sớm nhất."
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
            <Button href={siteConfig.facebookUrl} variant="outline">
              Facebook
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
    </Container>
  );
}
