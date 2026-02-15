import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "AGB | CSS Berlin",
    description: "Allgemeine Geschäftsbedingungen von CSS Berlin – Climate Smart Solutions.",
};

export default function AGBPage() {
    return (
        <div className="page-container py-10">
            <h1 className="text-3xl font-black text-berlin-green mb-2">Allgemeine Geschäftsbedingungen (AGB)</h1>
            <div className="w-16 h-1 bg-css-orange rounded-full mb-8" />

            <div className="max-w-3xl space-y-8 text-gray-700 leading-relaxed text-sm">
                {/* § 1 */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">§ 1 Geltungsbereich</h2>
                    <div className="space-y-2">
                        <p>(1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für alle Verträge, die über die Plattform CSS Berlin – Climate Smart Solutions (nachfolgend „Plattform") zwischen dem Betreiber und den Nutzern geschlossen werden.</p>
                        <p>(2) Betreiber der Plattform ist:</p>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 my-3">
                            <p className="font-bold">CSS Berlin – Climate Smart Solutions</p>
                            <p>Inh. Ceyhun Sabahattin Sorguç</p>
                            <p>Am Omnibushof 12, 13593 Berlin</p>
                            <p>E-Mail: info@cssberlin.de | Tel: +49 163 263 4020</p>
                        </div>
                        <p>(3) Die Plattform dient als Online-Marktplatz für den Kauf und Verkauf von gebrauchten und neuwertigen Artikeln zwischen privaten sowie gewerblichen Nutzern.</p>
                        <p>(4) Abweichende Bedingungen des Nutzers werden nicht anerkannt, es sei denn, der Betreiber stimmt ihrer Geltung ausdrücklich schriftlich zu.</p>
                    </div>
                </section>

                {/* § 2 */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">§ 2 Registrierung und Nutzerkonto</h2>
                    <div className="space-y-2">
                        <p>(1) Die Nutzung der Plattform setzt eine Registrierung voraus. Der Nutzer muss wahrheitsgemäße und vollständige Angaben machen.</p>
                        <p>(2) Der Nutzer ist verpflichtet, seine Zugangsdaten vertraulich zu behandeln und vor dem Zugriff Dritter zu schützen.</p>
                        <p>(3) Jeder Nutzer darf nur ein Konto unterhalten. Die Weitergabe des Kontos an Dritte ist untersagt.</p>
                        <p>(4) Der Betreiber behält sich das Recht vor, Konten bei Verdacht auf Missbrauch, Betrug oder Verstoß gegen diese AGB zu sperren oder zu löschen.</p>
                    </div>
                </section>

                {/* § 3 */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">§ 3 Vertragsschluss</h2>
                    <div className="space-y-2">
                        <p>(1) Die Darstellung von Artikeln auf der Plattform stellt ein verbindliches Angebot des Verkäufers dar.</p>
                        <p>(2) Der Kaufvertrag kommt zustande, wenn der Käufer den Kauf durch Klicken auf den Button „Zahlungspflichtig bestellen" abschließt und die Zahlung bestätigt wird.</p>
                        <p>(3) Bei Nutzung der „Preisvorschlag"-Funktion kommt der Vertrag erst zustande, wenn der Verkäufer das Angebot annimmt und der Käufer die Zahlung abschließt.</p>
                        <p>(4) Der Kaufvertrag wird zwischen Käufer und Verkäufer geschlossen. CSS Berlin ist lediglich Vermittler und wird nicht selbst Vertragspartei.</p>
                    </div>
                </section>

                {/* § 4 */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">§ 4 Preise und Zahlungsbedingungen</h2>
                    <div className="space-y-2">
                        <p>(1) Alle Preise sind Endpreise und verstehen sich inklusive der gesetzlichen Mehrwertsteuer, sofern anwendbar.</p>
                        <p>(2) Zusätzlich zum Artikelpreis fallen Versandkosten und ggf. eine Käuferschutzgebühr an, die dem Käufer vor Abschluss der Bestellung transparent angezeigt werden.</p>
                        <p>(3) Die Zahlung erfolgt über die auf der Plattform angebotenen Zahlungsmethoden (z. B. Kreditkarte, PayPal, Klarna, Sofortüberweisung via Stripe).</p>
                        <p>(4) Der Kaufpreis wird zunächst treuhänderisch einbehalten und erst nach Bestätigung des Wareneingangs durch den Käufer an den Verkäufer ausgezahlt.</p>
                    </div>
                </section>

                {/* § 5 */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">§ 5 Versand und Lieferung</h2>
                    <div className="space-y-2">
                        <p>(1) Der Verkäufer ist verpflichtet, den Artikel innerhalb von 5 Werktagen nach Zahlungseingang zu versenden.</p>
                        <p>(2) Die Versandkosten werden im Angebot angegeben. Es gelten folgende Richtwerte:</p>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 my-3">
                            <ul className="space-y-1">
                                <li>Kleines Paket (bis 2 kg): ab 3,49 € (DHL)</li>
                                <li>Mittleres Paket (bis 5 kg): ab 4,99 € (DHL)</li>
                                <li>Großes Paket (bis 10 kg): ab 6,99 € (DHL)</li>
                                <li>Kostenloser Versand ab einem Bestellwert von 50,00 €</li>
                            </ul>
                        </div>
                        <p>(3) Der Verkäufer hat eine Sendungsverfolgungsnummer bereitzustellen.</p>
                        <p>(4) Das Risiko des zufälligen Untergangs und der zufälligen Verschlechterung der Ware geht bei Verbrauchern mit der Übergabe an den Käufer über.</p>
                    </div>
                </section>

                {/* § 6 */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">§ 6 Käuferschutz</h2>
                    <div className="space-y-2">
                        <p>(1) CSS Berlin bietet einen Käuferschutz für alle über die Plattform abgewickelten Transaktionen.</p>
                        <p>(2) Der Käuferschutz greift, wenn:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>der Artikel nicht ankommt,</li>
                            <li>der Artikel erheblich von der Beschreibung abweicht,</li>
                            <li>der Artikel beschädigt ankommt (sofern nicht vom Verkäufer entsprechend beschrieben).</li>
                        </ul>
                        <p>(3) Der Käufer hat nach Erhalt 2 Tage Zeit, den Artikel zu prüfen und ggf. ein Problem zu melden. Nach Ablauf dieser Frist wird der Kaufpreis an den Verkäufer ausgezahlt.</p>
                    </div>
                </section>

                {/* § 7 */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">§ 7 Widerrufsrecht</h2>
                    <div className="space-y-2">
                        <p>(1) Bei Käufen von gewerblichen Verkäufern steht dem Verbraucher ein 14-tägiges Widerrufsrecht zu. Einzelheiten entnehmen Sie bitte unserer <Link href="/widerruf" className="text-css-orange hover:underline font-bold">Widerrufsbelehrung</Link>.</p>
                        <p>(2) Bei Käufen von privaten Verkäufern besteht kein gesetzliches Widerrufsrecht. Es greift jedoch der Käuferschutz gemäß § 6.</p>
                    </div>
                </section>

                {/* § 8 */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">§ 8 Pflichten der Verkäufer</h2>
                    <div className="space-y-2">
                        <p>(1) Der Verkäufer verpflichtet sich, Artikel wahrheitsgemäß und vollständig zu beschreiben. Dies umfasst insbesondere Angaben zu Zustand, Mängeln, Marke, Größe und Material.</p>
                        <p>(2) Das Einstellen von Artikeln, deren Verkauf gegen geltendes Recht verstößt (z. B. Fälschungen, gestohlene Waren, gefährliche Gegenstände), ist untersagt.</p>
                        <p>(3) Gewerbliche Verkäufer sind verpflichtet, sich als solche zu kennzeichnen und die für sie geltenden gesetzlichen Informationspflichten zu erfüllen.</p>
                    </div>
                </section>

                {/* § 9 */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">§ 9 Gebühren</h2>
                    <div className="space-y-2">
                        <p>(1) Die Registrierung und das Einstellen von Artikeln ist kostenlos.</p>
                        <p>(2) Bei einem erfolgreichen Verkauf fällt eine Verkäuferprovision in Höhe von 5 % des Verkaufspreises an. Diese wird vom Verkaufserlös vor der Auszahlung abgezogen.</p>
                        <p>(3) Dem Käufer wird eine Käuferschutzgebühr berechnet, die vor Abschluss der Bestellung angezeigt wird.</p>
                    </div>
                </section>

                {/* § 10 */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">§ 10 Haftung</h2>
                    <div className="space-y-2">
                        <p>(1) CSS Berlin haftet als Plattformbetreiber nicht für die zwischen Käufer und Verkäufer geschlossenen Verträge.</p>
                        <p>(2) CSS Berlin übernimmt keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität der von Nutzern eingestellten Inhalte.</p>
                        <p>(3) Die Haftung von CSS Berlin ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. Dies gilt nicht für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.</p>
                    </div>
                </section>

                {/* § 11 */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">§ 11 Datenschutz</h2>
                    <p>
                        Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer{" "}
                        <Link href="/datenschutz" className="text-css-orange hover:underline font-bold">Datenschutzerklärung</Link>.
                    </p>
                </section>

                {/* § 12 */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">§ 12 Schlussbestimmungen</h2>
                    <div className="space-y-2">
                        <p>(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.</p>
                        <p>(2) Ist der Nutzer Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist ausschließlicher Gerichtsstand für alle Streitigkeiten aus diesem Vertrag Berlin.</p>
                        <p>(3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
                    </div>
                </section>

                <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
                    <p>Stand: Februar 2026</p>
                    <p>CSS Berlin – Climate Smart Solutions | Am Omnibushof 12, 13593 Berlin</p>
                </div>

                <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-4 text-sm">
                    <Link href="/impressum" className="text-css-orange hover:underline font-bold">Impressum</Link>
                    <Link href="/datenschutz" className="text-css-orange hover:underline font-bold">Datenschutz</Link>
                    <Link href="/widerruf" className="text-css-orange hover:underline font-bold">Widerruf</Link>
                    <Link href="/contact" className="text-css-orange hover:underline font-bold">Kontakt</Link>
                </div>
            </div>
        </div>
    );
}
