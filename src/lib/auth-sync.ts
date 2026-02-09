"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function syncUser() {
    const user = await currentUser();

    if (!user) return null;

    try {
        const dbUser = await db.user.upsert({
            where: { clerkId: user.id },
            update: {
                username: user.username || `user_${user.id.substring(0, 8)}`,
                firstName: user.firstName,
                lastName: user.lastName,
                avatarUrl: user.imageUrl,
                email: user.emailAddresses[0]?.emailAddress,
            },
            create: {
                clerkId: user.id,
                username: user.username || `user_${user.id.substring(0, 8)}`,
                firstName: user.firstName,
                lastName: user.lastName,
                avatarUrl: user.imageUrl,
                email: user.emailAddresses[0]?.emailAddress || "",
            },
        });
        return dbUser;
    } catch (error) {
        console.error("Failed to sync user:", error);
        return null;
    }
}
