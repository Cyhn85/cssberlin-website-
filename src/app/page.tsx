import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { images: { take: 1 } },
  });

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section - Yükseklik 650'den 500'e çekildi */}
      <section className="relative h-[500px] flex items-center justify-center bg-[#1a3b28] text-white overflow-hidden">
        <div className="page-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Est. 2026 Berlin</span>
          </div>

          {/* Yazı boyutu 9xl'den 6xl'e düşürüldü */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
            BERLIN<br /><span className="text-green-400">VINTAGE</span>
          </h1>

          <p className="text-base md:text-lg text-green-100/70 mb-8 max-w-xl mx-auto">
            Nachhaltige Mode aus Berlin. Entdecke einzigartige Schätze.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/catalog" className="bg-white text-[#1a3b28] px-8 py-3 rounded-full font-black hover:scale-105 transition-transform flex items-center gap-2">
              JETZT SHOPPEN <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/sell" className="border-2 border-white text-white px-8 py-3 rounded-full font-black hover:bg-white/10 transition-all">
              VERKAUFEN
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Bölümü */}
      <section className="page-container">
        <h2 className="text-3xl font-black text-[#1a3b28] mb-8">Frisch Eingetroffen</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link href={`/items/${product.id}`} key={product.id} className="product-card group block">
              <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden rounded-t-xl">
                {product.images[0] && (
                  <img src={product.images[0].url} alt={product.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                )}
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded font-bold text-xs shadow">
                  €{Number(product.price).toFixed(2)}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm truncate">{product.title}</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{product.brand || "Vintage"}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}