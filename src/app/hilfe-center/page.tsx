import Link from "next/link";
import {
    ShoppingBag,
    CreditCard,
    Truck,
    Shield,
    RotateCcw,
    UserPlus,
    Tag,
    MessageCircle,
    HelpCircle,
    ChevronRight,
    Leaf,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

export const metadata = {
    title: "Hilfe-Center | CSS Berlin",
    description: "Häufig gestellte Fragen und Hilfe rund um CSS Berlin.",
};

const faqSections = [
    {
        icon: UserPlus,
        title: "Konto & Registrierung",
        faqs: [
            {
                q: "Wie erstelle ich ein Konto bei CSS Berlin?",
                a: "Klicke oben rechts auf 'Anmelden' und registriere dich mit deiner E-Mail-Adresse oder deinem Google-/Apple-Konto. Die Registrierung ist kostenlos und dauert weniger als eine Minute.",
            },
            {
                q: "Kann ich mein Profil bearbeiten?",
                a: "Ja, nach dem Einloggen klicke auf dein Profilbild oben rechts und wähle 'Einstellungen'. Dort kannst du Benutzername, Profilbild, Adresse und Zahlungsmethoden verwalten.",
            },
            {
                q: "Ich habe mein Passwort vergessen. Was tun?",
                a: "Klicke auf 'Anmelden' und dann auf 'Passwort vergessen'. Du erhältst eine E-Mail mit einem Link zum Zurücksetzen deines Passworts.",
            },
        ],
    },
    {
        icon: ShoppingBag,
        title: "Kaufen",
        faqs: [
            {
                q: "Wie kaufe ich einen Artikel?",
                a: "Öffne die Artikelseite, prüfe die Details und klicke auf 'Sofort kaufen'. Du wirst zur sicheren Stripe-Zahlung weitergeleitet. Nach der Bezahlung erhältst du eine Bestätigungsemail.",
            },
            {
                q: "Kann ich einen Preisvorschlag machen?",
                a: "Ja! Auf jeder Artikelseite findest du den Button 'Preisvorschlag'. Gib deinen Wunschpreis ein — der Verkäufer wird benachrichtigt und kann annehmen, ablehnen oder ein Gegenangebot machen.",
            },
            {
                q: "Wie funktioniert die Suche und die Filter?",
                a: "Nutze die Suchleiste oben, um nach Artikeln, Marken oder Kategorien zu suchen. Im Katalog kannst du nach Kategorie, Größe, Zustand, Preis und Marke filtern.",
            },
            {
                q: "Was bedeutet der Artikelzustand?",
                a: "Wir verwenden folgende Zustände: 'Neu mit Etikett' (nie getragen, Etikett vorhanden), 'Neu ohne Etikett' (nie getragen), 'Sehr Gut' (kaum Gebrauchsspuren), 'Gut' (leichte Gebrauchsspuren), 'Zufriedenstellend' (sichtbare Gebrauchsspuren, voll funktionsfähig).",
            },
        ],
    },
    {
        icon: Tag,
        title: "Verkaufen",
        faqs: [
            {
                q: "Wie stelle ich einen Artikel zum Verkauf ein?",
                a: "Klicke auf 'Verkaufen' in deinem Dashboard. Lade Fotos hoch, fülle Titel, Beschreibung, Kategorie, Größe und Preis aus. Dein Artikel ist sofort nach dem Einstellen sichtbar.",
            },
            {
                q: "Welche Gebühren fallen beim Verkauf an?",
                a: "CSS Berlin erhebt eine Plattformgebühr von 5% auf den Verkaufspreis. Es gibt keine Einstellgebühren — du zahlst nur bei einem erfolgreichen Verkauf.",
            },
            {
                q: "Wie erhalte ich mein Geld nach einem Verkauf?",
                a: "Nach Bestätigung des Kaufs wird der Betrag (abzüglich 5% Gebühr) deinem CSS Berlin Wallet gutgeschrieben. Von dort kannst du eine Auszahlung auf dein Bankkonto anfordern.",
            },
            {
                q: "Kann ich meinen Artikel bearbeiten oder löschen?",
                a: "Ja, gehe in dein Dashboard unter 'Meine Artikel'. Dort kannst du Preis, Beschreibung und Fotos bearbeiten oder den Artikel ganz entfernen.",
            },
        ],
    },
    {
        icon: CreditCard,
        title: "Bezahlung",
        faqs: [
            {
                q: "Welche Zahlungsmethoden werden akzeptiert?",
                a: "Wir akzeptieren alle gängigen Kredit- und Debitkarten (Visa, Mastercard, American Express) über unseren sicheren Zahlungspartner Stripe. Weitere Zahlungsmethoden wie Apple Pay und Google Pay sind verfügbar.",
            },
            {
                q: "Ist meine Zahlung sicher?",
                a: "Ja, alle Zahlungen werden über Stripe abgewickelt — einen PCI-DSS Level 1 zertifizierten Zahlungsanbieter. CSS Berlin hat keinen Zugriff auf deine Kartendaten.",
            },
            {
                q: "Was ist der Käuferschutz?",
                a: "Bei jedem Kauf wird eine kleine Käuferschutzgebühr (ca. 5% des Artikelpreises, min. €0,70) berechnet. Dafür bist du geschützt: Kommt der Artikel nicht an oder weicht erheblich von der Beschreibung ab, erhältst du dein Geld zurück.",
            },
        ],
    },
    {
        icon: Truck,
        title: "Versand",
        faqs: [
            {
                q: "Wie wird versendet?",
                a: "Der Versand erfolgt über DHL. Nach dem Kauf erhält der Verkäufer ein Versandlabel per E-Mail. Er verpackt den Artikel und gibt ihn bei der nächsten DHL-Station ab.",
            },
            {
                q: "Was kostet der Versand?",
                a: "Kleines Paket: €3,49 | Mittleres Paket: €4,99 | Großes Paket: €6,99. Ab einem Warenwert von €50 ist der Versand kostenlos!",
            },
            {
                q: "Wie lange dauert der Versand?",
                a: "In der Regel 2–5 Werktage innerhalb Deutschlands. Der Verkäufer hat nach dem Kauf 5 Werktage Zeit, den Artikel zu versenden. Du erhältst eine Sendungsverfolgungsnummer per E-Mail.",
            },
            {
                q: "Kann ich den Versandstatus verfolgen?",
                a: "Ja, sobald der Verkäufer das Paket abgeschickt hat, erhältst du eine DHL-Sendungsverfolgungsnummer per E-Mail und in deinem Dashboard unter 'Meine Bestellungen'.",
            },
        ],
    },
    {
        icon: RotateCcw,
        title: "Rückgabe & Widerruf",
        faqs: [
            {
                q: "Kann ich einen Artikel zurückgeben?",
                a: "Ja, du hast ein 14-tägiges Widerrufsrecht ab Erhalt der Ware. Kontaktiere uns über das Hilfe-Center oder per E-Mail an info@cssberlin.de, um eine Rückgabe einzuleiten.",
            },
            {
                q: "Wer trägt die Rücksendekosten?",
                a: "Die Kosten der Rücksendung trägt der Käufer, es sei denn, der Artikel weicht erheblich von der Beschreibung ab oder ist defekt — in diesem Fall übernehmen wir die Kosten.",
            },
            {
                q: "Wie lange dauert die Rückerstattung?",
                a: "Nach Eingang der Rücksendung wird dein Geld innerhalb von 5–10 Werktagen auf deine ursprüngliche Zahlungsmethode zurückerstattet.",
            },
        ],
    },
    {
        icon: Shield,
        title: "Sicherheit & Vertrauen",
        faqs: [
            {
                q: "Wie schützt CSS Berlin vor Betrug?",
                a: "Wir prüfen alle Angebote regelmäßig, verwenden sichere Zahlungssysteme und bieten Käuferschutz. Verdächtige Artikel oder Konten werden sofort gesperrt. Du kannst verdächtige Angebote über den 'Melden'-Button auf jeder Artikelseite melden.",
            },
            {
                q: "Sind die Bewertungen echt?",
                a: "Ja, nur verifizierte Käufer können Bewertungen abgeben. Jede Bewertung ist an eine tatsächliche Transaktion gebunden.",
            },
            {
                q: "Was passiert mit meinen persönlichen Daten?",
                a: "Deine Daten werden gemäß DSGVO verarbeitet und nicht an Dritte verkauft. Weitere Informationen findest du in unserer Datenschutzerklärung.",
            },
        ],
    },
    {
        icon: Leaf,
        title: "Nachhaltigkeit",
        faqs: [
            {
                q: "Warum ist Second-Hand nachhaltig?",
                a: "Second-Hand-Mode spart bis zu 73% Wasser und reduziert CO₂-Emissionen erheblich. Die Modebranche ist für etwa 10% der globalen CO₂-Emissionen verantwortlich. Jedes gebrauchte Kleidungsstück, das weitergetragen wird, reduziert diesen Fußabdruck.",
            },
            {
                q: "Was ist der CO₂-Spar-Rechner?",
                a: "Bei jedem Artikel zeigen wir dir, wie viel CO₂ du im Vergleich zum Neukauf sparst. Diese Berechnung basiert auf Daten von WRAP Research und dem UN Environment Programme.",
            },
        ],
    },
];

export default function HilfeCenterPage() {
    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Hero */}
            <section className="bg-gradient-to-br from-berlin-green to-berlin-green/90 text-white py-16 md:py-20">
                <div className="page-container text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
                        <HelpCircle className="w-4 h-4" />
                        <span className="text-xs font-black tracking-widest uppercase">Support</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-4">
                        Hilfe-Center
                    </h1>
                    <p className="text-lg text-white/70 max-w-xl mx-auto">
                        Finde Antworten auf häufig gestellte Fragen rund um Kaufen, Verkaufen, Versand und mehr.
                    </p>
                </div>
            </section>

            {/* Quick Links */}
            <section className="page-container -mt-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: ShoppingBag, label: "Kaufen", href: "#kaufen" },
                        { icon: Tag, label: "Verkaufen", href: "#verkaufen" },
                        { icon: Truck, label: "Versand", href: "#versand" },
                        { icon: Shield, label: "Sicherheit", href: "#sicherheit" },
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <a
                                key={item.label}
                                href={item.href}
                                className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 flex items-center gap-3 hover:shadow-xl hover:-translate-y-0.5 transition-all group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-css-orange/10 flex items-center justify-center group-hover:bg-css-orange transition-colors">
                                    <Icon className="w-5 h-5 text-css-orange group-hover:text-white transition-colors" />
                                </div>
                                <span className="font-black text-sm text-berlin-green uppercase tracking-wider">{item.label}</span>
                                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-berlin-green transition-colors" />
                            </a>
                        );
                    })}
                </div>
            </section>

            {/* FAQ Sections */}
            <section className="page-container py-16">
                <div className="space-y-12">
                    {faqSections.map((section) => {
                        const Icon = section.icon;
                        const sectionId = section.title.toLowerCase().replace(/[^a-z]/g, "").slice(0, 12);
                        return (
                            <div key={section.title} id={sectionId}>
                                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                                    <div className="w-10 h-10 rounded-lg bg-berlin-green/10 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-berlin-green" />
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-black text-berlin-green uppercase tracking-tight">
                                        {section.title}
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    {section.faqs.map((faq, i) => (
                                        <details
                                            key={i}
                                            className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                                        >
                                            <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors font-bold text-gray-900 text-sm md:text-base">
                                                <span className="pr-4">{faq.q}</span>
                                                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-90" />
                                            </summary>
                                            <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">
                                                {faq.a}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-br from-berlin-green/5 to-css-orange/5 py-16">
                <div className="page-container">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-black text-berlin-green uppercase tracking-tight mb-3">
                            Noch Fragen?
                        </h2>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Unser Support-Team hilft dir gerne weiter. Kontaktiere uns per E-Mail oder über das Kontaktformular.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <Link
                            href="mailto:info@cssberlin.de"
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-css-orange/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-css-orange transition-colors">
                                <Mail className="w-5 h-5 text-css-orange group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-black text-sm text-berlin-green uppercase tracking-wider mb-1">E-Mail</h3>
                            <p className="text-sm text-gray-500">info@cssberlin.de</p>
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-css-orange/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-css-orange transition-colors">
                                <MessageCircle className="w-5 h-5 text-css-orange group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-black text-sm text-berlin-green uppercase tracking-wider mb-1">Kontaktformular</h3>
                            <p className="text-sm text-gray-500">Schreibe uns direkt</p>
                        </Link>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                            <div className="w-12 h-12 rounded-full bg-css-orange/10 flex items-center justify-center mx-auto mb-3">
                                <MapPin className="w-5 h-5 text-css-orange" />
                            </div>
                            <h3 className="font-black text-sm text-berlin-green uppercase tracking-wider mb-1">Adresse</h3>
                            <p className="text-sm text-gray-500">Am Omnibushof 12<br />13593 Berlin</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
