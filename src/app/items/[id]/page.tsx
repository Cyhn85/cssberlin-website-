import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ProductDetail } from "./product-detail";

type Params = Promise<{ id: string }>;

export default async function ProductDetailPage({ params }: { params: Params }) {
    const { id } = await params;
    const { userId } = await auth();

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            images: { orderBy: { order: "asc" } },
            seller: {
                select: {
                    id: true,
                    clerkId: true,
                    username: true,
                    avatarUrl: true,
                    location: true,
                    isVerified: true,
                    createdAt: true,
                    _count: {
                        select: {
                            products: true,
                            reviews: true,
                        },
                    },
                },
            },
        },
    });

    if (!product) notFound();

    // Favori durumunu kontrol et
    let isFavorited = false;
    if (userId) {
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true },
        });
        if (dbUser) {
            const fav = await prisma.favorite.findFirst({
                where: { userId: dbUser.id, productId: id },
            });
            isFavorited = !!fav;
        }
    }

    // Similar products
    const orConditions = [
        ...(product.categoryId ? [{ categoryId: product.categoryId }] : []),
        ...(product.brand ? [{ brand: product.brand }] : []),
    ];

    const similarProducts = await prisma.product.findMany({
        where: {
            status: "AVAILABLE",
            id: { not: id },
            ...(orConditions.length > 0 ? { OR: orConditions } : {}),
        },
        take: 12,
        include: { images: { take: 1, orderBy: { order: "asc" } } },
    });

    // Seller's other products
    const sellerOtherProducts = await prisma.product.findMany({
        where: {
            status: "AVAILABLE",
            sellerId: product.sellerId,
            id: { not: id },
        },
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { images: { take: 1, orderBy: { order: "asc" } } },
    });

    // Serialize for client component
    const serializedProduct = {
        id: product.id,
        title: product.title,
        description: product.description,
        price: Number(product.price),
        brand: product.brand,
        size: product.size,
        color: product.color,
        condition: product.condition,
        viewCount: product.viewCount,
        likeCount: product.likeCount,
        createdAt: product.createdAt.toISOString(),
        sellerId: product.sellerId,
        categoryId: product.categoryId,
        images: product.images.map((img) => img.url),
        seller: {
            id: product.seller.id,
            clerkId: product.seller.clerkId,
            name: product.seller.username || "Verkäufer",
            avatar: product.seller.avatarUrl || "",
            location: product.seller.location || "Berlin",
            isVerified: product.seller.isVerified,
            memberSince: product.seller.createdAt.toISOString(),
            productCount: product.seller._count.products,
            reviewCount: product.seller._count.reviews,
        },
    };

    const serializedSimilar = similarProducts.map((p) => ({
        id: p.id,
        title: p.title,
        price: Number(p.price),
        brand: p.brand,
        size: p.size,
        image: p.images[0]?.url || "",
    }));

    const serializedSellerProducts = sellerOtherProducts.map((p) => ({
        id: p.id,
        title: p.title,
        price: Number(p.price),
        image: p.images[0]?.url || "",
    }));

    return (
        <ProductDetail
            product={serializedProduct}
            similarProducts={serializedSimilar}
            sellerProducts={serializedSellerProducts}
            initialFavorited={isFavorited}
        />
    );
}
