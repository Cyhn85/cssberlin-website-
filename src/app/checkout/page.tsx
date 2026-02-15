import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db as prisma } from "@/lib/db";
import Image from "next/image";
import { Shield, Truck, Package, Leaf } from "lucide-react";
import { CheckoutForm } from "./checkout-form";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function CheckoutPage(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams;
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const productId = typeof searchParams.product === "string" ? searchParams.product : null;

    if (!productId) {
        redirect("/");
    }

    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            images: { take: 1, orderBy: { order: "asc" } },
            seller: {
                select: { username: true, firstName: true },
            },
        },
    });

    if (!product || product.status !== "AVAILABLE") {
        redirect("/catalog");
    }

    const price = Number(product.price);
    const sellerName = product.seller?.username || product.seller?.firstName || "Verkäufer";

    return (
        <div className="bg-[#fdfbf7] min-h-screen">
            <div className="page-container py-8">
                <h1 className="text-2xl font-black text-berlin-green uppercase tracking-tight mb-8">
                    Bestellübersicht
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Summary */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-4">Artikel</h2>
                            <div className="flex gap-4">
                                <div className="relative w-24 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    {product.images[0] ? (
                                        <Image src={product.images[0].url} alt={product.title} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Package className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900">{product.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Verkäufer: {sellerName}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                        {product.brand && <span className="font-bold uppercase">{product.brand}</span>}
                                        {product.size && (
                                            <>
                                                <span className="text-gray-300">&bull;</span>
                                                <span>Größe {product.size}</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-lg font-black text-berlin-green mt-2">€{price.toFixed(2).replace(".", ",")}</p>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Form (Client Component) */}
                        <CheckoutForm productId={product.id} price={price} />

                        {/* Legal Notices */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">Rechtliche Hinweise</h2>
                            <div className="text-xs text-gray-500 leading-relaxed space-y-3">
                                <p>
                                    <strong>Widerrufsrecht:</strong> Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen
                                    Vertrag zu widerrufen. Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem Sie oder ein von Ihnen
                                    benannter Dritter die Ware in Besitz genommen haben.
                                </p>
                                <p>
                                    <strong>Preise:</strong> Alle angegebenen Preise sind Endpreise inkl. gesetzlicher MwSt.
                                    Versandkosten werden separat ausgewiesen.
                                </p>
                                <p>
                                    Mit Ihrer Bestellung erklären Sie sich mit unseren{" "}
                                    <a href="/agb" className="text-berlin-green underline">AGB</a>,{" "}
                                    <a href="/datenschutz" className="text-berlin-green underline">Datenschutzbestimmungen</a> und der{" "}
                                    <a href="/widerruf" className="text-berlin-green underline">Widerrufsbelehrung</a> einverstanden.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-black text-gray-900 uppercase tracking-wide text-sm mb-4">Kostenübersicht</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Artikelpreis</span>
                                        <span className="font-bold text-gray-900">€{price.toFixed(2).replace(".", ",")}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Truck className="w-3 h-3" />
                                            Versand (DHL)
                                        </span>
                                        <span className="font-bold text-gray-900">€4,99</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Shield className="w-3 h-3 text-berlin-green" />
                                            Käuferschutz
                                        </span>
                                        <span className="font-bold text-gray-900">€{Math.max(0.70, price * 0.05).toFixed(2).replace(".", ",")}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-black text-gray-900 uppercase tracking-wide text-sm">Gesamtbetrag</span>
                                    <span className="text-xl font-black text-berlin-green">
                                        €{(price + 4.99 + Math.max(0.70, price * 0.05)).toFixed(2).replace(".", ",")}
                                    </span>
                                </div>
                                <p className="text-[10px] text-gray-400">inkl. MwSt. gem. § 19 UStG</p>

                                {/* Käuferschutz Info */}
                                <div className="mt-4 p-3 bg-berlin-green/5 rounded-lg border border-berlin-green/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Shield className="w-4 h-4 text-berlin-green" />
                                        <span className="text-xs font-bold text-berlin-green">Käuferschutz inklusive</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500">
                                        Ihr Geld ist geschützt. Erhalten Sie den Artikel nicht, bekommen Sie Ihr Geld zurück.
                                    </p>
                                </div>

                                {/* Climate Smart */}
                                <div className="mt-3 p-3 bg-css-orange/5 rounded-lg border border-css-orange/20">
                                    <div className="flex items-center gap-2">
                                        <Leaf className="w-4 h-4 text-berlin-green" />
                                        <span className="text-[10px] text-gray-500">
                                            <strong className="text-berlin-green">Climate Smart:</strong> ~3,6 kg CO₂ gespart
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
