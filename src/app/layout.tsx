import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BottomNav } from "@/components/bottom-nav";
import { CookieBanner } from "@/components/cookie-banner";

// ❌ "export const runtime = 'edge';" SATIRI SİLİNDİ!
// Artık Cloudflare panelinden "nodejs_compat" ile yöneteceğiz.

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "CSS Berlin - İkinci El Moda Pazarı",
    template: "%s | CSS Berlin",
  },
  description:
    "Berlin'in ikinci el moda pazarı. Sürdürülebilir alışveriş, satış ve pazarlık. Kadın, erkek ve çocuk giyim, ayakkabı, aksesuar.",
  keywords: [
    "ikinci el",
    "second hand",
    "vintage",
    "berlin",
    "moda",
    "giyim",
    "ayakkabı",
    "sürdürülebilir",
    "css berlin",
  ],
  authors: [{ name: "CSS Berlin" }],
  creator: "CSS Berlin",
  publisher: "CSS Berlin",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "de_DE",
    alternateLocale: ["tr_TR", "en_US"],
    url: "https://www.cssberlin.de",
    siteName: "CSS Berlin",
    title: "CSS Berlin - İkinci El Moda Pazarı",
    description: "Berlin'in ikinci el moda pazarı. Sürdürülebilir alışveriş.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSS Berlin",
    description: "Berlin'in ikinci el moda pazarı.",
  },
  other: {
    "geo.region": "DE-BE",
    "geo.placename": "Berlin, Spandau",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#2E9E5C",
          colorTextOnPrimaryBackground: "#ffffff",
          borderRadius: "0.625rem",
        },
        elements: {
          card: "shadow-xl",
          formButtonPrimary:
            "bg-[#2E9E5C] hover:bg-[#258A4F] text-white",
          footerActionLink: "text-[#2E9E5C] hover:text-[#258A4F]",
        },
      }}
    >
      <html lang="de" className={inter.variable}>
        <head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="theme-color" content="#2E9E5C" />
        </head>
        <body className={`${inter.className} antialiased`}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 page-container">{children}</main>
            <Footer />
            <BottomNav />
            <CookieBanner />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}