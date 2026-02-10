import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

// Geliştirme ortamı için Cloudflare platform ayarı
if (process.env.NODE_ENV === "development") {
  setupDevPlatform();
}

const nextConfig: NextConfig = {
  // Cloudflare Pages için optimize edilmiş resim ayarları
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "utfs.io" },
    ],
    unoptimized: true, // Cloudflare ücretsiz planda resim optimizasyonu bazen sorun olabilir
  },
  // TypeScript ve ESLint hatalarını build sırasında yoksay
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;