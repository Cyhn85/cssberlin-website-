import { Metadata } from "next";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

export const metadata: Metadata = {
    title: "Widerrufsrecht | CSS Berlin",
    description: "Widerrufsbelehrung und Muster-Widerrufsformular von CSS Berlin.",
};

export default function WiderrufPage() {
    return (
        <div className="page-container py-10">
            <h1 className="text-3xl font-black text-berlin-green mb-2">Widerrufsbelehrung</h1>
            <div className="w-16 h-1 bg-css-orange rounded-full mb-8" />

            <div className="max-w-3xl space-y-8 text-gray-700 leading-relaxed text-sm">
                {/* Widerrufsrecht */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">Widerrufsrecht</h2>
                    <div className="space-y-3">
                        <p>
                            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von
                            Gründen diesen Vertrag zu widerrufen.
                        </p>
                        <p>
                            Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem
                            Sie oder ein von Ihnen benannter Dritter, der nicht der
                            Beförderer ist, die Waren in Besitz genommen haben bzw. hat.
                        </p>
                        <p>
                            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer
                            eindeutigen Erklärung (z. B. ein mit der Post versandter Brief
                            oder E-Mail) über Ihren Entschluss, diesen Vertrag zu
                            widerrufen, informieren:
                        </p>
                        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-1">
                            <p className="font-bold">CSS Berlin – Climate Smart Solutions</p>
                            <p>Ceyhun Sabahattin Sorguç</p>
                            <p>Am Omnibushof 12</p>
                            <p>13593 Berlin</p>
                            <p>E-Mail: info@cssberlin.de</p>
                        </div>
                        <p>
                            Sie können dafür das beigefügte Muster-Widerrufsformular
                            verwenden, das jedoch nicht vorgeschrieben ist.
                        </p>
                        <p>
                            Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die
                            Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf
                            der Widerrufsfrist absenden.
                        </p>
                    </div>
                </section>

                {/* Folgen des Widerrufs */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">Folgen des Widerrufs</h2>
                    <div className="space-y-3">
                        <p>
                            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle
                            Zahlungen, die wir von Ihnen erhalten haben, einschließlich
                            der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die
                            sich daraus ergeben, dass Sie eine andere Art der Lieferung
                            als die von uns angebotene, günstigste Standardlieferung
                            gewählt haben), unverzüglich und spätestens binnen vierzehn
                            Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über
                            Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
                        </p>
                        <p>
                            Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel,
                            das Sie bei der ursprünglichen Transaktion eingesetzt haben,
                            es sei denn, mit Ihnen wurde ausdrücklich etwas anderes
                            vereinbart; in keinem Fall werden Ihnen wegen dieser
                            Rückzahlung Entgelte berechnet.
                        </p>
                        <p>
                            Wir können die Rückzahlung verweigern, bis wir die Waren
                            wieder zurückerhalten haben oder bis Sie den Nachweis
                            erbracht haben, dass Sie die Waren zurückgesandt haben, je
                            nachdem, welches der frühere Zeitpunkt ist.
                        </p>
                        <p>
                            Sie haben die Waren unverzüglich und in jedem Fall
                            spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns
                            über den Widerruf dieses Vertrags unterrichten, an uns
                            zurückzusenden oder zu übergeben. Die Frist ist gewahrt,
                            wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen
                            absenden.
                        </p>
                        <p>
                            Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.
                        </p>
                        <p>
                            Sie müssen für einen etwaigen Wertverlust der Waren nur
                            aufkommen, wenn dieser Wertverlust auf einen zur Prüfung
                            der Beschaffenheit, Eigenschaften und Funktionsweise der
                            Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
                        </p>
                    </div>
                </section>

                {/* Ausschluss */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">Ausschluss des Widerrufsrechts</h2>
                    <div className="space-y-2">
                        <p>Das Widerrufsrecht besteht nicht bei folgenden Verträgen:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Verträge zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist</li>
                            <li>Verträge zur Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde</li>
                        </ul>
                    </div>
                </section>

                {/* Hinweis */}
                <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <h2 className="text-lg font-black text-amber-800 mb-2">
                        <RotateCcw className="w-5 h-5 inline mr-2" />
                        Wichtiger Hinweis für private Verkäufer
                    </h2>
                    <p className="text-amber-700">
                        Das Widerrufsrecht gilt nur für Verkäufe durch gewerbliche Verkäufer. Bei Käufen
                        von privaten Verkäufern über den CSS Berlin Marktplatz besteht kein gesetzliches
                        Widerrufsrecht. In diesen Fällen greift jedoch unser Käuferschutz, wenn der
                        Artikel erheblich von der Beschreibung abweicht oder nicht ankommt.
                    </p>
                </section>

                {/* Muster-Widerrufsformular */}
                <section>
                    <h2 className="text-lg font-black text-gray-900 mb-3">Muster-Widerrufsformular</h2>
                    <p className="mb-4">
                        (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses
                        Formular aus und senden Sie es zurück.)
                    </p>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
                        <p>
                            An:<br />
                            CSS Berlin – Climate Smart Solutions<br />
                            Ceyhun Sabahattin Sorguç<br />
                            Am Omnibushof 12<br />
                            13593 Berlin<br />
                            E-Mail: info@cssberlin.de
                        </p>
                        <p>
                            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen
                            Vertrag über den Kauf der folgenden Waren (*) / die Erbringung der
                            folgenden Dienstleistung (*)
                        </p>
                        <p>__________________________________________________</p>
                        <p>Bestellt am (*) / erhalten am (*) _________________________</p>
                        <p>Name des/der Verbraucher(s) _________________________</p>
                        <p>Anschrift des/der Verbraucher(s) _________________________</p>
                        <p>__________________________________________________</p>
                        <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</p>
                        <p>__________________________________________________</p>
                        <p>Datum: _________________________</p>
                        <p className="text-gray-500 text-xs mt-2">(*) Unzutreffendes streichen.</p>
                    </div>
                </section>

                <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
                    <p>Stand: Februar 2026</p>
                    <p>CSS Berlin – Climate Smart Solutions | Am Omnibushof 12, 13593 Berlin</p>
                </div>

                <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-4 text-sm">
                    <Link href="/impressum" className="text-css-orange hover:underline font-bold">Impressum</Link>
                    <Link href="/agb" className="text-css-orange hover:underline font-bold">AGB</Link>
                    <Link href="/datenschutz" className="text-css-orange hover:underline font-bold">Datenschutz</Link>
                    <Link href="/contact" className="text-css-orange hover:underline font-bold">Kontakt</Link>
                </div>
            </div>
        </div>
    );
}
