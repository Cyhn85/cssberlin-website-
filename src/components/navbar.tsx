"use client";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Search, Heart, ShoppingBag, Truck } from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
            {/* Top Info Bar */}
            <div className="bg-[#1a3b28] text-white text-[10px] py-1 text-center font-medium uppercase tracking-widest">
                Kostenloser Versand in ganz Berlin ab 50€
            </div>

            <header className="page-container h-20 flex items-center justify-between gap-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <div className="bg-[#1a3b28] p-1.5 rounded-lg text-white">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-[#1a3b28]">CSS BERLIN</span>
                </Link>

                {/* Modern Search */}
                <div className="flex-1 max-w-2xl relative hidden md:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Marke, Stil veya Ürün ara..."
                        className="w-full bg-gray-50 border-none rounded-full py-3 pl-12 pr-4 text-sm focus:ring-2 ring-[#1a3b28]/10 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-5">
                    <SignedIn>
                        <Link href="/favorites" className="text-gray-600 hover:text-[#1a3b28] transition-colors">
                            <Heart className="w-6 h-6" />
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                        <Link href="/sell" className="btn-primary hidden lg:flex">
                            Jetzt verkaufen
                        </Link>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="text-sm font-bold text-[#1a3b28] hover:underline">Einloggen</button>
                        </SignInButton>
                        <Link href="/sell" className="btn-primary text-sm">Verkaufen</Link>
                    </SignedOut>
                </div>
            </header>
        </div>
    );
}