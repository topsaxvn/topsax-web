import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { ProductDetail, ProductSummary } from "@/data-access/products";
import { conditionLabel, formatPrice, statusLabel } from "@/lib/utils/format";
import { siteConfig } from "@/lib/site-config";
import { MessengerIcon } from "@/components/ui/SocialIcons";

function isPlainSpecValue(value: unknown): value is string | number | boolean {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

export function ProductDetailView({
  product,
  related,
}: {
  product: ProductDetail;
  related: ProductSummary[];
}) {
  const isSold = product.status === "sold";
  const specs = Object.entries(product.specifications ?? {}).filter(([, value]) => isPlainSpecValue(value));

  return (
    <Container className="py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-paper-soft">
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt_text ?? product.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted">Chưa có ảnh</div>
            )}
            {isSold && (
              <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-paper">
                Đã bán
              </span>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.images.slice(1).map((image, index) => (
                <div
                  key={image.url + index}
                  className="relative aspect-square overflow-hidden rounded-xl border border-border bg-paper-soft"
                >
                  <Image
                    src={image.url}
                    alt={image.alt_text ?? product.name}
                    fill
                    sizes="12vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-paper-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brass-deep">
              {conditionLabel[product.condition]}
            </span>
            <span className="rounded-full bg-paper-soft px-3 py-1 text-xs font-semibold text-ink-soft">
              {statusLabel[product.status]}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">{product.name}</h1>

          {(product.brand || product.model) && (
            <p className="mt-1 text-sm text-muted">
              {[product.brand?.name, product.model].filter(Boolean).join(" · ")}
            </p>
          )}

          <p className="mt-4 text-2xl font-semibold text-ink">
            {formatPrice(product.price, product.currency)}
          </p>

          {product.short_description && (
            <p className="mt-3 max-w-lg text-muted">{product.short_description}</p>
          )}

          {isSold ? (
            <div className="mt-6 rounded-2xl border border-border bg-paper-soft p-4 text-sm text-ink-soft">
              Sản phẩm này đã được bán. Xem sản phẩm tương tự bên dưới hoặc liên hệ để được tư vấn sản phẩm khác.
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-sm font-medium text-ink">Bạn quan tâm sản phẩm này?</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Button href={siteConfig.phoneHref} variant="brass">
                  Gọi ngay
                </Button>
                <Button href={siteConfig.zaloUrl} variant="outline">
                  Nhắn Zalo
                </Button>
                <Button href={siteConfig.messengerUrl} variant="outline">
                  <MessengerIcon className="h-4 w-4" />
                  Nhắn Messenger
                </Button>
              </div>
            </div>
          )}

          {specs.length > 0 && (
            <dl className="mt-8 space-y-2 rounded-2xl border border-border bg-paper-soft p-5 text-sm">
              {specs.map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4">
                  <dt className="text-muted">{key}</dt>
                  <dd className="text-right font-medium text-ink">{String(value)}</dd>
                </div>
              ))}
              {product.year && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Năm sản xuất</dt>
                  <dd className="text-right font-medium text-ink">{product.year}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      </div>

      {product.description && (
        <div className="mt-12 max-w-3xl">
          <h2 className="text-lg font-semibold text-ink">Mô tả chi tiết</h2>
          <p className="mt-3 whitespace-pre-line text-ink-soft">{product.description}</p>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16">
          <SectionHeading eyebrow="Có thể bạn quan tâm" title="Sản phẩm liên quan" />
          <div className="mt-6">
            <ProductGrid products={related} emptyMessage="" />
          </div>
        </div>
      )}
    </Container>
  );
}
