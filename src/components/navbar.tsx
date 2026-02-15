"use client";

import Link from "next/link";
import React, { useState, FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import {
    ShoppingBag,
    Search,
    User,
    Heart,
    LayoutGrid,
    Menu,
    Package,
    Wallet,
    Settings,
    HelpCircle,
    CreditCard,
    MapPin,
    X,
    Globe,
} from "lucide-react";
import { NotificationsPopover } from "@/components/notifications-popover";
import { MessageBadge } from "@/components/message-badge";
import { MegaMenu } from "@/components/mega-menu";
import { useCart } from "@/lib/cart";

const dashboardMenuItems = [
    { icon: Package, label: "Meine Bestellungen", href: "/profile/orders" },
    { icon: ShoppingBag, label: "Meine Verkäufe", href: "/profile/sales" },
    { icon: Heart, label: "Favoriten", href: "/favorites" },
    { icon: Wallet, label: "Geldbörse", href: "/wallet" },
    { icon: CreditCard, label: "Zahlungsmethoden", href: "/settings" },
    { icon: MapPin, label: "Adressen", href: "/settings" },
    { icon: Settings, label: "Einstellungen", href: "/settings" },
    { icon: HelpCircle, label: "Hilfe", href: "/hilfe-center" },
];

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { itemCount } = useCart();

    const isActive = (path: string) => pathname === path;

    const handleSearch = (e?: FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="w-full sticky top-0 z-50 shadow-lg">
            {/* TOP ROW: Logo & Icons */}
            <div className="animate-header-bg text-white py-3 md:py-4">
                <div className="page-container flex items-center justify-between gap-4 md:gap-8">
                    <Link href="/" className="hover:opacity-90 transition-opacity flex items-baseline group flex-shrink-0">
                        <span className="font-[var(--font-display)] font-black text-3xl md:text-4xl tracking-tight text-css-orange leading-none uppercase italic drop-shadow-[0_2px_4px_rgba(224,94,0,0.3)]">
                            CSS
                        </span>
                        <span className="font-[var(--font-display)] font-black text-3xl md:text-4xl tracking-tight text-white leading-none uppercase italic -ml-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                            berlin
                        </span>
                    </Link>

                    {/* SEARCH BAR (Center) */}
                    <div className="flex-1 flex justify-center hidden lg:flex">
                        <form onSubmit={handleSearch} className="relative group w-full max-w-lg flex items-center">
                            <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-2 rounded-l-sm text-white/70">
                                <Globe className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-black tracking-widest uppercase">DE</span>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="CLIMATE SMART SOLUTIONS — WAS SUCHST DU HEUTE?"
                                className="w-full bg-white text-gray-800 px-4 py-2.5 rounded-r-sm font-bold text-[10px] tracking-widest placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-css-orange transition-all uppercase pr-9"
                            />
                            <button
                                type="submit"
                                title="Suchen"
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-css-orange transition-colors"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* ACTION ICONS (Right) */}
                    <div className="flex items-center gap-3 md:gap-5">
                        <div className="hidden lg:flex items-center gap-4 mr-2">
                            <NotificationsPopover />
                            <Link href="/catalog" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <LayoutGrid className="w-5 h-5" />
                            </Link>
                            <MessageBadge />
                            <Link href="/favorites" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <Heart className="w-5 h-5" />
                            </Link>
                        </div>

                        <Link href="/cart" className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
                            <ShoppingBag className="w-6 h-6" />
                            {itemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-css-orange text-berlin-green text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-current animate-in zoom-in duration-200">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Anmelden Button - Top Row (SignedOut) */}
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button type="button" className="whitespace-nowrap bg-css-orange text-berlin-green text-[10px] md:text-xs font-black px-6 py-2.5 rounded-full transition-all uppercase tracking-widest hover:bg-berlin-green hover:text-white hover:-translate-y-0.5 active:translate-y-0 shadow-lg">
                                    Anmelden
                                </button>
                            </SignInButton>
                        </SignedOut>

                        <div className="flex items-center ml-2 gap-3 relative">
                            <SignedIn>
                                <div className="flex items-center gap-3 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="p-1 hover:text-css-orange transition-colors"
                                    >
                                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                    </button>
                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: {
                                                avatarBox: "w-11 h-11 border-[3px] border-css-orange shadow-lg"
                                            }
                                        }}
                                    />
                                </div>

                                {/* Dashboard Dropdown */}
                                {isMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                                            <div className="p-4 bg-gradient-to-r from-berlin-green to-berlin-green/90 text-white">
                                                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Mein Konto</p>
                                                <p className="text-sm font-black mt-1">Dashboard</p>
                                            </div>
                                            <div className="py-2">
                                                {dashboardMenuItems.map((item) => {
                                                    const Icon = item.icon;
                                                    return (
                                                        <Link
                                                            key={item.label}
                                                            href={item.href}
                                                            onClick={() => setIsMenuOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-css-orange/10 flex items-center justify-center transition-colors">
                                                                <Icon className="w-4 h-4 text-gray-500 group-hover:text-css-orange transition-colors" />
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-700 group-hover:text-berlin-green transition-colors">
                                                                {item.label}
                                                            </span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                            <div className="border-t border-gray-100 p-3">
                                                <Link
                                                    href="/profile"
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="block w-full text-center py-2.5 bg-css-orange text-berlin-green rounded-lg font-black text-xs uppercase tracking-widest hover:bg-berlin-green hover:text-white transition-colors duration-300"
                                                >
                                                    Profil Ansehen
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </SignedIn>
                        </div>
                    </div>
                </div>
            </div>


            {/* BOTTOM SECTION: Mega Menu with Categories */}
            <MegaMenu />
        </nav>
    );
}
