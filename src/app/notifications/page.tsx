"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Check, Trash2, Heart, MessageCircle, Package, Tag, Star, Shield } from "lucide-react";

// Demo notifications
const demoNotifications = [
    {
        id: "1",
        type: "message",
        title: "Yeni mesaj aldınız",
        description: "alex_style: 'Ürün hala satışta mı?'",
        time: "2 dakika önce",
        isRead: false,
        link: "/inbox",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    {
        id: "2",
        type: "offer",
        title: "Yeni teklif aldınız!",
        description: "Nike Air Force 1 için 40€ teklif yapıldı",
        time: "15 dakika önce",
        isRead: false,
        link: "/inbox",
        productImage: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=100&h=100&fit=crop",
    },
    {
        id: "3",
        type: "sale",
        title: "Tebrikler! Satış yaptınız 🎉",
        description: "Levi's 501 Jeans - 35€",
        time: "1 saat önce",
        isRead: false,
        link: "/profile/sales",
        productImage: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=100&h=100&fit=crop",
    },
    {
        id: "4",
        type: "favorite",
        title: "Ürününüz beğenildi",
        description: "3 kişi Zara Blazer ürününüzü beğendi",
        time: "3 saat önce",
        isRead: true,
        link: "/items/3",
        productImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop",
    },
    {
        id: "5",
        type: "review",
        title: "Yeni değerlendirme aldınız",
        description: "fashion_finds size 5 yıldız verdi ⭐",
        time: "5 saat önce",
        isRead: true,
        link: "/profile",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
        id: "6",
        type: "shipping",
        title: "Kargonuz yola çıktı",
        description: "Sipariş #ORD-2024-002 kargoya verildi",
        time: "1 gün önce",
        isRead: true,
        link: "/profile/orders",
    },
    {
        id: "7",
        type: "price_drop",
        title: "Fiyat düştü!",
        description: "Favorinizdeki Adidas Superstar artık 38€",
        time: "2 gün önce",
        isRead: true,
        link: "/items/4",
        productImage: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=100&h=100&fit=crop",
    },
];

const iconMap = {
    message: MessageCircle,
    offer: Tag,
    sale: Package,
    favorite: Heart,
    review: Star,
    shipping: Package,
    price_drop: Tag,
    security: Shield,
};

const colorMap = {
    message: "bg-blue-100 text-blue-600",
    offer: "bg-orange-100 text-orange-600",
    sale: "bg-green-100 text-green-600",
    favorite: "bg-pink-100 text-pink-600",
    review: "bg-yellow-100 text-yellow-600",
    shipping: "bg-purple-100 text-purple-600",
    price_drop: "bg-red-100 text-red-600",
    security: "bg-gray-100 text-gray-600",
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(demoNotifications);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter((n) => n.id !== id));
    };

    const markAsRead = (id: string) => {
        setNotifications(
            notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    return (
        <div className="page-container bg-gray-50">
            <div className="container px-4 md:px-6 py-6 max-w-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Bildirimler</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-gray-500">
                                {unreadCount} okunmamış bildirim
                            </p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-[#2E9E5C] hover:underline flex items-center gap-1"
                        >
                            <Check className="w-4 h-4" />
                            Tümünü Okundu İşaretle
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                {notifications.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Bildirim yok
                        </h2>
                        <p className="text-gray-500">
                            Yeni bildirimleriniz burada görünecek.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.map((notification) => {
                            const Icon =
                                iconMap[notification.type as keyof typeof iconMap] || Bell;
                            const colorClass =
                                colorMap[notification.type as keyof typeof colorMap] ||
                                "bg-gray-100 text-gray-600";

                            return (
                                <div
                                    key={notification.id}
                                    className={`bg-white rounded-xl p-4 shadow-sm flex items-start gap-4 transition-colors ${!notification.isRead ? "border-l-4 border-[#2E9E5C]" : ""
                                        }`}
                                >
                                    {/* Icon or Avatar */}
                                    <div className="flex-shrink-0">
                                        {notification.avatar ? (
                                            <Image
                                                src={notification.avatar}
                                                alt=""
                                                width={48}
                                                height={48}
                                                className="rounded-full object-cover"
                                            />
                                        ) : notification.productImage ? (
                                            <Image
                                                src={notification.productImage}
                                                alt=""
                                                width={48}
                                                height={48}
                                                className="rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <Link
                                        href={notification.link}
                                        onClick={() => markAsRead(notification.id)}
                                        className="flex-1 min-w-0"
                                    >
                                        <p
                                            className={`font-medium ${notification.isRead
                                                    ? "text-gray-700"
                                                    : "text-gray-900"
                                                }`}
                                        >
                                            {notification.title}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {notification.description}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {notification.time}
                                        </p>
                                    </Link>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
