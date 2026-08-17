import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    loader: "custom",
    loaderFile: "./src/lib/utils/cloudinary-loader.ts",
  },
};

export default nextConfig;
