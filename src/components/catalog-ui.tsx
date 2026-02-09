"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, ChevronDown, Check, X, Search, Heart, Image as ImageIcon } from "lucide-react";
import { toggleFavorite } from "@/actions/favorite-actions";

type Product = {
    id: string;
    title: string;
    price: number;
    size: string | null;
    brand: string | null;
    condition: string;
    image: string | null;
    isFavorited?: boolean; // Gelecekte eklenebilir
};

interface CatalogUIProps {
    products: Product[];
    brands: string[];
    sizes: string[];
    conditions: string[];
}

export function CatalogUI({ products, brands, sizes, conditions }: CatalogUIProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // URL parametrelerinden filtreleri oku
    const selectedBrands = searchParams.getAll("brand");
    const minPrice = searchParams.get("min") || "";
    const maxPrice = searchParams.get("max") || "";

    const [localPriceRange, setLocalPriceRange] = useState({ min: minPrice, max: maxPrice });

    // URL Güncelleme Fonksiyonu
    const updateFilters = (key: string, value: string | null, isArray: boolean = false) => {
        const params = new URLSearchParams(searchParams.toString());

        if (isArray) {
            const current = params.getAll(key);
            if (current.includes(value!)) {
                params.delete(key);
                current.filter(v => v !== value).forEach(v => params.append(key, v));
            } else {
                params.append(key, value!);
            }
        } else {
            if (value) params.set(key, value);
            else params.delete(key);
        }

        router.push(`/catalog?${params.toString()}`);
    };

    // Debounce Price Update
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (localPriceRange.min) params.set("min", localPriceRange.min); else params.delete("min");
            if (localPriceRange.max) params.set("max", localPriceRange.max); else params.delete("max");
            // Sadece değer değiştiyse pushla
            if (params.get("min") !== searchParams.get("min") || params.get("max") !== searchParams.get("max")) {
                router.push(`/catalog?${params.toString()}`);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localPriceRange]);


    const toggleBrand = (brand: string) => updateFilters("brand", brand, true);

    const handleFavorite = async (e: React.MouseEvent, productId: string) => {
        e.preventDefault();
        // Optimistic update logic could be here
        await toggleFavorite(productId);
        // Geri bildirim (toast) eklenebilir
    };

    return (
        <div className="page-container bg-[var(--css-cream)] min-h-screen">
            {/* Mobile Filter Header */}
            <div className="md:hidden sticky top-[64px] z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
                <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="flex items-center gap-2 text-gray-700 font-medium"
                >
                    <Filter className="w-5 h-5 text-[var(--css-green)]" />
                    Filtern
                </button>
                <span className="text-gray-500 text-sm">{products.length} Ergebnisse</span>
            </div>

            <div className="container px-4 md:px-6 py-6 md:py-8">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <aside className={`
            fixed md:sticky md:top-24 inset-0 z-50 md:z-0 bg-white md:bg-transparent
            transform ${isMobileFiltersOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
            transition-transform duration-300 ease-in-out md:block md:w-64 flex-shrink-0
          `}>
                        <div className="h-full md:h-[calc(100vh-120px)] overflow-y-auto bg-white md:bg-transparent md:rounded-xl md:border-none p-6 md:p-0">
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between md:hidden mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Filter</h2>
                                <button onClick={() => setIsMobileFiltersOpen(false)}>
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            {/* Filter Sections */}
                            <div className="space-y-6 md:bg-white md:p-5 md:rounded-xl md:shadow-sm md:border md:border-gray-100">

                                {/* Price Range */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Preis (€)</h3>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={localPriceRange.min}
                                            onChange={(e) => setLocalPriceRange({ ...localPriceRange, min: e.target.value })}
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-[var(--css-green)] focus:border-[var(--css-green)] bg-gray-50"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={localPriceRange.max}
                                            onChange={(e) => setLocalPriceRange({ ...localPriceRange, max: e.target.value })}
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-[var(--css-green)] focus:border-[var(--css-green)] bg-gray-50"
                                        />
                                    </div>
                                </div>

                                {/* Brands */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 mb-3">Marken</h3>
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                                        {brands.map((brand) => (
                                            <label key={brand} className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 p-1 rounded-lg transition-colors">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedBrands.includes(brand)}
                                                        onChange={() => toggleBrand(brand)}
                                                        className="peer w-4 h-4 border-2 border-gray-300 rounded checked:bg-[var(--css-green)] checked:border-[var(--css-green)] transition-all appearance-none cursor-pointer"
                                                    />
                                                    <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                                </div>
                                                <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">{brand}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Mobile Filter Actions */}
                                <div className="md:hidden pt-4 border-t border-gray-100 mt-4 flex gap-3">
                                    <button
                                        onClick={() => {
                                            router.push('/catalog');
                                            setIsMobileFiltersOpen(false);
                                        }}
                                        className="flex-1 py-3 text-gray-600 font-medium bg-gray-100 rounded-xl"
                                    >
                                        Zurücksetzen
                                    </button>
                                    <button
                                        onClick={() => setIsMobileFiltersOpen(false)}
                                        className="flex-1 py-3 bg-[var(--css-green)] text-white rounded-xl font-bold"
                                    >
                                        Anzeigen ({products.length})
                                    </button>
                                </div>

                            </div>
                        </div>
                        {/* Overlay for mobile drawer */}
                        {isMobileFiltersOpen && (
                            <div
                                className="fixed inset-0 bg-black/50 z-[-1] md:hidden backdrop-blur-sm"
                                onClick={() => setIsMobileFiltersOpen(false)}
                            />
                        )}
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Desktop Sort Header */}
                        <div className="hidden md:flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                Katalog
                                <span className="text-gray-400 font-normal text-sm bg-gray-100 px-2 py-0.5 rounded-full">{products.length}</span>
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">Sortieren:</span>
                                <select className="text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 cursor-pointer hover:bg-gray-50 rounded-lg p-1">
                                    <option>Empfohlen</option>
                                    <option>Neuheiten</option>
                                    <option>Preis: Aufsteigend</option>
                                    <option>Preis: Absteigend</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <Link key={product.id} href={`/items/${product.id}`} className="card group relative hover:-translate-y-1 transition-transform duration-300">
                                        <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                                            {product.image ? (
                                                <Image src={product.image} alt={product.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 33vw" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                                    <ImageIcon className="w-12 h-12" />
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            <button
                                                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-lg hover:scale-110"
                                                onClick={(e) => handleFavorite(e, product.id)}
                                            >
                                                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 hover:fill-red-500 transition-colors" />
                                            </button>
                                        </div>
                                        <div className="p-3">
                                            <div className="flex items-start justify-between mb-1">
                                                <div className="font-bold text-[var(--css-green)]">€{product.price.toFixed(2).replace('.', ',')}</div>
                                                <div className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{product.size || "S/M"}</div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-800 truncate mb-1 leading-snug">{product.title}</div>
                                            <div className="text-xs text-gray-400 truncate flex items-center gap-1">
                                                <span className="font-semibold">{product.brand || "Markenlos"}</span>
                                                <span>•</span>
                                                <span>{product.condition}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Keine Ergebnisse</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Wir konnten leider keine Artikel finden. Versuche es mit anderen Filterkriterien.
                                </p>
                                <button
                                    onClick={() => router.push('/catalog')}
                                    className="mt-6 btn-secondary"
                                >
                                    Filter zurücksetzen
                                </button>
                            </div>
                        )}

                        {/* Pagination Placeholder */}
                        {products.length > 0 && (
                            <div className="mt-12 flex justify-center">
                                <nav className="flex items-center gap-2">
                                    {[1, 2, 3].map((page) => (
                                        <button
                                            key={page}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${page === 1 ? "bg-[var(--css-green)] text-white shadow-lg shadow-green-900/20" : "hover:bg-white text-gray-600"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
