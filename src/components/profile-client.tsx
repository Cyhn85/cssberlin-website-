"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
    Settings,
    Package,
    Heart,
    Star,
    MapPin,
    Calendar,
    Shield,
    Edit,
    Grid,
    ChevronRight,
    ShoppingBag,
    Wallet,
    Bell,
    HelpCircle,
    ImageIcon,
} from "lucide-react";

type ProfileProduct = {
    id: string;
    title: string;
    price: number;
    status: string;
    image: string | null;
};

type ProfileReview = {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    reviewer: {
        id: string;
        username: string | null;
        firstName: string | null;
        avatarUrl: string | null;
    };
};

type ProfileData = {
    id: string;
    clerkId: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    location: string | null;
    isVerified: boolean;
    createdAt: Date;
    stats: {
        productCount: number;
        soldCount: number;
        followerCount: number;
        followingCount: number;
        rating: number;
        reviewCount: number;
    };
    walletBalance: number;
    products: ProfileProduct[];
    reviews: ProfileReview[];
};

interface ProfileClientProps {
    profile: ProfileData;
}

type MenuItem = {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    badge?: string | null;
    isWallet?: boolean;
};

const menuItems: MenuItem[] = [
    { icon: Package, label: "Meine Bestellungen", href: "/profile/orders" },
    { icon: ShoppingBag, label: "Meine Verkäufe", href: "/profile/sales" },
    { icon: Heart, label: "Favoriten", href: "/favorites" },
    { icon: Wallet, label: "Geldbörse", href: "/wallet", isWallet: true },
    { icon: Bell, label: "Benachrichtigungen", href: "/notifications" },
    { icon: Settings, label: "Einstellungen", href: "/settings" },
    { icon: HelpCircle, label: "Hilfe", href: "/help" },
];

export function ProfileClient({ profile }: ProfileClientProps) {
    const { user: clerkUser } = useUser();
    const [activeTab, setActiveTab] = useState<"products" | "reviews">("products");

    // Clerk'ten gelen verilerle DB'den gelen verileri birleştir
    const displayName = profile.firstName || clerkUser?.firstName || "Benutzer";
    const displayUsername = profile.username || clerkUser?.username || "user";
    const displayAvatar = profile.avatarUrl || clerkUser?.imageUrl || null;
    const memberSince = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString("de-DE", { month: "long", year: "numeric" })
        : "Neu";

    return (
        <div className="page-container bg-gray-50">
            <div className="container px-4 md:px-6 py-6">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="relative">
                                    {displayAvatar ? (
                                        <Image
                                            src={displayAvatar}
                                            alt={displayName}
                                            width={80}
                                            height={80}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                    )}
                                    {profile.isVerified && (
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--css-green)] rounded-full flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h1 className="font-bold text-xl text-gray-900">
                                        {displayName} {profile.lastName || ""}
                                    </h1>
                                    <p className="text-gray-500">@{displayUsername}</p>
                                    {profile.stats.reviewCount > 0 && (
                                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium">{profile.stats.rating}</span>
                                            <span>({profile.stats.reviewCount} Bewertungen)</span>
                                        </div>
                                    )}
                                </div>
                                <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-lg">
                                    <Edit className="w-5 h-5 text-gray-400" />
                                </Link>
                            </div>

                            {profile.bio && <p className="text-gray-600 mb-4">{profile.bio}</p>}

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                {profile.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {profile.location}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {memberSince}
                                </span>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="text-center">
                                    <div className="font-bold text-xl text-gray-900">{profile.stats.productCount}</div>
                                    <div className="text-xs text-gray-500">Artikel</div>
                                </div>
                                <div className="text-center border-x border-gray-200">
                                    <div className="font-bold text-xl text-gray-900">{profile.stats.followerCount}</div>
                                    <div className="text-xs text-gray-500">Follower</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-xl text-gray-900">{profile.stats.followingCount}</div>
                                    <div className="text-xs text-gray-500">Folge ich</div>
                                </div>
                            </div>
                        </div>

                        {/* Menu */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            {menuItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors ${index > 0 ? "border-t border-gray-100" : ""
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 text-gray-400" />
                                        <span className="flex-1 text-gray-700">{item.label}</span>
                                        {item.badge && (
                                            <span className="px-2 py-0.5 bg-[var(--css-green)] text-white text-xs rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                        {item.isWallet && (
                                            <span className="font-semibold text-[var(--css-green)]">
                                                €{profile.walletBalance.toFixed(2)}
                                            </span>
                                        )}
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tabs */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="flex border-b">
                                <button
                                    onClick={() => setActiveTab("products")}
                                    className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === "products"
                                        ? "text-[var(--css-green)] border-b-2 border-[var(--css-green)]"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <Grid className="w-5 h-5 inline-block mr-2" />
                                    Mein Kleiderschrank ({profile.stats.productCount})
                                </button>
                                <button
                                    onClick={() => setActiveTab("reviews")}
                                    className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === "reviews"
                                        ? "text-[var(--css-green)] border-b-2 border-[var(--css-green)]"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    <Star className="w-5 h-5 inline-block mr-2" />
                                    Bewertungen ({profile.stats.reviewCount})
                                </button>
                            </div>

                            <div className="p-6">
                                {activeTab === "products" ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {profile.products.length > 0 ? (
                                            profile.products.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/items/${product.id}`}
                                                    className={`relative bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow ${product.status === "SOLD" ? "opacity-60" : ""
                                                        }`}
                                                >
                                                    <div className="relative aspect-[4/5] bg-gray-100">
                                                        {product.image ? (
                                                            <Image
                                                                src={product.image}
                                                                alt={product.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                                                <ImageIcon className="w-10 h-10" />
                                                            </div>
                                                        )}
                                                        {product.status === "SOLD" && (
                                                            <span className="absolute top-2 left-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md">
                                                                Verkauft
                                                            </span>
                                                        )}
                                                        {product.status === "RESERVED" && (
                                                            <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-md">
                                                                Reserviert
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="p-3">
                                                        <div className="font-bold text-[var(--css-green)]">
                                                            €{product.price.toFixed(2).replace(".", ",")}
                                                        </div>
                                                        <div className="text-sm text-gray-600 truncate">{product.title}</div>
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-12 text-gray-500">
                                                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                <p>Noch keine Artikel im Kleiderschrank</p>
                                            </div>
                                        )}

                                        {/* Add Product Card */}
                                        <Link
                                            href="/sell"
                                            className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 hover:border-[var(--css-green)] hover:bg-green-50/50 transition-colors min-h-[200px]"
                                        >
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <Package className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <span className="font-medium text-gray-600">Artikel hochladen</span>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {profile.reviews.length > 0 ? (
                                            profile.reviews.map((review) => (
                                                <div key={review.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
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
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <ImageIcon className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium">
                                                                {review.reviewer.firstName || review.reviewer.username || "Benutzer"}
                                                            </span>
                                                            <div className="flex text-yellow-400">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"
                                                                            }`}
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
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">
                                                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                <p>Noch keine Bewertungen</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
