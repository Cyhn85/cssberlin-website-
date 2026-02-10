"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, MessageSquare, User } from "lucide-react";

// Pages where bottom nav should be hidden
const hiddenOnPages = ["/checkout", "/payment", "/sell"];

export function BottomNav() {
    const pathname = usePathname();

    // Hide on certain pages
    if (hiddenOnPages.some((page) => pathname.startsWith(page))) {
        return null;
    }

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };

    const navItems = [
        { href: "/", icon: Home, label: "Startseite" },
        { href: "/catalog", icon: Search, label: "Suche" },
        { href: "/sell", icon: PlusCircle, label: "Verkaufen" },
        { href: "/inbox", icon: MessageSquare, label: "Nachrichten" },
        { href: "/profile", icon: User, label: "Profil" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50 px-4" aria-label="Mobile Navigation">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center transition-colors ${active ? "text-[#1a3b28]" : "text-gray-400 hover:text-gray-600"}`}
                            aria-current={active ? "page" : undefined}
                        >
                            {item.href === "/sell" ? (
                                <div className="w-12 h-12 -mt-8 bg-[#1a3b28] rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-transform hover:scale-105 active:scale-95">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            ) : (
                                <>
                                    <Icon className={`w-5 h-5 ${active ? "text-[#1a3b28]" : ""}`} />
                                    <span className={`text-[10px] mt-1 font-medium ${active ? "text-[#1a3b28]" : ""}`}>{item.label}</span>
                                </>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
