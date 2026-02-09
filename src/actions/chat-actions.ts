"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";

// --- GET All Chats for User ---
export async function getChats() {
    const { userId } = await auth();
    if (!userId) return [];

    // Kullanıcının dahil olduğu sohbetleri getir
    const chats = await prisma.chat.findMany({
        where: {
            OR: [
                { buyerId: userId },
                { sellerId: userId },
            ],
        },
        include: {
            product: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                    images: {
                        take: 1,
                        orderBy: { order: "asc" },
                        select: { url: true }
                    },
                },
            },
            buyer: {
                select: { id: true, firstName: true, lastName: true, username: true, avatarUrl: true },
            },
            seller: {
                select: { id: true, firstName: true, lastName: true, username: true, avatarUrl: true },
            },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1,
            },
        },
        orderBy: { updatedAt: "desc" },
    });

    return chats.map((chat) => {
        const isBuyer = chat.buyerId === userId;
        const otherUser = isBuyer ? chat.seller : chat.buyer;
        const lastMessage = chat.messages[0];

        const otherUserName = otherUser.username ||
            (otherUser.firstName ? `${otherUser.firstName} ${otherUser.lastName || ""}`.trim() : "Benutzer");

        const productImage = chat.product?.images?.[0]?.url || null;

        return {
            id: chat.id,
            otherUser: {
                id: otherUser.id,
                name: otherUserName,
                avatar: otherUser.avatarUrl || null,
            },
            product: chat.product ? {
                id: chat.product.id,
                title: chat.product.title,
                price: Number(chat.product.price),
                image: productImage,
            } : null,
            lastMessage: lastMessage ? {
                id: lastMessage.id,
                senderId: lastMessage.senderId,
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                isRead: lastMessage.isRead,
                isOffer: lastMessage.isOffer,
                offerPrice: lastMessage.offerPrice ? Number(lastMessage.offerPrice) : null,
            } : null,
            unreadCount: 0,
        };
    });
}

// --- GET Messages for a Chat ---
export async function getMessages(chatId: string) {
    const { userId } = await auth();
    if (!userId) return [];

    const messages = await prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "asc" },
    });

    return messages.map(msg => ({
        id: msg.id,
        senderId: msg.senderId,
        content: msg.content,
        createdAt: msg.createdAt,
        isRead: msg.isRead,
        isOffer: msg.isOffer,
        offerPrice: msg.offerPrice ? Number(msg.offerPrice) : null,
    }));
}

// --- SEND Message ---
export async function sendMessage(chatId: string, content: string) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        // Chat sahipliğini doğrula
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            select: { buyerId: true, sellerId: true }
        });

        if (!chat || (chat.buyerId !== userId && chat.sellerId !== userId)) {
            return { success: false, error: "Unauthorized: You are not part of this chat." };
        }

        await prisma.message.create({
            data: {
                chatId,
                senderId: userId,
                content,
                isRead: false,
            },
        });

        await prisma.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() },
        });

        revalidatePath("/inbox");
        revalidatePath(`/inbox/${chatId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to send message:", error);
        return { success: false, error: "Failed to send message" };
    }
}

// --- SEND OFFER (New Feature) ---
export async function sendOffer(chatId: string, offerPrice: number) {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Unauthorized" };

    try {
        // Chat sahipliğini doğrula
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            select: { buyerId: true, sellerId: true }
        });

        if (!chat || (chat.buyerId !== userId && chat.sellerId !== userId)) {
            return { success: false, error: "Unauthorized: You are not part of this chat." };
        }

        // Log simulation (Email Logu)
        console.log(`📧 Email sent to seller: New offer of €${offerPrice} for chat ${chatId}`);

        await prisma.message.create({
            data: {
                chatId,
                senderId: userId,
                content: `Teklif Verildi: €${offerPrice}`,
                isRead: false,
                isOffer: true,
                offerPrice: offerPrice,
            },
        });

        await prisma.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() },
        });

        revalidatePath("/inbox");
        revalidatePath(`/inbox/${chatId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to send offer:", error);
        return { success: false, error: "Failed to send offer" };
    }
}
