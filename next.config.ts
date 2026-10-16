import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Dùng loader tuỳ chỉnh cho toàn bộ next/image thay vì loader mặc định
    // của Next - Cloudinary tự resize/nén ảnh ở CDN của họ nên không cần
    // Next tải về xử lý lại lần 2. remotePatterns không còn cần thiết vì
    // loader custom bỏ qua hẳn cơ chế fetch/optimize mặc định của Next.
    loader: "custom",
    loaderFile: "./src/lib/utils/cloudinary-loader.ts",
  },
  // Domain mặc định của hosting (topsaxvn.vercel.app, deploy preview,
  // *.netlify.app) phục vụ y hệt nội dung domain chính - chặn index ở cấp
  // header để Google không coi là bản trùng lặp. Không dùng redirect vì sẽ
  // làm mất khả năng xem deploy preview.
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: ".+\\.(?:vercel|netlify)\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
