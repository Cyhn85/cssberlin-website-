"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { toggleFavorite } from "@/actions/favorite-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FavoriteProduct = {
    id: string;
    title: string;
    price: number;
    brand: string | null;
    size: string | null;
    condition: string;
    image: string | null;
    seller: {
        name: string | null;
    };
};

interface FavoritesClientProps {
    initialProducts: FavoriteProduct[];
}

export function FavoritesClient({ initialProducts }: FavoritesClientProps) {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);

    const handleRemove = async (e: React.MouseEvent, productId: string) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic update
        setProducts(prev => prev.filter(p => p.id !== productId));

        const result = await toggleFavorite(productId);
        if (!result.success) {
            // Revert if failed (optional, usually not needed for simple toggle)
            alert("Hata oluştu: " + result.error);
            router.refresh();
        } else {
            router.refresh(); // Sync server state
        }
    };

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Henüz favorin yok</h2>
                <p className="text-gray-500 mb-8 max-w-sm text-center">
                    Beğendiğin ürünleri kalp ikonuna tıklayarak buraya kaydedebilir ve fiyat düşüşlerini takip edebilirsin.
                </p>
                <Link href="/catalog" className="btn-primary flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Ürünleri Keşfet
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
                <Link key={product.id} href={`/items/${product.id}`} className="product-card group relative">
                    <div className="product-card-image">
                        {product.image ? (
                            <Image src={product.image} alt={product.title} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">Resim Yok</span>
                            </div>
                        )}

                        {/* Remove from favorites button */}
                        <button
                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors z-10"
                            onClick={(e) => handleRemove(e, product.id)}
                            title="Favorilerden çıkar"
                        >
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                    </div>
                    <div className="product-card-content">
                        <div className="product-card-price">€{product.price.toFixed(2)}</div>
                        <div className="product-card-brand">{product.brand || "Markenlos"}</div>
                        <div className="product-card-size">
                            {product.size || "-"} · {product.condition}
                        </div>
                        <div className="product-card-seller">
                            <div className="w-5 h-5 bg-[#2E9E5C] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                                {product.seller.name?.substring(0, 2).toUpperCase() || "?"}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">{product.seller.name || "User"}</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
