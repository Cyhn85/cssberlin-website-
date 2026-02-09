"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { getUnreadMessageCount } from "@/actions/notification-actions";

interface MessageBadgeProps {
    initialCount?: number;
}

export function MessageBadge({ initialCount = 0 }: MessageBadgeProps) {
    const [unreadCount, setUnreadCount] = useState(initialCount);

    // Periyodik olarak okunmamış mesaj sayısını güncelle
    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const count = await getUnreadMessageCount();
                setUnreadCount(count);
            } catch (error) {
                console.error("Failed to fetch unread count:", error);
            }
        };

        // İlk yükleme
        fetchUnread();

        // Her 30 saniyede bir güncelle
        const interval = setInterval(fetchUnread, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Link
            href="/inbox"
            className="p-2 hover:bg-white/10 rounded-full transition-colors relative group"
        >
            <Mail className="h-5 w-5" />
            {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[var(--css-orange)] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[var(--css-green)] animate-in zoom-in duration-200">
                    {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            )}
        </Link>
    );
}
