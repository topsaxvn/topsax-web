import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { mainNav, siteConfig } from "@/lib/site-config";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Header() {
  return (
    <header className="relative">
      <div className="hidden bg-paper-soft text-ink-soft lg:block">
        <Container className="flex h-9 items-center justify-between text-xs">
          <p>{siteConfig.tagline}</p>
          <div className="flex items-center gap-5">
            <a href={`mailto:${siteConfig.email}`} className="hover:text-ink">
              {siteConfig.email}
            </a>
            <a href={siteConfig.phoneHref} className="font-medium hover:text-ink">
              {siteConfig.phone}
            </a>
          </div>
        </Container>
      </div>

      <div className="border-b border-brass-deep/20 bg-brass">
        <Container className="flex h-16 items-center justify-between lg:h-[72px]">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/topsax-logo.png"
              alt={siteConfig.name}
              width={40}
              height={39}
              className="rounded-full"
              priority
            />
            <span className="text-lg font-semibold tracking-wide text-ink">
              {siteConfig.name}
            </span>
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-semibold text-ink/80 transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <a
              href={siteConfig.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink hover:text-paper"
            >
              Nhắn Zalo
            </a>
          </div>

          <MobileMenu />
        </Container>
      </div>
    </header>
  );
}
