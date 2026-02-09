"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Heart, Package, UserCheck, CheckCircle, Tag } from "lucide-react";

// Mock Notifications Data (German)
const initialNotifications = [
    {
        id: "1",
        type: "price_drop",
        title: "Preisalarm!",
        message: "Der Preis für 'Nike Air Force 1' ist von 45€ auf 35€ gefallen!",
        time: "vor 2 Std.",
        read: false,
        icon: <Tag className="w-4 h-4 text-[var(--css-orange)]" />,
        bg: "bg-orange-50",
        href: "/items/1",
    },
    {
        id: "2",
        type: "follow",
        title: "Neuer Follower",
        message: "@modaseli folgt dir jetzt.",
        time: "Gestern",
        read: true,
        icon: <UserCheck className="w-4 h-4 text-blue-500" />,
        bg: "bg-blue-50",
        href: "/profile/modaseli",
    },
    {
        id: "3",
        type: "order_shipped",
        title: "Versandbestätigung",
        message: "Bestellung #123 wurde versandt. Hier verfolgen.",
        time: "vor 2 Tagen",
        read: true,
        icon: <Package className="w-4 h-4 text-[var(--css-green)]" />,
        bg: "bg-green-50",
        href: "/orders/123",
    },
];

export function NotificationsPopover() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(initialNotifications);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
                aria-label="Benachrichtigungen"
            >
                <Bell className="h-5 w-5 text-white" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--css-orange)] rounded-full border border-[var(--css-green)] animate-pulse" />
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-[var(--css-cream)]">
                            <h3 className="font-bold text-[var(--css-green)]">Benachrichtigungen</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-[var(--css-green)] hover:underline font-semibold flex items-center gap-1"
                                >
                                    <CheckCircle className="w-3 h-3" />
                                    Alle gelesen
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <Link
                                        key={notification.id}
                                        href={notification.href}
                                        onClick={() => {
                                            markAsRead(notification.id);
                                            setIsOpen(false);
                                        }}
                                        className={`block p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors relative ${!notification.read ? "bg-orange-50/30" : ""
                                            }`}
                                    >
                                        {!notification.read && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--css-orange)]" />
                                        )}
                                        <div className="flex gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.bg}`}
                                            >
                                                {notification.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-1">
                                                    <p className={`text-sm ${!notification.read ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                                                        {notification.title}
                                                    </p>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                        {notification.time}
                                                    </span>
                                                </div>
                                                <p className={`text-sm ${!notification.read ? "text-gray-800" : "text-gray-500"} line-clamp-2 leading-relaxed`}>
                                                    {notification.message}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-12 text-center text-gray-400">
                                    <Bell className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                                    <p className="font-medium">Keine Benachrichtigungen</p>
                                </div>
                            )}
                        </div>

                        <Link href="/notifications" className="block p-3 bg-gray-50 text-center text-xs font-bold text-gray-500 hover:text-[var(--css-green)] hover:bg-gray-100 transition-colors uppercase tracking-wide">
                            Alle anzeigen
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
