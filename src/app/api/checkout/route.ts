import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { db as prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
        return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    // Look up internal DB user by Clerk ID
    const dbUser = await prisma.user.findUnique({
        where: { clerkId },
        select: { id: true },
    });

    if (!dbUser) {
        return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 });
    }

    const { productId, shippingOption } = await req.json();

    if (!productId) {
        return NextResponse.json({ error: "Produkt-ID fehlt" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { images: { take: 1, orderBy: { order: "asc" } } },
    });

    if (!product || product.status !== "AVAILABLE") {
        return NextResponse.json({ error: "Produkt nicht verfügbar" }, { status: 404 });
    }

    const priceInCents = Math.round(Number(product.price) * 100);

    // Shipping costs
    const shippingCosts: Record<string, number> = {
        dhl_small: 349,
        dhl_medium: 499,
        dhl_large: 699,
    };
    const shippingCost = shippingCosts[shippingOption] || 499;

    // Käuferschutz fee (~5% of product price, min €0.70)
    const protectionFee = Math.max(70, Math.round(priceInCents * 0.05));

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        locale: "de",
        line_items: [
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: product.title,
                        description: `${product.brand || ""} ${product.size ? `Größe ${product.size}` : ""}`.trim() || undefined,
                        images: product.images[0] ? [product.images[0].url] : undefined,
                    },
                    unit_amount: priceInCents,
                },
                quantity: 1,
            },
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: "Versandkosten (DHL)",
                    },
                    unit_amount: shippingCost,
                },
                quantity: 1,
            },
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: "Käuferschutz",
                    },
                    unit_amount: protectionFee,
                },
                quantity: 1,
            },
        ],
        metadata: {
            productId: product.id,
            buyerId: dbUser.id,
            sellerId: product.sellerId,
            shippingOption: shippingOption || "dhl_medium",
        },
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/items/${product.id}`,
    });

    return NextResponse.json({ url: session.url });
}
