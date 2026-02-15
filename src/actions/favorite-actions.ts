"use server";

import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(productId: string) {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
        return { success: false, error: "Bitte einloggen." };
    }

    // Look up the internal DB user by Clerk ID
    const dbUser = await prisma.user.findUnique({
        where: { clerkId },
        select: { id: true },
    });

    if (!dbUser) {
        return { success: false, error: "Benutzerkonto nicht gefunden." };
    }

    try {
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId: dbUser.id,
                    productId,
                },
            },
        });

        if (existingFavorite) {
            await prisma.favorite.delete({
                where: { id: existingFavorite.id },
            });
        } else {
            await prisma.favorite.create({
                data: {
                    userId: dbUser.id,
                    productId,
                },
            });
        }

        revalidatePath(`/items/${productId}`);
        revalidatePath("/favorites");
        revalidatePath("/");
        revalidatePath("/catalog");
        return { success: true, isFavorited: !existingFavorite };
    } catch (error) {
        console.error("Favorite error:", error);
        return { success: false, error: "Fehler beim Aktualisieren der Merkliste." };
    }
}
