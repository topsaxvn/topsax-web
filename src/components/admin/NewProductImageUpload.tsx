"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { getUploadSignature, destroyUnattachedImage } from "@/app/admin/(protected)/upload-actions";
import { uploadToCloudinary } from "@/lib/utils/cloudinary-client";
import { FormSection } from "@/components/admin/form-fields";

export type PendingImage = { url: string; publicId: string };

// Upload ảnh trực tiếp khi đang tạo sản phẩm mới (chưa có product id) - ảnh
// lên thẳng Cloudinary, danh sách được giữ ở state và gửi kèm form qua input
// ẩn "pending_images". Server action sẽ gắn ảnh vào sản phẩm sau khi tạo xong.
export function NewProductImageUpload() {
  const [images, setImages] = useState<PendingImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const signature = await getUploadSignature("saxophone/products");
        const result = await uploadToCloudinary(file, signature);
        setImages((prev) => [...prev, { url: result.url, publicId: result.publicId }]);
      }
    } catch {
      setError("Upload ảnh thất bại, vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  }

  function handleDelete(index: number) {
    const image = images[index];
    setImages((prev) => prev.filter((_, i) => i !== index));
    destroyUnattachedImage(image.publicId).catch(() => {
      // Ảnh đã bị bỏ khỏi form; lỗi xoá trên Cloudinary không cần chặn thao tác.
    });
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    setImages((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function setThumbnail(index: number) {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
  }

  return (
    <FormSection title="Hình ảnh sản phẩm">
      <input type="hidden" name="pending_images" value={JSON.stringify(images)} readOnly />

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">Ảnh đầu tiên sẽ là ảnh thumbnail.</p>
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

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div key={image.publicId} className="relative rounded-xl border border-border p-2">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-paper-soft">
                <Image src={image.url} alt="" fill sizes="200px" className="object-cover" />
                {index === 0 && (
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
                    disabled={index === images.length - 1}
                    onClick={() => move(index, 1)}
                    className="rounded border border-border px-1.5 py-0.5 text-ink-soft hover:text-ink disabled:opacity-30"
                    aria-label="Di chuyển xuống"
                  >
                    ↓
                  </button>
                </div>
                <div className="flex gap-2">
                  {index !== 0 && (
                    <button type="button" onClick={() => setThumbnail(index)} className="text-brass-deep hover:underline">
                      Đặt thumbnail
                    </button>
                  )}
                  <button type="button" onClick={() => handleDelete(index)} className="text-red-600 hover:underline">
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </FormSection>
  );
}
