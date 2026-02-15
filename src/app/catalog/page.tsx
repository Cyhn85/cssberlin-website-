import { CatalogUI } from "@/components/catalog-ui";
import { db as prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const BRANDS = ["Nike", "Adidas", "Zara", "H&M", "Levi's", "Mango", "The North Face", "Dr. Martens", "Sony", "Vintage"];
const SIZES = [
    // Kleidung
    "XS", "S", "M", "L", "XL", "XXL", "3XL",
    // Schuhe
    "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46",
    // Jeans (Weite)
    "W26", "W27", "W28", "W29", "W30", "W31", "W32", "W33", "W34", "W36", "W38",
];
const CONDITIONS = ["NEW_WITH_TAGS", "NEW_WITHOUT_TAGS", "VERY_GOOD", "GOOD", "SATISFACTORY"];
const CONDITION_LABELS: Record<string, string> = {
    NEW_WITH_TAGS: "Neu mit Etikett",
    NEW_WITHOUT_TAGS: "Neu ohne Etikett",
    VERY_GOOD: "Sehr Gut",
    GOOD: "Gut",
    SATISFACTORY: "Zufriedenstellend",
};

const CATEGORY_MAP: Record<string, string[]> = {
    damen: ["Damen"],
    herren: ["Herren"],
    kinder: ["Kinder"],
    elektronik: ["Elektronik"],
    sonstiges: ["Sonstiges"],
    sale: [],
};

function getParam(val: string | string[] | undefined): string | undefined {
    if (!val) return undefined;
    return Array.isArray(val) ? val[0] : val;
}

function getArrayParam(val: string | string[] | undefined): string[] {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
}

export default async function CatalogPage(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams;
    const { userId: clerkId } = await auth();

    const brands = getArrayParam(searchParams.brand);
    const selectedSizes = getArrayParam(searchParams.size);
    const selectedConditions = getArrayParam(searchParams.condition);
    const category = getParam(searchParams.category);
    const query = getParam(searchParams.q);
    const sort = getParam(searchParams.sort) || "newest";

    let minPrice: number | undefined;
    let maxPrice: number | undefined;
    const minVal = Number(getParam(searchParams.min));
    const maxVal = Number(getParam(searchParams.max));
    if (!isNaN(minVal) && minVal > 0) minPrice = minVal;
    if (!isNaN(maxVal) && maxVal > 0) maxPrice = maxVal;

    // Sort logic
    let orderBy: Prisma.ProductOrderByWithRelationInput;
    switch (sort) {
        case "price-asc": orderBy = { price: "asc" }; break;
        case "price-desc": orderBy = { price: "desc" }; break;
        case "popular": orderBy = { viewCount: "desc" }; break;
        default: orderBy = { createdAt: "desc" };
    }

    // Prisma query
    const products = await prisma.product.findMany({
        where: {
            status: "AVAILABLE",
            ...(brands.length > 0 && { brand: { in: brands } }),
            ...(selectedSizes.length > 0 && { size: { in: selectedSizes } }),
            ...(selectedConditions.length > 0 && { condition: { in: selectedConditions } }),
            ...(minPrice !== undefined || maxPrice !== undefined ? {
                price: { gte: minPrice, lte: maxPrice }
            } : {}),
            ...(query ? {
                OR: [
                    { title: { contains: query, mode: "insensitive" as const } },
                    { brand: { contains: query, mode: "insensitive" as const } },
                    { description: { contains: query, mode: "insensitive" as const } },
                ]
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
        orderBy,
    });

    let favoritedProductIds = new Set<string>();
    if (clerkId) {
        const dbUser = await prisma.user.findUnique({
            where: { clerkId },
            select: { id: true },
        });
        if (dbUser) {
            const favorites = await prisma.favorite.findMany({
                where: { userId: dbUser.id },
                select: { productId: true }
            });
            favoritedProductIds = new Set(favorites.map(f => f.productId));
        }
    }

    const formattedProducts = products.map(product => ({
        id: product.id,
        title: product.title,
        price: Number(product.price),
        size: product.size,
        brand: product.brand,
        condition: String(product.condition),
        image: product.images[0]?.url || null,
        isFavorited: favoritedProductIds.has(product.id),
    }));

    return (
        <CatalogUI
            products={formattedProducts}
            brands={BRANDS}
            sizes={SIZES}
            conditions={CONDITIONS}
            conditionLabels={CONDITION_LABELS}
        />
    );
}
