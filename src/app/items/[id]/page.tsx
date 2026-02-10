"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOffer } from "@/actions/offer-actions";
import { toggleFavorite } from "@/actions/favorite-actions";
import {
    Heart,
    Share2,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    Star,
    Shield,
    Truck,
    Clock,
    MapPin,
    Flag,
    Eye,
    AlertTriangle,
} from "lucide-react";

// Mock Product Data
const product = {
    id: "1",
    title: "Nike Air Force 1 Low - Weiß Sneaker",
    description: `Original Nike Air Force 1 Low Sneaker. Nur wenige Male getragen, in sehr gutem Zustand.
    
• Farbe: Weiß
• Material: Leder
• Kaufjahr: 2024
• Originalverpackung vorhanden

Perfekt für Größe 42, sehr bequem. Bei Fragen gerne schreiben.`,
    price: 45.0,
    originalPrice: 120.0,
    brand: "Nike",
    size: "42",
    condition: "Sehr Gut",
    color: "Weiß",
    category: "Herren > Schuhe > Sneaker",
    views: 234,
    favorites: 18,
    createdAt: "vor 2 Tagen",
    sellerId: "seller1", // Added for logic
    images: [
        "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop",
    ],
    seller: {
        id: "seller1",
        name: "alex_style",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        rating: 4.8,
        reviewCount: 47,
        productCount: 23,
        location: "Berlin, Kreuzberg",
        memberSince: "Jan 2024",
        isVerified: true,
    },
};

const similarProducts = [
    {
        id: "2",
        title: "Adidas Stan Smith",
        price: 55.0,
        brand: "Adidas",
        size: "42",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    },
    {
        id: "3",
        title: "Converse Chuck Taylor",
        price: 32.0,
        brand: "Converse",
        size: "41",
        image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop",
    },
    {
        id: "4",
        title: "New Balance 574",
        price: 48.0,
        brand: "New Balance",
        size: "42",
        image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&h=400&fit=crop",
    },
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorited, setIsFavorited] = useState(false);

    // Offer State
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [offerPrice, setOfferPrice] = useState("");
    const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

    // Report State
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const handleFavorite = async () => {
        // Optimistic update
        setIsFavorited(!isFavorited);

        try {
            const result = await toggleFavorite(product.id);
            if (!result.success) {
                // Revert if failed
                setIsFavorited(!isFavorited);
                alert(result.error);
            }
        } catch (error) {
            setIsFavorited(!isFavorited);
        }
    };

    const handleMakeOffer = async () => {
        if (!offerPrice) return;

        setIsSubmittingOffer(true);
        try {
            const result = await createOffer(product.id, product.sellerId, parseFloat(offerPrice));

            if (result.success) {
                alert(`Preisvorschlag über €${offerPrice} gesendet!`);
                setShowOfferModal(false);
                setOfferPrice("");
                router.push("/inbox"); // Redirect to inbox to see the offer
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert("Ein Fehler ist aufgetreten.");
        } finally {
            setIsSubmittingOffer(false);
        }
    };

    const handleReport = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Bericht gesendet. Wir werden dies überprüfen.");
        setShowReportModal(false);
        setReportReason("");
    };

    return (
        <div className="bg-[#fdfbf7] min-h-screen">
            <div className="page-container py-6">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-500 mb-4 hidden md:block">
                    <Link href="/" className="hover:text-[#1a3b28]">
                        Startseite
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href="/catalog/men" className="hover:text-[#1a3b28]">
                        Herren
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href="/catalog/men/shoes" className="hover:text-[#1a3b28]">
                        Schuhe
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{product.title}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <Image
                                src={product.images[currentImageIndex]}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Navigation Arrows */}
                            {product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10"
                                    >
                                        <ChevronRight className="w-5 h-5 text-gray-700" />
                                    </button>
                                </>
                            )}

                            <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                                {currentImageIndex + 1} / {product.images.length}
                            </div>

                            <button
                                onClick={handleFavorite}
                                className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-10"
                            >
                                <Heart
                                    className={`w-5 h-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                                />
                            </button>

                            <button className="absolute top-3 left-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-10">
                                <Share2 className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index ? "border-[#1a3b28] ring-2 ring-green-100" : "border-transparent opacity-70 hover:opacity-100"
                                        }`}
                                >
                                    <Image
                                        src={image}
                                        alt={`${product.title} ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Price & Title */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl font-bold text-gray-900">
                                            €{product.price.toFixed(2).replace('.', ',')}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-lg text-gray-400 line-through decoration-gray-300">
                                                €{product.originalPrice.toFixed(2).replace('.', ',')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">
                                        inkl. MwSt. zzgl. <Link href="#" className="underline">Versand</Link>
                                    </div>
                                    <h1 className="text-xl font-semibold text-gray-900 leading-snug">{product.title}</h1>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 py-3 border-y border-gray-50">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {product.createdAt}
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="flex items-center gap-1.5">
                                    <Eye className="w-4 h-4 text-gray-400" />
                                    {product.views} Aufrufe
                                </span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="flex items-center gap-1.5">
                                    <Heart className="w-4 h-4 text-gray-400" />
                                    {product.favorites} Merkliste
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button className="btn-primary flex items-center justify-center gap-2 py-3 text-lg">
                                    Sofort kaufen
                                </button>
                                <button
                                    onClick={() => setShowOfferModal(true)}
                                    className="btn-secondary flex items-center justify-center gap-2 py-3 text-lg border-[#1a3b28] text-[#1a3b28] hover:bg-green-50"
                                >
                                    Preisvorschlag
                                </button>
                            </div>

                            <Link
                                href={`/inbox?product=${product.id}`}
                                className="mt-3 w-full btn-secondary border-gray-200 text-gray-600 flex items-center justify-center gap-2 py-2.5 group hover:text-[#1a3b28] hover:border-[#1a3b28]"
                            >
                                <MessageCircle className="w-5 h-5 group-hover:text-[#1a3b28] transition-colors" />
                                <span className="group-hover:text-[#1a3b28] transition-colors">Verkäufer kontaktieren</span>
                            </Link>
                        </div>

                        {/* Product Details */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Flag className="w-4 h-4 text-[#1a3b28]" />
                                Artikelmerkmale
                            </h2>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div className="detail-item">
                                    <span className="text-gray-500 block mb-1">Marke</span>
                                    <p className="font-medium text-gray-900 uppercase tracking-wide">{product.brand}</p>
                                </div>
                                <div className="detail-item">
                                    <span className="text-gray-500 block mb-1">Größe</span>
                                    <p className="font-medium text-gray-900">{product.size}</p>
                                </div>
                                <div className="detail-item">
                                    <span className="text-gray-500 block mb-1">Zustand</span>
                                    <p className="font-medium text-[#1a3b28] bg-green-50 px-2 py-0.5 rounded-md inline-block">{product.condition}</p>
                                </div>
                                <div className="detail-item">
                                    <span className="text-gray-500 block mb-1">Farbe</span>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: '#ffffff' }}></span>
                                        <p className="font-medium text-gray-900">{product.color}</p>
                                    </div>
                                </div>
                                <div className="detail-item col-span-2">
                                    <span className="text-gray-500 block mb-1">Kategorie</span>
                                    <p className="font-medium text-blue-600 hover:underline cursor-pointer">{product.category}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="font-semibold text-gray-900 mb-4">Beschreibung</h2>
                            <p className="text-gray-600 whitespace-pre-line leading-relaxed">{product.description}</p>
                        </div>

                        {/* Seller Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="relative">
                                    <Image
                                        src={product.seller.avatar}
                                        alt={product.seller.name}
                                        width={64}
                                        height={64}
                                        className="rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    {product.seller.isVerified && (
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--css-green)] border-2 border-white rounded-full flex items-center justify-center shadow-sm" title="Verifizierter Verkäufer">
                                            <Shield className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/profile/${product.seller.id}`}
                                        className="font-bold text-lg text-gray-900 hover:text-[#1a3b28] truncate block"
                                    >
                                        {product.seller.name}
                                    </Link>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-1">
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="font-semibold text-gray-900">{product.seller.rating}</span>
                                            <span className="text-gray-400">({product.seller.reviewCount})</span>
                                        </div>
                                        <span className="text-gray-300">•</span>
                                        <span>{product.seller.productCount} Artikel</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                        <MapPin className="w-3 h-3" />
                                        {product.seller.location}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-50">
                                <Link
                                    href={`/profile/${product.seller.id}`}
                                    className="flex-1 btn-secondary text-center text-sm"
                                >
                                    Profil ansehen
                                </Link>
                                <button
                                    onClick={() => setShowReportModal(true)}
                                    className="p-2.5 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors text-gray-400"
                                    title="Artikel melden"
                                >
                                    <Flag className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Protection Info */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 flex items-start gap-4 border border-green-100">
                            <div className="bg-white p-2 rounded-full shadow-sm">
                                <Shield className="w-6 h-6 text-[#1a3b28]" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Käuferschutz</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Ihr Geld ist sicher. Erhalten Sie den Artikel nicht oder weicht er von der Beschreibung ab, bekommen Sie Ihr Geld zurück.
                                    <a href="#" className="block mt-1 text-[#1a3b28] font-medium hover:underline">Mehr erfahren &rarr;</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Products */}
                <section className="mt-16 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Das könnte dir auch gefallen</h2>
                        <Link href="/catalog/men/shoes" className="text-[#1a3b28] font-medium hover:underline">
                            Alle anzeigen
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {similarProducts.map((item) => (
                            <Link key={item.id} href={`/items/${item.id}`} className="product-card group">
                                <div className="product-card-image bg-gray-100 aspect-[4/5] relative overflow-hidden rounded-t-xl">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <button className="absolute top-2 right-2 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-red-500 shadow-sm">
                                        <Heart className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-3">
                                    <div className="font-bold text-gray-900 mb-1">€{item.price.toFixed(2).replace('.', ',')}</div>
                                    <p className="text-sm text-gray-500 truncate mb-1">{item.brand}</p>
                                    <p className="text-xs text-gray-400">Größe {item.size}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            {/* Offer Modal */}
            {showOfferModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={() => setShowOfferModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Preisvorschlag senden</h2>
                            <button onClick={() => setShowOfferModal(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="sr-only">Schließen</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl mb-6 flex items-center justify-between">
                            <span className="text-gray-600 font-medium">Listenpreis</span>
                            <span className="text-lg font-bold text-gray-900">€{product.price.toFixed(2).replace('.', ',')}</span>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Dein Angebot (€)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">€</span>
                                <input
                                    type="number"
                                    value={offerPrice}
                                    onChange={(e) => setOfferPrice(e.target.value)}
                                    placeholder="0,00"
                                    className="input-field pl-8 text-lg font-bold"
                                    step="0.01"
                                    min="1"
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Empfohlener Bereich: €{(product.price * 0.8).toFixed(0)} - €{(product.price * 0.95).toFixed(0)}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowOfferModal(false)} className="flex-1 btn-secondary font-medium">
                                Abbrechen
                            </button>
                            <button
                                onClick={handleMakeOffer}
                                disabled={!offerPrice || parseFloat(offerPrice) <= 0 || isSubmittingOffer}
                                className="flex-1 btn-primary font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmittingOffer ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Senden...
                                    </span>
                                ) : (
                                    "Angebot senden"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={() => setShowReportModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="w-6 h-6" />
                                <h2 className="text-xl font-bold text-gray-900">Artikel melden</h2>
                            </div>
                            <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <p className="text-gray-600 mb-4 text-sm">
                            Bitte teilen Sie uns mit, warum Sie diesen Artikel melden möchten. Ihr Feedback bleibt anonym.
                        </p>

                        <form onSubmit={handleReport}>
                            <div className="space-y-3 mb-6">
                                {["Gefälschter Artikel / Replica", "Verbotener Artikel", "Betrugsverdacht", "Unangemessene Inhalte", "Spam"].map((reason) => (
                                    <label key={reason} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="reason"
                                            value={reason}
                                            className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                                            onChange={(e) => setReportReason(e.target.value)}
                                            required
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-700">{reason}</span>
                                    </label>
                                ))}
                            </div>

                            <textarea
                                className="input-field mb-6 h-24 resize-none text-sm"
                                placeholder="Weitere Details (optional)..."
                            ></textarea>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 btn-secondary font-medium">
                                    Abbrechen
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-lg shadow-red-200"
                                >
                                    Melden
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
