"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ShoppingBag, Search, User, PlusCircle } from "lucide-react";

export function Navbar() {
    return (
        <nav className="w-full bg-black text-white border-b border-white/10 sticky top-0 z-50">
            <div className="page-container flex items-center justify-between py-3 md:py-4">

                {/* SOL: LOGO (Görseldeki gibi bembeyaz yazı) */}
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <span className="font-black text-xl md:text-2xl tracking-tighter text-white uppercase">
                        CSS BERLIN
                    </span>
                </Link>

                {/* SAĞ: İKONLAR VE BUTONLAR (Backend Mantığı Korundu) */}
                <div className="flex items-center gap-4 md:gap-6">
                    <button className="text-white hover:text-gray-400">
                        <Search className="w-5 h-5" />
                    </button>

                    <SignedOut>
                        <Link href="/sign-in" className="text-xs font-bold flex items-center gap-1">
                            <User className="w-4 h-4" /> Einloggen
                        </Link>
                        <Link href="/sign-up" className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs hover:bg-gray-200">
                            Verkaufen
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <Link href="/sell" className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-bold text-xs">
                            <PlusCircle className="w-4 h-4" /> Verkaufen
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}