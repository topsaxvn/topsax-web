"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/data-access/products";
import { getProductHref } from "@/lib/product-url";
import { priceLabel } from "@/lib/utils/format";

// Popup sản phẩm nổi bật dưới đáy màn hình cho trang Cảm âm trên mobile -
// thay cho thanh liên hệ (đã ẩn riêng ở MobileContactBar), cho phép thu nhỏ
// lại thành một thanh gọn khi người dùng muốn đọc cảm âm không bị che.
export function FeaturedProductsMobileSheet({ products }: { products: ProductSummary[] }) {
  const [expanded, setExpanded] = useState(true);

  if (products.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="cam-am-featured-sheet"
        className="flex w-full items-center justify-between border-t border-border bg-paper px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brass-deep"
      >
        Sản phẩm nổi bật
        <span aria-hidden className={`transition-transform ${expanded ? "" : "rotate-180"}`}>
          ▾
        </span>
      </button>

      {expanded && (
        <div id="cam-am-featured-sheet" className="border-t border-border bg-paper px-4 pb-4 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {products.map((product) => (
              <Link
                key={product.id}
                href={getProductHref(product)}
                className="w-28 shrink-0"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-paper-soft">
                  {product.thumbnailUrl ? (
                    <Image src={product.thumbnailUrl} alt={product.name} fill sizes="112px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-muted">Chưa có ảnh</div>
                  )}
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs font-medium text-ink">{product.name}</p>
                <p className="text-xs font-semibold text-ink">{priceLabel(product.price, product.currency)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
