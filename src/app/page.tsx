import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function HomePage() {
  // Mevcut Prisma sorgunuz korunuyor
  const products = await prisma.product.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { images: { take: 1 } },
  });

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#1a3b28] text-white py-16 md:py-24">
        <div className="page-container text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Vintage Market 2026</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
            BERLIN<br /><span className="text-green-400">VINTAGE</span>
          </h1>
          <p className="text-lg text-green-100/70 mb-10 max-w-xl mx-auto">
            Nachhaltige Mode aus Berlin-Spandau. Entdecke einzigartige Schätze.
          </p>
          <div className="flex gap-4">
            <Link href="/catalog" className="bg-white text-[#1a3b28] px-10 py-4 rounded-full font-black hover:scale-105 transition-all">
              SHOPPEN
            </Link>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="page-container py-20">
        <h2 className="text-3xl font-black text-[#1a3b28] mb-12">Frisch Eingetroffen</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link href={`/items/${product.id}`} key={product.id} className="group">
              <div className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden relative shadow-sm">
                {product.images[0] && (
                  <img src={product.images[0].url} alt={product.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1 rounded-lg font-black text-sm shadow-sm text-[#1a3b28]">
                  €{Number(product.price).toFixed(2)}
                </div>
              </div>
              <div className="mt-4 px-2">
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