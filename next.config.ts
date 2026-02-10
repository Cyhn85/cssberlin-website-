import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Resim optimizasyonu için (UploadThing ve Clerk resimleri)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "utfs.io" },
    ],
  },
  // TypeScript ve ESLint hatalarını build sırasında yoksay (Hız kazandırır)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Deneysel özellikler (Gerekirse açılır, şu an kapalı kalsın)
};

export default nextConfig;