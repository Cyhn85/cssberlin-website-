import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Datenschutzerklärung | CSS Berlin",
    description: "Datenschutzerklärung von CSS Berlin gemäß DSGVO.",
};

export default function DatenschutzPage() {
    return (
        <div className="page-container py-10">
            <h1 className="text-3xl font-black text-berlin-green mb-2">Datenschutzerklärung</h1>
            <div className="w-16 h-1 bg-css-orange rounded-full mb-8" />

            <div className="max-w-3xl space-y-8 text-gray-700 leading-relaxed text-sm">
                {/* 1. Verantwortlicher */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">1. Verantwortlicher</h2>
                    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-1">
                        <p className="font-bold">CSS Berlin – Climate Smart Solutions</p>
                        <p>Inh. Ceyhun Sabahattin Sorguç</p>
                        <p>Am Omnibushof 12, 13593 Berlin</p>
                        <p>E-Mail: info@cssberlin.de</p>
                        <p>Telefon: +49 163 263 4020</p>
                    </div>
                </section>

                {/* 2. Erhebung und Speicherung */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">2. Erhebung und Speicherung personenbezogener Daten</h2>
                    <div className="space-y-3">
                        <p>Beim Besuch unserer Website werden automatisch folgende Informationen erfasst:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>IP-Adresse des anfragenden Rechners</li>
                            <li>Datum und Uhrzeit des Zugriffs</li>
                            <li>Name und URL der abgerufenen Datei</li>
                            <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                            <li>Verwendeter Browser und ggf. das Betriebssystem</li>
                        </ul>
                        <p>Diese Daten werden für die technische Bereitstellung der Website benötigt (Art. 6 Abs. 1 lit. f DSGVO).</p>
                    </div>
                </section>

                {/* 3. Registrierung */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">3. Registrierung und Nutzerkonto</h2>
                    <div className="space-y-2">
                        <p>Bei der Registrierung erheben wir folgende Daten:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Name / Benutzername</li>
                            <li>E-Mail-Adresse</li>
                            <li>Profilbild (optional)</li>
                            <li>Adressdaten (bei Kauf/Verkauf)</li>
                        </ul>
                        <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>
                        <p>Die Authentifizierung erfolgt über den Dienst <strong>Clerk</strong> (Clerk Inc., San Francisco, USA). Clerk verarbeitet Ihre Anmeldedaten gemäß deren Datenschutzerklärung. Die Übermittlung in die USA erfolgt auf Grundlage von Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).</p>
                    </div>
                </section>

                {/* 4. Zahlungsabwicklung */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">4. Zahlungsabwicklung</h2>
                    <div className="space-y-2">
                        <p>Für die Zahlungsabwicklung nutzen wir den Dienst <strong>Stripe</strong> (Stripe Inc., San Francisco, USA).</p>
                        <p>Bei einer Zahlung werden Ihre Zahlungsdaten (z. B. Kreditkartennummer, IBAN) direkt an Stripe übermittelt. CSS Berlin speichert keine vollständigen Zahlungsdaten.</p>
                        <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Datenschutzhinweise von Stripe: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-css-orange hover:underline">stripe.com/de/privacy</a></p>
                    </div>
                </section>

                {/* 5. Datei-Upload */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">5. Datei-Uploads (Bilder)</h2>
                    <p>Für den Upload von Produktbildern und Profilbildern nutzen wir den Dienst <strong>UploadThing</strong>. Die hochgeladenen Dateien werden auf Servern in der EU/den USA gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>
                </section>

                {/* 6. Cookies */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">6. Cookies</h2>
                    <div className="space-y-2">
                        <p>Unsere Website verwendet Cookies. Dabei handelt es sich um kleine Textdateien, die auf Ihrem Endgerät gespeichert werden.</p>
                        <p><strong>Notwendige Cookies:</strong> Diese sind für die Grundfunktionen erforderlich (z. B. Session, Authentifizierung). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>
                        <p><strong>Analyse-Cookies:</strong> Werden nur mit Ihrer Einwilligung gesetzt (Art. 6 Abs. 1 lit. a DSGVO). Sie können Ihre Einwilligung jederzeit in den <Link href="/cookies" className="text-css-orange hover:underline">Cookie-Einstellungen</Link> widerrufen.</p>
                    </div>
                </section>

                {/* 7. Rechte */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">7. Ihre Rechte</h2>
                    <div className="space-y-2">
                        <p>Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><strong>Recht auf Auskunft</strong> (Art. 15 DSGVO)</li>
                            <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
                            <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
                            <li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
                            <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
                            <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)</li>
                        </ul>
                        <p>Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: <strong>info@cssberlin.de</strong></p>
                    </div>
                </section>

                {/* 8. Beschwerderecht */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">8. Beschwerderecht bei einer Aufsichtsbehörde</h2>
                    <div className="space-y-2">
                        <p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist:</p>
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                            <p className="font-bold">Berliner Beauftragte für Datenschutz und Informationsfreiheit</p>
                            <p>Alt-Moabit 59-61, 10555 Berlin</p>
                            <p>E-Mail: mailbox@datenschutz-berlin.de</p>
                        </div>
                    </div>
                </section>

                {/* 9. Datensicherheit */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">9. Datensicherheit</h2>
                    <p>Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe. Ob eine einzelne Seite unseres Internetauftrittes verschlüsselt übertragen wird, erkennen Sie an der geschlossenen Darstellung des Schlüssel- bzw. Schloss-Symbols in der Adressleiste Ihres Browsers.</p>
                </section>

                {/* 10. Änderungen */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">10. Aktualität und Änderung dieser Datenschutzerklärung</h2>
                    <p>Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Februar 2026. Durch die Weiterentwicklung unserer Website oder aufgrund geänderter gesetzlicher bzw. behördlicher Vorgaben kann eine Anpassung notwendig werden.</p>
                </section>

                <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
                    <p>Stand: Februar 2026</p>
                    <p>CSS Berlin – Climate Smart Solutions | Am Omnibushof 12, 13593 Berlin</p>
                </div>

                <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-4 text-sm">
                    <Link href="/impressum" className="text-css-orange hover:underline font-bold">Impressum</Link>
                    <Link href="/agb" className="text-css-orange hover:underline font-bold">AGB</Link>
                    <Link href="/cookies" className="text-css-orange hover:underline font-bold">Cookie-Einstellungen</Link>
                    <Link href="/contact" className="text-css-orange hover:underline font-bold">Kontakt</Link>
                </div>
            </div>
        </div>
    );
}
