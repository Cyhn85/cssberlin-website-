"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, TrendingUp, UserCheck, ShoppingBag, ShieldCheck, RefreshCw, Send, Image as ImageIcon, Heart } from "lucide-react";
import { toggleFavorite } from "@/actions/favorite-actions";
import { useRouter } from "next/navigation";

type Product = {
    id: string;
    title: string;
    price: number;
    brand: string | null;
    size: string | null;
    condition: string;
    image: string | null;
    isFavorited?: boolean;
};

interface HomeClientProps {
    popularProducts: Product[];
}

export function HomeClient({ popularProducts }: HomeClientProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"popular" | "feed">("popular");
    const [optimisticFavorites, setOptimisticFavorites] = useState<Record<string, boolean>>({});

    const isProductFavorited = (product: Product) => {
        return optimisticFavorites[product.id] !== undefined
            ? optimisticFavorites[product.id]
            : product.isFavorited;
    };

    const handleFavorite = async (e: React.MouseEvent, productId: string) => {
        e.preventDefault();
        e.stopPropagation();

        const currentStatus = isProductFavorited(popularProducts.find(p => p.id === productId)!);

        // Optimistic update
        setOptimisticFavorites(prev => ({ ...prev, [productId]: !currentStatus }));

        try {
            const result = await toggleFavorite(productId);
            if (!result.success) {
                // Revert on failure
                setOptimisticFavorites(prev => ({ ...prev, [productId]: !!currentStatus }));
                if (result.error === "Bitte einloggen.") {
                    router.push("/sign-in");
                }
            } else {
                router.refresh();
            }
        } catch (error) {
            setOptimisticFavorites(prev => ({ ...prev, [productId]: !!currentStatus }));
        }
    };

    return (
        <div className="page-container bg-[var(--css-cream)]">
            {/* Hero Section */}
            <section className="relative w-full h-[500px] flex items-center justify-center bg-[var(--css-green)] text-white overflow-hidden">
                {/* Background Pattern/Overlay */}
                <div className="absolute inset-0 bg-black/10 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 z-0 mix-blend-overlay"></div>

                <div className="container relative z-10 text-center px-4">
                    <span className="inline-block py-1 px-3 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider mb-4 border border-white/20 uppercase">
                        Willkommen bei CSS Berlin
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                        Dein Kleiderschrank,<br /> Deine Regeln.
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
                        Verkaufe, was du nicht mehr trägst, und finde einzigartige Vintage-Schätze. Nachhaltig, sicher und lokal in Berlin.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/sell" className="btn-primary flex items-center gap-2 px-8 py-4 text-lg shadow-lg shadow-orange-900/20 hover:-translate-y-1 transition-transform">
                            <ShoppingBag className="w-5 h-5" />
                            Jetzt verkaufen
                        </Link>
                        <Link href="/catalog" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all flex items-center gap-2">
                            Katalog ansehen
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main Content Section (Tabs) */}
            <section className="py-12 md:py-16 min-h-[600px]">
                <div className="container px-4 md:px-6">

                    {/* Tabs */}
                    <div className="flex justify-center mb-10">
                        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
                            <button
                                onClick={() => setActiveTab("popular")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "popular"
                                    ? "bg-[var(--css-green)] text-white shadow-md scale-100"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <TrendingUp className="w-4 h-4" />
                                Beliebt
                            </button>
                            <button
                                onClick={() => setActiveTab("feed")}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "feed"
                                    ? "bg-[var(--css-green)] text-white shadow-md scale-100"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <UserCheck className="w-4 h-4" />
                                Mein Feed
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-1 font-bold ${activeTab === "feed" ? "bg-white text-[var(--css-green)]" : "bg-[var(--css-green)] text-white"}`}>0</span>
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === "popular" ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {popularProducts.length > 0 ? (
                                        popularProducts.map((product) => (
                                            <Link key={product.id} href={`/items/${product.id}`} className="card group hover:shadow-md transition-shadow duration-300">
                                                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                                                    {product.image ? (
                                                        <Image src={product.image} alt={product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                                            <ImageIcon className="w-12 h-12" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            className="p-2 bg-white rounded-full shadow-sm hover:scale-110 transition-transform"
                                                            onClick={(e) => handleFavorite(e, product.id)}
                                                        >
                                                            <Heart
                                                                className={`w-4 h-4 ${isProductFavorited(product) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="font-bold text-gray-900 truncate pr-2">{product.title}</h3>
                                                        <p className="font-bold text-[var(--css-green)]">€{product.price.toFixed(2).replace('.', ',')}</p>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                                                        <span>{product.brand || "Markenlos"}</span>
                                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{product.size || "S/M"}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">{product.condition}</p>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-20 text-gray-500">
                                            Noch keine beliebten Artikel.
                                        </div>
                                    )}
                                </div>
                                <div className="mt-12 text-center">
                                    <Link href="/catalog" className="btn-secondary inline-flex px-8 py-3 border-gray-300 text-gray-600 hover:border-[var(--css-green)] hover:text-[var(--css-green)]">
                                        Alle Artikel anzeigen
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-8 text-center py-20">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UserCheck className="w-8 h-8 text-[var(--css-green)]" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Dein Feed ist leer</h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                    Folge anderen Mitgliedern, um hier ihre neuen Artikel zu sehen.
                                </p>
                                <Link href="/catalog" className="btn-primary inline-flex">
                                    Mitglieder entdecken
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ... Trust Section (Aynı kaldığı için tekrar yazmıyorum, yukarıdaki gibi) ... */}
            {/* Features / Trust Section */}
            <section className="py-16 bg-white border-t border-gray-100">
                <div className="container px-4 md:px-6">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center p-6 rounded-2xl hover:bg-[var(--css-cream)] transition-colors">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 text-[var(--css-green)]">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Sicher einkaufen</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Unser Käuferschutz garantiert, dass du dein Geld zurückbekommst, falls etwas schiefgeht.
                            </p>
                        </div>
                        <div className="flex flex-col items-center p-6 rounded-2xl hover:bg-[var(--css-cream)] transition-colors">
                            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-[var(--css-orange)]">
                                <Send className="w-8 h-8" />
                            </div>
                            <div className="relative">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Einfach verkaufen</h3>
                            </div>
                            <p className="text-gray-500 leading-relaxed">
                                Lade deine Artikel in Sekunden hoch und erreiche Tausende von Käufern in Berlin.
                            </p>
                        </div>
                        <div className="flex flex-col items-center p-6 rounded-2xl hover:bg-[var(--css-cream)] transition-colors">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600">
                                <RefreshCw className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Nachhaltige Mode</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Gib Kleidung ein zweites Leben und reduziere deinen ökologischen Fußabdruck.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-[var(--css-green)] text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container relative z-10 px-4">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Bereit, deinen Stil zu teilen?</h2>
                    <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light">
                        Werde Teil der größten Second-Hand Community in Berlin. Kostenlos anmelden und loslegen.
                    </p>
                    <Link href="/sell" className="btn-accent inline-flex items-center gap-2 px-10 py-4 text-lg bg-white text-[var(--css-green)] hover:bg-gray-100 hover:scale-105 shadow-xl">
                        <span className="font-bold">Kostenlos registrieren</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
