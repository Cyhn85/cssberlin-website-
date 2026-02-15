"use server";

import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sendOfferNotificationEmail } from "@/lib/email";

export async function createOffer(
    productId: string,
    sellerId: string,
    offerPrice: number,
    messageText: string = ""
) {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
        return { success: false, error: "Bitte melden Sie sich an, um ein Angebot zu senden." };
    }

    // Look up the internal DB user by Clerk ID
    const dbUser = await prisma.user.findUnique({
        where: { clerkId },
        select: { id: true },
    });

    if (!dbUser) {
        return { success: false, error: "Benutzerkonto nicht gefunden. Bitte melden Sie sich erneut an." };
    }

    if (dbUser.id === sellerId) {
        return { success: false, error: "Sie können kein Angebot für Ihren eigenen Artikel abgeben." };
    }

    if (offerPrice <= 0 || !Number.isFinite(offerPrice)) {
        return { success: false, error: "Bitte geben Sie einen gültigen Preis ein." };
    }

    try {
        // 1. Check if a chat already exists between these users for this product
        let chat = await prisma.chat.findFirst({
            where: {
                productId: productId,
                buyerId: dbUser.id,
                sellerId: sellerId,
            },
        });

        // 2. If not, create a new chat
        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    productId: productId,
                    buyerId: dbUser.id,
                    sellerId: sellerId,
                },
            });
        }

        // 3. Create the offer message
        const messageContent = messageText || `Möchte diesen Artikel für €${offerPrice.toFixed(2).replace(".", ",")} kaufen.`;

        await prisma.message.create({
            data: {
                chatId: chat.id,
                senderId: dbUser.id,
                content: messageContent,
                isOffer: true,
                offerPrice: offerPrice,
            },
        });

        // 4. Send email notification to seller + create DB notification
        const [seller, buyer, product] = await Promise.all([
            prisma.user.findUnique({ where: { id: sellerId }, select: { email: true, username: true, firstName: true } }),
            prisma.user.findUnique({ where: { id: dbUser.id }, select: { username: true, firstName: true } }),
            prisma.product.findUnique({ where: { id: productId }, select: { title: true } }),
        ]);

        if (seller && product) {
            const sellerName = seller.firstName || seller.username || "Verkäufer";
            const buyerName = buyer?.firstName || buyer?.username || "Ein Käufer";

            // DB notification
            await prisma.notification.create({
                data: {
                    userId: sellerId,
                    type: "MESSAGE",
                    title: "Neuer Preisvorschlag",
                    message: `${buyerName} hat €${offerPrice.toFixed(2).replace(".", ",")} für "${product.title}" geboten.`,
                    link: "/inbox",
                },
            });

            // Email notification (fire and forget)
            sendOfferNotificationEmail(
                seller.email,
                sellerName,
                product.title,
                offerPrice.toFixed(2).replace(".", ","),
                buyerName
            ).catch((err) => console.error("Offer email failed:", err));
        }

        revalidatePath("/inbox");
        revalidatePath("/notifications");
        return { success: true };
    } catch (error: unknown) {
        console.error("Error creating offer:", error);
        const message = error instanceof Error ? error.message : "Unbekannter Fehler";
        console.error("Offer error details:", message);
        return { success: false, error: "Fehler beim Senden des Angebots. Bitte versuchen Sie es erneut." };
    }
}
