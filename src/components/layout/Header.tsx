import Image from "next/image";
import Link from "next/link";
import { mainNav, siteConfig } from "@/lib/site-config";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { MessengerIcon, ZaloIcon } from "@/components/ui/SocialIcons";

export function Header() {
  return (
    <header className="relative">
      <div className="border-b border-brass-deep/20 bg-brass">
        <div className="relative flex h-20 items-center justify-between px-4 sm:px-6 lg:h-24 lg:px-10">
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

          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
            <ul className="flex items-center gap-10">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-lg font-semibold text-ink/80 transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={siteConfig.messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink hover:text-paper"
            >
              <MessengerIcon className="h-4 w-4" />
              Nhắn Messenger
            </a>
            <a
              href={siteConfig.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold text-ink hover:bg-ink hover:text-paper"
            >
              <ZaloIcon className="h-4 w-4" />
              Nhắn Zalo
            </a>
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
