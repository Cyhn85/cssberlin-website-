import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Cookie-Richtlinie | CSS Berlin",
    description: "Cookie-Richtlinie und Einstellungen von CSS Berlin.",
};

export default function CookiesPage() {
    return (
        <div className="page-container py-10">
            <h1 className="text-3xl font-black text-berlin-green mb-2">Cookie-Richtlinie</h1>
            <div className="w-16 h-1 bg-css-orange rounded-full mb-8" />

            <div className="max-w-3xl space-y-8 text-gray-700 leading-relaxed text-sm">
                {/* Intro */}
                <section>
                    <p>
                        CSS Berlin verwendet Cookies und ähnliche Technologien, um dir das bestmögliche
                        Erlebnis auf unserer Plattform zu bieten. Diese Cookie-Richtlinie erklärt, was
                        Cookies sind, welche wir verwenden und wie du sie verwalten kannst.
                    </p>
                </section>

                {/* Was sind Cookies */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">Was sind Cookies?</h2>
                    <p>
                        Cookies sind kleine Textdateien, die beim Besuch einer Website auf deinem Endgerät
                        gespeichert werden. Sie ermöglichen es der Website, dein Gerät wiederzuerkennen und
                        bestimmte Informationen über deine Präferenzen oder vergangene Aktionen zu speichern.
                    </p>
                </section>

                {/* Cookie-Kategorien */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">Cookie-Einstellungen</h2>
                    <div className="space-y-4">
                        {/* Notwendige */}
                        <div className="p-5 bg-white border border-gray-200 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-900">Notwendige Cookies</h3>
                                <div className="bg-berlin-green text-white text-xs font-bold px-3 py-1 rounded-full">Immer aktiv</div>
                            </div>
                            <p className="text-gray-500 mb-3">
                                Diese Cookies sind für die Grundfunktionen der Website unbedingt erforderlich
                                und können nicht deaktiviert werden.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="font-bold">__clerk_session</span>
                                    <span className="text-gray-400">Authentifizierung (Clerk)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">__client_uat</span>
                                    <span className="text-gray-400">Session-Token (Clerk)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">cookie_consent</span>
                                    <span className="text-gray-400">Cookie-Einwilligung</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">cart_session</span>
                                    <span className="text-gray-400">Warenkorb-Sitzung</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</p>
                        </div>

                        {/* Funktionale */}
                        <div className="p-5 bg-white border border-gray-200 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-900">Funktionale Cookies</h3>
                                <button type="button" className="bg-css-orange hover:bg-berlin-green text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors duration-300">
                                    Akzeptieren
                                </button>
                            </div>
                            <p className="text-gray-500 mb-3">
                                Diese Cookies ermöglichen erweiterte Funktionalität und Personalisierung,
                                wie z. B. gespeicherte Spracheinstellungen oder zuletzt angesehene Artikel.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="font-bold">recently_viewed</span>
                                    <span className="text-gray-400">Zuletzt angesehene Artikel</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-bold">preferred_language</span>
                                    <span className="text-gray-400">Spracheinstellung</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</p>
                        </div>

                        {/* Analyse */}
                        <div className="p-5 bg-white border border-gray-200 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-900">Analyse-Cookies</h3>
                                <button type="button" className="bg-css-orange hover:bg-berlin-green text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors duration-300">
                                    Akzeptieren
                                </button>
                            </div>
                            <p className="text-gray-500 mb-3">
                                Helfen uns zu verstehen, wie Besucher unsere Website nutzen, um sie
                                kontinuierlich zu verbessern.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="font-bold">_vercel_analytics</span>
                                    <span className="text-gray-400">Seitenaufrufe &amp; Performance (Vercel)</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</p>
                        </div>

                        {/* Marketing */}
                        <div className="p-5 bg-white border border-gray-200 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-900">Marketing-Cookies</h3>
                                <button type="button" className="bg-gray-200 hover:bg-css-orange hover:text-white text-gray-700 text-xs font-bold px-4 py-1.5 rounded-full transition-colors duration-300">
                                    Ablehnen
                                </button>
                            </div>
                            <p className="text-gray-500">
                                Werden verwendet, um Besuchern relevante Werbung anzuzeigen.
                                Derzeit setzt CSS Berlin keine Marketing-Cookies ein.
                            </p>
                            <p className="text-xs text-gray-400 mt-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</p>
                        </div>
                    </div>
                </section>

                {/* Cookies verwalten */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">Cookies verwalten</h2>
                    <div className="space-y-2">
                        <p>
                            Du kannst Cookies jederzeit über die Einstellungen deines Browsers verwalten
                            oder löschen. Bitte beachte, dass das Deaktivieren bestimmter Cookies die
                            Funktionalität der Website beeinträchtigen kann.
                        </p>
                        <p>Die meisten Browser bieten folgende Optionen:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Alle Cookies anzeigen und löschen</li>
                            <li>Alle Cookies blockieren</li>
                            <li>Cookies von Drittanbietern blockieren</li>
                            <li>Cookies beim Schließen des Browsers löschen</li>
                            <li>Einen &quot;Privaten&quot; bzw. &quot;Inkognito&quot;-Modus nutzen</li>
                        </ul>
                    </div>
                </section>

                {/* Drittanbieter */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">Drittanbieter</h2>
                    <div className="space-y-2">
                        <p>Wir nutzen folgende Drittanbieter-Dienste, die eigene Cookies setzen können:</p>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                            <div>
                                <p className="font-bold">Clerk (Authentifizierung)</p>
                                <p className="text-gray-500">Verwaltet Benutzer-Sessions und Anmeldung</p>
                            </div>
                            <div>
                                <p className="font-bold">Stripe (Zahlungsabwicklung)</p>
                                <p className="text-gray-500">Sichere Zahlungsverarbeitung und Betrugsprävention</p>
                            </div>
                            <div>
                                <p className="font-bold">Vercel (Hosting)</p>
                                <p className="text-gray-500">Website-Hosting und optionale Analytics</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
                    <p>Stand: Februar 2026</p>
                    <p>CSS Berlin – Climate Smart Solutions | Am Omnibushof 12, 13593 Berlin</p>
                </div>

                <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-4 text-sm">
                    <Link href="/datenschutz" className="text-css-orange hover:underline font-bold">Datenschutzerklärung</Link>
                    <Link href="/impressum" className="text-css-orange hover:underline font-bold">Impressum</Link>
                    <Link href="/contact" className="text-css-orange hover:underline font-bold">Kontakt</Link>
                </div>
            </div>
        </div>
    );
}
