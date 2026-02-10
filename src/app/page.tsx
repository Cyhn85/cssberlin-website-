import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { images: { take: 1 } },
  });

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* 21st.dev Style Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center bg-[#1a3b28] overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="page-container relative z-10 text-center text-white">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">BERLIN VINTAGE</h1>
          <p className="text-lg md:text-xl text-green-100/80 mb-10 max-w-2xl mx-auto">
            Sustainable fashion from the heart of Spandau. Buy, sell, and bargain.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/catalog" className="bg-white text-[#1a3b28] px-10 py-4 rounded-full font-black hover:scale-105 transition-transform">SHOP NOW</Link>
            <Link href="/sell" className="border-2 border-white text-white px-10 py-4 rounded-full font-black hover:bg-white/10 transition-all">SELL ITEMS</Link>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="page-container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Populär in Berlin</h2>
            <p className="text-gray-500">En son eklenen parçalar</p>
          </div>
          <Link href="/catalog" className="text-[#1a3b28] font-bold hover:underline">Tümünü gör →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link href={`/items/${product.id}`} key={product.id} className="product-card group">
              <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                {product.images[0] && (
                  <img src={product.images[0].url} alt={product.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                )}
                <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-md font-black text-sm shadow-sm">
                  €{Number(product.price)}
                </div>
              </div>
              <div className="p-4">
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