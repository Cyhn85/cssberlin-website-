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
} from "lucide-react";

// Demo orders
const demoOrders = [
    {
        id: "ORD-2024-001",
        status: "delivered",
        date: "2024-02-05",
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
            estimatedDelivery: "2024-02-08",
            deliveredAt: "2024-02-07",
        },
    },
    {
        id: "ORD-2024-002",
        status: "shipped",
        date: "2024-02-08",
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
            carrier: "Hermes",
            trackingNumber: "H0000000000000456",
            estimatedDelivery: "2024-02-12",
        },
    },
    {
        id: "ORD-2024-003",
        status: "processing",
        date: "2024-02-09",
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
        label: "Hazırlanıyor",
        color: "text-yellow-600 bg-yellow-50",
        icon: Clock,
    },
    shipped: {
        label: "Kargoda",
        color: "text-blue-600 bg-blue-50",
        icon: Truck,
    },
    delivered: {
        label: "Teslim Edildi",
        color: "text-green-600 bg-green-50",
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
        <div className="page-container bg-gray-50">
            <div className="container px-4 md:px-6 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Siparişlerim</h1>
                    <p className="text-gray-500 text-sm">
                        Tüm satın aldığınız ürünleri buradan takip edin
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { value: "all", label: "Tümü" },
                        { value: "processing", label: "Hazırlanıyor" },
                        { value: "shipped", label: "Kargoda" },
                        { value: "delivered", label: "Teslim Edildi" },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setFilter(tab.value as typeof filter)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${filter === tab.value
                                    ? "bg-[#2E9E5C] text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Henüz siparişiniz yok
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Alışverişe başlayın ve siparişlerinizi buradan takip edin.
                        </p>
                        <Link href="/" className="btn-primary inline-flex items-center gap-2">
                            Ürünleri Keşfet
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
                                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                                >
                                    {/* Order Header */}
                                    <div className="p-4 border-b flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-500">
                                                {order.id}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                                            >
                                                <StatusIcon className="w-3 h-3 inline mr-1" />
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(order.date).toLocaleDateString("de-DE")}
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4 flex items-start gap-4">
                                        <Link
                                            href={`/items/${order.product.id}`}
                                            className="relative w-20 h-20 flex-shrink-0"
                                        >
                                            <Image
                                                src={order.product.image}
                                                alt={order.product.title}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/items/${order.product.id}`}
                                                className="font-medium text-gray-900 hover:text-[#2E9E5C]"
                                            >
                                                {order.product.title}
                                            </Link>
                                            <p className="text-sm text-gray-500">
                                                Beden: {order.product.size}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Image
                                                    src={order.seller.avatar}
                                                    alt={order.seller.name}
                                                    width={20}
                                                    height={20}
                                                    className="rounded-full"
                                                />
                                                <span className="text-sm text-gray-500">
                                                    @{order.seller.name}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900">
                                                €{order.product.price.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Info */}
                                    {order.shipping && (
                                        <div className="px-4 pb-4">
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        <Truck className="w-4 h-4 inline mr-1" />
                                                        {order.shipping.carrier}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {order.shipping.trackingNumber}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <MapPin className="w-4 h-4" />
                                                    {order.status === "delivered"
                                                        ? `${new Date(
                                                            order.shipping.deliveredAt!
                                                        ).toLocaleDateString("de-DE")} tarihinde teslim edildi`
                                                        : `Tahmini teslimat: ${new Date(
                                                            order.shipping.estimatedDelivery
                                                        ).toLocaleDateString("de-DE")}`}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="px-4 pb-4 flex items-center gap-2">
                                        <Link
                                            href={`/inbox?order=${order.id}`}
                                            className="btn-secondary text-sm py-2 flex-1 sm:flex-none"
                                        >
                                            <MessageCircle className="w-4 h-4 mr-1" />
                                            Satıcıya Mesaj
                                        </Link>
                                        <Link
                                            href={`/profile/orders/${order.id}`}
                                            className="btn-primary text-sm py-2 flex-1 sm:flex-none"
                                        >
                                            Detayları Gör
                                            <ChevronRight className="w-4 h-4 ml-1" />
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
