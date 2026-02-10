export const runtime = "edge"; import { prisma } from "@/lib/prisma";
import { HomeClient } from "@/components/home-client";
import { auth } from "@clerk/nextjs/server";

// Ana sayfa server component - veritabanından çeker
export default async function HomePage() {
  const { userId } = await auth();

  // Veritabanından popüler ürünleri çek (En son 8 ürün)
  const products = await prisma.product.findMany({
    where: {
      status: "AVAILABLE",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 8,
    include: {
      images: {
        orderBy: { order: "asc" },
        take: 1,
      },
    },
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

  // Veriyi client component formatına dönüştür
  const popularProducts = products.map((product) => ({
    id: product.id,
    title: product.title,
    price: Number(product.price),
    brand: product.brand,
    size: product.size,
    condition: formatCondition(product.condition),
    image: product.images[0]?.url || null,
    isFavorited: favoritedProductIds.has(product.id),
  }));

  return <HomeClient popularProducts={popularProducts} />;
}

// Condition enum'unu Almanca'ya çevir
function formatCondition(condition: string): string {
  const conditionMap: Record<string, string> = {
    NEW_WITH_TAGS: "Neu mit Etikett",
    NEW_WITHOUT_TAGS: "Neu ohne Etikett",
    VERY_GOOD: "Sehr gut",
    GOOD: "Gut",
    SATISFACTORY: "Befriedigend",
  };
  return conditionMap[condition] || condition;
}
