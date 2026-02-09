"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ChevronRight, CreditCard, MapPin, Package, Shield, Truck } from "lucide-react";

// Mock Product Data for Checkout
const product = {
    id: "1",
    title: "Nike Air Force 1 Low - Beyaz Sneaker",
    price: 45.0,
    shipping: 4.99,
    protectionFee: 2.25, // Alıcı koruması ücreti (~%5)
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=200&h=200&fit=crop",
    seller: "alex_style",
};

export default function CheckoutPage() {
    const [step, setStep] = useState(1); // 1: Address, 2: Shipping, 3: Payment
    const [selectedAddress, setSelectedAddress] = useState("addr1");
    const [selectedShipping, setSelectedShipping] = useState("dhl");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const total = product.price + product.shipping + product.protectionFee;

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="page-container flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-scale-in">
                    <Check className="w-10 h-10 text-[#2E9E5C]" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Siparişiniz Alındı!</h1>
                <p className="text-gray-600 mb-8 text-center max-w-md">
                    Ödemeniz başarıyla gerçekleşti. Satıcı ürünü kargoladığında size haber vereceğiz.
                </p>
                <div className="flex gap-4">
                    <Link href="/orders" className="btn-secondary">
                        Siparişimi Takip Et
                    </Link>
                    <Link href="/" className="btn-primary">
                        Alışverişe Devam Et
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container bg-gray-50 min-h-screen py-8">
            <div className="container max-w-4xl px-4 md:px-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Ödeme Yap</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content - Steps */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Step 1: Address */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm">1</div>
                                    Teslimat Adresi
                                </h2>
                                <button className="text-[#2E9E5C] text-sm font-medium hover:underline">Değiştir</button>
                            </div>

                            <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer bg-gray-50 border-[#2E9E5C] ring-1 ring-[#2E9E5C]">
                                <input
                                    type="radio"
                                    name="address"
                                    checked={selectedAddress === "addr1"}
                                    onChange={() => setSelectedAddress("addr1")}
                                    className="mt-1 text-[#2E9E5C] focus:ring-[#2E9E5C]"
                                />
                                <div>
                                    <div className="font-medium text-gray-900">Ev Adresim</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Mustafa Kemal Atatürk Cd. No:1 D:5<br />
                                        Kreuzberg, Berlin 10999<br />
                                        Almanya
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Step 2: Shipping Method */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm">2</div>
                                    Kargo Seçeneği
                                </h2>
                            </div>

                            <div className="space-y-3">
                                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${selectedShipping === "dhl" ? "border-[#2E9E5C] bg-green-50/30" : "hover:bg-gray-50"}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="shipping"
                                            checked={selectedShipping === "dhl"}
                                            onChange={() => setSelectedShipping("dhl")}
                                            className="text-[#2E9E5C] focus:ring-[#2E9E5C]"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">DHL Paket</div>
                                            <div className="text-xs text-gray-500">2-3 iş günü, Sigortalı</div>
                                        </div>
                                    </div>
                                    <span className="font-semibold text-gray-900">€4.99</span>
                                </label>

                                <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${selectedShipping === "hermes" ? "border-[#2E9E5C] bg-green-50/30" : "hover:bg-gray-50"}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="shipping"
                                            checked={selectedShipping === "hermes"}
                                            onChange={() => setSelectedShipping("hermes")}
                                            className="text-[#2E9E5C] focus:ring-[#2E9E5C]"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">Hermes PaketShop</div>
                                            <div className="text-xs text-gray-500">3-5 iş günü, Teslim Noktasına</div>
                                        </div>
                                    </div>
                                    <span className="font-semibold text-gray-900">€3.79</span>
                                </label>
                            </div>
                        </div>

                        {/* Step 3: Payment */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm">3</div>
                                    Ödeme Yöntemi
                                </h2>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <CreditCard className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium text-gray-900">Kredi Kartı</span>
                                </div>
                                <div className="space-y-3">
                                    <input type="text" placeholder="Kart Numarası" className="input-field bg-white" defaultValue="**** **** **** 4242" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="text" placeholder="SKT (AA/YY)" className="input-field bg-white" defaultValue="12/26" />
                                        <input type="text" placeholder="CVC" className="input-field bg-white" defaultValue="***" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Shield className="w-3 h-3 text-[#2E9E5C]" />
                                Ödemeniz SSL ile şifrelenir ve güvendedir.
                            </div>
                        </div>

                    </div>

                    {/* Sidebar - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-24">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900 mb-4">Sipariş Özeti</h3>
                                <div className="flex gap-3 mb-4">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <Image src={product.image} alt={product.title} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{product.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">Satıcı: {product.seller}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Ürün Fiyatı</span>
                                    <span>€{product.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Kargo</span>
                                    <span>€{product.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        Alıcı Koruması
                                        <Shield className="w-3 h-3 text-[#2E9E5C]" />
                                    </span>
                                    <span>€{product.protectionFee.toFixed(2)}</span>
                                </div>

                                <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Toplam</span>
                                    <span>€{total.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className="btn-primary w-full mt-6 py-3 text-lg relative"
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Verarbeitung...
                                        </span>
                                    ) : (
                                        "Zahlungspflichtig bestellen"
                                    )}
                                </button>

                                <p className="text-xs text-center text-gray-400 mt-4">
                                    "Ödemeyi Tamamla" butonuna basarak <a href="#" className="underline">Kullanıcı Sözleşmesi</a>'ni kabul etmiş olursunuz.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
