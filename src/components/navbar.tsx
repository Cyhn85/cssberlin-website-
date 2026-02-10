"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ShoppingBag, PlusCircle, Search } from "lucide-react";

export function Navbar() {
    return (
        <nav className="w-full bg-white border-b sticky top-0 z-50">
            <div className="page-container h-20 flex items-center justify-between">
                {/* Sol: Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#1a3b28] rounded-xl flex items-center justify-center">
                        <ShoppingBag className="text-white w-6 h-6" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-[#1a3b28]">CSS BERLIN</span>
                </Link>

                {/* Sağ: Butonlar */}
                <div className="flex items-center gap-4">
                    <SignedOut>
                        <Link href="/sign-in" className="text-sm font-bold text-gray-600 hover:text-[#1a3b28]">
                            Einloggen
                        </Link>
                        <Link href="/sign-up" className="bg-[#1a3b28] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all">
                            Verkaufen
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <Link href="/sell" className="flex items-center gap-2 bg-[#1a3b28] text-white px-6 py-2.5 rounded-full font-bold text-sm">
                            <PlusCircle className="w-4 h-4" /> Verkaufen
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}