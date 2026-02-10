import { Metadata } from "next";
import Link from "next/link";
import {
    HelpCircle,
    ShoppingBag,
    Truck,
    CreditCard,
    Shield,
    MessageCircle,
    Package,
    RotateCcw,
    User,
    ChevronRight,
    Search,
    Mail,
} from "lucide-react";

export const metadata: Metadata = {
    title: "Hilfe-Center | CSS Berlin",
    description: "CSS Berlin Hilfe-Center - Häufig gestellte Fragen und Support",
};

const helpCategories = [
    {
        icon: ShoppingBag,
        title: "Kaufen",
        description: "Kaufvorgang, Zahlung und Warenkorb",
        topics: ["Wie kaufe ich ein?", "Zahlungsmethoden", "Bestellung verfolgen", "Angebot machen"],
    },
    {
        icon: Package,
        title: "Verkaufen",
        description: "Artikel einstellen, Preise und Verkaufstipps",
        topics: ["Artikel hochladen", "Preis festlegen", "Fototipps", "Provision"],
    },
    {
        icon: Truck,
        title: "Versand",
        description: "Versandoptionen, Sendungsverfolgung und Lieferung",
        topics: ["Wie versende ich?", "Versandkosten", "Lieferzeit", "Sendungsverfolgung"],
    },
    {
        icon: CreditCard,
        title: "Zahlungen",
        description: "Zahlungssicherheit und Geldbeutel-Transaktionen",
        topics: ["Sicherheit", "Geld auszahlen", "Zahlung ausstehend", "Wann kommt das Geld?"],
    },
    {
        icon: Shield,
        title: "Sicherheit",
        description: "Käuferschutz und sicheres Einkaufen",
        topics: ["Was ist Käuferschutz?", "Fälschungen melden", "Artikel nicht erhalten", "Kontoschutz"],
    },
    {
        icon: RotateCcw,
        title: "Rückgabe",
        description: "Rückgabeprozess und Stornierungen",
        topics: ["Wie sende ich zurück?", "Rückgabefrist", "Bestellung stornieren", "Rückerstattungsdauer"],
    },
];

const popularQuestions = [
    {
        question: "Ich habe einen Artikel gekauft, aber er ist nicht angekommen. Was soll ich tun?",
        answer: "Überprüfen Sie zuerst die Sendungsverfolgung. Wenn der Artikel nach 10 Werktagen nicht ankommt, klicken Sie auf 'Problem melden'. Ihr Geld ist durch den Käuferschutz abgesichert.",
    },
    {
        question: "Wie hoch ist die Verkaufsprovision?",
        answer: "CSS Berlin erhebt eine Provision von 5% auf jeden erfolgreichen Verkauf. Wenn Sie beispielsweise für 100€ verkaufen, werden 95€ Ihrem Geldbeutel gutgeschrieben.",
    },
];

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero */}
            <div className="bg-[#1a3b28] text-white py-20">
                <div className="page-container text-center">
                    <HelpCircle className="w-16 h-16 mx-auto mb-6 text-green-400" />
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                        Wie können wir helfen?
                    </h1>
                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Suchen Sie nach Antworten..."
                            className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 ring-green-500/20 shadow-xl"
                        />
                    </div>
                </div>
            </div>

            <div className="page-container py-16">
                {/* Categories */}
                <section className="mb-20">
                    <h2 className="text-3xl font-black tracking-tight mb-10 text-[#1a3b28]">Hilfe-Kategorien</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {helpCategories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <div key={category.title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1a3b28] transition-colors">
                                        <Icon className="w-7 h-7 text-[#1a3b28] group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                                    <p className="text-gray-500 mb-6 text-sm">{category.description}</p>
                                    <ul className="space-y-3">
                                        {category.topics.map((topic) => (
                                            <li key={topic}>
                                                <Link href="#" className="text-sm font-medium text-gray-600 hover:text-[#2E9E5C] flex items-center gap-2">
                                                    <ChevronRight className="w-4 h-4" /> {topic}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Popular Questions */}
                <section className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-black tracking-tight mb-8 text-center text-[#1a3b28]">FAQ - Häufige Fragen</h2>
                    <div className="space-y-4">
                        {popularQuestions.map((faq, index) => (
                            <details key={index} className="bg-white rounded-xl border border-gray-100 group overflow-hidden">
                                <summary className="p-5 flex items-center justify-between cursor-pointer list-none font-bold">
                                    {faq.question}
                                    <ChevronRight className="w-5 h-5 transform transition-transform group-open:rotate-90" />
                                </summary>
                                <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}