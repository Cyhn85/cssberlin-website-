"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type CartItem = {
    productId: string;
    title: string;
    price: number;
    brand: string | null;
    size: string | null;
    image: string | null;
    addedAt: number;
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "addedAt">) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
    isInCart: (productId: string) => boolean;
    itemCount: number;
    total: number;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "cssberlin_cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CART_KEY);
            if (stored) {
                setItems(JSON.parse(stored));
            }
        } catch {
            // ignore parse errors
        }
        setHydrated(true);
    }, []);

    // Persist to localStorage on change
    useEffect(() => {
        if (hydrated) {
            localStorage.setItem(CART_KEY, JSON.stringify(items));
        }
    }, [items, hydrated]);

    const addItem = useCallback((item: Omit<CartItem, "addedAt">) => {
        setItems((prev) => {
            // Don't add duplicates
            if (prev.some((i) => i.productId === item.productId)) {
                return prev;
            }
            return [...prev, { ...item, addedAt: Date.now() }];
        });
    }, []);

    const removeItem = useCallback((productId: string) => {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const isInCart = useCallback(
        (productId: string) => items.some((i) => i.productId === productId),
        [items]
    );

    const itemCount = items.length;
    const total = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, removeItem, clearCart, isInCart, itemCount, total }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used within CartProvider");
    }
    return ctx;
}
