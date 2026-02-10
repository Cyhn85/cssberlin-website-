import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { images: { take: 1 } },
  });

  return (
    <div className="w-full">
      {/* Hero: Tam genişlikte ama içerik ortalı */}
      <section className="w-full bg-[#1a3b28] text-white py-24 md:py-32">
        <div className="page-container text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
            BERLIN<br /><span className="text-green-400">VINTAGE</span>
          </h1>
          <p className="text-lg text-green-100/70 mb-10 max-w-xl mx-auto">
            Nachhaltige Mode aus Berlin. Entdecke einzigartige Schätze.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/catalog" className="bg-white text-[#1a3b28] px-10 py-4 rounded-full font-black hover:bg-gray-100 transition-colors">
              JETZT SHOPPEN
            </Link>
            <Link href="/sell" className="border-2 border-white px-10 py-4 rounded-full font-black hover:bg-white/10 transition-colors">
              VERKAUFEN
            </Link>
          </div>
        </div>
      </section>

      {/* Ürünler: Sayfa konteynerı içinde ortalı */}
      <section className="page-container py-20">
        <h2 className="text-3xl font-black text-[#1a3b28] mb-12">Frisch Eingetroffen</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link href={`/items/${product.id}`} key={product.id} className="group">
              <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden relative">
                {product.images[0] && (
                  <img src={product.images[0].url} alt={product.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-lg font-black text-sm shadow-md">
                  €{Number(product.price).toFixed(2)}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-gray-800 truncate">{product.title}</h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{product.brand || "Vintage"}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}