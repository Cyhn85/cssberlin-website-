"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { createProduct } from "@/actions/product-actions";
import {
    X,
    Camera,
    Info,
    Check,
    ArrowLeft,
    Package,
    Truck,
    Loader2
} from "lucide-react";

// Kategoriler Backend (Seed Data) ile uyumlu
const categories = [
    { id: "damen", name: "Damen (Kadın)", subcategories: ["Giyim", "Ayakkabı", "Çanta"] },
    { id: "herren", name: "Herren (Erkek)", subcategories: ["Giyim", "Ayakkabı", "Aksesuar"] },
    { id: "schuhe", name: "Schuhe (Ayakkabı)", subcategories: ["Spor", "Bot", "Klasik"] },
];

const conditions = [
    { id: "new_with_tags", name: "Yeni Etiketli", description: "Hiç giyilmedi, etiketi üzerinde" },
    { id: "new_without_tags", name: "Yeni Etiketsiz", description: "Hiç giyilmedi, etiketi yok" },
    { id: "very_good", name: "Çok İyi", description: "Az kullanıldı, kusur yok" },
    { id: "good", name: "İyi", description: "Kullanıldı, küçük kusurlar olabilir" },
    { id: "satisfactory", name: "Tatminkar", description: "Görünür kullanım izleri" },
];

const shippingSizes = [
    { id: "small", name: "Küçük", description: "Aksesuar, takı (max 500g)", price: 3.49 },
    { id: "medium", name: "Orta", description: "T-shirt, pantolon (max 2kg)", price: 4.99 },
    { id: "large", name: "Büyük", description: "Palto, mont (max 10kg)", price: 6.99 },
];

export default function SellPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [images, setImages] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [size, setSize] = useState("");
    const [condition, setCondition] = useState("");
    const [price, setPrice] = useState("");
    const [shippingSize, setShippingSize] = useState("");

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (images.length === 0) {
            alert("Lütfen en az 1 fotoğraf yükleyin.");
            return;
        }

        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum <= 0) {
            alert("Geçerli bir fiyat giriniz.");
            return;
        }

        startTransition(async () => {
            try {
                const result = await createProduct({
                    title,
                    description,
                    price: priceNum,
                    categoryId: category, // slug olarak gönderiyoruz (damen, herren vs)
                    brand,
                    size,
                    condition,
                    images,
                });

                if (result.success) {
                    alert("Ürün başarıyla yayınlandı! 🎉");
                    router.push("/profile"); // Profile yönlendir
                } else {
                    alert("Hata: " + result.error);
                }
            } catch (error) {
                console.error("Submit error:", error);
                alert("Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        });
    };

    const priceNum = parseFloat(price) || 0;
    const serviceFee = priceNum * 0.05;
    const earnings = priceNum - serviceFee;

    return (
        <div className="page-container bg-gray-50 pb-32">
            <div className="container px-4 md:px-6 py-6 max-w-3xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Ürün Sat</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload (Uploadthing) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="font-semibold text-gray-900 mb-4">Fotoğraflar</h2>
                        <div className="grid grid-cols-4 gap-3">
                            {/* Yüklenen Resimler */}
                            {images.map((image, index) => (
                                <div key={index} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group">
                                    <Image src={image} alt={`Ürün ${index + 1}`} fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white" />
                                    </button>
                                    {index === 0 && (
                                        <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-[#2E9E5C] text-white text-[10px] rounded">
                                            Kapak
                                        </span>
                                    )}
                                </div>
                            ))}

                            {/* Upload Button */}
                            {images.length < 8 && (
                                <div className="col-span-1 aspect-square relative">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl hover:border-[#2E9E5C] hover:bg-green-50/50 transition-colors group">
                                        <UploadButton
                                            endpoint="productImage"
                                            onClientUploadComplete={(res) => {
                                                if (res) {
                                                    const newUrls = res.map((r) => r.url);
                                                    setImages((prev) => [...prev, ...newUrls].slice(0, 8));
                                                }
                                            }}
                                            onUploadError={(error: Error) => {
                                                alert(`Hata: ${error.message}`);
                                            }}
                                            appearance={{
                                                button: "w-full h-full bg-transparent text-transparent", // Görünmez buton overlay
                                                allowedContent: "hidden"
                                            }}
                                        />
                                        {/* Custom UI underneath the invisible button */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <Camera className="w-8 h-8 text-gray-400 mb-2 group-hover:text-[#2E9E5C]" />
                                            <span className="text-xs text-gray-500">Yükle</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Maksimum 8 fotoğraf. İlk fotoğraf kapak resmi olur.
                        </p>
                    </div>

                    {/* Title & Description */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                        <div>
                            <label className="block font-medium text-gray-900 mb-2">Başlık</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="örn: Nike Air Force 1 Low Beyaz 42"
                                className="input-field w-full p-3 border rounded-lg"
                                maxLength={80}
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-900 mb-2">Açıklama</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ürünün detayları..."
                                className="input-field w-full p-3 border rounded-lg min-h-[120px]"
                                maxLength={1000}
                                required
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                        <label className="block font-medium text-gray-900">Kategori</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input-field w-full p-3 border rounded-lg"
                            required
                        >
                            <option value="">Seçiniz</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Product Details */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                        <h2 className="font-semibold text-gray-900">Detaylar</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium">Marka</label>
                                <input
                                    type="text"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="input-field w-full p-3 border rounded-lg"
                                    placeholder="Zara, Nike..."
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium">Beden</label>
                                <input
                                    type="text"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    className="input-field w-full p-3 border rounded-lg"
                                    placeholder="42, M, S..."
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">Durum</label>
                            <select
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                className="input-field w-full p-3 border rounded-lg"
                                required
                            >
                                <option value="">Seçiniz</option>
                                {conditions.map((cond) => (
                                    <option key={cond.id} value={cond.id}>
                                        {cond.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                        <h2 className="font-semibold text-gray-900">Fiyat</h2>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="input-field w-full p-3 pl-10 border rounded-lg"
                                placeholder="0.00"
                                step="0.01"
                                min="1"
                                required
                            />
                        </div>
                        {priceNum > 0 && (
                            <div className="flex justify-between p-4 bg-gray-50 rounded-lg text-sm">
                                <span>Kazancınız (Tahmini):</span>
                                <span className="font-bold text-[#2E9E5C]">€{earnings.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    {/* Shipping */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                        <h2 className="font-semibold text-gray-900">Kargo Boyutu</h2>
                        <div className="grid gap-3">
                            {shippingSizes.map((ship) => (
                                <label key={ship.id} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer ${shippingSize === ship.id ? "border-[#2E9E5C] bg-green-50" : "hover:bg-gray-50"}`}>
                                    <input
                                        type="radio"
                                        name="shipping"
                                        value={ship.id}
                                        checked={shippingSize === ship.id}
                                        onChange={(e) => setShippingSize(e.target.value)}
                                        className="accent-[#2E9E5C]"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium">{ship.name}</div>
                                        <div className="text-xs text-gray-500">{ship.description}</div>
                                    </div>
                                    <div className="font-semibold">€{ship.price}</div>
                                </label>
                            ))}
                        </div>
                    </div>

                </form>

                {/* Submit Button */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40">
                    <div className="container max-w-3xl mx-auto flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={isPending || images.length === 0 || !title || !price}
                            className={`px-8 py-3 bg-[#2E9E5C] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#25854b] transition-colors ${isPending ? "opacity-70" : ""}`}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Yayınlanıyor...
                                </>
                            ) : (
                                <>
                                    <Package className="w-5 h-5" />
                                    Ürünü Yayınla
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
