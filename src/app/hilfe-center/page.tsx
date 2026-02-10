import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

export default async function HomePage() {
    const products = await prisma.product.findMany({
        where: { status: "AVAILABLE" },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { images: { take: 1 } },
    });

    return (
        <div className="flex flex-col gap-20 pb-20">
            {/* Premium Hero Section */}
            <section className="relative h-[650px] flex items-center justify-center bg-[#1a3b28] overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>

                <div className="page-container relative z-10 text-center text-white">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-fade-in">
                        <Sparkles className="w-4 h-4 text-green-400" />
                        <span className="text-xs font-bold tracking-widest uppercase">Est. 2026 Berlin-Spandau</span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-none">
                        BERLIN<br /><span className="text-green-400">VINTAGE</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-green-100/70 mb-12 max-w-2xl mx-auto font-medium">
                        Nachhaltige Mode aus dem Herzen Berlins. Entdecke einzigartige Schätze.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <Link href="/catalog" className="btn-primary text-lg px-12 py-5 bg-white text-[#1a3b28] hover:bg-green-50">
                            JETZT SHOPPEN <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/sell" className="px-12 py-5 rounded-full border-2 border-white/30 text-white font-black hover:bg-white/10 transition-all">
                            ARTIKEL VERKAUFEN
                        </Link>
                    </div>
                </div>
            </section>

            {/* Modern Product Grid */}
            <section className="page-container">
                <div className="flex items-end justify-between mb-12 border-b border-gray-100 pb-8">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-[#1a3b28]">Frisch Eingetroffen</h2>
                        <p className="text-gray-500 mt-2 text-lg font-medium">Die neuesten Fundstücke aus Spandau</p>
                    </div>
                    <Link href="/catalog" className="group flex items-center gap-2 text-[#1a3b28] font-black text-sm uppercase tracking-wider">
                        Alle ansehen <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <Link href={`/items/${product.id}`} key={product.id} className="product-card group">
                            <div className="aspect-[3/4] bg-[#f3f4f1] relative overflow-hidden">
                                {product.images[0] ? (
                                    <img
                                        src={product.images[0].url}
                                        alt={product.title}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300">
                                        <ShoppingBag className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-black text-sm shadow-xl text-[#1a3b28]">
                                    €{Number(product.price).toFixed(2)}
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.2em] mb-2">{product.brand || "Vintage Collection"}</p>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1a3b28] transition-colors truncate">{product.title}</h3>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400">Berlin, DE</span>
                                    <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                                    <span className="text-xs font-bold text-gray-400">Zustand: Gut</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}