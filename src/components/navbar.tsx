"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Search, Heart, Menu, X, ChevronDown, ShoppingBag, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { NotificationsPopover } from "@/components/notifications-popover";
import { MessageBadge } from "@/components/message-badge";

// Categories for mega menu (German)
const categories = {
    women: {
        title: "Damen",
        subcategories: [
            { name: "Kleidung", href: "/catalog/women/clothing" },
            { name: "Schuhe", href: "/catalog/women/shoes" },
            { name: "Taschen", href: "/catalog/women/bags" },
            { name: "Accessoires", href: "/catalog/women/accessories" },
            { name: "Schmuck", href: "/catalog/women/jewelry" },
        ],
    },
    men: {
        title: "Herren",
        subcategories: [
            { name: "Kleidung", href: "/catalog/men/clothing" },
            { name: "Schuhe", href: "/catalog/men/shoes" },
            { name: "Taschen", href: "/catalog/men/bags" },
            { name: "Accessoires", href: "/catalog/men/accessories" },
        ],
    },
    kids: {
        title: "Kinder",
        subcategories: [
            { name: "Mädchen", href: "/catalog/kids/girls" },
            { name: "Jungen", href: "/catalog/kids/boys" },
            { name: "Baby", href: "/catalog/kids/baby" },
        ],
    },
    home: {
        title: "Wohnen",
        subcategories: [
            { name: "Dekoration", href: "/catalog/home/decor" },
            { name: "Textilien", href: "/catalog/home/textiles" },
            { name: "Küche", href: "/catalog/home/kitchen" },
        ],
    },
};

import { syncUser } from "@/lib/auth-sync";
import { useUser } from "@clerk/nextjs";

export function Navbar() {
    const { isSignedIn, user } = useUser();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const catalogRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsCatalogOpen(false);
    }, [pathname]);

    // Sync user to DB when signed in
    useEffect(() => {
        if (isSignedIn && user) {
            // Server action'ı client component'ten çağırmak için
            // Ancak syncUser server-side bir fonksiyon, burada direkt çağıramayız.
            // Bu yüzden bir server action wrapper'ına veya useEffect içinde fetch/transition kullanımına ihtiyacımız var.
            // Veya daha iyisi: Navbar server component olmalıydı ama 'use client' var.
            // Çözüm: syncUser'ı bir server action olarak işaretleyip buradan çağırabiliriz.
            const sync = async () => {
                try {
                    await syncUser();
                } catch (err) {
                    console.error("Sync failed", err);
                }
            };
            sync();
        }
    }, [isSignedIn, user]);

    // Close catalog on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (catalogRef.current && !catalogRef.current.contains(event.target as Node)) {
                setIsCatalogOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <div className="sticky top-0 z-50 flex flex-col w-full shadow-md">
            {/* Top Marquee */}
            <div className="bg-[#2c5e42] text-white text-xs py-1.5 overflow-hidden whitespace-nowrap relative">
                <div className="animate-marquee inline-flex gap-12 min-w-full justify-center items-center font-medium tracking-wide">
                    <span className="flex items-center gap-2"><Truck className="w-3 h-3" /> Kostenloser Versand ab 50€</span>
                    <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> 100% Käuferschutz</span>
                    <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3" /> Nachhaltig shoppen</span>
                    <span className="flex items-center gap-2"><Truck className="w-3 h-3" /> Kostenloser Versand ab 50€</span>
                </div>
            </div>

            {/* Main Header */}
            <header className="bg-[var(--css-green)] h-16 w-full transition-all duration-300">
                <div className="container h-full mx-auto px-4 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity shrink-0">
                        <ShoppingBag className="h-7 w-7" />
                        <span className="font-bold text-xl tracking-tight hidden sm:inline">CSS Berlin</span>
                        <span className="font-bold text-xl tracking-tight sm:hidden">CSS</span>
                    </Link>

                    {/* Catalog Dropdown - Desktop */}
                    <div className="hidden lg:block relative" ref={catalogRef}>
                        <button
                            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white/90 text-sm font-medium transition-all ${isCatalogOpen ? "bg-white/20" : "hover:bg-white/10"}`}
                        >
                            Katalog
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCatalogOpen ? "rotate-180" : ""}`} />
                        </button>

                        {/* Mega Menu */}
                        {isCatalogOpen && (
                            <div className="absolute top-full left-0 mt-3 w-[800px] bg-white rounded-xl shadow-xl border border-gray-100 p-8 grid grid-cols-4 gap-8 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                {Object.entries(categories).map(([key, category]) => (
                                    <div key={key}>
                                        <Link href={`/catalog/${key}`} className="block font-bold text-gray-900 mb-4 text-base hover:text-[var(--css-green)] border-b pb-1 border-gray-100">
                                            {category.title}
                                        </Link>
                                        <ul className="space-y-2.5">
                                            {category.subcategories.map((sub) => (
                                                <li key={sub.href}>
                                                    <Link
                                                        href={sub.href}
                                                        className="text-sm text-gray-500 hover:text-[var(--css-green)] transition-colors block"
                                                        onClick={() => setIsCatalogOpen(false)}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden md:block group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60 group-focus-within:text-[var(--css-green)] transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="Suchen nach Artikeln, Mitgliedern oder Marken..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/20 border border-transparent text-white placeholder:text-white/60 text-sm focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-400 focus:outline-none transition-all duration-200"
                        />
                    </form>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-3 text-white">
                        <SignedIn>
                            <MessageBadge />

                            <NotificationsPopover />

                            <Link href="/favorites" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <Heart className="h-5 w-5" />
                            </Link>

                            <div className="ml-1 pl-2 border-l border-white/20">
                                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8 ring-2 ring-white/20 hover:ring-white/40 transition-all" } }} />
                            </div>

                            <Link href="/sell" className="ml-3 btn-primary text-sm px-5 py-2 whitespace-nowrap shadow-lg shadow-orange-900/20 hover:-translate-y-0.5 transition-transform hidden sm:flex">
                                Jetzt verkaufen
                            </Link>
                        </SignedIn>

                        <SignedOut>
                            <div className="flex items-center gap-2">
                                <SignInButton mode="modal">
                                    <button className="text-sm font-medium hover:text-white/80 px-3 py-2 transition-colors">Anmelden</button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="btn-secondary text-xs sm:text-sm px-4 py-2 border-white text-[var(--css-green)] hover:bg-gray-100 hidden sm:block">
                                        Registrieren
                                    </button>
                                </SignUpButton>
                                <Link href="/sell" className="btn-primary text-sm px-4 py-2 whitespace-nowrap ml-2 hidden sm:flex">
                                    Verkaufen
                                </Link>
                            </div>
                        </SignedOut>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 ml-1 hover:bg-white/10 rounded-full md:hidden"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-[#153020] text-white border-t border-white/10 absolute top-full left-0 w-full shadow-xl animate-in slide-in-from-top-5 z-40">
                        <div className="p-4 space-y-4">
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Suchen..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-10 pl-9 pr-4 rounded-lg bg-white text-gray-900 text-sm focus:outline-none"
                                />
                            </form>

                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(categories).map(([key, category]) => (
                                    <Link
                                        key={key}
                                        href={`/catalog/${key}`}
                                        className="block p-3 bg-white/5 rounded-lg text-center text-sm font-medium hover:bg-white/10 transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {category.title}
                                    </Link>
                                ))}
                            </div>

                            <SignedOut>
                                <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                                    <SignInButton mode="modal">
                                        <button className="w-full py-2.5 bg-white/10 rounded-lg font-medium hover:bg-white/20 transition-colors">
                                            Anmelden
                                        </button>
                                    </SignInButton>
                                    <SignUpButton mode="modal">
                                        <button className="w-full py-2.5 bg-white text-[var(--css-green)] rounded-lg font-bold hover:bg-gray-100 transition-colors">
                                            Jetzt registrieren
                                        </button>
                                    </SignUpButton>
                                </div>
                            </SignedOut>
                        </div>
                    </div>
                )}
            </header>
        </div>
    );
}
