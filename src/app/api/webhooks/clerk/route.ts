import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // Clerk Dashboard -> Webhooks -> Endpoint -> Signing Secret
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occured", {
            status: 400,
        });
    }

    // Get the ID and type
    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name, image_url, username } = evt.data;

        const email = email_addresses[0]?.email_address;

        if (!email) {
            return new Response("Error: No email found", { status: 400 });
        }

        // Upsert user to database
        await db.user.upsert({
            where: { clerkId: id },
            update: {
                email: email,
                firstName: first_name,
                lastName: last_name,
                avatarUrl: image_url,
                username: username || email.split("@")[0], // Fallback username
            },
            create: {
                clerkId: id,
                email: email,
                firstName: first_name,
                lastName: last_name,
                avatarUrl: image_url,
                username: username || email.split("@")[0],
                isVerified: false,
            },
        });

        return NextResponse.json({ message: "User synced successfully", user: id });
    }

    if (eventType === "user.deleted") {
        const { id } = evt.data;

        if (id) {
            // Soft delete or hard delete depending on policy. Hard delete for now to keep DB clean.
            // Note: Removing a user might require removing products/chats first due to constraints.
            // For safety, we wrap in try/catch and log error if fails.
            try {
                // Delete related products first? Or rely on Cascade?
                // Prisma schema should handle onDelete: Cascade if set.
                // If not, we might need manual deletion. Assuming Cascade or manual cleanup for now.
                // Let's just try to delete the user.
                await db.user.delete({
                    where: { clerkId: id }
                });
                return NextResponse.json({ message: "User deleted successfully", user: id });
            } catch (error) {
                console.error("Error deleting user:", error);
                return NextResponse.json({ message: "Error deleting user", error: String(error) }, { status: 500 });
            }
        }
    }

    return new Response("", { status: 200 });
}
