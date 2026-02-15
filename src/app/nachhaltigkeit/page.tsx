import { Leaf, Droplets, Factory, Recycle, TrendingDown, Heart } from "lucide-react";
import Link from "next/link";

const stats = [
    { icon: Droplets, value: "73%", label: "Wasserersparnis", desc: "Second-Hand spart im Vergleich zu Neuproduktion bis zu 73% Wasser." },
    { icon: Factory, value: "10%", label: "CO₂ der Modeindustrie", desc: "Fast Fashion ist für ca. 10% der globalen CO₂-Emissionen verantwortlich." },
    { icon: TrendingDown, value: "3,6 kg", label: "CO₂ pro Artikel", desc: "Jedes gebrauchte Kleidungsstück spart durchschnittlich 3,6 kg CO₂." },
    { icon: Recycle, value: "92 Mio.", label: "Tonnen Textilmüll/Jahr", desc: "Weltweit landen jährlich 92 Millionen Tonnen Textilien im Müll." },
];

const tips = [
    "Kaufe Second-Hand statt neu – jeder Artikel zählt.",
    "Repariere Kleidung, bevor du sie wegwirfst.",
    "Verkaufe Kleidung, die du nicht mehr trägst, auf CSSberlin.",
    "Wähle Qualität statt Quantität bei Neuanschaffungen.",
    "Wasche Kleidung bei niedrigeren Temperaturen.",
    "Unterstütze lokale Second-Hand Läden in deiner Nähe.",
];

export default function NachhaltigkeitPage() {
    return (
        <div className="flex flex-col gap-16 pb-20">
            {/* Hero */}
            <section className="relative bg-berlin-green text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="page-container relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                        <Leaf className="w-4 h-4 text-css-orange" />
                        <span className="text-xs font-bold tracking-widest uppercase">Climate Smart Solutions</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        Nachhaltigkeit
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                        Jedes gebrauchte Kleidungsstück, das ein neues Zuhause findet, ist ein Schritt in Richtung einer grüneren Zukunft.
                    </p>
                </div>
            </section>

            {/* Stats Grid */}
            <section className="page-container">
                <h2 className="text-3xl font-black text-berlin-green mb-8 text-center">Warum Second-Hand?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm text-center hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 bg-berlin-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icon className="w-7 h-7 text-berlin-green" />
                                </div>
                                <p className="text-4xl font-black text-css-orange mb-1">{stat.value}</p>
                                <p className="text-sm font-bold text-gray-900 mb-2">{stat.label}</p>
                                <p className="text-xs text-gray-500">{stat.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Impact Section */}
            <section className="bg-gradient-to-r from-berlin-green to-berlin-green/90 text-white py-16">
                <div className="page-container text-center">
                    <h2 className="text-3xl font-black mb-4">Dein Beitrag zählt</h2>
                    <p className="text-white/70 max-w-xl mx-auto mb-8">
                        Wenn du auf CSSberlin kaufst oder verkaufst, unterstützt du aktiv die Kreislaufwirtschaft und hilfst, die Umweltbelastung durch die Modeindustrie zu reduzieren.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/catalog"
                            className="bg-css-orange text-berlin-green font-black px-8 py-4 rounded-lg uppercase tracking-widest text-sm hover:bg-white hover:text-berlin-green transition-colors duration-300"
                        >
                            Nachhaltig Shoppen
                        </Link>
                        <Link
                            href="/sell"
                            className="border-2 border-white/30 text-white font-black px-8 py-4 rounded-lg uppercase tracking-widest text-sm hover:bg-white/10 transition-colors duration-300"
                        >
                            Artikel Verkaufen
                        </Link>
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className="page-container">
                <h2 className="text-3xl font-black text-berlin-green mb-8 text-center">Tipps für nachhaltigen Konsum</h2>
                <div className="max-w-2xl mx-auto space-y-4">
                    {tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="w-8 h-8 bg-css-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Heart className="w-4 h-4 text-css-orange" />
                            </div>
                            <p className="text-sm text-gray-700 font-medium">{tip}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sources */}
            <section className="page-container">
                <div className="max-w-2xl mx-auto text-center border-t border-gray-200 pt-8">
                    <p className="text-xs text-gray-400">
                        Quellen: UNEP (2024), Ellen MacArthur Foundation, McKinsey &amp; Company Fashion Report.
                        Die genannten Zahlen sind Durchschnittswerte und können je nach Produkt variieren.
                    </p>
                </div>
            </section>
        </div>
    );
}
