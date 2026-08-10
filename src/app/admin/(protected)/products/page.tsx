import Link from "next/link";
import type { Metadata } from "next";
import { searchProductsAdmin } from "@/data-access/products";
import { deleteProduct, setInspectionStatus, setProductStatus } from "@/app/admin/(protected)/products/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { ProductThumbLightbox } from "@/components/admin/ProductThumbLightbox";
import { conditionLabel, formatPrice, inspectionStatusLabel, statusLabel } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { ProductInspectionStatus, ProductStatus } from "@/types/database";

export const metadata: Metadata = { title: "Sản phẩm", robots: { index: false, follow: false } };

const statusTabs: { value: ProductStatus | undefined; label: string }[] = [
  { value: undefined, label: "Tất cả" },
  { value: "available", label: "Còn hàng" },
  { value: "sold", label: "Đã bán" },
  { value: "hidden", label: "Ẩn" },
];

const inspectionTabs: { value: ProductInspectionStatus | undefined; label: string }[] = [
  { value: undefined, label: "Tất cả" },
  { value: "pending", label: "Chờ kiểm tra" },
  { value: "in_progress", label: "Đang kiểm tra" },
  { value: "passed", label: "Đạt" },
  { value: "failed", label: "Không đạt" },
];

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; inspection?: string }>;
}) {
  const { q, status, inspection } = await searchParams;
  const validStatus = status === "available" || status === "sold" || status === "hidden" ? status : undefined;
  const validInspection =
    inspection === "pending" || inspection === "in_progress" || inspection === "passed" || inspection === "failed"
      ? inspection
      : undefined;

  const products = await searchProductsAdmin({ q, status: validStatus, inspectionStatus: validInspection });

  const buildHref = (params: { status?: string; inspection?: string; q?: string }) => {
    const search = new URLSearchParams();
    if (params.status) search.set("status", params.status);
    if (params.inspection) search.set("inspection", params.inspection);
    if (params.q) search.set("q", params.q);
    const qs = search.toString();
    return qs ? `/admin/products?${qs}` : "/admin/products";
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-ink">Sản phẩm</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brass px-4 py-2 text-sm font-semibold text-ink hover:bg-brass-soft"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase text-muted">Trạng thái hàng:</span>
          {statusTabs.map((tab) => (
            <Link
              key={tab.label}
              href={buildHref({ status: tab.value, inspection: validInspection, q })}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                validStatus === tab.value
                  ? "border-brass bg-brass text-ink"
                  : "border-border text-ink-soft hover:border-brass hover:text-brass-deep",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase text-muted">Kiểm tra:</span>
          {inspectionTabs.map((tab) => (
            <Link
              key={tab.label}
              href={buildHref({ status: validStatus, inspection: tab.value, q })}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                validInspection === tab.value
                  ? "border-brass bg-brass text-ink"
                  : "border-border text-ink-soft hover:border-brass hover:text-brass-deep",
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <form className="flex gap-2">
          {validStatus && <input type="hidden" name="status" value={validStatus} />}
          {validInspection && <input type="hidden" name="inspection" value={validInspection} />}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Tìm theo tên..."
            className="rounded-lg border border-border bg-paper px-3.5 py-2 text-sm text-ink outline-none focus:border-brass"
          />
          <button type="submit" className="rounded-lg border border-border px-3.5 py-2 text-sm text-ink-soft hover:text-ink">
            Tìm
          </button>
        </form>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-paper">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Ảnh</th>
              <th className="px-4 py-3 font-medium">Sản phẩm</th>
              <th className="px-4 py-3 font-medium">Giá</th>
              <th className="px-4 py-3 font-medium">Tình trạng</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium">Kiểm tra</th>
              <th className="px-4 py-3 font-medium">Nổi bật</th>
              <th className="px-4 py-3 font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <ProductThumbLightbox images={product.images} name={product.name} />
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{product.name}</p>
                  <p className="text-xs text-muted">{product.category?.name ?? "Chưa phân loại"}</p>
                </td>
                <td className="px-4 py-3 text-ink">{formatPrice(product.price, product.currency)}</td>
                <td className="px-4 py-3 text-ink-soft">{conditionLabel[product.condition]}</td>
                <td className="px-4 py-3 text-ink-soft">{statusLabel[product.status]}</td>
                <td className="px-4 py-3 text-ink-soft">{inspectionStatusLabel[product.inspection_status]}</td>
                <td className="px-4 py-3">{product.featured ? "✓" : ""}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-brass-deep hover:underline">
                      Sửa
                    </Link>
                    {product.inspection_status !== "passed" && (
                      <form action={setInspectionStatus.bind(null, product.id, "passed")}>
                        <button type="submit" className="text-ink-soft hover:underline">
                          Đánh dấu đạt
                        </button>
                      </form>
                    )}
                    {product.status !== "sold" && (
                      <form action={setProductStatus.bind(null, product.id, "sold")}>
                        <button type="submit" className="text-ink-soft hover:underline">
                          Đánh dấu đã bán
                        </button>
                      </form>
                    )}
                    {product.status !== "available" && (
                      <form action={setProductStatus.bind(null, product.id, "available")}>
                        <button type="submit" className="text-ink-soft hover:underline">
                          Còn hàng
                        </button>
                      </form>
                    )}
                    <form action={deleteProduct.bind(null, product.id)}>
                      <ConfirmButton
                        confirmMessage={`Xóa sản phẩm "${product.name}"? Hành động này không thể hoàn tác.`}
                        className="text-red-600 hover:underline"
                      >
                        Xóa
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted">
                  Không có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
