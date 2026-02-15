import { notFound } from "next/navigation";
import { db as prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import {
    Star,
    MapPin,
    Calendar,
    Shield,
    Package,
    Heart,
    ImageIcon,
} from "lucide-react";

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            products: {
                where: { status: "AVAILABLE" },
                orderBy: { createdAt: "desc" },
                take: 20,
                include: {
                    images: {
                        take: 1,
                        orderBy: { order: "asc" },
                    },
                },
            },
            reviews: {
                take: 10,
                orderBy: { createdAt: "desc" },
                include: {
                    reviewer: {
                        select: {
                            id: true,
                            username: true,
                            firstName: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
            followers: true,
            following: true,
        },
    });

    if (!user) {
        notFound();
    }

    const displayName = user.username || user.firstName || "Benutzer";
    const avgRating = user.reviews.length > 0
        ? Math.round((user.reviews.reduce((sum, r) => sum + r.rating, 0) / user.reviews.length) * 10) / 10
        : 0;
    const memberSince = new Date(user.createdAt).toLocaleDateString("de-DE", { month: "long", year: "numeric" });

    return (
        <div className="bg-[#fdfbf7] min-h-screen">
            <div className="page-container py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            {user.avatarUrl ? (
                                <Image
                                    src={user.avatarUrl}
                                    alt={displayName}
                                    width={100}
                                    height={100}
                                    className="rounded-full object-cover border-4 border-white shadow-md"
                                />
                            ) : (
                                <div className="w-[100px] h-[100px] rounded-full bg-berlin-green flex items-center justify-center text-white text-3xl font-black shadow-md">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            {user.isVerified && (
                                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-berlin-green border-3 border-white rounded-full flex items-center justify-center shadow-sm" title="Verifizierter Verkäufer">
                                    <Shield className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900">
                                {user.firstName || displayName} {user.lastName || ""}
                            </h1>
                            <p className="text-gray-500 text-sm">@{displayName.toLowerCase().replace(/\s/g, "")}</p>

                            {user.bio && (
                                <p className="text-gray-600 mt-3 max-w-xl">{user.bio}</p>
                            )}

                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
                                {user.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {user.location}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    Mitglied seit {memberSince}
                                </span>
                                {user.reviews.length > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold text-gray-900">{avgRating}</span>
                                        <span>({user.reviews.length} Bewertungen)</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100">
                        <div className="text-center">
                            <div className="text-2xl font-black text-berlin-green">{user.products.length}</div>
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Artikel</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-berlin-green">{user.followers.length}</div>
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Follower</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-berlin-green">{user.following.length}</div>
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Folgt</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-berlin-green">{avgRating || "–"}</div>
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">Bewertung</div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="mb-8">
                    <h2 className="text-xl font-black text-berlin-green italic uppercase tracking-tighter mb-6">
                        Kleiderschrank ({user.products.length})
                    </h2>
                    {user.products.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {user.products.map((product) => (
                                <Link key={product.id} href={`/items/${product.id}`} className="group flex flex-col">
                                    <div className="aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden relative border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                        {product.images[0] ? (
                                            <Image
                                                src={product.images[0].url}
                                                alt={product.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-css-orange text-berlin-green px-3 py-1 text-[8px] font-black uppercase tracking-[0.15em] rounded-sm shadow-sm">
                                                {product.condition || "VINTAGE"}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-sm font-black text-sm shadow-lg text-berlin-green border border-gray-100">
                                            &euro;{Number(product.price).toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="mt-3 px-1 space-y-1">
                                        <h3 className="font-black text-sm text-gray-900 uppercase tracking-tight truncate">{product.title}</h3>
                                        <div className="flex items-center gap-2">
                                            {product.brand && <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">{product.brand}</p>}
                                            {product.brand && product.size && <span className="text-gray-200">&bull;</span>}
                                            {product.size && <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">{product.size}</p>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-100">
                            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Dieser Benutzer hat noch keine Artikel eingestellt.</p>
                        </div>
                    )}
                </div>

                {/* Reviews Section */}
                <div>
                    <h2 className="text-xl font-black text-berlin-green italic uppercase tracking-tighter mb-6">
                        Bewertungen ({user.reviews.length})
                    </h2>
                    {user.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {user.reviews.map((review) => (
                                <div key={review.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                        {review.reviewer.avatarUrl ? (
                                            <Image
                                                src={review.reviewer.avatarUrl}
                                                alt={review.reviewer.username || "User"}
                                                width={48}
                                                height={48}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                                <ImageIcon className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900">
                                                {review.reviewer.firstName || review.reviewer.username || "Benutzer"}
                                            </span>
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className="text-gray-600 text-sm">{review.comment}</p>
                                        )}
                                        <p className="text-gray-400 text-xs mt-1">
                                            {new Date(review.createdAt).toLocaleDateString("de-DE")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
                            <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Noch keine Bewertungen vorhanden.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
