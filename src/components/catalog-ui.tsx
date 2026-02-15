"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Check, X, Search, Heart, Image as ImageIcon, SlidersHorizontal } from "lucide-react";
import { toggleFavorite } from "@/actions/favorite-actions";

type Product = {
    id: string;
    title: string;
    price: number;
    size: string | null;
    brand: string | null;
    condition: string;
    image: string | null;
    isFavorited?: boolean;
};

interface CatalogUIProps {
    products: Product[];
    brands: string[];
    sizes: string[];
    conditions: string[];
    conditionLabels?: Record<string, string>;
}

export function CatalogUI({ products, brands, sizes, conditions, conditionLabels }: CatalogUIProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const selectedBrands = searchParams.getAll("brand");
    const selectedSizes = searchParams.getAll("size");
    const selectedConditions = searchParams.getAll("condition");
    const currentSort = searchParams.get("sort") || "newest";
    const minPrice = searchParams.get("min") || "";
    const maxPrice = searchParams.get("max") || "";

    const [localPriceRange, setLocalPriceRange] = useState({ min: minPrice, max: maxPrice });

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

    const handleSort = (sortValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (sortValue === "newest") params.delete("sort");
        else params.set("sort", sortValue);
        router.push(`/catalog?${params.toString()}`);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (localPriceRange.min) params.set("min", localPriceRange.min); else params.delete("min");
            if (localPriceRange.max) params.set("max", localPriceRange.max); else params.delete("max");
            if (params.get("min") !== searchParams.get("min") || params.get("max") !== searchParams.get("max")) {
                router.push(`/catalog?${params.toString()}`);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localPriceRange]);

    const toggleBrand = (brand: string) => updateFilters("brand", brand, true);
    const toggleSize = (size: string) => updateFilters("size", size, true);
    const toggleCondition = (cond: string) => updateFilters("condition", cond, true);

    const activeFilterCount = selectedBrands.length + selectedSizes.length + selectedConditions.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

    const handleFavorite = async (e: React.MouseEvent, productId: string) => {
        e.preventDefault();
        await toggleFavorite(productId);
    };

    const getConditionLabel = (cond: string) => conditionLabels?.[cond] || cond;

    const FilterCheckbox = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
        <label className="flex items-center gap-2 cursor-pointer group hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="peer w-4 h-4 border-2 border-gray-300 rounded checked:bg-berlin-green checked:border-berlin-green transition-all appearance-none cursor-pointer"
                />
                <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">{label}</span>
        </label>
    );

    return (
        <div className="bg-[#fdfbf7] min-h-screen">
            {/* Mobile Filter Header */}
            <div className="md:hidden sticky top-[64px] z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
                <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="flex items-center gap-2 text-gray-700 font-bold"
                >
                    <Filter className="w-5 h-5 text-berlin-green" />
                    Filtern
                    {activeFilterCount > 0 && (
                        <span className="bg-css-orange text-berlin-green text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>
                    )}
                </button>
                <span className="text-gray-500 text-sm font-bold">{products.length} Ergebnisse</span>
            </div>

            <div className="page-container py-6 md:py-8">
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
                                <h2 className="text-xl font-black text-gray-900">Filter</h2>
                                <button onClick={() => setIsMobileFiltersOpen(false)}>
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-6 md:bg-white md:p-5 md:rounded-xl md:shadow-sm md:border md:border-gray-100">

                                {/* Price Range */}
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-wide">Preis (€)</h3>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={localPriceRange.min}
                                            onChange={(e) => setLocalPriceRange({ ...localPriceRange, min: e.target.value })}
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-berlin-green focus:border-berlin-green bg-gray-50"
                                        />
                                        <span className="text-gray-400 font-bold">–</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={localPriceRange.max}
                                            onChange={(e) => setLocalPriceRange({ ...localPriceRange, max: e.target.value })}
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-berlin-green focus:border-berlin-green bg-gray-50"
                                        />
                                    </div>
                                </div>

                                {/* Sizes */}
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-wide">Größe</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => toggleSize(size)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                                    selectedSizes.includes(size)
                                                        ? "bg-berlin-green text-white border-berlin-green"
                                                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-berlin-green"
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Condition */}
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-wide">Zustand</h3>
                                    <div className="space-y-1">
                                        {conditions.map((cond) => (
                                            <FilterCheckbox
                                                key={cond}
                                                checked={selectedConditions.includes(cond)}
                                                onChange={() => toggleCondition(cond)}
                                                label={getConditionLabel(cond)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Brands */}
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-wide">Marken</h3>
                                    <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                                        {brands.map((brand) => (
                                            <FilterCheckbox
                                                key={brand}
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() => toggleBrand(brand)}
                                                label={brand}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Mobile Filter Actions */}
                                <div className="md:hidden pt-4 border-t border-gray-100 mt-4 flex gap-3">
                                    <button
                                        onClick={() => {
                                            router.push("/catalog");
                                            setIsMobileFiltersOpen(false);
                                        }}
                                        className="flex-1 py-3 text-gray-600 font-bold bg-gray-100 rounded-lg"
                                    >
                                        Zurücksetzen
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsMobileFiltersOpen(false)}
                                        className="flex-1 py-3 bg-css-orange text-berlin-green rounded-lg font-black"
                                    >
                                        Anzeigen ({products.length})
                                    </button>
                                </div>
                            </div>
                        </div>
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
                            <h1 className="text-lg font-black text-berlin-green uppercase tracking-tight flex items-center gap-2">
                                Katalog
                                <span className="text-gray-400 font-normal text-sm bg-gray-100 px-2.5 py-0.5 rounded-full">{products.length}</span>
                            </h1>
                            <div className="flex items-center gap-3">
                                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                                <select
                                    value={currentSort}
                                    onChange={(e) => handleSort(e.target.value)}
                                    title="Sortierung"
                                    className="text-sm font-bold text-gray-900 bg-transparent border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-berlin-green focus:border-berlin-green cursor-pointer"
                                >
                                    <option value="newest">Neuheiten</option>
                                    <option value="price-asc">Preis: Aufsteigend</option>
                                    <option value="price-desc">Preis: Absteigend</option>
                                    <option value="popular">Beliebt</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {products.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                {products.map((product) => (
                                    <Link key={product.id} href={`/items/${product.id}`} className="group flex flex-col">
                                        <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden rounded-lg border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                            {product.image ? (
                                                <Image src={product.image} alt={product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                                    <ImageIcon className="w-10 h-10" />
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                title="Merken"
                                                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-lg hover:scale-110"
                                                onClick={(e) => handleFavorite(e, product.id)}
                                            >
                                                <Heart className={`w-4 h-4 transition-colors ${product.isFavorited ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"}`} />
                                            </button>

                                            <div className="absolute top-2 left-2">
                                                <span className="bg-css-orange text-berlin-green px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] rounded-sm shadow-sm">
                                                    {product.condition ? getConditionLabel(product.condition) : "VINTAGE"}
                                                </span>
                                            </div>

                                            <div className="absolute bottom-2 right-2 bg-white px-2.5 py-1 rounded-sm font-black text-sm shadow-lg text-berlin-green border border-gray-100">
                                                €{product.price.toFixed(2).replace(".", ",")}
                                            </div>
                                        </div>
                                        <div className="mt-3 px-1 space-y-1">
                                            <h3 className="font-black text-sm text-gray-900 uppercase tracking-tight truncate">{product.title}</h3>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">{product.brand || "ESSENTIALS"}</p>
                                                {product.size && (
                                                    <>
                                                        <span className="text-gray-200">&bull;</span>
                                                        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">{product.size}</p>
                                                    </>
                                                )}
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
                                <h3 className="text-lg font-black text-gray-900 mb-2">Keine Ergebnisse</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Wir konnten leider keine Artikel finden. Versuche es mit anderen Filterkriterien.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => router.push("/catalog")}
                                    className="mt-6 bg-css-orange text-berlin-green px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-berlin-green hover:text-white transition-colors duration-300"
                                >
                                    Filter zurücksetzen
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
