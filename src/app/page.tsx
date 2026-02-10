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
    <div className="w-full flex flex-col items-center">
      {/* Hero Section - Tam genişlik ama içerik ortalı */}
      <section className="w-full bg-[#1a3b28] text-white py-16 md:py-24 flex justify-center border-b border-white/5">
        <div className="page-container text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Est. 2026 Berlin</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
            BERLIN<br /><span className="text-green-400">VINTAGE</span>
          </h1>

          <p className="text-base md:text-lg text-green-100/70 mb-8 max-w-xl mx-auto">
            Nachhaltige Mode aus Berlin. Entdecke einzigartige Schätze.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/catalog" className="bg-white text-[#1a3b28] px-10 py-4 rounded-full font-black hover:scale-105 transition-all flex items-center gap-2">
              JETZT SHOPPEN <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/sell" className="border-2 border-white text-white px-10 py-4 rounded-full font-black hover:bg-white/10 transition-all">
              VERKAUFEN
            </Link>
          </div>
        </div>
      </section>

      {/* Ürünler Bölümü */}
      <section className="page-container py-16">
        <h2 className="text-3xl font-black text-[#1a3b28] mb-10 text-center md:text-left">Frisch Eingetroffen</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <Link href={`/items/${product.id}`} key={product.id} className="group flex flex-col">
              <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden relative shadow-sm">
                {product.images[0] && (
                  <img src={product.images[0].url} alt={product.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg font-black text-sm shadow-sm text-[#1a3b28]">
                  €{Number(product.price).toFixed(2)}
                </div>
              </div>
              <div className="mt-4 px-1">
                <h3 className="font-bold text-gray-900 truncate">{product.title}</h3>
                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">{product.brand || "Vintage"}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}