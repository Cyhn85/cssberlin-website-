"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Wallet, Building2, ChevronRight, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";

// Demo transactions
const transactions = [
    {
        id: "TX-1",
        type: "sale",
        title: "Satış: Nike Air Force 1",
        amount: 45.00,
        date: "Today, 14:30",
        status: "completed"
    },
    {
        id: "TX-2",
        type: "withdrawal",
        title: "Banka Hesabına Transfer",
        amount: -120.50,
        date: "Yesterday, 09:15",
        status: "processing"
    },
    {
        id: "TX-3",
        type: "purchase",
        title: "Satın Alma: Levi's 501",
        amount: -35.00,
        date: "Feb 12",
        status: "completed"
    },
    {
        id: "TX-4",
        type: "refund",
        title: "İade: Zara Blazer",
        amount: 28.00,
        date: "Feb 10",
        status: "completed"
    }
];

export default function WalletPage() {
    const [balance, setBalance] = useState(75.55);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    return (
        <div className="page-container bg-gray-50">
            <div className="container px-4 md:px-6 py-6 max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Cüzdanım</h1>
                    <p className="text-gray-500 text-sm">Bakiye ve işlem geçmişinizi yönetin</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Main Balance Card */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-gradient-to-br from-[#2E9E5C] to-[#258A4F] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Wallet className="w-32 h-32" />
                            </div>

                            <div className="relative z-10">
                                <p className="text-green-100 font-medium mb-1">Mevcut Bakiye</p>
                                <h2 className="text-4xl font-bold mb-6">€{balance.toFixed(2)}</h2>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsWithdrawModalOpen(true)}
                                        className="bg-white text-[#2E9E5C] hover:bg-green-50 px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2"
                                    >
                                        <Building2 className="w-4 h-4" />
                                        Banka Hesabına Aktar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Son İşlemler</h3>
                                <Link href="#" className="text-sm text-[#2E9E5C] hover:underline flex items-center gap-1">
                                    Tümünü Gör <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {transactions.map((tx) => (
                                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                                                }`}>
                                                {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{tx.title}</p>
                                                <p className="text-xs text-gray-500">{tx.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold ${tx.amount > 0 ? "text-[#2E9E5C]" : "text-gray-900"}`}>
                                                {tx.amount > 0 ? "+" : ""}€{Math.abs(tx.amount).toFixed(2)}
                                            </p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${tx.status === "completed" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                                                }`}>
                                                {tx.status === "completed" ? "Tamamlandı" : "İşleniyor"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4">Ödeme Yöntemleri</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
                                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">•••• 4242</p>
                                        <p className="text-xs text-gray-500">Visa Debit</p>
                                    </div>
                                </div>
                                <button className="w-full py-2 text-sm text-[#2E9E5C] font-medium hover:bg-green-50 rounded-lg transition-colors dashed border border-green-200">
                                    + Yeni Kart Ekle
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-2xl p-6 text-blue-800 text-sm">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold mb-1">Güvenli Ödemeler</p>
                                    <p className="opacity-80">CSS Berlin üzerindeki tüm işlemler alıcı koruması kapsamındadır. Ödemeniz ürün teslim alınana kadar güvende tutulur.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Withdraw Modal */}
                {isWithdrawModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-scale-in">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Banka Hesabına Aktar</h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tutar (€)</label>
                                    <input
                                        type="number"
                                        defaultValue={balance}
                                        max={balance}
                                        className="input-field"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Maksimum çekilebilir bakiye: €{balance.toFixed(2)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                                    <input
                                        type="text"
                                        placeholder="DE00 0000 0000 0000 0000 00"
                                        className="input-field uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hesap Sahibi</label>
                                    <input
                                        type="text"
                                        placeholder="Ad Soyad"
                                        className="input-field"
                                    />
                                </div>

                                <div className="bg-yellow-50 p-3 rounded-lg flex items-start gap-2 text-xs text-yellow-700">
                                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <p>Transfer işlemleri genellikle 2-3 iş günü içerisinde hesabınıza yansır.</p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsWithdrawModalOpen(false)}
                                        className="btn-secondary flex-1"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-primary flex-1"
                                    >
                                        Onayla
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
