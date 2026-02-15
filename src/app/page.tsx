import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowRight, Sparkles, Filter, SlidersHorizontal, Leaf, Droplets, Factory, ChevronRight } from "lucide-react";
import { ProductGrid } from "@/components/product-grid";

const climateSlides = [
    {
        text: "Second-Hand spart bis zu 73% Wasser im Vergleich zu Neuproduktion",
        source: "WRAP Research 2024",
        href: "/nachhaltigkeit",
        icon: "droplets",
    },
    {
        text: "Fast Fashion verursacht 10% der globalen CO₂-Emissionen",
        source: "UN Environment Programme",
        href: "/nachhaltigkeit",
        icon: "factory",
    },
    {
        text: "Jetzt verkaufen — bis zu 90% des Erlöses gehen an dich!",
        source: "CSS Berlin",
        href: "/sell",
        icon: "leaf",
    },
];

export default async function HomePage() {
    const { userId: clerkId } = await auth();

    const products = await prisma.product.findMany({
        where: { status: "AVAILABLE" },
        orderBy: { createdAt: "desc" },
        take: 12,
        include: { images: { take: 1 } },
    });

    // Fetch user's favorited product IDs
    let favoritedIds: string[] = [];
    if (clerkId) {
        const dbUser = await prisma.user.findUnique({
            where: { clerkId },
            select: { id: true },
        });
        if (dbUser) {
            const favs = await prisma.favorite.findMany({
                where: { userId: dbUser.id },
                select: { productId: true },
            });
            favoritedIds = favs.map((f) => f.productId);
        }
    }

    const serializedProducts = products.map((p) => ({
        id: p.id,
        title: p.title,
        price: Number(p.price),
        brand: p.brand,
        size: p.size,
        condition: p.condition,
        image: p.images[0]?.url || null,
        isFavorited: favoritedIds.includes(p.id),
    }));

    return (
        <div className="w-full flex flex-col bg-white">

            {/* BANNER SECTION: Climate Info */}
            <section className="page-container pt-6 pb-4">
                <div className="w-full">
                    {/* Climate Info */}
                    <div className="bg-gradient-to-br from-berlin-green/5 to-berlin-green/10 border border-berlin-green/20 rounded-xl p-5 overflow-hidden relative w-full">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-berlin-green/60 mb-3">Climate Smart Solutions</p>
                        <div className="space-y-3">
                            {climateSlides.map((slide, i) => (
                                <Link
                                    key={i}
                                    href={slide.href}
                                    className="flex items-start gap-3 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-berlin-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {slide.icon === "droplets" && <Droplets className="w-4 h-4 text-berlin-green" />}
                                        {slide.icon === "factory" && <Factory className="w-4 h-4 text-css-orange" />}
                                        {slide.icon === "leaf" && <Leaf className="w-4 h-4 text-berlin-green" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-800 leading-snug group-hover:text-berlin-green transition-colors">{slide.text}</p>
                                        <p className="text-[9px] text-gray-400 mt-0.5">{slide.source}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-berlin-green transition-colors flex-shrink-0 mt-1" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Feed */}
            <main className="page-container py-8 md:py-12">
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                    <h2 className="text-2xl md:text-4xl font-black text-berlin-green italic uppercase tracking-tighter">
                        Frisch Eingetroffen
                    </h2>
                    <div className="flex gap-3">
                        <Link href="/catalog" className="flex items-center gap-2 px-4 py-2 bg-css-orange text-berlin-green rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-berlin-green hover:text-white transition-colors duration-300">
                            <Filter className="w-3 h-3" /> Filter
                        </Link>
                        <button type="button" className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-sm text-[10px] font-black uppercase tracking-widest hover:border-css-orange transition-colors">
                            <SlidersHorizontal className="w-3 h-3" /> Sortieren
                        </button>
                    </div>
                </div>

                <ProductGrid products={serializedProducts} />

                {/* View All Button */}
                <div className="mt-16 flex justify-center">
                    <Link
                        href="/catalog"
                        className="group flex items-center gap-4 bg-css-orange text-berlin-green px-10 py-4 rounded-lg font-black uppercase tracking-[0.2em] text-xs hover:bg-berlin-green hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        Alle Produkte Ansehen
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
