import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { mainNav, siteConfig } from "@/lib/site-config";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Header() {
  return (
    <header className="relative">
      <div className="border-b border-brass-deep/20 bg-brass">
        <Container className="flex h-20 items-center justify-between lg:h-24">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/topsax-icon.png"
              alt={siteConfig.name}
              width={200}
              height={180}
              className="h-10 w-auto invert lg:h-12"
              priority
            />
            <span className="text-2xl font-bold tracking-wide text-ink lg:text-2xl">
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

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={siteConfig.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink hover:text-paper"
            >
              Nhắn Facebook
            </a>
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
