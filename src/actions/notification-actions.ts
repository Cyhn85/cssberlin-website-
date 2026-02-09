"use server";

import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";

/**
 * Get unread message count for the current user
 */
export async function getUnreadMessageCount(): Promise<number> {
    const { userId: clerkId } = await auth();
    if (!clerkId) return 0;

    try {
        // Önce kullanıcıyı DB'de bul
        const user = await prisma.user.findUnique({
            where: { clerkId },
            select: { id: true }
        });

        if (!user) return 0;

        // Kullanıcının dahil olduğu sohbetlerdeki okunmamış mesajları say
        const unreadCount = await prisma.message.count({
            where: {
                chat: {
                    OR: [
                        { buyerId: user.id },
                        { sellerId: user.id }
                    ]
                },
                isRead: false,
                NOT: {
                    senderId: user.id // Kendi gönderdiği mesajları sayma
                }
            }
        });

        return unreadCount;
    } catch (error) {
        console.error("Failed to get unread count:", error);
        return 0;
    }
}

/**
 * Mark all messages in a chat as read
 */
export async function markChatAsRead(chatId: string): Promise<boolean> {
    const { userId: clerkId } = await auth();
    if (!clerkId) return false;

    try {
        const user = await prisma.user.findUnique({
            where: { clerkId },
            select: { id: true }
        });

        if (!user) return false;

        // Chat'in bu kullanıcıya ait olduğunu doğrula
        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId,
                OR: [
                    { buyerId: user.id },
                    { sellerId: user.id }
                ]
            }
        });

        if (!chat) return false;

        // Kullanıcının almış olduğu mesajları okundu olarak işaretle
        await prisma.message.updateMany({
            where: {
                chatId,
                NOT: { senderId: user.id },
                isRead: false
            },
            data: { isRead: true }
        });

        return true;
    } catch (error) {
        console.error("Failed to mark chat as read:", error);
        return false;
    }
}
