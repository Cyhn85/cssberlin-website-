"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

type SubItem = {
    label: string;
    href: string;
};

type SubGroup = {
    title: string;
    items: SubItem[];
};

type Category = {
    key: string;
    label: string;
    groups: SubGroup[];
};

const categories: Category[] = [
    {
        key: "damen",
        label: "DAMEN",
        groups: [
            {
                title: "Kleidung",
                items: [
                    { label: "Kleider", href: "/catalog?category=damen&sub=kleider" },
                    { label: "Tops & T-Shirts", href: "/catalog?category=damen&sub=tops" },
                    { label: "Blusen & Hemden", href: "/catalog?category=damen&sub=blusen" },
                    { label: "Pullover & Strick", href: "/catalog?category=damen&sub=pullover" },
                    { label: "Hoodies & Sweatshirts", href: "/catalog?category=damen&sub=hoodies" },
                    { label: "Jacken & Mäntel", href: "/catalog?category=damen&sub=jacken" },
                    { label: "Blazer", href: "/catalog?category=damen&sub=blazer" },
                ],
            },
            {
                title: "Hosen & Röcke",
                items: [
                    { label: "Jeans", href: "/catalog?category=damen&sub=jeans" },
                    { label: "Stoffhosen", href: "/catalog?category=damen&sub=stoffhosen" },
                    { label: "Leggings", href: "/catalog?category=damen&sub=leggings" },
                    { label: "Shorts", href: "/catalog?category=damen&sub=shorts" },
                    { label: "Röcke", href: "/catalog?category=damen&sub=roecke" },
                ],
            },
            {
                title: "Schuhe & Taschen",
                items: [
                    { label: "Sneaker", href: "/catalog?category=damen&sub=sneaker" },
                    { label: "Stiefel & Boots", href: "/catalog?category=damen&sub=stiefel" },
                    { label: "Sandalen", href: "/catalog?category=damen&sub=sandalen" },
                    { label: "High Heels", href: "/catalog?category=damen&sub=heels" },
                    { label: "Flats & Ballerinas", href: "/catalog?category=damen&sub=flats" },
                    { label: "Handtaschen", href: "/catalog?category=damen&sub=handtaschen" },
                    { label: "Rucksäcke", href: "/catalog?category=damen&sub=rucksaecke" },
                ],
            },
            {
                title: "Accessoires",
                items: [
                    { label: "Schmuck", href: "/catalog?category=damen&sub=schmuck" },
                    { label: "Schals & Tücher", href: "/catalog?category=damen&sub=schals" },
                    { label: "Gürtel", href: "/catalog?category=damen&sub=guertel" },
                    { label: "Sonnenbrillen", href: "/catalog?category=damen&sub=sonnenbrillen" },
                    { label: "Hüte & Mützen", href: "/catalog?category=damen&sub=huete" },
                    { label: "Unterwäsche & Nachtwäsche", href: "/catalog?category=damen&sub=unterwaesche" },
                    { label: "Sportbekleidung", href: "/catalog?category=damen&sub=sport" },
                ],
            },
        ],
    },
    {
        key: "herren",
        label: "HERREN",
        groups: [
            {
                title: "Kleidung",
                items: [
                    { label: "T-Shirts", href: "/catalog?category=herren&sub=tshirts" },
                    { label: "Hemden", href: "/catalog?category=herren&sub=hemden" },
                    { label: "Poloshirts", href: "/catalog?category=herren&sub=poloshirts" },
                    { label: "Pullover & Strick", href: "/catalog?category=herren&sub=pullover" },
                    { label: "Hoodies & Sweatshirts", href: "/catalog?category=herren&sub=hoodies" },
                    { label: "Jacken & Mäntel", href: "/catalog?category=herren&sub=jacken" },
                    { label: "Anzüge & Sakkos", href: "/catalog?category=herren&sub=anzuege" },
                ],
            },
            {
                title: "Hosen",
                items: [
                    { label: "Jeans", href: "/catalog?category=herren&sub=jeans" },
                    { label: "Chinos", href: "/catalog?category=herren&sub=chinos" },
                    { label: "Jogginghosen", href: "/catalog?category=herren&sub=jogginghosen" },
                    { label: "Shorts", href: "/catalog?category=herren&sub=shorts" },
                    { label: "Cargohosen", href: "/catalog?category=herren&sub=cargo" },
                ],
            },
            {
                title: "Schuhe",
                items: [
                    { label: "Sneaker", href: "/catalog?category=herren&sub=sneaker" },
                    { label: "Boots & Stiefel", href: "/catalog?category=herren&sub=boots" },
                    { label: "Business-Schuhe", href: "/catalog?category=herren&sub=business" },
                    { label: "Sandalen", href: "/catalog?category=herren&sub=sandalen" },
                    { label: "Sportschuhe", href: "/catalog?category=herren&sub=sportschuhe" },
                ],
            },
            {
                title: "Accessoires",
                items: [
                    { label: "Uhren", href: "/catalog?category=herren&sub=uhren" },
                    { label: "Gürtel", href: "/catalog?category=herren&sub=guertel" },
                    { label: "Mützen & Caps", href: "/catalog?category=herren&sub=muetzen" },
                    { label: "Sonnenbrillen", href: "/catalog?category=herren&sub=sonnenbrillen" },
                    { label: "Krawatten", href: "/catalog?category=herren&sub=krawatten" },
                    { label: "Sportbekleidung", href: "/catalog?category=herren&sub=sport" },
                ],
            },
        ],
    },
    {
        key: "kinder",
        label: "KINDER",
        groups: [
            {
                title: "Mädchen",
                items: [
                    { label: "Kleider & Röcke", href: "/catalog?category=kinder&sub=maedchen-kleider" },
                    { label: "Tops & T-Shirts", href: "/catalog?category=kinder&sub=maedchen-tops" },
                    { label: "Hosen & Jeans", href: "/catalog?category=kinder&sub=maedchen-hosen" },
                    { label: "Jacken", href: "/catalog?category=kinder&sub=maedchen-jacken" },
                    { label: "Pullover", href: "/catalog?category=kinder&sub=maedchen-pullover" },
                ],
            },
            {
                title: "Jungen",
                items: [
                    { label: "T-Shirts & Hemden", href: "/catalog?category=kinder&sub=jungen-tshirts" },
                    { label: "Hosen & Jeans", href: "/catalog?category=kinder&sub=jungen-hosen" },
                    { label: "Jacken", href: "/catalog?category=kinder&sub=jungen-jacken" },
                    { label: "Hoodies & Pullover", href: "/catalog?category=kinder&sub=jungen-hoodies" },
                ],
            },
            {
                title: "Baby (0-24 Mon.)",
                items: [
                    { label: "Strampler & Bodies", href: "/catalog?category=kinder&sub=baby-strampler" },
                    { label: "Sets & Outfits", href: "/catalog?category=kinder&sub=baby-sets" },
                    { label: "Mützen & Socken", href: "/catalog?category=kinder&sub=baby-muetzen" },
                    { label: "Jacken & Overalls", href: "/catalog?category=kinder&sub=baby-jacken" },
                ],
            },
            {
                title: "Schuhe & Mehr",
                items: [
                    { label: "Sneaker", href: "/catalog?category=kinder&sub=sneaker" },
                    { label: "Sandalen", href: "/catalog?category=kinder&sub=sandalen" },
                    { label: "Winterschuhe", href: "/catalog?category=kinder&sub=winterschuhe" },
                    { label: "Spielzeug", href: "/catalog?category=kinder&sub=spielzeug" },
                    { label: "Schulbedarf", href: "/catalog?category=kinder&sub=schulbedarf" },
                ],
            },
        ],
    },
    {
        key: "elektronik",
        label: "ELEKTRONIK",
        groups: [
            {
                title: "Geräte",
                items: [
                    { label: "Smartphones", href: "/catalog?category=elektronik&sub=smartphones" },
                    { label: "Laptops", href: "/catalog?category=elektronik&sub=laptops" },
                    { label: "Tablets", href: "/catalog?category=elektronik&sub=tablets" },
                    { label: "Smartwatches", href: "/catalog?category=elektronik&sub=smartwatches" },
                ],
            },
            {
                title: "Audio & Gaming",
                items: [
                    { label: "Kopfhörer", href: "/catalog?category=elektronik&sub=kopfhoerer" },
                    { label: "Lautsprecher", href: "/catalog?category=elektronik&sub=lautsprecher" },
                    { label: "Konsolen", href: "/catalog?category=elektronik&sub=konsolen" },
                    { label: "Spiele", href: "/catalog?category=elektronik&sub=spiele" },
                ],
            },
            {
                title: "Zubehör",
                items: [
                    { label: "Handyhüllen", href: "/catalog?category=elektronik&sub=handyhuellen" },
                    { label: "Ladegeräte & Kabel", href: "/catalog?category=elektronik&sub=ladegeraete" },
                    { label: "Speicherkarten", href: "/catalog?category=elektronik&sub=speicher" },
                    { label: "Kamera & Foto", href: "/catalog?category=elektronik&sub=kamera" },
                ],
            },
        ],
    },
    {
        key: "sonstiges",
        label: "SONSTIGES",
        groups: [
            {
                title: "Bücher & Medien",
                items: [
                    { label: "Bücher", href: "/catalog?category=sonstiges&sub=buecher" },
                    { label: "Filme & DVDs", href: "/catalog?category=sonstiges&sub=filme" },
                    { label: "Musik & Vinyl", href: "/catalog?category=sonstiges&sub=musik" },
                ],
            },
            {
                title: "Sport & Freizeit",
                items: [
                    { label: "Fitnessgeräte", href: "/catalog?category=sonstiges&sub=fitness" },
                    { label: "Fahrräder", href: "/catalog?category=sonstiges&sub=fahrraeder" },
                    { label: "Outdoor", href: "/catalog?category=sonstiges&sub=outdoor" },
                ],
            },
            {
                title: "Haus & Garten",
                items: [
                    { label: "Möbel", href: "/catalog?category=sonstiges&sub=moebel" },
                    { label: "Deko", href: "/catalog?category=sonstiges&sub=deko" },
                    { label: "Küche & Haushalt", href: "/catalog?category=sonstiges&sub=kueche" },
                    { label: "Sammeln & Raritäten", href: "/catalog?category=sonstiges&sub=sammeln" },
                ],
            },
        ],
    },
    {
        key: "sale",
        label: "SALE",
        groups: [
            {
                title: "Nach Rabatt",
                items: [
                    { label: "Bis -30%", href: "/catalog?category=sale&discount=30" },
                    { label: "Bis -50%", href: "/catalog?category=sale&discount=50" },
                    { label: "Bis -70%", href: "/catalog?category=sale&discount=70" },
                    { label: "Alle Sale-Artikel", href: "/catalog?category=sale" },
                ],
            },
            {
                title: "Beliebte Kategorien",
                items: [
                    { label: "Damen Sale", href: "/catalog?category=sale&sub=damen" },
                    { label: "Herren Sale", href: "/catalog?category=sale&sub=herren" },
                    { label: "Schuhe Sale", href: "/catalog?category=sale&sub=schuhe" },
                    { label: "Elektronik Sale", href: "/catalog?category=sale&sub=elektronik" },
                ],
            },
        ],
    },
];

export function MegaMenu() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState<string | null>(null);

    return (
        <div className="bg-berlin-green/95 backdrop-blur-sm border-b border-white/10 shadow-sm relative">
            <div className="page-container">
                {/* Desktop: Tubelight-style tabs with cascading mega panels */}
                <div className="hidden md:flex items-center justify-center gap-0 py-1">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.key;
                        const isSale = cat.key === "sale";

                        return (
                            <div
                                key={cat.key}
                                className="relative"
                                onMouseEnter={() => setActiveCategory(cat.key)}
                                onMouseLeave={() => setActiveCategory(null)}
                            >
                                <Link
                                    href={`/catalog?category=${cat.key}`}
                                    className={`relative block px-4 lg:px-5 py-2.5 text-[10px] lg:text-xs font-black tracking-[0.2em] transition-all duration-300 ${
                                        isSale
                                            ? "text-berlin-green bg-css-orange rounded-full mx-1 hover:bg-white hover:text-berlin-green"
                                            : isActive
                                                ? "text-white"
                                                : "text-white/70 hover:text-white"
                                    }`}
                                >
                                    {cat.label}

                                    {/* Tubelight glow effect */}
                                    {isActive && !isSale && (
                                        <motion.div
                                            layoutId="mega-tubelight"
                                            className="absolute inset-0 rounded-full -z-10"
                                            initial={false}
                                            transition={{
                                                type: "spring",
                                                stiffness: 350,
                                                damping: 30,
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-white/10 rounded-full" />
                                            <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-css-orange rounded-full">
                                                <div className="absolute w-12 h-3 bg-css-orange/30 rounded-full blur-md -top-1 -left-2" />
                                                <div className="absolute w-6 h-3 bg-css-orange/40 rounded-full blur-sm -top-0.5 left-1" />
                                            </div>
                                        </motion.div>
                                    )}
                                </Link>

                                {/* Cascading Mega Dropdown Panel */}
                                {isActive && (
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 z-50">
                                        <motion.div
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                                            style={{ minWidth: cat.groups.length > 2 ? "640px" : "360px" }}
                                        >
                                            {/* Category Header */}
                                            <div className="px-6 py-3 bg-gradient-to-r from-berlin-green/5 to-transparent border-b border-gray-100">
                                                <Link
                                                    href={`/catalog?category=${cat.key}`}
                                                    className="text-sm font-black text-berlin-green uppercase tracking-widest hover:text-css-orange transition-colors"
                                                >
                                                    Alle {cat.label} anzeigen
                                                </Link>
                                            </div>

                                            {/* Grouped Subcategories */}
                                            <div className={`grid gap-0 p-4 ${
                                                cat.groups.length >= 4 ? "grid-cols-4" :
                                                cat.groups.length === 3 ? "grid-cols-3" :
                                                "grid-cols-2"
                                            }`}>
                                                {cat.groups.map((group) => (
                                                    <div key={group.title} className="px-2">
                                                        <h4 className="text-[10px] font-black text-berlin-green uppercase tracking-widest mb-2 pb-1 border-b border-berlin-green/10">
                                                            {group.title}
                                                        </h4>
                                                        <ul className="space-y-0.5">
                                                            {group.items.map((item) => (
                                                                <li key={item.label}>
                                                                    <Link
                                                                        href={item.href}
                                                                        className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 hover:bg-berlin-green/5 hover:text-berlin-green rounded-lg transition-colors group/item"
                                                                    >
                                                                        <span className="font-medium">{item.label}</span>
                                                                        <ChevronRight className="w-3 h-3 text-gray-300 group-hover/item:text-berlin-green transition-colors" />
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Mobile: Accordion-style */}
                <div className="md:hidden py-2">
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {categories.map((cat) => {
                            const isSale = cat.key === "sale";
                            return (
                                <button
                                    key={cat.key}
                                    type="button"
                                    onClick={() => setMobileOpen(mobileOpen === cat.key ? null : cat.key)}
                                    className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-black tracking-[0.15em] transition-colors rounded-full ${
                                        isSale
                                            ? "bg-css-orange text-berlin-green"
                                            : mobileOpen === cat.key
                                                ? "bg-white/20 text-white"
                                                : "text-white/70"
                                    }`}
                                >
                                    {cat.label}
                                    <ChevronDown className={`w-3 h-3 transition-transform ${mobileOpen === cat.key ? "rotate-180" : ""}`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Mobile expanded subcategories */}
                    {mobileOpen && (
                        <div className="mt-2 bg-gray-50 rounded-xl p-4 animate-in slide-in-from-top-2 duration-200">
                            {categories
                                .find((c) => c.key === mobileOpen)
                                ?.groups.map((group) => (
                                    <div key={group.title} className="mb-3 last:mb-0">
                                        <h4 className="text-[9px] font-black text-berlin-green uppercase tracking-widest mb-1 px-2">
                                            {group.title}
                                        </h4>
                                        <div className="grid grid-cols-2 gap-0.5">
                                            {group.items.map((item) => (
                                                <Link
                                                    key={item.label}
                                                    href={item.href}
                                                    className="text-[11px] font-medium text-gray-600 hover:text-berlin-green px-2 py-1.5 rounded hover:bg-berlin-green/5 transition-colors"
                                                    onClick={() => setMobileOpen(null)}
                                                >
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            <Link
                                href={`/catalog?category=${mobileOpen}`}
                                className="block mt-3 text-center py-2 bg-css-orange text-white rounded-lg font-black text-[10px] uppercase tracking-widest"
                                onClick={() => setMobileOpen(null)}
                            >
                                Alle anzeigen
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
