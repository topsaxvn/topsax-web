import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/data-access/products";
import { getProductHref } from "@/lib/product-url";
import { cn } from "@/lib/utils/cn";
import { conditionLabel, priceLabel } from "@/lib/utils/format";

// Sidebar Cảm âm / trang khóa học: liệt kê sản phẩm thành danh sách dài,
// cuộn riêng bên trong khi sticky để không bị tràn khỏi màn hình.
//
// fill: khung nằm trong một cột flex có chiều cao giới hạn (trang khóa học:
// dưới thẻ học phí) - danh sách co lại vừa phần còn lại và cuộn bên trong.
export function FeaturedProductsSidebar({
  products,
  title = "Sản phẩm nổi bật",
  note,
  showCategory = false,
  fill = false,
  className,
}: {
  products: ProductSummary[];
  title?: string;
  /** Một dòng ngắn dưới tiêu đề. */
  note?: string;
  /** Ghi loại sản phẩm (Alto, Mouthpiece, Reed...) trước tình trạng. */
  showCategory?: boolean;
  fill?: boolean;
  className?: string;
}) {
  if (products.length === 0) return null;

  return (
    <div className={cn("rounded-2xl border border-border bg-paper p-4", fill && "flex min-h-0 flex-col", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-brass-deep">{title}</p>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}

      <div className={cn("mt-3 space-y-3 overflow-y-auto pr-1", fill ? "min-h-0 flex-1" : "max-h-[calc(100vh-9rem)]")}>
        {products.map((product) => (
          <Link
            key={product.id}
            href={getProductHref(product)}
            className="group flex gap-3 rounded-xl p-1.5 transition-colors hover:bg-paper-soft"
          >
            <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-paper-soft">
              {product.thumbnailUrl ? (
                <Image
                  src={product.thumbnailUrl}
                  alt={product.name}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-muted">Chưa có ảnh</div>
              )}
            </div>
            <div className="min-w-0 py-0.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                {showCategory && product.category?.name ? `${product.category.name} · ` : ""}
                {conditionLabel[product.condition]}
              </p>
              <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-ink group-hover:text-brass-deep">
                {product.name}
              </h3>
              <p className="mt-0.5 text-sm font-semibold text-ink">{priceLabel(product.price, product.currency)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
