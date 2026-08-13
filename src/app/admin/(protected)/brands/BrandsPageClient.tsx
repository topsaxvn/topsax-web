"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { brandsApi } from "@/lib/admin-api/brands";
import { triggerRevalidate } from "@/lib/admin-api/revalidate";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Brand } from "@/data-access/brands";

export function BrandsPageClient() {
  const [brands, setBrands] = useState<Brand[] | null>(null);

  useEffect(() => {
    brandsApi.listAll().then(setBrands);
  }, []);

  async function handleDelete(brand: Brand) {
    setBrands((prev) => prev?.filter((b) => b.id !== brand.id) ?? prev);
    await brandsApi.remove(brand.id);
    triggerRevalidate({ resource: "brand" });
  }

  async function handleToggleActive(brand: Brand) {
    const nextActive = !brand.is_active;
    setBrands((prev) => prev?.map((b) => (b.id === brand.id ? { ...b, is_active: nextActive } : b)) ?? prev);
    await brandsApi.toggleActive(brand.id, nextActive);
    triggerRevalidate({ resource: "brand" });
  }

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

      {!brands ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-2xl" />
          ))}
        </div>
      ) : brands.length === 0 ? (
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
                      <button type="button" onClick={() => handleToggleActive(brand)} className="text-ink-soft hover:underline">
                        {brand.is_active ? "Đang hiện" : "Đang ẩn"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link href={`/admin/brands/${brand.id}/edit`} className="text-brass-deep hover:underline">
                          Sửa
                        </Link>
                        <ConfirmButton
                          confirmMessage={`Xóa thương hiệu "${brand.name}"?`}
                          onConfirm={() => handleDelete(brand)}
                          className="text-red-600 hover:underline"
                        >
                          Xóa
                        </ConfirmButton>
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
                  <button type="button" onClick={() => handleToggleActive(brand)} className="text-ink-soft hover:underline">
                    {brand.is_active ? "Đang hiện" : "Đang ẩn"}
                  </button>
                  <ConfirmButton
                    confirmMessage={`Xóa thương hiệu "${brand.name}"?`}
                    onConfirm={() => handleDelete(brand)}
                    className="text-red-600 hover:underline"
                  >
                    Xóa
                  </ConfirmButton>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
