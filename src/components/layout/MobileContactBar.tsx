"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

// Ẩn ở trang Cảm âm và trang một khóa học: các trang đó có sẵn popup sản
// phẩm (nổi bật / đề xuất cho khóa học) chiếm chỗ dưới màn hình trên mobile,
// không cần thêm thanh liên hệ.
const COURSE_PAGE = /^\/khoa-hoc\/(?!dang-nhap$|xac-thuc$|hoc$)[^/]+$/;

export function MobileContactBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/cam-am") || (pathname && COURSE_PAGE.test(pathname))) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-paper lg:hidden">
      <div className="grid grid-cols-3 divide-x divide-border">
        <a
          href={siteConfig.phoneHref}
          className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium text-ink"
        >
          <span aria-hidden>📞</span>
          Gọi điện
        </a>
        <a
          href={siteConfig.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium text-ink"
        >
          <span aria-hidden>💬</span>
          Zalo
        </a>
        <a
          href="/gioi-thieu#lien-he"
          className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium text-ink"
        >
          <span aria-hidden>✉️</span>
          Liên hệ
        </a>
      </div>
    </div>
  );
}
