import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/admin/actions";

const adminNav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Sản phẩm", href: "/admin/products" },
  { label: "Danh mục", href: "/admin/categories" },
  { label: "Thương hiệu", href: "/admin/brands" },
  { label: "Blog", href: "/admin/blog" },
];

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware đã chặn /admin/* khi chưa đăng nhập, kiểm tra lại ở đây theo
  // nguyên tắc "luôn xác thực trong từng Server Action/Server Component".
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper-soft">
      <header className="border-b border-border bg-ink text-paper">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="text-sm font-semibold tracking-wide">
            TOPSAX Admin
          </Link>
          <div className="flex items-center gap-4 text-xs text-paper/70">
            <span>{user.email}</span>
            <form action={signOut}>
              <button type="submit" className="rounded-full border border-paper/30 px-3 py-1.5 hover:bg-paper/10">
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <nav className="w-44 shrink-0">
          <ul className="space-y-1">
            {adminNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-paper hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
