import type { ImageLoaderProps } from "next/image";

// Loader tuỳ chỉnh cho next/image: chèn transform (f_auto,q_auto,w_) thẳng
// vào URL Cloudinary thay vì để Next.js tải ảnh về xử lý lại lần 2 qua
// /_next/image - Cloudinary đã tự resize/nén ở edge CDN của họ rồi.
//
// Khai báo qua next.config.ts (images.loaderFile) thay vì truyền prop
// `loader={cloudinaryLoader}` ở từng <Image> - truyền function trực tiếp
// từ Server Component cho next/image (một Client Component) có thể vỡ khi
// Next serialize RSC payload cho một số route cụ thể.
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const marker = "/upload/";
  const idx = src.indexOf(marker);
  if (idx === -1) {
    // Ảnh local (vd. public/) - không qua Cloudinary. Khi images.loader
    // là "custom", Next.js tắt hẳn optimizer /_next/image mặc định, nên
    // ảnh local phải được resize/nén sẵn trước khi đưa vào public/ và
    // trả nguyên src ở đây (không có bước resize động).
    return src;
  }

  const transforms = `f_auto,q_${quality ?? "auto"},w_${width}`;
  return `${src.slice(0, idx + marker.length)}${transforms}/${src.slice(idx + marker.length)}`;
}
