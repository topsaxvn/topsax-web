"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProductSummary } from "@/data-access/products";
import { getProductHref } from "@/lib/product-url";
import { conditionLabel, priceLabel } from "@/lib/utils/format";

const ROTATE_MS = 4500;

// Hiện lần lượt từng sản phẩm nổi bật thay vì cả danh sách - tiết kiệm
// không gian cho sidebar cạnh nội dung Cảm âm.
export function FeaturedProductsSidebar({ products }: { products: ProductSummary[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (products.length <= 1 || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % products.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [products.length, paused]);

  if (products.length === 0) return null;
  const product = products[index];

  return (
    <div
      className="rounded-2xl border border-border bg-paper p-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-brass-deep">Sản phẩm nổi bật</p>

      <Link key={product.id} href={getProductHref(product)} className="group mt-3 block animate-[cam-fade-in_0.4s_ease]">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-paper-soft">
          {product.thumbnailUrl ? (
            <Image
              src={product.thumbnailUrl}
              alt={product.name}
              fill
              sizes="260px"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">Chưa có ảnh</div>
          )}
        </div>
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted">
          {conditionLabel[product.condition]}
        </p>
        <h3 className="mt-1 line-clamp-2 font-semibold text-ink group-hover:text-brass-deep">{product.name}</h3>
        <p className="mt-1 text-sm font-semibold text-ink">{priceLabel(product.price, product.currency)}</p>
      </Link>

      {products.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Xem sản phẩm ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-4 bg-brass" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
