import Link from "next/link";
import type { Metadata } from "next";
import { getDashboardCounts } from "@/data-access/admin";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const counts = await getDashboardCounts();

  const cards = [
    { label: "Sản phẩm", value: counts.products, href: "/admin/products" },
    { label: "Danh mục", value: counts.categories, href: "/admin/categories" },
    { label: "Thương hiệu", value: counts.brands, href: "/admin/brands" },
    { label: "Bài viết", value: counts.posts, href: "/admin/blog" },
    { label: "Liên hệ mới", value: counts.newMessages, href: "/admin/contacts" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-ink">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-border bg-paper p-5 transition-shadow hover:shadow-sm"
          >
            <p className="text-2xl font-bold text-ink">{card.value}</p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
