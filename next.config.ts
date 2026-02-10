import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Resim ayarları
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "utfs.io" },
    ],
    unoptimized: true,
  },
  // Hata yoksayma ayarları
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 👇 İŞTE HATAYI ÇÖZEN SİHİRLİ AYAR 👇
  webpack: (config, { isServer }) => {
    if (isServer) {
      // ws paketini dışlıyoruz ki Cloudflare'in global WebSocket'i ile çakışmasın
      config.externals.push('ws');
    }
    return config;
  },
};

export default nextConfig;