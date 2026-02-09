"use server";

import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(productId: string) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: "Bitte einloggen." };
    }

    try {
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId,
                },
            },
        });

        if (existingFavorite) {
            // Remove
            await prisma.favorite.delete({
                where: {
                    id: existingFavorite.id,
                },
            });
        } else {
            // Add
            await prisma.favorite.create({
                data: {
                    userId,
                    productId,
                },
            });
        }

        revalidatePath(`/items/${productId}`);
        revalidatePath("/favorites");
        return { success: true, isFavorited: !existingFavorite };
    } catch (error) {
        console.error("Favorite error:", error);
        return { success: false, error: "Fehler beim Aktualisieren der Merkliste." };
    }
}
