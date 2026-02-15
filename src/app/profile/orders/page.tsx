"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Package,
    Truck,
    Check,
    Clock,
    ChevronRight,
    MapPin,
    Calendar,
    MessageCircle,
    ShoppingBag,
} from "lucide-react";

// Demo orders — will be replaced with real DB data
const demoOrders = [
    {
        id: "ORD-2026-001",
        status: "delivered",
        date: "2026-02-05",
        product: {
            id: "1",
            title: "Nike Air Force 1 Low White",
            price: 45.0,
            image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=200&h=200&fit=crop",
            size: "42",
        },
        seller: {
            id: "seller1",
            name: "vintage_berlin",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        },
        shipping: {
            carrier: "DHL",
            trackingNumber: "JJD000000000000123",
            estimatedDelivery: "2026-02-08",
            deliveredAt: "2026-02-07",
        },
    },
    {
        id: "ORD-2026-002",
        status: "shipped",
        date: "2026-02-08",
        product: {
            id: "2",
            title: "Levi's 501 Original Jeans",
            price: 35.0,
            image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=200&h=200&fit=crop",
            size: "32/32",
        },
        seller: {
            id: "seller2",
            name: "denim_lover",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        },
        shipping: {
            carrier: "DHL",
            trackingNumber: "JJD000000000000456",
            estimatedDelivery: "2026-02-12",
        },
    },
    {
        id: "ORD-2026-003",
        status: "processing",
        date: "2026-02-09",
        product: {
            id: "3",
            title: "Zara Blazer",
            price: 28.0,
            image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop",
            size: "M",
        },
        seller: {
            id: "seller3",
            name: "style_master",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        },
        shipping: null,
    },
];

const statusConfig = {
    processing: {
        label: "In Bearbeitung",
        color: "text-yellow-700 bg-yellow-50 border border-yellow-200",
        icon: Clock,
    },
    shipped: {
        label: "Unterwegs",
        color: "text-blue-700 bg-blue-50 border border-blue-200",
        icon: Truck,
    },
    delivered: {
        label: "Zugestellt",
        color: "text-green-700 bg-green-50 border border-green-200",
        icon: Check,
    },
};

export default function OrdersPage() {
    const [filter, setFilter] = useState<"all" | "processing" | "shipped" | "delivered">(
        "all"
    );

    const filteredOrders =
        filter === "all"
            ? demoOrders
            : demoOrders.filter((order) => order.status === filter);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <div className="bg-gradient-to-br from-berlin-green to-berlin-green/90 text-white py-10">
                <div className="page-container">
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="w-6 h-6" />
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Meine Bestellungen</h1>
                    </div>
                    <p className="text-white/60 text-sm">
                        Verfolge alle deine Einkäufe und Lieferungen.
                    </p>
                </div>
            </div>

            <div className="page-container py-8">
                {/* Filter Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {[
                        { value: "all", label: "Alle" },
                        { value: "processing", label: "In Bearbeitung" },
                        { value: "shipped", label: "Unterwegs" },
                        { value: "delivered", label: "Zugestellt" },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setFilter(tab.value as typeof filter)}
                            className={`px-5 py-2 rounded-full whitespace-nowrap text-xs font-black uppercase tracking-widest transition-colors ${
                                filter === tab.value
                                    ? "bg-css-orange text-berlin-green"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-black text-gray-900 mb-2">
                            Noch keine Bestellungen
                        </h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            Beginne jetzt mit dem Einkaufen und verfolge deine Bestellungen hier.
                        </p>
                        <Link
                            href="/catalog"
                            className="inline-flex items-center gap-2 bg-css-orange text-berlin-green px-6 py-3 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-berlin-green hover:text-white transition-colors duration-300"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Produkte entdecken
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                            const status = statusConfig[order.status as keyof typeof statusConfig];
                            const StatusIcon = status.icon;

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {/* Order Header */}
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                                                {order.id}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${status.color}`}
                                            >
                                                <StatusIcon className="w-3 h-3" />
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(order.date).toLocaleDateString("de-DE", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4 flex items-start gap-4">
                                        <Link
                                            href={`/items/${order.product.id}`}
                                            className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden"
                                        >
                                            <Image
                                                src={order.product.image}
                                                alt={order.product.title}
                                                fill
                                                className="object-cover hover:scale-105 transition-transform"
                                            />
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/items/${order.product.id}`}
                                                className="font-bold text-gray-900 hover:text-berlin-green transition-colors text-sm"
                                            >
                                                {order.product.title}
                                            </Link>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Größe: {order.product.size}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Image
                                                    src={order.seller.avatar}
                                                    alt={order.seller.name}
                                                    width={20}
                                                    height={20}
                                                    className="rounded-full"
                                                />
                                                <span className="text-xs text-gray-500 font-medium">
                                                    @{order.seller.name}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-berlin-green text-lg">
                                                €{order.product.price.toFixed(2).replace(".", ",")}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Info */}
                                    {order.shipping && (
                                        <div className="px-4 pb-4">
                                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                                        <Truck className="w-3.5 h-3.5 text-berlin-green" />
                                                        {order.shipping.carrier}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-mono">
                                                        {order.shipping.trackingNumber}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {order.status === "delivered"
                                                        ? `Zugestellt am ${new Date(
                                                            order.shipping.deliveredAt!
                                                        ).toLocaleDateString("de-DE", {
                                                            day: "2-digit",
                                                            month: "long",
                                                            year: "numeric",
                                                        })}`
                                                        : `Voraussichtliche Lieferung: ${new Date(
                                                            order.shipping.estimatedDelivery
                                                        ).toLocaleDateString("de-DE", {
                                                            day: "2-digit",
                                                            month: "long",
                                                            year: "numeric",
                                                        })}`}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="px-4 pb-4 flex items-center gap-2">
                                        <Link
                                            href={`/inbox?order=${order.id}`}
                                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-bold text-xs hover:bg-gray-50 transition-colors"
                                        >
                                            <MessageCircle className="w-3.5 h-3.5" />
                                            Verkäufer kontaktieren
                                        </Link>
                                        <Link
                                            href={`/profile/orders/${order.id}`}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-css-orange text-berlin-green rounded-lg font-black text-xs uppercase tracking-wider hover:bg-berlin-green hover:text-white transition-colors duration-300"
                                        >
                                            Details ansehen
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
