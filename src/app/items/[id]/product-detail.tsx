"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOffer } from "@/actions/offer-actions";
import { toggleFavorite } from "@/actions/favorite-actions";
import { useCart } from "@/lib/cart";
import {
    Heart,
    Share2,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    Shield,
    Clock,
    MapPin,
    Flag,
    Eye,
    AlertTriangle,
    Truck,
    Leaf,
    Package,
    ShoppingBag,
    Check,
} from "lucide-react";

const conditionLabels: Record<string, string> = {
    NEW_WITH_TAGS: "Neu mit Etikett",
    NEW_WITHOUT_TAGS: "Neu ohne Etikett",
    VERY_GOOD: "Sehr Gut",
    GOOD: "Gut",
    SATISFACTORY: "Zufriedenstellend",
};

interface ProductDetailProps {
    product: {
        id: string;
        title: string;
        description: string | null;
        price: number;
        brand: string | null;
        size: string | null;
        color: string | null;
        condition: string;
        viewCount: number;
        likeCount: number;
        createdAt: string;
        sellerId: string;
        categoryId: string | null;
        images: string[];
        seller: {
            id: string;
            clerkId: string;
            name: string;
            avatar: string;
            location: string;
            isVerified: boolean;
            memberSince: string;
            productCount: number;
            reviewCount: number;
        };
    };
    similarProducts: {
        id: string;
        title: string;
        price: number;
        brand: string | null;
        size: string | null;
        image: string;
    }[];
    sellerProducts: {
        id: string;
        title: string;
        price: number;
        image: string;
    }[];
    initialFavorited: boolean;
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 60) return `vor ${diffMin} Min.`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `vor ${diffH} Std.`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 30) return `vor ${diffD} Tagen`;
    const diffM = Math.floor(diffD / 30);
    return `vor ${diffM} Monaten`;
}

export function ProductDetail({ product, similarProducts, sellerProducts, initialFavorited }: ProductDetailProps) {
    const router = useRouter();
    const { addItem, isInCart } = useCart();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorited, setIsFavorited] = useState(initialFavorited);

    const [showOfferModal, setShowOfferModal] = useState(false);
    const [offerPrice, setOfferPrice] = useState("");
    const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const images = product.images.length > 0 ? product.images : ["/placeholder.svg"];

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    const handleFavorite = async () => {
        setIsFavorited(!isFavorited);
        try {
            const result = await toggleFavorite(product.id);
            if (!result.success) {
                setIsFavorited(isFavorited);
                showToast(result.error || "Fehler", "error");
            }
        } catch {
            setIsFavorited(isFavorited);
        }
    };

    const handleAddToCart = () => {
        if (isInCart(product.id)) {
            router.push("/cart");
            return;
        }
        addItem({
            productId: product.id,
            title: product.title,
            price: product.price,
            brand: product.brand,
            size: product.size,
            image: product.images[0] || null,
        });
        showToast("Artikel zum Warenkorb hinzugefügt!", "success");
    };

    const handleMakeOffer = async () => {
        if (!offerPrice) return;
        const price = parseFloat(offerPrice);
        if (isNaN(price) || price <= 0) {
            showToast("Bitte geben Sie einen gültigen Preis ein.", "error");
            return;
        }
        setIsSubmittingOffer(true);
        try {
            const result = await createOffer(product.id, product.sellerId, price);
            if (result.success) {
                setShowOfferModal(false);
                setOfferPrice("");
                showToast(`Preisvorschlag über €${price.toFixed(2).replace(".", ",")} gesendet!`, "success");
                setTimeout(() => router.push("/inbox"), 1500);
            } else {
                showToast(result.error || "Fehler beim Senden.", "error");
            }
        } catch {
            showToast("Verbindungsfehler. Bitte versuchen Sie es erneut.", "error");
        } finally {
            setIsSubmittingOffer(false);
        }
    };

    const handleReport = (e: React.FormEvent) => {
        e.preventDefault();
        showToast("Bericht gesendet. Wir werden dies überprüfen.", "success");
        setShowReportModal(false);
        setReportReason("");
    };

    return (
        <div className="bg-[var(--background)] min-h-screen">
            <div className="page-container py-6">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mb-6 hidden md:block">
                    <Link href="/" className="hover:text-berlin-green transition-colors">Startseite</Link>
                    <span className="mx-2">/</span>
                    <Link href="/catalog" className="hover:text-berlin-green transition-colors">Katalog</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{product.title}</span>
                </nav>

                {/* 3-Column Layout */}
                <div className="grid lg:grid-cols-12 gap-6">

                    {/* LEFT: Image Gallery (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="relative aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <Image
                                src={images[currentImageIndex]}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            {images.length > 1 && (
                                <>
                                    <button type="button" title="Vorheriges Bild" onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10">
                                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                                    </button>
                                    <button type="button" title="Nächstes Bild" onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10">
                                        <ChevronRight className="w-5 h-5 text-gray-700" />
                                    </button>
                                </>
                            )}
                            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                                {currentImageIndex + 1} / {images.length}
                            </div>
                            <button type="button" title="Merken" onClick={handleFavorite} className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-10">
                                <Heart className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                            </button>
                            <button type="button" title="Teilen" className="absolute top-3 left-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-10">
                                <Share2 className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        title={`Bild ${index + 1}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                            currentImageIndex === index ? "border-berlin-green ring-2 ring-green-100" : "border-transparent opacity-70 hover:opacity-100"
                                        }`}
                                    >
                                        <Image src={image} alt={`${product.title} ${index + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CENTER: Product Details (4 cols) */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* Price & Title */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <span className="text-3xl font-black text-berlin-green">
                                €{product.price.toFixed(2).replace(".", ",")}
                            </span>
                            <p className="text-xs text-gray-500 mt-1 mb-3">
                                inkl. MwSt. zzgl. <Link href="#versand" className="underline">Versand</Link>
                            </p>
                            <h1 className="text-xl font-bold text-gray-900 leading-snug mb-3">{product.title}</h1>

                            <div className="flex items-center gap-4 text-xs text-gray-500 py-3 border-y border-gray-100">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" /> {timeAgo(product.createdAt)}
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" /> {product.viewCount}
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span className="flex items-center gap-1">
                                    <Heart className="w-3.5 h-3.5" /> {product.likeCount}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 space-y-2">
                                <button
                                    type="button"
                                    onClick={() => router.push(`/checkout?product=${product.id}`)}
                                    className="w-full bg-css-orange text-berlin-green hover:bg-berlin-green hover:text-white font-black py-3 rounded-lg transition-colors duration-300 text-sm uppercase tracking-widest"
                                >
                                    Sofort kaufen
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowOfferModal(true)}
                                        className="border-2 border-css-orange text-css-orange hover:bg-css-orange hover:text-berlin-green font-black py-2.5 rounded-lg transition-colors duration-300 text-xs uppercase tracking-widest"
                                    >
                                        Preisvorschlag
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        className={`font-black py-2.5 rounded-lg transition-colors duration-300 text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 ${
                                            isInCart(product.id)
                                                ? "bg-berlin-green text-white"
                                                : "border-2 border-berlin-green text-berlin-green hover:bg-berlin-green hover:text-white"
                                        }`}
                                    >
                                        {isInCart(product.id) ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                                        {isInCart(product.id) ? "Im Warenkorb" : "Warenkorb"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <h2 className="font-black text-xs text-berlin-green uppercase tracking-widest mb-3">Artikelmerkmale</h2>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                                {product.brand && (
                                    <div>
                                        <span className="text-gray-500 text-xs">Marke</span>
                                        <p className="font-bold text-gray-900 uppercase">{product.brand}</p>
                                    </div>
                                )}
                                {product.size && (
                                    <div>
                                        <span className="text-gray-500 text-xs">Größe</span>
                                        <p className="font-bold text-gray-900">{product.size}</p>
                                    </div>
                                )}
                                <div>
                                    <span className="text-gray-500 text-xs">Zustand</span>
                                    <p className="font-bold text-berlin-green">{conditionLabels[product.condition] || product.condition}</p>
                                </div>
                                {product.color && (
                                    <div>
                                        <span className="text-gray-500 text-xs">Farbe</span>
                                        <p className="font-bold text-gray-900">{product.color}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                <h2 className="font-black text-xs text-berlin-green uppercase tracking-widest mb-3">Beschreibung</h2>
                                <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        {/* Shipping Info */}
                        <div id="versand" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <h2 className="font-black text-xs text-berlin-green uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5" /> Versand
                            </h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-1.5 border-b border-gray-50">
                                    <span className="text-gray-600 flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-gray-400" /> Klein (DHL)</span>
                                    <span className="font-bold">€3,49</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-50">
                                    <span className="text-gray-600 flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-gray-400" /> Mittel (DHL)</span>
                                    <span className="font-bold">€4,99</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-50">
                                    <span className="text-gray-600 flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-gray-400" /> Groß (DHL)</span>
                                    <span className="font-bold">€6,99</span>
                                </div>
                                <p className="text-berlin-green font-bold text-xs flex items-center gap-1 pt-1">
                                    <Leaf className="w-3.5 h-3.5" /> Kostenloser Versand ab €50
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Seller Card (3 cols) */}
                    <div className="lg:col-span-3 space-y-5">
                        {/* Seller */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="relative">
                                    {product.seller.avatar ? (
                                        <Image src={product.seller.avatar} alt={product.seller.name} width={48} height={48} className="rounded-full object-cover border-2 border-white shadow-sm" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-berlin-green flex items-center justify-center text-white text-lg font-bold">
                                            {product.seller.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    {product.seller.isVerified && (
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-berlin-green border-2 border-white rounded-full flex items-center justify-center" title="Verifiziert">
                                            <Shield className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <Link href={`/profile/${product.seller.id}`} className="font-bold text-gray-900 hover:text-berlin-green truncate block text-sm">
                                        {product.seller.name}
                                    </Link>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>{product.seller.productCount} Artikel</span>
                                        <span className="text-gray-300">·</span>
                                        <span>{product.seller.reviewCount} Bew.</span>
                                    </div>
                                    {product.seller.location && (
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                            <MapPin className="w-3 h-3" /> {product.seller.location}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Link
                                    href={`/inbox?product=${product.id}`}
                                    className="w-full flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors"
                                >
                                    <MessageCircle className="w-3.5 h-3.5" /> Nachricht senden
                                </Link>
                                <Link
                                    href={`/profile/${product.seller.id}`}
                                    className="w-full flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Profil ansehen
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setShowReportModal(true)}
                                    className="w-full flex items-center justify-center gap-1.5 text-gray-400 py-2 rounded-lg text-xs hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <Flag className="w-3.5 h-3.5" /> Melden
                                </button>
                            </div>
                        </div>

                        {/* Käuferschutz */}
                        <div className="bg-gradient-to-br from-css-orange/5 to-css-orange/10 rounded-2xl p-4 border border-css-orange/20">
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-berlin-green flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm mb-1">Käuferschutz</h3>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Geld-zurück-Garantie bei Nichterhalt oder erheblicher Abweichung.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Climate */}
                        <div className="bg-gradient-to-br from-berlin-green/5 to-berlin-green/10 rounded-2xl p-4 border border-berlin-green/20">
                            <div className="flex items-start gap-3">
                                <Leaf className="w-5 h-5 text-berlin-green flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-berlin-green text-sm mb-1">Climate Smart</h3>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Du sparst ca. <strong className="text-berlin-green">3,6 kg CO₂</strong> durch diesen Second-Hand-Kauf.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seller's Other Products */}
                {sellerProducts.length > 0 && (
                    <section className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-berlin-green uppercase tracking-tight">
                                Mehr von {product.seller.name}
                            </h2>
                            <Link href={`/profile/${product.seller.id}`} className="text-css-orange font-bold text-xs hover:text-berlin-green transition-colors uppercase tracking-widest">
                                Alle anzeigen →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                            {sellerProducts.map((item) => (
                                <Link key={item.id} href={`/items/${item.id}`} className="group">
                                    <div className="aspect-[3/4] relative overflow-hidden rounded-lg border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 text-xs">Kein Bild</div>
                                        )}
                                        <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-sm font-black text-xs shadow text-berlin-green">
                                            €{item.price.toFixed(2).replace(".", ",")}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs font-bold text-gray-900 truncate">{item.title}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <section className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-berlin-green uppercase tracking-tight">Ähnliche Produkte</h2>
                            <Link href="/catalog" className="text-css-orange font-bold text-xs hover:text-berlin-green transition-colors uppercase tracking-widest">
                                Alle anzeigen →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                            {similarProducts.map((item) => (
                                <Link key={item.id} href={`/items/${item.id}`} className="group">
                                    <div className="aspect-[3/4] relative overflow-hidden rounded-lg border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 text-xs">Kein Bild</div>
                                        )}
                                        <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-sm font-black text-xs shadow text-berlin-green">
                                            €{item.price.toFixed(2).replace(".", ",")}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs font-bold text-gray-900 truncate">{item.title}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Offer Modal */}
            {showOfferModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowOfferModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Preisvorschlag senden</h2>
                            <button type="button" title="Schließen" onClick={() => setShowOfferModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl mb-6 flex items-center justify-between">
                            <span className="text-gray-600 font-medium">Listenpreis</span>
                            <span className="text-lg font-bold text-gray-900">€{product.price.toFixed(2).replace(".", ",")}</span>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Dein Angebot (€)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">€</span>
                                <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="0,00" className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-berlin-green focus:border-transparent" step="0.01" min="1" autoFocus />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Empfohlener Bereich: €{(product.price * 0.8).toFixed(0)} - €{(product.price * 0.95).toFixed(0)}</p>
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setShowOfferModal(false)} className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-lg transition-colors">Abbrechen</button>
                            <button type="button" onClick={handleMakeOffer} disabled={!offerPrice || parseFloat(offerPrice) <= 0 || isSubmittingOffer} className="flex-1 bg-css-orange text-berlin-green hover:bg-berlin-green hover:text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmittingOffer ? "Senden..." : "Angebot senden"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowReportModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2 text-red-600 mb-4">
                            <AlertTriangle className="w-5 h-5" />
                            <h2 className="text-lg font-bold text-gray-900">Artikel melden</h2>
                        </div>
                        <form onSubmit={handleReport}>
                            <div className="space-y-2 mb-4">
                                {["Gefälschter Artikel", "Verbotener Artikel", "Betrugsverdacht", "Unangemessene Inhalte", "Spam"].map((reason) => (
                                    <label key={reason} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input type="radio" name="reason" value={reason} className="w-4 h-4 text-red-600" onChange={(e) => setReportReason(e.target.value)} required />
                                        <span className="ml-3 text-sm font-medium text-gray-700">{reason}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors">Abbrechen</button>
                                <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-colors">Melden</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-xl shadow-2xl font-bold text-sm flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300 ${
                    toast.type === "success" ? "bg-berlin-green text-white" : "bg-red-600 text-white"
                }`}>
                    {toast.type === "success" ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    {toast.message}
                </div>
            )}
        </div>
    );
}
