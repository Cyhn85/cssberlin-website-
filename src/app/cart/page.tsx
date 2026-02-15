"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2, ArrowRight, Package, Shield, Leaf, Truck } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function CartPage() {
    const { items, removeItem, clearCart, total } = useCart();

    const shipping = total >= 50 ? 0 : 4.99;
    const buyerProtection = Math.max(0.70, total * 0.05);
    const grandTotal = total + shipping + buyerProtection;

    if (items.length === 0) {
        return (
            <div className="page-container py-10">
                <h1 className="text-3xl font-black text-berlin-green mb-2">Warenkorb</h1>
                <div className="w-16 h-1 bg-css-orange rounded-full mb-8" />

                <div className="max-w-2xl mx-auto text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-10 h-10 text-gray-300" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Dein Warenkorb ist leer</h2>
                    <p className="text-gray-500 mb-6">Entdecke tolle Second-Hand Artikel und füge sie deinem Warenkorb hinzu.</p>
                    <Link
                        href="/catalog"
                        className="inline-block bg-css-orange text-berlin-green hover:bg-berlin-green hover:text-white font-black px-8 py-3 rounded-xl transition-colors duration-300 uppercase tracking-widest text-xs"
                    >
                        Jetzt stöbern
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#fdfbf7] min-h-screen">
            <div className="page-container py-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-black text-berlin-green uppercase tracking-tight">
                        Warenkorb
                        <span className="text-gray-400 text-lg font-normal ml-2">({items.length})</span>
                    </h1>
                    <button
                        type="button"
                        onClick={clearCart}
                        className="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
                    >
                        Alles entfernen
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.productId}
                                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4"
                            >
                                <Link href={`/items/${item.productId}`} className="relative w-24 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    {item.image ? (
                                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Package className="w-8 h-8" />
                                        </div>
                                    )}
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/items/${item.productId}`} className="font-bold text-gray-900 hover:text-berlin-green truncate block">
                                        {item.title}
                                    </Link>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        {item.brand && <span className="font-bold uppercase">{item.brand}</span>}
                                        {item.size && (
                                            <>
                                                <span className="text-gray-300">&bull;</span>
                                                <span>Größe {item.size}</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-lg font-black text-berlin-green mt-2">
                                        &euro;{item.price.toFixed(2).replace(".", ",")}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeItem(item.productId)}
                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors self-start"
                                    title="Entfernen"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-black text-gray-900 uppercase tracking-wide text-sm mb-4">Kostenübersicht</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>{items.length} Artikel</span>
                                        <span className="font-bold text-gray-900">&euro;{total.toFixed(2).replace(".", ",")}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Truck className="w-3 h-3" />
                                            Versand (DHL)
                                        </span>
                                        <span className="font-bold text-gray-900">
                                            {shipping === 0 ? (
                                                <span className="text-berlin-green">Kostenlos</span>
                                            ) : (
                                                `€${shipping.toFixed(2).replace(".", ",")}`
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Shield className="w-3 h-3 text-berlin-green" />
                                            Käuferschutz
                                        </span>
                                        <span className="font-bold text-gray-900">&euro;{buyerProtection.toFixed(2).replace(".", ",")}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-black text-gray-900 uppercase tracking-wide text-sm">Gesamt</span>
                                    <span className="text-xl font-black text-berlin-green">
                                        &euro;{grandTotal.toFixed(2).replace(".", ",")}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-400 mb-4">inkl. MwSt.</p>

                                <Link
                                    href={`/checkout?product=${items[0]?.productId}`}
                                    className="w-full flex items-center justify-center gap-2 bg-css-orange text-berlin-green hover:bg-berlin-green hover:text-white font-black py-3 px-4 rounded-xl transition-colors duration-300 uppercase tracking-widest text-xs"
                                >
                                    Zur Kasse
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <Link
                                    href="/catalog"
                                    className="mt-3 w-full flex items-center justify-center text-sm text-gray-500 hover:text-berlin-green transition-colors font-medium py-2"
                                >
                                    Weiter einkaufen
                                </Link>

                                {/* Climate Smart */}
                                <div className="mt-4 p-3 bg-berlin-green/5 rounded-lg border border-berlin-green/20">
                                    <div className="flex items-center gap-2">
                                        <Leaf className="w-4 h-4 text-berlin-green" />
                                        <span className="text-[10px] text-gray-500">
                                            <strong className="text-berlin-green">Climate Smart:</strong> ~{(items.length * 3.6).toFixed(1)} kg CO&#8322; gespart
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
