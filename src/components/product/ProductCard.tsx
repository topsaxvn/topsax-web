import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/data-access/products";
import { getProductHref } from "@/lib/product-url";
import { conditionLabel, formatPrice } from "@/lib/utils/format";
import { cloudinaryLoader } from "@/lib/utils/cloudinary-loader";

export function ProductCard({ product }: { product: ProductSummary }) {
  const isSold = product.status === "sold";

  return (
    <Link
      href={getProductHref(product)}
      className="group block overflow-hidden rounded-2xl border border-border bg-paper transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square bg-paper-soft">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
            loader={cloudinaryLoader}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Chưa có ảnh
          </div>
        )}
        {isSold && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-paper">
            Đã bán
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brass-deep">
          {conditionLabel[product.condition]}
        </p>
        <h3 className="mt-1 font-semibold text-ink group-hover:text-brass-deep">{product.name}</h3>
        <p className="mt-2 text-base font-semibold text-ink">{formatPrice(product.price, product.currency)}</p>
      </div>
    </Link>
  );
}
