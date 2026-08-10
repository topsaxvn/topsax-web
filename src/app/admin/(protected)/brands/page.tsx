import Link from "next/link";
import type { Metadata } from "next";
import { getAllBrands } from "@/data-access/brands";
import { deleteBrand, toggleBrandActive } from "@/app/admin/(protected)/brands/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export const metadata: Metadata = { title: "Thương hiệu", robots: { index: false, follow: false } };

export default async function AdminBrandsPage() {
  const brands = await getAllBrands();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-ink">Thương hiệu</h1>
        <Link
          href="/admin/brands/new"
          className="rounded-full bg-brass px-4 py-2 text-sm font-semibold text-ink hover:bg-brass-soft"
        >
          + Thêm thương hiệu
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-paper">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Tên</th>
              <th className="px-4 py-3 font-medium">Hiển thị</th>
              <th className="px-4 py-3 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{brand.name}</p>
                  <p className="text-xs text-muted">/{brand.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <form action={toggleBrandActive.bind(null, brand.id, !brand.is_active)}>
                    <button type="submit" className="text-ink-soft hover:underline">
                      {brand.is_active ? "Đang hiện" : "Đang ẩn"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href={`/admin/brands/${brand.id}/edit`} className="text-brass-deep hover:underline">
                      Sửa
                    </Link>
                    <form action={deleteBrand.bind(null, brand.id)}>
                      <ConfirmButton
                        confirmMessage={`Xóa thương hiệu "${brand.name}"?`}
                        className="text-red-600 hover:underline"
                      >
                        Xóa
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
