"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { adminNavItems } from "@/components/admin/admin-nav";
import { CloseIcon, LogoutIcon, MenuIcon } from "@/components/admin/icons";
import { cn } from "@/lib/utils/cn";

const NAV_LINK_BASE = "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";
const NAV_ACTIVE = "bg-brass text-ink";
const NAV_INACTIVE = "text-ink-soft hover:bg-paper-soft hover:text-ink";

function isActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ userEmail, children }: { userEmail: string; children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper-soft">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-56 flex-col border-r border-border bg-paper md:flex">
        <div className="flex h-16 items-center px-4">
          <Link href="/admin" className="text-sm font-semibold tracking-wide text-ink">
            TOPSAX Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
          {adminNavItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={cn(NAV_LINK_BASE, isActive(pathname, href, exact) ? NAV_ACTIVE : NAV_INACTIVE)}
            >
              <Icon width={18} height={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border px-2 py-3">
          <p className="truncate px-3 pb-2 text-xs text-muted" title={userEmail}>
            {userEmail}
          </p>
          <button type="button" onClick={handleSignOut} className={cn(NAV_LINK_BASE, NAV_INACTIVE, "w-full")}>
            <LogoutIcon width={18} height={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Mobile top header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-paper px-4 md:hidden">
        <Link href="/admin" className="text-sm font-semibold tracking-wide text-ink">
          TOPSAX Admin
        </Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Mở menu"
          aria-expanded={drawerOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink"
        >
          <MenuIcon width={20} height={20} />
        </button>
      </header>

      {/* Mobile slide-over drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-paper shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <span className="text-sm font-semibold tracking-wide text-ink">TOPSAX Admin</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Đóng menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-paper-soft"
              >
                <CloseIcon width={18} height={18} />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
              {adminNavItems.map(({ href, label, icon: Icon, exact }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setDrawerOpen(false)}
                  className={cn(NAV_LINK_BASE, isActive(pathname, href, exact) ? NAV_ACTIVE : NAV_INACTIVE)}
                >
                  <Icon width={18} height={18} />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-border px-2 py-3">
              <p className="truncate px-3 pb-2 text-xs text-muted" title={userEmail}>
                {userEmail}
              </p>
              <button type="button" onClick={handleSignOut} className={cn(NAV_LINK_BASE, NAV_INACTIVE, "w-full")}>
                <LogoutIcon width={18} height={18} />
                Đăng xuất
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="min-h-screen pb-20 md:ml-56 md:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-6 md:py-8">{children}</div>
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-paper md:hidden">
        {adminNavItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium",
                active ? "text-brass-deep" : "text-muted",
              )}
            >
              <Icon width={20} height={20} strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
