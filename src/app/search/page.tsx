"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, SlidersHorizontal, X, ChevronDown, Grid, List, Heart } from "lucide-react";

// Demo products for search
const allProducts = [
    {
        id: "1",
        title: "Nike Air Force 1 Low White",
        price: 45.0,
        originalPrice: 120.0,
        image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop",
        brand: "Nike",
        size: "42",
        seller: "vintage_berlin",
        condition: "Çok İyi",
        category: "Ayakkabı",
    },
    {
        id: "2",
        title: "Levi's 501 Original Jeans",
        price: 35.0,
        image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400&h=400&fit=crop",
        brand: "Levi's",
        size: "32/32",
        seller: "denim_lover",
        condition: "İyi",
        category: "Pantolon",
    },
    {
        id: "3",
        title: "Zara Blazer",
        price: 28.0,
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop",
        brand: "Zara",
        size: "M",
        seller: "style_master",
        condition: "Yeni Gibi",
        category: "Ceket",
    },
    {
        id: "4",
        title: "Adidas Superstar",
        price: 38.0,
        originalPrice: 100.0,
        image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop",
        brand: "Adidas",
        size: "41",
        seller: "sneaker_head",
        condition: "İyi",
        category: "Ayakkabı",
    },
    {
        id: "5",
        title: "H&M Wool Coat",
        price: 55.0,
        image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop",
        brand: "H&M",
        size: "L",
        seller: "winter_style",
        condition: "Çok İyi",
        category: "Mont",
    },
    {
        id: "6",
        title: "Nike Jordan 1",
        price: 120.0,
        originalPrice: 180.0,
        image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop",
        brand: "Nike",
        size: "43",
        seller: "sneaker_king",
        condition: "Yeni Etiketli",
        category: "Ayakkabı",
    },
    {
        id: "7",
        title: "Vintage Band T-Shirt",
        price: 22.0,
        image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=400&h=400&fit=crop",
        brand: "Vintage",
        size: "L",
        seller: "retro_berlin",
        condition: "İyi",
        category: "T-Shirt",
    },
    {
        id: "8",
        title: "Gucci Belt",
        price: 85.0,
        originalPrice: 350.0,
        image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&h=400&fit=crop",
        brand: "Gucci",
        size: "90",
        seller: "luxury_finds",
        condition: "Çok İyi",
        category: "Aksesuar",
    },
];

function SearchPageContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [searchQuery, setSearchQuery] = useState(query);
    const [results, setResults] = useState(allProducts);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState("relevance");
    const [filters, setFilters] = useState({
        priceMin: "",
        priceMax: "",
        brand: "",
        condition: "",
        size: "",
    });

    useEffect(() => {
        // Filter products based on search query
        if (query) {
            const filtered = allProducts.filter(
                (p) =>
                    p.title.toLowerCase().includes(query.toLowerCase()) ||
                    p.brand.toLowerCase().includes(query.toLowerCase()) ||
                    p.category.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults(allProducts);
        }
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Update URL with search query
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    };

    // Sort results
    const sortedResults = [...results].sort((a, b) => {
        switch (sortBy) {
            case "price_low":
                return a.price - b.price;
            case "price_high":
                return b.price - a.price;
            case "newest":
                return 0; // Would sort by date in real app
            default:
                return 0;
        }
    });

    return (
        <div className="page-container bg-gray-50">
            <div className="container px-4 md:px-6 py-6">
                {/* Search Header */}
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Ürün, marka veya kategori ara..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2E9E5C] focus:border-transparent"
                        />
                    </form>

                    {query && (
                        <div className="text-center text-gray-600">
                            <span className="font-medium">&quot;{query}&quot;</span> için{" "}
                            <span className="font-semibold text-[#2E9E5C]">
                                {results.length}
                            </span>{" "}
                            sonuç bulundu
                        </div>
                    )}
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6 gap-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filtreler
                    </button>

                    <div className="flex items-center gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2E9E5C]"
                        >
                            <option value="relevance">En Alakalı</option>
                            <option value="newest">En Yeni</option>
                            <option value="price_low">Fiyat: Düşükten Yükseğe</option>
                            <option value="price_high">Fiyat: Yüksekten Düşüğe</option>
                        </select>

                        <div className="hidden sm:flex items-center gap-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg ${viewMode === "grid"
                                        ? "bg-[#2E9E5C] text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg ${viewMode === "list"
                                        ? "bg-[#2E9E5C] text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Min Fiyat
                                </label>
                                <input
                                    type="number"
                                    value={filters.priceMin}
                                    onChange={(e) =>
                                        setFilters({ ...filters, priceMin: e.target.value })
                                    }
                                    placeholder="€0"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Fiyat
                                </label>
                                <input
                                    type="number"
                                    value={filters.priceMax}
                                    onChange={(e) =>
                                        setFilters({ ...filters, priceMax: e.target.value })
                                    }
                                    placeholder="€500"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Marka
                                </label>
                                <select
                                    value={filters.brand}
                                    onChange={(e) =>
                                        setFilters({ ...filters, brand: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                >
                                    <option value="">Tümü</option>
                                    <option value="Nike">Nike</option>
                                    <option value="Adidas">Adidas</option>
                                    <option value="Zara">Zara</option>
                                    <option value="H&M">H&M</option>
                                    <option value="Levi's">Levi&apos;s</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Durum
                                </label>
                                <select
                                    value={filters.condition}
                                    onChange={(e) =>
                                        setFilters({ ...filters, condition: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                >
                                    <option value="">Tümü</option>
                                    <option value="new">Yeni Etiketli</option>
                                    <option value="like_new">Yeni Gibi</option>
                                    <option value="very_good">Çok İyi</option>
                                    <option value="good">İyi</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Beden
                                </label>
                                <select
                                    value={filters.size}
                                    onChange={(e) =>
                                        setFilters({ ...filters, size: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                >
                                    <option value="">Tümü</option>
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results */}
                {sortedResults.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Sonuç bulunamadı
                        </h2>
                        <p className="text-gray-500 mb-6">
                            &quot;{query}&quot; için ürün bulunamadı. Farklı anahtar kelimeler deneyin.
                        </p>
                        <Link href="/" className="btn-primary">
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                ) : (
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                                : "space-y-3"
                        }
                    >
                        {sortedResults.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ProductCard({
    product,
    viewMode,
}: {
    product: (typeof allProducts)[0];
    viewMode: "grid" | "list";
}) {
    const [isFavorite, setIsFavorite] = useState(false);

    if (viewMode === "list") {
        return (
            <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                <Link href={`/items/${product.id}`} className="relative w-24 h-24 flex-shrink-0">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover rounded-lg"
                    />
                </Link>
                <div className="flex-1 min-w-0">
                    <Link
                        href={`/items/${product.id}`}
                        className="font-medium text-gray-900 hover:text-[#2E9E5C] block truncate"
                    >
                        {product.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                        {product.brand} • {product.size} • {product.condition}
                    </p>
                    <p className="text-sm text-gray-400">@{product.seller}</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <div className="font-bold text-gray-900">€{product.price.toFixed(2)}</div>
                    {product.originalPrice && (
                        <div className="text-sm text-gray-400 line-through">
                            €{product.originalPrice.toFixed(2)}
                        </div>
                    )}
                </div>
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-lg transition-colors ${isFavorite
                            ? "bg-red-50 text-red-500"
                            : "hover:bg-gray-100 text-gray-400"
                        }`}
                >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </button>
            </div>
        );
    }

    return (
        <div className="product-card">
            <div className="product-card-image">
                <Link href={`/items/${product.id}`}>
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                    />
                </Link>
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${isFavorite
                            ? "bg-red-500 text-white"
                            : "bg-white/90 text-gray-600 hover:text-red-500"
                        }`}
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                </button>
                {product.originalPrice && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                )}
            </div>
            <div className="product-card-content">
                <div className="flex items-center justify-between mb-1">
                    <span className="product-card-price">€{product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                            €{product.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>
                <Link
                    href={`/items/${product.id}`}
                    className="product-card-brand hover:text-[#2E9E5C]"
                >
                    {product.brand}
                </Link>
                <p className="text-xs text-gray-400">{product.size}</p>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="page-container bg-gray-50 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin w-8 h-8 border-4 border-[#2E9E5C] border-t-transparent rounded-full"></div>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}
