"use client";

import type { ImageLoaderProps } from "next/image";

// Loader tuỳ chỉnh cho next/image (cấu hình global qua next.config.ts
// images.loaderFile) - chèn transform (f_auto,q_auto,w_) thẳng vào URL
// Cloudinary thay vì để Next.js tải ảnh về xử lý lại lần 2 qua /_next/image.
// Phải export default và đánh dấu "use client" theo đúng yêu cầu của
// loaderFile (next/image gọi hàm này cả ở client để tính responsive srcset).
// Không thể truyền qua prop `loader` trên từng <Image> vì đó là truyền hàm
// từ Server Component sang Client Component - React không cho phép
// serialize hàm qua ranh giới đó (lỗi "Functions cannot be passed directly
// to Client Components").
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const marker = "/upload/";
  const idx = src.indexOf(marker);
  if (idx === -1) return src;

  const transforms = `f_auto,q_${quality ?? "auto"},w_${width}`;
  return `${src.slice(0, idx + marker.length)}${transforms}/${src.slice(idx + marker.length)}`;
}
