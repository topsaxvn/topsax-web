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
  // Màn hình học (app Tập Sax build tĩnh vào public/khoa-hoc/hoc, xem
  // src/lib/course.ts): thư mục public không tự phục vụ index.html.
  async rewrites() {
    return [{ source: "/khoa-hoc/hoc", destination: "/khoa-hoc/hoc/index.html" }];
  },
  async headers() {
    return [
      // Domain mặc định của hosting (topsaxvn.vercel.app, deploy preview,
      // *.netlify.app) phục vụ y hệt nội dung domain chính - chặn index ở cấp
      // header để Google không coi là bản trùng lặp. Không dùng redirect vì sẽ
      // làm mất khả năng xem deploy preview.
      {
        source: "/:path*",
        has: [{ type: "host", value: ".+\\.(?:vercel|netlify)\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      // Màn hình học: JS/CSS có hash trong tên -> giữ 1 năm. Âm mẫu và font
      // không có hash nhưng hầu như không đổi -> 30 ngày. index.html luôn hỏi
      // lại để bản build mới tới học viên ngay.
      {
        source: "/khoa-hoc/hoc/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/khoa-hoc/hoc/:dir(sax|inst|fonts)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
      {
        source: "/khoa-hoc/hoc",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
      {
        source: "/khoa-hoc/hoc/index.html",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
    ];
  },
};

export default nextConfig;
