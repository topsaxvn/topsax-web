import type { ImageLoaderProps } from "next/image";

// Loader tuỳ chỉnh cho next/image: chèn transform (f_auto,q_auto,w_) thẳng
// vào URL Cloudinary thay vì để Next.js tải ảnh về xử lý lại lần 2 qua
// /_next/image - Cloudinary đã tự resize/nén ở edge CDN của họ rồi.
export function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const marker = "/upload/";
  const idx = src.indexOf(marker);
  if (idx === -1) return src;

  const transforms = `f_auto,q_${quality ?? "auto"},w_${width}`;
  return `${src.slice(0, idx + marker.length)}${transforms}/${src.slice(idx + marker.length)}`;
}
