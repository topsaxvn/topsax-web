"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { productImagesApi } from "@/lib/admin-api/product-images";
import { triggerRevalidate } from "@/lib/admin-api/revalidate";
import { useImageUpload } from "@/lib/utils/useImageUpload";
import type { ProductImageRow } from "@/data-access/products";

export function ProductImageManager({
  productId,
  slug,
  images,
}: {
  productId: string;
  slug: string;
  images: ProductImageRow[];
}) {
  const [items, setItems] = useState(images);
  const [error, setError] = useState<string | null>(null);
  const { uploadFiles, uploading, error: uploadError } = useImageUpload("saxophone/products");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setError(null);
    const results = await uploadFiles(Array.from(files));
    for (const result of results) {
      try {
        await productImagesApi.attach(productId, { url: result.url, publicId: result.publicId, altText: null });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Không thể lưu ảnh vào cơ sở dữ liệu.");
      }
    }
    if (results.length > 0) {
      setItems(await productImagesApi.list(productId));
      triggerRevalidate({ resource: "product", slug });
    }
  }

  async function handleDelete(image: ProductImageRow) {
    if (!confirm("Xoá ảnh này?")) return;
    setItems((prev) => prev.filter((i) => i.id !== image.id));
    await productImagesApi.remove(image.id, image.public_id, productId);
    triggerRevalidate({ resource: "product", slug });
  }

  async function handleSetThumbnail(image: ProductImageRow) {
    setItems((prev) => prev.map((i) => ({ ...i, is_thumbnail: i.id === image.id })));
    await productImagesApi.setThumbnail(productId, image.id);
    triggerRevalidate({ resource: "product", slug });
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    await productImagesApi.reorder(next.map((i) => i.id));
    triggerRevalidate({ resource: "product", slug });
  }

  return (
    <div className="rounded-2xl border border-border bg-paper p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Hình ảnh sản phẩm</h2>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) void handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-border px-3.5 py-2 text-sm text-ink-soft hover:text-ink disabled:opacity-60"
          >
            {uploading ? "Đang upload..." : "+ Thêm ảnh"}
          </button>
        </div>
      </div>

      <p className="mt-1 text-xs text-muted">Tối đa 15MB/ảnh.</p>
      {(error || uploadError) && <p className="mt-2 text-xs text-red-600">{error ?? uploadError}</p>}

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Chưa có ảnh nào.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((image, index) => (
            <div key={image.id} className="relative rounded-xl border border-border p-2">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-paper-soft">
                <Image src={image.url} alt={image.alt_text ?? ""} fill sizes="200px" className="object-cover" />
                {image.is_thumbnail && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-brass px-2 py-0.5 text-[10px] font-semibold text-ink">
                    Thumbnail
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-xs">
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="rounded border border-border px-1.5 py-0.5 text-ink-soft hover:text-ink disabled:opacity-30"
                    aria-label="Di chuyển lên"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === items.length - 1}
                    onClick={() => move(index, 1)}
                    className="rounded border border-border px-1.5 py-0.5 text-ink-soft hover:text-ink disabled:opacity-30"
                    aria-label="Di chuyển xuống"
                  >
                    ↓
                  </button>
                </div>
                <div className="flex gap-2">
                  {!image.is_thumbnail && (
                    <button
                      type="button"
                      onClick={() => handleSetThumbnail(image)}
                      className="text-brass-deep hover:underline"
                    >
                      Đặt thumbnail
                    </button>
                  )}
                  <button type="button" onClick={() => handleDelete(image)} className="text-red-600 hover:underline">
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
