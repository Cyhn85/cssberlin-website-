"use server";

import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createOffer(
    productId: string,
    sellerId: string,
    offerPrice: number,
    messageText: string = ""
) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: "Lütfen giriş yapın." };
    }

    if (userId === sellerId) {
        return { success: false, error: "Kendi ürününüze teklif veremezsiniz." };
    }

    try {
        // 1. Check if a chat already exists between these users for this product
        let chat = await prisma.chat.findFirst({
            where: {
                productId: productId,
                buyerId: userId,
                sellerId: sellerId,
            },
        });

        // 2. If not, create a new chat
        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    productId: productId,
                    buyerId: userId,
                    sellerId: sellerId,
                },
            });
        }

        // 3. Create the offer message
        const messageContent = messageText || `Möchte diesen Artikel für ${offerPrice}€ kaufen.`;

        await prisma.message.create({
            data: {
                chatId: chat.id,
                senderId: userId,
                content: messageContent,
                isOffer: true,
                offerPrice: offerPrice,
            },
        });

        revalidatePath("/inbox");
        return { success: true };
    } catch (error) {
        console.error("Error creating offer:", error);
        return { success: false, error: "Teklif gönderilirken bir hata oluştu." };
    }
}
