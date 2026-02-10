"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, X, ChevronDown, Grid, List, Heart, Star } from "lucide-react";

// Demo products
const products = [
    {
        id: "1",
        title: "Nike Air Force 1 Low",
        price: 45.0,
        brand: "Nike",
        size: "42",
        condition: "Çok İyi",
        image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop",
        seller: { name: "alex_style", rating: 4.8 },
    },
    {
        id: "2",
        title: "Levi's 501 Original Jeans",
        price: 35.0,
        brand: "Levi's",
        size: "M",
        condition: "İyi",
        image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400&h=400&fit=crop",
        seller: { name: "vintage_berlin", rating: 4.9 },
    },
    {
        id: "3",
        title: "Zara Oversize Blazer",
        price: 28.0,
        brand: "Zara",
        size: "S",
        condition: "Yeni Gibi",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
        seller: { name: "fashion_finds", rating: 5.0 },
    },
    {
        id: "4",
        title: "Adidas Stan Smith",
        price: 55.0,
        brand: "Adidas",
        size: "38",
        condition: "Çok İyi",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
        seller: { name: "sneaker_hub", rating: 4.7 },
    },
    {
        id: "5",
        title: "H&M Yün Palto",
        price: 65.0,
        brand: "H&M",
        size: "L",
        condition: "İyi",
        image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop",
        seller: { name: "winter_wardrobe", rating: 4.6 },
    },
    {
        id: "6",
        title: "Mango Deri Çanta",
        price: 42.0,
        brand: "Mango",
        size: "One Size",
        condition: "Çok İyi",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
        seller: { name: "bag_lover", rating: 4.9 },
    },
    {
        id: "7",
        title: "Ralph Lauren Polo Shirt",
        price: 38.0,
        brand: "Ralph Lauren",
        size: "M",
        condition: "Yeni Etiketli",
        image: "https://images.unsplash.com/photo-1625910513413-5fc6e09d6c87?w=400&h=400&fit=crop",
        seller: { name: "premium_picks", rating: 5.0 },
    },
    {
        id: "8",
        title: "Converse Chuck Taylor",
        price: 32.0,
        brand: "Converse",
        size: "40",
        condition: "İyi",
        image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop",
        seller: { name: "casual_kicks", rating: 4.5 },
    },
];

// Filter options
const categories = [
    { id: "clothing", name: "Giyim" },
    { id: "shoes", name: "Ayakkabı" },
    { id: "bags", name: "Çanta" },
    { id: "accessories", name: "Aksesuar" },
];

const sizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43", "44"];

const conditions = [
    { id: "new_with_tags", name: "Yeni Etiketli" },
    { id: "new_without_tags", name: "Yeni Etiketsiz" },
    { id: "very_good", name: "Çok İyi" },
    { id: "good", name: "İyi" },
    { id: "satisfactory", name: "Tatminkar" },
];

const brands = ["Nike", "Adidas", "Zara", "H&M", "Mango", "Levi's", "Ralph Lauren", "Converse"];

const sortOptions = [
    { id: "newest", name: "En Yeni" },
    { id: "price_low", name: "Fiyat: Düşükten Yükseğe" },
    { id: "price_high", name: "Fiyat: Yüksekten Düşüğe" },
    { id: "popular", name: "En Popüler" },
];

export default function CatalogPage({ params }: { params: { category: string } }) {
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [sortBy, setSortBy] = useState("newest");

    const categoryTitles: Record<string, string> = {
        women: "Kadın",
        men: "Erkek",
        kids: "Çocuk",
        home: "Ev & Yaşam",
    };

    const categoryTitle = categoryTitles[params.category] || "Tüm Ürünler";

    const toggleFilter = (
        value: string,
        selected: string[],
        setSelected: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        if (selected.includes(value)) {
            setSelected(selected.filter((v) => v !== value));
        } else {
            setSelected([...selected, value]);
        }
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedSizes([]);
        setSelectedConditions([]);
        setSelectedBrands([]);
        setPriceRange({ min: "", max: "" });
    };

    const activeFiltersCount =
        selectedCategories.length +
        selectedSizes.length +
        selectedConditions.length +
        selectedBrands.length +
        (priceRange.min || priceRange.max ? 1 : 0);

    return (
        <div className="page-container bg-gray-50">
            <div className="container px-4 md:px-6 py-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <nav className="text-sm text-gray-500 mb-2">
                            <Link href="/" className="hover:text-[#2E9E5C]">
                                Ana Sayfa
                            </Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-900">{categoryTitle}</span>
                        </nav>
                        <h1 className="text-2xl font-bold text-gray-900">{categoryTitle}</h1>
                        <p className="text-gray-500">{products.length} ürün bulundu</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Filter Button (Mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            Filtreler
                            {activeFiltersCount > 0 && (
                                <span className="w-5 h-5 bg-[#2E9E5C] text-white text-xs rounded-full flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#2E9E5C]"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* View Mode */}
                        <div className="hidden md:flex bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 ${viewMode === "list" ? "bg-gray-100" : ""}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Filters Sidebar */}
                    <aside
                        className={`${showFilters ? "fixed inset-0 z-50 bg-white" : "hidden"
                            } md:block md:relative md:w-64 flex-shrink-0`}
                    >
                        <div className="h-full md:h-auto overflow-y-auto md:bg-white md:rounded-xl md:border md:p-4">
                            {/* Mobile Header */}
                            <div className="md:hidden flex items-center justify-between p-4 border-b">
                                <h2 className="font-bold text-lg">Filtreler</h2>
                                <button onClick={() => setShowFilters(false)}>
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-4 md:p-0 space-y-6">
                                {/* Active Filters */}
                                {activeFiltersCount > 0 && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">{activeFiltersCount} filtre aktif</span>
                                        <button onClick={clearFilters} className="text-sm text-[#2E9E5C] font-medium">
                                            Temizle
                                        </button>
                                    </div>
                                )}

                                {/* Category Filter */}
                                <div className="filter-section">
                                    <h3 className="filter-title">Kategori</h3>
                                    <div className="space-y-2">
                                        {categories.map((cat) => (
                                            <label key={cat.id} className="filter-option">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(cat.id)}
                                                    onChange={() =>
                                                        toggleFilter(cat.id, selectedCategories, setSelectedCategories)
                                                    }
                                                    className="w-4 h-4 text-[#2E9E5C] rounded border-gray-300 focus:ring-[#2E9E5C]"
                                                />
                                                {cat.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Size Filter */}
                                <div className="filter-section">
                                    <h3 className="filter-title">Beden</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
                                                className={`px-3 py-1 text-sm border rounded-lg transition-colors ${selectedSizes.includes(size)
                                                    ? "bg-[#2E9E5C] text-white border-[#2E9E5C]"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Brand Filter */}
                                <div className="filter-section">
                                    <h3 className="filter-title">Marka</h3>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {brands.map((brand) => (
                                            <label key={brand} className="filter-option">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBrands.includes(brand)}
                                                    onChange={() =>
                                                        toggleFilter(brand, selectedBrands, setSelectedBrands)
                                                    }
                                                    className="w-4 h-4 text-[#2E9E5C] rounded border-gray-300 focus:ring-[#2E9E5C]"
                                                />
                                                {brand}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Condition Filter */}
                                <div className="filter-section">
                                    <h3 className="filter-title">Durum</h3>
                                    <div className="space-y-2">
                                        {conditions.map((cond) => (
                                            <label key={cond.id} className="filter-option">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedConditions.includes(cond.id)}
                                                    onChange={() =>
                                                        toggleFilter(cond.id, selectedConditions, setSelectedConditions)
                                                    }
                                                    className="w-4 h-4 text-[#2E9E5C] rounded border-gray-300 focus:ring-[#2E9E5C]"
                                                />
                                                {cond.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div className="filter-section">
                                    <h3 className="filter-title">Fiyat Aralığı</h3>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E9E5C]"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E9E5C]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Apply Button */}
                            <div className="md:hidden p-4 border-t">
                                <button onClick={() => setShowFilters(false)} className="w-full btn-primary">
                                    {products.length} Ürünü Göster
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        <div
                            className={`grid gap-4 ${viewMode === "grid"
                                ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                : "grid-cols-1"
                                }`}
                        >
                            {products.map((product) => (
                                <Link key={product.id} href={`/items/${product.id}`} className="product-card">
                                    <div className="product-card-image">
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            className="product-card-favorite"
                                            onClick={(e) => {
                                                e.preventDefault();
                                            }}
                                        >
                                            <Heart className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>
                                    <div className="product-card-content">
                                        <div className="product-card-price">€{product.price.toFixed(2)}</div>
                                        <div className="product-card-brand">{product.brand}</div>
                                        <div className="product-card-size">
                                            {product.size} · {product.condition}
                                        </div>
                                        <div className="product-card-seller">
                                            <div className="w-6 h-6 bg-gray-200 rounded-full" />
                                            <span className="text-xs text-gray-500">{product.seller.name}</span>
                                            <span className="text-xs text-gray-400 flex items-center gap-0.5 ml-auto">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                {product.seller.rating}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="mt-8 text-center">
                            <button className="btn-outline">Daha Fazla Yükle</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
