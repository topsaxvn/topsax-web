"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getUploadSignature } from "@/app/admin/(protected)/upload-actions";
import { uploadToCloudinary } from "@/lib/utils/cloudinary-client";
import {
  attachProductImage,
  deleteProductImage,
  reorderProductImages,
  setThumbnailImage,
} from "@/app/admin/(protected)/products/actions";
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
  const router = useRouter();
  const [prevImages, setPrevImages] = useState(images);
  const [items, setItems] = useState(images);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (images !== prevImages) {
    setPrevImages(images);
    setItems(images);
  }

  async function handleFiles(files: FileList) {
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const signature = await getUploadSignature("saxophone/products");
        const result = await uploadToCloudinary(file, signature);
        await attachProductImage(productId, slug, { url: result.url, publicId: result.publicId, altText: null });
      }
      router.refresh();
    } catch {
      setError("Upload ảnh thất bại, vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(image: ProductImageRow) {
    if (!confirm("Xoá ảnh này?")) return;
    setItems((prev) => prev.filter((i) => i.id !== image.id));
    await deleteProductImage(image.id, image.public_id, productId, slug);
    router.refresh();
  }

  async function handleSetThumbnail(image: ProductImageRow) {
    setItems((prev) => prev.map((i) => ({ ...i, is_thumbnail: i.id === image.id })));
    await setThumbnailImage(productId, image.id, slug);
    router.refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    await reorderProductImages(next.map((i) => i.id), slug);
    router.refresh();
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

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

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
