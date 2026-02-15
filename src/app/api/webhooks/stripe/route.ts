import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db as prisma } from "@/lib/db";
import { sendOrderConfirmationEmail, sendSaleNotificationEmail } from "@/lib/email";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("Stripe webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const { productId, buyerId, sellerId } = session.metadata || {};

        if (!productId || !buyerId || !sellerId) {
            console.error("Missing metadata in Stripe session:", session.id);
            return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
        }

        try {
            // 1. Mark product as SOLD
            const product = await prisma.product.update({
                where: { id: productId },
                data: { status: "SOLD" },
                select: { title: true, price: true },
            });

            // 2. Fetch buyer and seller info
            const [buyer, seller] = await Promise.all([
                prisma.user.findUnique({
                    where: { id: buyerId },
                    select: { email: true, username: true, firstName: true },
                }),
                prisma.user.findUnique({
                    where: { id: sellerId },
                    select: { email: true, username: true, firstName: true },
                }),
            ]);

            const priceStr = Number(product.price).toFixed(2).replace(".", ",");
            const buyerName = buyer?.firstName || buyer?.username || "Käufer";
            const sellerName = seller?.firstName || seller?.username || "Verkäufer";

            // 3. Create notifications for both buyer and seller
            await prisma.notification.createMany({
                data: [
                    {
                        userId: buyerId,
                        type: "SYSTEM",
                        title: "Bestellung bestätigt",
                        message: `Deine Bestellung für "${product.title}" (€${priceStr}) wurde bestätigt.`,
                        link: "/profile/orders",
                    },
                    {
                        userId: sellerId,
                        type: "SOLD",
                        title: "Artikel verkauft!",
                        message: `"${product.title}" wurde für €${priceStr} von ${buyerName} gekauft.`,
                        link: "/profile/orders",
                    },
                ],
            });

            // 4. Send emails (fire and forget)
            if (buyer) {
                sendOrderConfirmationEmail(
                    buyer.email,
                    buyerName,
                    product.title,
                    priceStr,
                    session.id
                ).catch((err) => console.error("Order email failed:", err));
            }

            if (seller) {
                sendSaleNotificationEmail(
                    seller.email,
                    sellerName,
                    product.title,
                    priceStr,
                    buyerName
                ).catch((err) => console.error("Sale email failed:", err));
            }

            // 5. Create wallet transactions (escrow)
            const sellerWallet = await prisma.wallet.upsert({
                where: { userId: sellerId },
                update: {},
                create: { userId: sellerId, balance: 0, pendingBalance: 0 },
            });

            const saleAmount = Number(product.price) * 0.95; // 5% platform fee
            await prisma.transaction.create({
                data: {
                    walletId: sellerWallet.id,
                    amount: saleAmount,
                    type: "SALE",
                    status: "PENDING",
                    referenceId: productId,
                    description: `Verkauf: ${product.title}`,
                },
            });

            // Update pending balance
            await prisma.wallet.update({
                where: { id: sellerWallet.id },
                data: {
                    pendingBalance: { increment: saleAmount },
                },
            });

            console.log(`[Stripe] Payment completed for product ${productId}`);
        } catch (error) {
            console.error("Error processing Stripe webhook:", error);
            return NextResponse.json({ error: "Processing failed" }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
