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

      {brands.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-paper px-4 py-10 text-center text-sm text-muted">
          Chưa có thương hiệu nào.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-border bg-paper md:block">
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

          {/* Mobile cards */}
          <div className="mt-6 space-y-3 md:hidden">
            {brands.map((brand) => (
              <div key={brand.id} className="rounded-2xl border border-border bg-paper p-3">
                <p className="font-medium text-ink">{brand.name}</p>
                <p className="text-xs text-muted">/{brand.slug}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-border pt-2 text-sm">
                  <Link href={`/admin/brands/${brand.id}/edit`} className="text-brass-deep hover:underline">
                    Sửa
                  </Link>
                  <form action={toggleBrandActive.bind(null, brand.id, !brand.is_active)}>
                    <button type="submit" className="text-ink-soft hover:underline">
                      {brand.is_active ? "Đang hiện" : "Đang ẩn"}
                    </button>
                  </form>
                  <form action={deleteBrand.bind(null, brand.id)}>
                    <ConfirmButton
                      confirmMessage={`Xóa thương hiệu "${brand.name}"?`}
                      className="text-red-600 hover:underline"
                    >
                      Xóa
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
