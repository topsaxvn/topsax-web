import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";
import { PostGrid } from "@/components/blog/PostGrid";
import { getProducts } from "@/data-access/products";
import { getPublishedPosts } from "@/data-access/posts";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 1800;

export const metadata: Metadata = {
  alternates: { canonical: siteConfig.url },
};

const quickCategories = [
  { label: "Alto", href: "/saxophone/alto" },
  { label: "Tenor", href: "/saxophone/tenor" },
  { label: "Soprano", href: "/saxophone/soprano" },
  { label: "Phụ kiện", href: "/phu-kien" },
];

const reasons = [
  {
    title: "Am hiểu chuyên sâu",
    description: "Tư vấn dựa trên kiến thức thực tế về từng dòng saxophone, không chỉ bán hàng đơn thuần.",
  },
  {
    title: "Kiểm tra kỹ trước khi bán",
    description: "Saxophone cũ được kiểm tra tình trạng pad, leak, body trước khi lên kệ.",
  },
  {
    title: "Thông tin minh bạch",
    description: "Mỗi sản phẩm ghi rõ tình trạng, năm sản xuất và phụ kiện đi kèm.",
  },
  {
    title: "Hỗ trợ trực tiếp",
    description: "Liên hệ nhanh qua điện thoại, Zalo hoặc Facebook, phản hồi tận tâm.",
  },
];

export default async function Home() {
  const [featuredSaxophones, latestSaxophones, featuredAccessories, recentPosts] = await Promise.all([
    getProducts({ sectionSlug: "saxophone", featured: true, limit: 4 }),
    getProducts({ sectionSlug: "saxophone", sort: "newest", limit: 4 }),
    getProducts({ sectionSlug: "phu-kien", featured: true, limit: 4 }),
    getPublishedPosts(3),
  ]);

  return (
    <>
      <section className="border-b border-border bg-paper">
        <Container className="grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass-deep">
              {siteConfig.tagline}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
              Chúng tôi luôn có <span className="text-brass">cây saxophone</span> bạn cần
            </h1>
            <p className="mt-5 max-w-lg text-muted">
              {siteConfig.name} chuyên saxophone mới, saxophone cũ đã qua kiểm tra và phụ kiện
              chính hãng — giúp bạn chọn được cây kèn phù hợp nhất.
            </p>
              <p className="text-brass">Chúng tôi đảm bảo bạn thở được thì kèn thổi được</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/saxophone" variant="brass">
                Xem saxophone
              </Button>
              <Button href="/lien-he" variant="outline">
                Liên hệ tư vấn
              </Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center rounded-3xl bg-brass-soft/40 p-10 lg:p-16">
            <div className="absolute inset-6 rounded-2xl border border-brass/30 lg:inset-10" />
            <Image
              src="/brand/topsax-mark-white.png"
              alt="Biểu tượng saxophone TOPSAX"
              width={280}
              height={273}
              className="relative w-48 drop-shadow-sm invert lg:w-64"
              priority
            />
          </div>
        </Container>
      </section>

      <section className="border-b border-border py-10">
        <Container>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickCategories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="rounded-2xl border border-border bg-paper px-4 py-6 text-center font-semibold text-ink transition-colors hover:border-brass hover:text-brass-deep"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading
            eyebrow="Về chúng tôi"
            title="Một cửa hàng chuyên saxophone, có kiến thức và uy tín"
            description="Từ chọn cây kèn đầu tiên đến nâng cấp phụ kiện, chúng tôi đồng hành cùng người chơi saxophone ở mọi trình độ."
          />
        </Container>
      </section>

      <section className="border-t border-border bg-paper-soft py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Sản phẩm" title="Saxophone nổi bật" />
            <Link href="/saxophone" className="text-sm font-medium text-brass hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="mt-8">
            <ProductGrid
              products={featuredSaxophones}
              emptyMessage="Chưa có saxophone nổi bật. Vào trang quản trị để đánh dấu sản phẩm nổi bật."
            />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Đa dạng lựa chọn" title="Saxophone mới & đã qua sử dụng" />
            <Link href="/saxophone" className="text-sm font-medium text-brass hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={latestSaxophones} emptyMessage="Chưa có sản phẩm saxophone." />
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-paper-soft py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Phụ kiện" title="Phụ kiện nổi bật" />
            <Link href="/phu-kien" className="text-sm font-medium text-brass hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={featuredAccessories} emptyMessage="Chưa có phụ kiện nổi bật." />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="Vì sao chọn chúng tôi" title="Vì sao nên mua tại TOPSAX" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason) => (
              <div key={reason.title} className="rounded-2xl border border-border bg-paper p-6">
                <p className="font-semibold text-ink">{reason.title}</p>
                <p className="mt-2 text-sm text-muted">{reason.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-paper-soft py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Kiến thức saxophone" title="Bài viết mới" />
            <Link href="/blog" className="text-sm font-medium text-brass hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="mt-8">
            <PostGrid posts={recentPosts} emptyMessage="Chưa có bài viết nào." />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="rounded-3xl bg-ink px-8 py-14 text-center text-paper">
          <h2 className="text-2xl font-semibold sm:text-3xl">Bạn đang tìm cây saxophone phù hợp?</h2>
          <p className="mx-auto mt-3 max-w-xl text-paper/70">
            Liên hệ với chúng tôi để được tư vấn miễn phí về sản phẩm phù hợp với nhu cầu và ngân sách của bạn.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href={siteConfig.phoneHref} variant="brass">
              Gọi ngay {siteConfig.phone}
            </Button>
            <Button
              href={siteConfig.zaloUrl}
              variant="outline"
              className="border-paper/30 text-paper hover:bg-paper hover:text-ink"
            >
              Nhắn Zalo
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
