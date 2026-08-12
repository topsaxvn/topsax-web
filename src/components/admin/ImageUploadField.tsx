"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { getUploadSignature } from "@/app/admin/(protected)/upload-actions";
import { uploadToCloudinary } from "@/lib/utils/cloudinary-client";

export function ImageUploadField({
  name,
  label,
  folder,
  defaultValue,
}: {
  name: string;
  label: string;
  folder: "saxophone/products" | "saxophone/blog";
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const signature = await getUploadSignature(folder);
      const result = await uploadToCloudinary(file, signature);
      setUrl(result.url);
    } catch {
      setError("Upload ảnh thất bại, vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <span className="text-sm font-medium text-ink">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className="mt-1.5 flex items-center gap-4">
        {url ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-paper-soft">
            <Image src={url} alt="" fill sizes="80px" className="object-cover" />
          </div>
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted">
            Chưa có ảnh
          </div>
        )}
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-border px-3.5 py-2 text-sm text-ink-soft hover:text-ink disabled:opacity-60"
          >
            {uploading ? "Đang upload..." : url ? "Đổi ảnh" : "Chọn ảnh"}
          </button>
          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="ml-2 text-sm text-red-600 hover:underline"
            >
              Xoá
            </button>
          )}
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
