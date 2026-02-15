import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";
import { FavoritesClient } from "@/components/favorites-client";
import { Heart } from "lucide-react";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
        redirect("/sign-in");
    }

    // Look up internal DB user by Clerk ID
    const dbUser = await prisma.user.findUnique({
        where: { clerkId },
        select: { id: true },
    });

    if (!dbUser) {
        redirect("/sign-in");
    }

    const favorites = await prisma.favorite.findMany({
        where: { userId: dbUser.id },
        include: {
            product: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                    brand: true,
                    size: true,
                    condition: true,
                    images: {
                        take: 1,
                        orderBy: { order: "asc" },
                        select: { url: true }
                    },
                    seller: {
                        select: {
                            username: true,
                            firstName: true
                        }
                    }
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const formattedProducts = favorites.map(f => ({
        id: f.product.id,
        title: f.product.title,
        price: Number(f.product.price),
        brand: f.product.brand,
        size: f.product.size,
        condition: String(f.product.condition),
        image: f.product.images[0]?.url || null,
        seller: {
            name: f.product.seller.firstName || f.product.seller.username || "Verkäufer"
        }
    }));

    return (
        <div className="page-container bg-gray-50 min-h-screen py-8">
            <div className="container px-4 md:px-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Heart className="w-6 h-6 text-css-orange fill-current" />
                        Merkliste
                        <span className="text-gray-400 text-lg font-normal">({formattedProducts.length})</span>
                    </h1>
                </div>

                <FavoritesClient initialProducts={formattedProducts} />
            </div>
        </div>
    );
}
