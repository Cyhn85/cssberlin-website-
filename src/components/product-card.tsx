"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    brand?: string;
    size?: string;
    condition?: string;
    image: string;
    seller?: {
        name: string;
        avatar?: string;
        rating?: number;
    };
    isNew?: boolean;
    isFavorited?: boolean;
    onFavoriteClick?: () => void;
}

export function ProductCard({
    id,
    title,
    price,
    brand,
    size,
    condition,
    image,
    seller,
    isNew = false,
    isFavorited = false,
    onFavoriteClick,
}: ProductCardProps) {
    return (
        <Link href={`/items/${id}`} className="product-card">
            <div className="product-card-image">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {isNew && <span className="product-card-badge">Yeni</span>}
                <button
                    className="product-card-favorite"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onFavoriteClick?.();
                    }}
                    aria-label={isFavorited ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                >
                    <Heart
                        className={`w-5 h-5 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
                            }`}
                    />
                </button>
            </div>
            <div className="product-card-content">
                <div className="product-card-price">€{price.toFixed(2)}</div>
                {brand && <div className="product-card-brand">{brand}</div>}
                {(size || condition) && (
                    <div className="product-card-size">
                        {size}
                        {size && condition && " · "}
                        {condition}
                    </div>
                )}
                {seller && (
                    <div className="product-card-seller">
                        <div className="w-6 h-6 bg-gray-200 rounded-full overflow-hidden">
                            {seller.avatar && (
                                <Image
                                    src={seller.avatar}
                                    alt={seller.name}
                                    width={24}
                                    height={24}
                                    className="object-cover"
                                />
                            )}
                        </div>
                        <span className="text-xs text-gray-500 truncate">{seller.name}</span>
                        {seller.rating && (
                            <span className="text-xs text-gray-400 flex items-center gap-0.5 ml-auto">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                {seller.rating}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}
