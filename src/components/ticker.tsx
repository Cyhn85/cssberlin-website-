"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const announcements = [
    { text: "🚀 PREISVORSCHLAG SENDEN & SPAREN", link: "/catalog" },
    { text: "🚚 KOSTENLOSER VERSAND AB 50€", link: "/hilfe-center" },
    { text: "🛡️ SICHER BEZAHLEN MIT KÄUFERSCHUTZ", link: "/agb" },
    { text: "🌱 CLIMATE SMART SOLUTIONS – NACHHALTIG SHOPPEN", link: "/nachhaltigkeit" },
];

export function Ticker() {
    return (
        <div className="w-full bg-css-orange text-white py-2 overflow-hidden whitespace-nowrap border-b border-black/5">
            <div className="flex animate-marquee hover:pause-animation">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex">
                        {announcements.map((item, idx) => (
                            <Link
                                key={`${i}-${idx}`}
                                href={item.link}
                                className="inline-block px-12 text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-white/80 transition-colors"
                            >
                                {item.text}
                            </Link>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
