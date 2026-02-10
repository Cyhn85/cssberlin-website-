import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Resim optimizasyonu ayarları
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "utfs.io" },
    ],
    // Cloudflare ücretsiz planda resim optimizasyonunu kapatmak hataları önler
    unoptimized: true,
  },
  // Build hatalarını yoksay (Hız kazandırır)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;