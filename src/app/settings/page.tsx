"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, MapPin, Save, User } from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile"); // profile | account | notifications

    return (
        <div className="page-container bg-gray-50">
            <div className="container px-4 md:px-6 py-6 max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="md:col-span-1">
                        <nav className="bg-white rounded-2xl shadow-sm p-2 space-y-1 sticky top-24">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "profile"
                                        ? "bg-green-50 text-[#2E9E5C]"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                Profil Bilgileri
                            </button>
                            <button
                                onClick={() => setActiveTab("account")}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "account"
                                        ? "bg-green-50 text-[#2E9E5C]"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                Hesap Ayarları
                            </button>
                            <button
                                onClick={() => setActiveTab("notifications")}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "notifications"
                                        ? "bg-green-50 text-[#2E9E5C]"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                Bildirimler
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                            {/* Profile Settings */}
                            {activeTab === "profile" && (
                                <form className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Profil Bilgileri</h2>

                                    {/* Avatar Upload */}
                                    <div className="flex flex-col items-center sm:flex-row gap-6">
                                        <div className="relative group cursor-pointer">
                                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-md">
                                                <Image
                                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop"
                                                    alt="Profile"
                                                    width={96}
                                                    height={96}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="font-semibold text-gray-900">Profil Fotoğrafı</h3>
                                            <p className="text-sm text-gray-500 mb-3">Diğer kullanıcılar sizi bu fotoğrafla tanıyacak.</p>
                                            <button type="button" className="text-sm text-[#2E9E5C] font-medium hover:underline">Fotoğrafı Değiştir</button>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                                            <input type="text" defaultValue="Alex Style" className="input-field" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
                                            <input type="text" defaultValue="alex_style" className="input-field bg-gray-50" disabled />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hakkımda (Bio)</label>
                                        <textarea
                                            className="input-field h-32 resize-none"
                                            defaultValue="Vintage kıyafetler ve sneaker koleksiyoncusuyum. Berlin'de yaşıyorum. Tüm ürünlerim orijinaldir."
                                            placeholder="Kendinizden bahsedin..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="text" defaultValue="Berlin, Germany" className="input-field pl-10" />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button className="btn-primary flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Değişiklikleri Kaydet
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Account Settings */}
                            {activeTab === "account" && (
                                <form className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Hesap Ayarları</h2>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
                                        <input type="email" defaultValue="alex@example.com" className="input-field" />
                                    </div>

                                    <div className="pt-4 border-t">
                                        <h3 className="font-semibold text-gray-900 mb-4">Şifre Değiştir</h3>
                                        <div className="space-y-4">
                                            <input type="password" placeholder="Mevcut Şifre" className="input-field" />
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <input type="password" placeholder="Yeni Şifre" className="input-field" />
                                                <input type="password" placeholder="Yeni Şifre (Tekrar)" className="input-field" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <h3 className="font-semibold text-gray-900 mb-4">Tatil Modu</h3>
                                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                                            <div>
                                                <p className="font-medium text-gray-900">Ürünlerimi Gizle</p>
                                                <p className="text-sm text-gray-500">Tatildeyken veya satışa ara vermek istediğinizde ürünlerinizi geçici olarak gizleyin.</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2E9E5C]"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <button className="btn-primary flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Ayarları Kaydet
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Notifications Settings */}
                            {activeTab === "notifications" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Bildirim Tercihleri</h2>

                                    {[
                                        { title: "Yeni Mesajlar", desc: "Biri size mesaj gönderdiğinde bildirim alın" },
                                        { title: "Yeni Teklifler", desc: "Ürünlerinize teklif geldiğinde haberdar olun" },
                                        { title: "Fiyat Düşüşleri", desc: "Favorilerinizdeki ürünlerin fiyatı düştüğünde" },
                                        { title: "Satılan Ürünler", desc: "Bir ürününüz satıldığında anında bilgi alın" },
                                        { title: "Kampanyalar", desc: "Özel teklifler ve kampanyalardan haberdar olun" },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center justify-between py-2">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.title}</p>
                                                <p className="text-sm text-gray-500">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2E9E5C]"></div>
                                            </label>
                                        </div>
                                    ))}

                                    <div className="pt-4 flex justify-end border-t mt-4">
                                        <button className="btn-primary flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Tercihleri Kaydet
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
