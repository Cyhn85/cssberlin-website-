import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";

export default function CheckoutSuccessPage() {
    return (
        <div className="page-container bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="container px-4 md:px-6 py-12 max-w-lg text-center">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-[#2E9E5C]" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Siparişiniz Alındı! 🎉
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Ödemeniz başarıyla tamamlandı. Siparişiniz satıcıya iletildi.
                    </p>

                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                        <div className="flex items-center gap-2 mb-3">
                            <Package className="w-5 h-5 text-[#2E9E5C]" />
                            <span className="font-semibold text-gray-900">Sipariş #ORD-2024-004</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>Tahmini teslimat: 3-5 iş günü</p>
                            <p>Sipariş onay e-postası gönderildi.</p>
                        </div>
                    </div>

                    {/* What's Next */}
                    <div className="text-left mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Sırada Ne Var?</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-[#2E9E5C] text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                                    1
                                </span>
                                <span>Satıcı ürünü hazırlayacak ve kargoya verecek</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                                    2
                                </span>
                                <span>Kargo takip bilgisi e-posta ile iletilecek</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                                    3
                                </span>
                                <span>Ürün teslim edildiğinde onaylamanız istenecek</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            href="/profile/orders"
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            Siparişi Görüntüle
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/"
                            className="btn-secondary w-full flex items-center justify-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            Alışverişe Devam Et
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
