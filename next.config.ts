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
};

export default nextConfig;
