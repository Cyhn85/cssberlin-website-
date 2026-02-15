"use client";

import { useState, useTransition } from "react";
import { Heart, ShoppingBag, Sparkles, Check } from "lucide-react";
import { toggleFavorite } from "@/actions/favorite-actions";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";

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

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    const router = useRouter();
    const { addItem, isInCart } = useCart();
    const [optimisticFavorites, setOptimisticFavorites] = useState<Record<string, boolean>>({});
    const [loadingFavorites, setLoadingFavorites] = useState<Record<string, boolean>>({});
    const [cartToast, setCartToast] = useState<string | null>(null);
    const [, startTransition] = useTransition();

    const isProductFavorited = (product: Product) => {
        return optimisticFavorites[product.id] !== undefined
            ? optimisticFavorites[product.id]
            : !!product.isFavorited;
    };

    const handleCardClick = (productId: string) => {
        router.push(`/items/${productId}`);
    };

    const handleFavorite = async (e: React.MouseEvent, productId: string) => {
        e.stopPropagation();

        const product = products.find((p) => p.id === productId);
        if (!product) return;

        const currentStatus = isProductFavorited(product);
        setOptimisticFavorites((prev) => ({ ...prev, [productId]: !currentStatus }));
        setLoadingFavorites((prev) => ({ ...prev, [productId]: true }));

        try {
            const result = await toggleFavorite(productId);
            if (!result.success) {
                setOptimisticFavorites((prev) => ({ ...prev, [productId]: currentStatus }));
                if (result.error === "Bitte einloggen.") {
                    router.push("/sign-in");
                }
            }
        } catch {
            setOptimisticFavorites((prev) => ({ ...prev, [productId]: currentStatus }));
        } finally {
            setLoadingFavorites((prev) => ({ ...prev, [productId]: false }));
        }
    };

    const handleAddToCart = (e: React.MouseEvent, productId: string) => {
        e.stopPropagation();
        const product = products.find((p) => p.id === productId);
        if (!product) return;

        if (isInCart(productId)) {
            router.push("/cart");
            return;
        }

        addItem({
            productId: product.id,
            title: product.title,
            price: product.price,
            brand: product.brand,
            size: product.size,
            image: product.image,
        });
        setCartToast(product.title);
        setTimeout(() => setCartToast(null), 2500);
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
                <div
                    key={product.id}
                    onClick={() => handleCardClick(product.id)}
                    className="group flex flex-col cursor-pointer"
                    role="link"
                >
                    <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden relative border border-gray-100 shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.title}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                <Sparkles className="w-8 h-8" />
                            </div>
                        )}

                        {/* Cart Button - Top Left */}
                        <button
                            type="button"
                            onClick={(e) => handleAddToCart(e, product.id)}
                            className={`absolute top-3 left-3 w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all z-20 ${
                                isInCart(product.id)
                                    ? "bg-berlin-green opacity-100"
                                    : "bg-css-orange opacity-0 group-hover:opacity-100 hover:bg-berlin-green"
                            }`}
                            title={isInCart(product.id) ? "Im Warenkorb" : "In den Warenkorb"}
                        >
                            {isInCart(product.id) ? (
                                <Check className="w-4 h-4 text-white" />
                            ) : (
                                <ShoppingBag className="w-4 h-4 text-white" />
                            )}
                        </button>

                        {/* Favorite Button - Top Right */}
                        <button
                            type="button"
                            onClick={(e) => handleFavorite(e, product.id)}
                            className={`absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-all z-20 ${
                                loadingFavorites[product.id] ? "animate-pulse" : ""
                            }`}
                            title="Merken"
                        >
                            <Heart
                                className={`w-4 h-4 transition-colors duration-200 ${
                                    isProductFavorited(product) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-300"
                                }`}
                            />
                        </button>

                        {/* Condition Badge - Bottom Left */}
                        <div className="absolute bottom-3 left-3 z-10">
                            <span className="bg-css-orange text-berlin-green px-3 py-1 text-[8px] font-black uppercase tracking-[0.15em] rounded-sm shadow-sm">
                                {product.condition || "VINTAGE"}
                            </span>
                        </div>

                        {/* Price Tag - Bottom Right */}
                        <div className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-sm font-black text-sm shadow-lg text-berlin-green border border-gray-100 z-10">
                            €{product.price.toFixed(2).replace(".", ",")}
                        </div>
                    </div>

                    <div className="mt-4 px-1 space-y-1">
                        <h3 className="font-black text-sm text-gray-900 uppercase tracking-tight truncate">
                            {product.title}
                        </h3>
                        <div className="flex items-center gap-2">
                            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">
                                {product.brand || "ESSENTIALS"}
                            </p>
                            <span className="text-gray-200">&bull;</span>
                            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">
                                {product.size || "ONESIZE"}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            {/* Cart Toast */}
            {cartToast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-berlin-green text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate max-w-[200px]">{cartToast}</span> zum Warenkorb hinzugefügt
                </div>
            )}
        </div>
    );
}
