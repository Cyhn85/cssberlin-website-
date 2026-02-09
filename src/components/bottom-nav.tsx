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
        { href: "/", icon: Home, label: "Ana Sayfa" },
        { href: "/search", icon: Search, label: "Ara" },
        { href: "/sell", icon: PlusCircle, label: "Sat" },
        { href: "/inbox", icon: MessageSquare, label: "Mesajlar" },
        { href: "/profile", icon: User, label: "Profil" },
    ];

    return (
        <nav className="bottom-nav" aria-label="Mobile Navigation">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`bottom-nav-item ${active ? "active" : ""}`}
                            aria-current={active ? "page" : undefined}
                        >
                            {item.href === "/sell" ? (
                                <div className="w-12 h-12 -mt-6 bg-[#2E9E5C] rounded-full flex items-center justify-center shadow-lg">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            ) : (
                                <>
                                    <Icon className={`w-6 h-6 ${active ? "text-[#2E9E5C]" : ""}`} />
                                    <span className="text-[10px] mt-1">{item.label}</span>
                                </>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
