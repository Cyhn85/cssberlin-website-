import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/navbar";
import { Ticker } from "@/components/ticker";
import { Footer } from "@/components/footer";
import { BottomNav } from "@/components/bottom-nav";
import { CartProvider } from "@/lib/cart";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["700", "800", "900"] });

export const metadata: Metadata = {
  title: "CSS Berlin | Sustainable Vintage Fashion",
  description: "Sustainability meets Berlin style in Spandau.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#0f7b3f", colorText: "#1a1a1a", borderRadius: "0.75rem" },
        elements: {
          formButtonPrimary: "bg-[#e05e00] hover:bg-[#0f7b3f] text-white font-bold",
          card: "shadow-xl border border-gray-100",
        },
      }}
    >
      <html lang="de" className={`${inter.variable} ${montserrat.variable}`}>
        <body className="min-h-screen flex flex-col font-sans antialiased">
          <CartProvider>
            <Ticker />
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <BottomNav />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}