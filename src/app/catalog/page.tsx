export const runtime = "edge";

import { CatalogUI } from "@/components/catalog-ui";
import { db as prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Next.js 15+ compatibility for searchParams
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const BRANDS = ["Nike", "Adidas", "Zara", "H&M", "Levi's", "Mango", "The North Face", "Dr. Martens", "Sony", "Vintage"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "36", "38", "40", "42", "44"];
const CONDITIONS = ["Neu", "Sehr gut", "Gut", "Zufriedenstellend"];

export default async function CatalogPage(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams;
    const { userId } = await auth();

    // Filtreleri hazırla
    const brandParam = searchParams.brand;
    let brands: string[] | undefined;

    if (brandParam) {
        if (Array.isArray(brandParam)) {
            brands = brandParam;
        } else {
            brands = [brandParam];
        }
    }

    let minPrice: number | undefined;
    let maxPrice: number | undefined;

    if (searchParams.min) {
        const val = Number(Array.isArray(searchParams.min) ? searchParams.min[0] : searchParams.min);
        if (!isNaN(val)) minPrice = val;
    }

    if (searchParams.max) {
        const val = Number(Array.isArray(searchParams.max) ? searchParams.max[0] : searchParams.max);
        if (!isNaN(val)) maxPrice = val;
    }

    // Prisma Sorgusu
    const products = await prisma.product.findMany({
        where: {
            status: "AVAILABLE",
            ...(brands && { brand: { in: brands } }),
            ...(minPrice !== undefined || maxPrice !== undefined ? {
                price: {
                    gte: minPrice,
                    lte: maxPrice,
                }
            } : {}),
        },
        select: {
            id: true,
            title: true,
            price: true,
            size: true,
            brand: true,
            condition: true,
            images: {
                take: 1,
                orderBy: { order: "asc" },
                select: { url: true }
            }
        },
        orderBy: { createdAt: "desc" },
    });

    // Kullanıcının favorilerini çek
    let favoritedProductIds = new Set<string>();
    if (userId) {
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            select: { productId: true }
        });
        favoritedProductIds = new Set(favorites.map(f => f.productId));
    }

    // UI Formatına Dönüştür
    const formattedProducts = products.map(product => ({
        id: product.id,
        title: product.title,
        price: Number(product.price),
        size: product.size,
        brand: product.brand,
        condition: String(product.condition), // Enum to string conversion explictly
        image: product.images[0]?.url || null,
        isFavorited: favoritedProductIds.has(product.id),
    }));

    return (
        <CatalogUI
            products={formattedProducts}
            brands={BRANDS}
            sizes={SIZES}
            conditions={CONDITIONS}
        />
    );
}
