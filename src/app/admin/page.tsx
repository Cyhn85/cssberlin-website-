"use client";

import { useState } from "react";
import { Search, Shield, Trash2, Ban, Eye, AlertTriangle } from "lucide-react";

// Mock data
const users = [
    { id: 1, username: "alex_style", email: "alex@example.com", status: "active", reports: 0, joined: "2024-01-10" },
    { id: 2, username: "bad_user_99", email: "spam@bot.com", status: "suspended", reports: 12, joined: "2024-02-01" },
    { id: 3, username: "vintage_pro", email: "pro@store.com", status: "active", reports: 1, joined: "2023-11-20" },
    { id: 4, username: "scammer_alert", email: "fake@mail.com", status: "active", reports: 5, joined: "2024-02-08" },
];

const items = [
    { id: 1, title: "Nike Air Force 1", seller: "alex_style", price: 45, reports: 0, status: "active" },
    { id: 2, title: "Replica Rolex", seller: "scammer_alert", price: 150, reports: 8, status: "flagged" },
    { id: 3, title: "Vintage Jacket", seller: "vintage_pro", price: 89, reports: 0, status: "active" },
];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("users");

    return (
        <div className="page-container bg-gray-100 min-h-screen">
            {/* Admin Header */}
            <div className="bg-[#111827] text-white py-4 px-6 shadow-md">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-[#2E9E5C]" />
                        <h1 className="text-xl font-bold">CSS Berlin Admin</h1>
                    </div>
                    <div className="text-sm text-gray-400">Ver. 1.0.0</div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-white">
                    <div className="bg-blue-600 rounded-xl p-6 shadow-sm">
                        <h3 className="text-blue-100 text-sm font-medium mb-1">Toplam Kullanıcı</h3>
                        <p className="text-3xl font-bold">1,245</p>
                    </div>
                    <div className="bg-green-600 rounded-xl p-6 shadow-sm">
                        <h3 className="text-green-100 text-sm font-medium mb-1">Aktif Ürünler</h3>
                        <p className="text-3xl font-bold">8,532</p>
                    </div>
                    <div className="bg-orange-500 rounded-xl p-6 shadow-sm">
                        <h3 className="text-orange-100 text-sm font-medium mb-1">Bekleyen Raporlar</h3>
                        <p className="text-3xl font-bold">14</p>
                    </div>
                    <div className="bg-purple-600 rounded-xl p-6 shadow-sm">
                        <h3 className="text-purple-100 text-sm font-medium mb-1">Bugünkü Ciro</h3>
                        <p className="text-3xl font-bold">€3,450</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b px-6 flex items-center gap-6">
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === "users" ? "border-[#2E9E5C] text-[#2E9E5C]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        >
                            Kullanıcı Yönetimi
                        </button>
                        <button
                            onClick={() => setActiveTab("items")}
                            className={`py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === "items" ? "border-[#2E9E5C] text-[#2E9E5C]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                        >
                            Ürün Denetimi
                        </button>
                    </div>

                    {/* Toolbar */}
                    <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Ara..." className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:border-[#2E9E5C]" />
                        </div>
                    </div>

                    {/* User Table */}
                    {activeTab === "users" && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Kullanıcı</th>
                                        <th className="px-6 py-3">Durum</th>
                                        <th className="px-6 py-3">Raporlar</th>
                                        <th className="px-6 py-3">Katılım Tarihi</th>
                                        <th className="px-6 py-3 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{user.username}</div>
                                                <div className="text-gray-500 text-xs">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                    }`}>
                                                    {user.status === "active" ? "Aktif" : "Askıda"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.reports > 0 ? (
                                                    <span className="text-red-600 font-bold flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" /> {user.reports}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{user.joined}</td>
                                            <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded text-gray-500" title="Profili Gör">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-red-50 rounded text-red-500" title="Yasakla">
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Item Table */}
                    {activeTab === "items" && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Ürün</th>
                                        <th className="px-6 py-3">Satıcı</th>
                                        <th className="px-6 py-3">Fiyat</th>
                                        <th className="px-6 py-3">Durum</th>
                                        <th className="px-6 py-3 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                                            <td className="px-6 py-4 text-blue-600">@{item.seller}</td>
                                            <td className="px-6 py-4">€{item.price}</td>
                                            <td className="px-6 py-4">
                                                {item.status === "flagged" ? (
                                                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">Şüpheli</span>
                                                ) : (
                                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Onaylı</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded text-gray-500" title="Ürünü İncele">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-red-50 rounded text-red-500" title="Sil">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
