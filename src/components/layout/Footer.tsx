import Link from "next/link";
import { mainNav, siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/Container";
import {
  FacebookIcon,
  MessengerIcon,
  TiktokIcon,
  YoutubeIcon,
  ZaloIcon,
} from "@/components/ui/SocialIcons";

const socialLinks = [
  { label: "Messenger", href: siteConfig.messengerUrl, icon: MessengerIcon },
  { label: "Zalo", href: siteConfig.zaloUrl, icon: ZaloIcon },
  { label: "Facebook", href: siteConfig.facebookUrl, icon: FacebookIcon },
  { label: "TikTok", href: siteConfig.tiktokUrl, icon: TiktokIcon },
  { label: "YouTube", href: siteConfig.youtubeUrl, icon: YoutubeIcon },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-ink text-paper">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-semibold tracking-wide">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-paper/70">{siteConfig.tagline}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-brass-soft">Danh mục</p>
          <ul className="mt-3 space-y-2">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-paper/70 hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-brass-soft">Liên hệ</p>
          <ul className="mt-3 space-y-2 text-sm text-paper/70">
            <li>
              <a href={siteConfig.phoneHref} className="hover:text-paper">
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-paper">
                {siteConfig.email}
              </a>
            </li>
            <li>{siteConfig.address}</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-brass-soft">Kết nối</p>
          <ul className="mt-3 flex flex-wrap gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/20 text-paper/70 transition-colors hover:border-paper/40 hover:text-paper"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-paper/10 py-5">
        <Container>
          <p className="text-xs text-paper/50">
            © {new Date().getFullYear()} {siteConfig.name}. Đã đăng ký bản quyền.
          </p>
        </Container>
      </div>
    </footer>
  );
}
