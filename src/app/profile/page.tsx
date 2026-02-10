export const runtime = "edge";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db as prisma } from "@/lib/db";
import { ProfileClient } from "@/components/profile-client";

export default async function ProfilePage() {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
        redirect("/sign-in");
    }

    // Kullanıcı bilgilerini veritabanından çek
    const user = await prisma.user.findUnique({
        where: { clerkId },
        include: {
            products: {
                where: { status: { in: ["AVAILABLE", "SOLD", "RESERVED"] } },
                orderBy: { createdAt: "desc" },
                take: 20,
                include: {
                    images: {
                        take: 1,
                        orderBy: { order: "asc" },
                    },
                },
            },
            reviews: {
                take: 10,
                orderBy: { createdAt: "desc" },
                include: {
                    reviewer: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
            followers: true,
            following: true,
            wallet: true,
        },
    });

    // Kullanıcı veritabanında yoksa demo verilerle render et (Clerk'ten henüz sync olmamış olabilir)
    if (!user) {
        // Kullanıcı Clerk'te var ama DB'de yok - sync lazım
        // Şimdilik boş profil göster
        const emptyProfile = {
            id: "",
            clerkId: clerkId,
            username: null,
            firstName: null,
            lastName: null,
            avatarUrl: null,
            bio: null,
            location: null,
            isVerified: false,
            createdAt: new Date(),
            stats: {
                productCount: 0,
                soldCount: 0,
                followerCount: 0,
                followingCount: 0,
                rating: 0,
                reviewCount: 0,
            },
            walletBalance: 0,
            products: [],
            reviews: [],
        };

        return <ProfileClient profile={emptyProfile} />;
    }

    // Satılan ürün sayısı
    const soldCount = user.products.filter(p => p.status === "SOLD").length;

    // Ortalama puan hesapla
    const avgRating = user.reviews.length > 0
        ? user.reviews.reduce((sum, r) => sum + r.rating, 0) / user.reviews.length
        : 0;

    // Profil verisini formatla
    const profile = {
        id: user.id,
        clerkId: user.clerkId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        location: user.location,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        stats: {
            productCount: user.products.length,
            soldCount: soldCount,
            followerCount: user.followers.length,
            followingCount: user.following.length,
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: user.reviews.length,
        },
        walletBalance: user.wallet ? Number(user.wallet.balance) : 0,
        products: user.products.map(p => ({
            id: p.id,
            title: p.title,
            price: Number(p.price),
            status: p.status,
            image: p.images[0]?.url || null,
        })),
        reviews: user.reviews.map(r => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
            reviewer: {
                id: r.reviewer.id,
                username: r.reviewer.username,
                firstName: r.reviewer.firstName,
                avatarUrl: r.reviewer.avatarUrl,
            },
        })),
    };

    return <ProfileClient profile={profile} />;
}
