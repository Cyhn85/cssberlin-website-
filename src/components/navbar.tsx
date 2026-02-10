"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ShoppingBag, Search, User } from "lucide-react";

export function Navbar() {
    return (
        // SİYAH ARKA PLAN, BEYAZ METİN, KOMPAKT YÜKSEKLİK (py-4)
        <nav className="w-full bg-black text-white border-b border-white/10 sticky top-0 z-50 font-sans">
            <div className="page-container flex items-center justify-between py-4">

                {/* SOL: LOGO (Görseldeki gibi sadece beyaz metin) */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                    {/* İkonu kaldırdık, sadece görseldeki gibi güçlü yazı kaldı */}
                    <span className="font-black text-2xl tracking-tighter text-white">
                        CSS BERLIN
                    </span>
                </Link>

                {/* SAĞ: İKONLAR VE BUTONLAR (Backend Mantığı Korundu) */}
                <div className="flex items-center gap-6">
                    {/* Arama İkonu (Görseldeki gibi) */}
                    <button className="text-white hover:text-gray-300 transition-colors">
                        <Search className="w-5 h-5" />
                    </button>

                    {/* Backend Mantığı: Giriş Yapmamışsa */}
                    <SignedOut>
                        <Link href="/sign-in" className="text-sm font-bold text-white hover:text-gray-300 flex items-center gap-2">
                            <User className="w-5 h-5" /> {/* Giriş ikonu */}
                            <span className="hidden md:inline">Einloggen</span>
                        </Link>
                        {/* Satış Butonu: Kontrast için beyaz zemin, siyah yazı */}
                        <Link href="/sign-up" className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-all">
                            Verkaufen
                        </Link>
                    </SignedOut>

                    {/* Backend Mantığı: Giriş Yapmışsa */}
                    <SignedIn>
                        <Link href="/cart" className="text-white hover:text-gray-300 transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                        </Link>
                        {/* Clerk UserButton - Beyaz temaya uygun */}
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    userButtonTrigger: "focus:shadow-none focus:ring-0"
                                }
                            }}
                        />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}