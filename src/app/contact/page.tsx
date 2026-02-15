import { Mail, MapPin, Clock, Phone, Building2, Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kontakt | CSS Berlin",
    description: "Kontaktiere CSS Berlin - Climate Smart Solutions. Am Omnibushof 12, 13593 Berlin.",
};

export default function ContactPage() {
    return (
        <div className="page-container py-10">
            <h1 className="text-3xl font-black text-berlin-green mb-2">Kontakt</h1>
            <div className="w-16 h-1 bg-css-orange rounded-full mb-8" />

            <div className="grid md:grid-cols-2 gap-10 max-w-5xl">
                {/* Kontakt-Infos */}
                <div className="space-y-6">
                    <p className="text-gray-700 leading-relaxed">
                        Hast du Fragen, Anregungen oder brauchst du Hilfe? Unser Team ist für dich da
                        und antwortet so schnell wie möglich.
                    </p>

                    <div className="space-y-5">
                        <div className="flex items-start gap-3">
                            <Building2 className="w-5 h-5 text-css-orange mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-gray-900">Firma</p>
                                <p className="text-gray-600">CSS Berlin – Climate Smart Solutions</p>
                                <p className="text-gray-600">Inh. Ceyhun Sabahattin Sorguç</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-css-orange mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-gray-900">Adresse</p>
                                <p className="text-gray-600">Am Omnibushof 12</p>
                                <p className="text-gray-600">13593 Berlin, Deutschland</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-css-orange mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-gray-900">Telefon</p>
                                <p className="text-gray-600">+49 163 263 4020</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-css-orange mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-gray-900">E-Mail</p>
                                <p className="text-gray-600">info@cssberlin.de</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-css-orange mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-gray-900">Antwortzeit</p>
                                <p className="text-gray-600">In der Regel innerhalb von 24 Stunden</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-berlin-green/5 rounded-xl border border-berlin-green/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-berlin-green" />
                            <p className="font-bold text-berlin-green text-sm">Käuferschutz</p>
                        </div>
                        <p className="text-sm text-gray-600">
                            Bei Problemen mit deiner Bestellung hilft unser Käuferschutz-Team.
                            Schreibe uns einfach mit deiner Bestellnummer an{" "}
                            <span className="font-bold text-css-orange">info@cssberlin.de</span>.
                        </p>
                    </div>
                </div>

                {/* Kontakt-Formular */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="font-bold text-lg text-gray-900 mb-4">Nachricht senden</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input type="text" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-berlin-green text-sm" placeholder="Dein Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail *</label>
                            <input type="email" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-berlin-green text-sm" placeholder="deine@email.de" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Betreff</label>
                            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-berlin-green text-sm text-gray-700">
                                <option value="">Bitte wählen...</option>
                                <option value="bestellung">Frage zu meiner Bestellung</option>
                                <option value="rueckgabe">Rückgabe / Widerruf</option>
                                <option value="konto">Konto &amp; Anmeldung</option>
                                <option value="verkaufen">Verkaufen auf CSS Berlin</option>
                                <option value="zahlung">Zahlung &amp; Rechnung</option>
                                <option value="sonstiges">Sonstiges</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nachricht *</label>
                            <textarea required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-berlin-green text-sm h-32 resize-none" placeholder="Beschreibe dein Anliegen möglichst genau..." />
                        </div>
                        <button type="submit" className="w-full bg-css-orange text-berlin-green font-black py-3 rounded-xl transition-colors duration-300 uppercase tracking-widest text-xs hover:bg-berlin-green hover:text-white">
                            Absenden
                        </button>
                        <p className="text-[11px] text-gray-400 text-center">
                            Mit dem Absenden stimmst du unserer{" "}
                            <a href="/datenschutz" className="text-css-orange hover:underline">Datenschutzerklärung</a> zu.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
