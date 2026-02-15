import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Home, Leaf, Heart, Sparkles } from "lucide-react";

export const metadata = {
    title: "Bestellung erfolgreich | CSS Berlin",
};

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-lg space-y-6">
                {/* Main Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-berlin-green/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <CheckCircle className="w-10 h-10 text-berlin-green" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-css-orange rounded-full flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-berlin-green uppercase tracking-tight mb-2">
                        Herzlichen Glückwunsch!
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Deine Bestellung wurde erfolgreich abgeschlossen. Der Verkäufer wurde benachrichtigt und bereitet den Versand vor.
                    </p>

                    {/* Steps */}
                    <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-berlin-green" />
                            <span className="font-black text-gray-900 text-sm uppercase tracking-wider">Nächste Schritte</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="w-7 h-7 bg-berlin-green text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black">1</span>
                                <div>
                                    <span className="font-bold text-gray-900 text-sm">Verkäufer bereitet den Versand vor</span>
                                    <p className="text-xs text-gray-500 mt-0.5">Der Verkäufer hat 5 Werktage Zeit für den Versand.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="w-7 h-7 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black">2</span>
                                <div>
                                    <span className="font-bold text-gray-900 text-sm">Sendungsverfolgung per E-Mail</span>
                                    <p className="text-xs text-gray-500 mt-0.5">Du erhältst eine DHL-Tracking-Nummer.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="w-7 h-7 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black">3</span>
                                <div>
                                    <span className="font-bold text-gray-900 text-sm">Empfang bestätigen</span>
                                    <p className="text-xs text-gray-500 mt-0.5">Nach Erhalt bestätigst du den Empfang in deinem Dashboard.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link
                            href="/profile/orders"
                            className="w-full flex items-center justify-center gap-2 bg-css-orange text-berlin-green py-3.5 rounded-lg font-black text-sm uppercase tracking-widest hover:bg-berlin-green hover:text-white transition-colors duration-300"
                        >
                            Bestellung ansehen
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/"
                            className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Weiter einkaufen
                        </Link>
                    </div>
                </div>

                {/* Sustainability Card */}
                <div className="bg-gradient-to-br from-berlin-green to-berlin-green/90 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Leaf className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg mb-1">Du machst einen Unterschied!</h3>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Durch den Kauf von Second-Hand sparst du ca. <strong className="text-css-orange">3,6 kg CO₂</strong> und <strong className="text-css-orange">3.000 Liter Wasser</strong> im Vergleich zu Neuware. Gemeinsam machen wir Mode nachhaltiger.
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-xs text-white/50">
                        <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> WRAP Research 2024
                        </span>
                        <Link href="/nachhaltigkeit" className="underline hover:text-white transition-colors">
                            Mehr erfahren →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
