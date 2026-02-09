import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

export const metadata: Metadata = {
    title: "Widerrufsrecht",
    description: "CSS Berlin Widerrufsbelehrung und Widerrufsformular",
};

export default function WiderrufPage() {
    return (
        <div className="page-container bg-gray-50">
            <div className="container px-4 md:px-6 py-8 max-w-3xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2E9E5C] mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Zurück zur Startseite
                </Link>

                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <RotateCcw className="w-8 h-8 text-[#2E9E5C]" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Widerrufsbelehrung
                        </h1>
                    </div>
                    <p className="text-gray-500 mb-8">
                        Ihre Rechte als Verbraucher bei Fernabsatzverträgen
                    </p>

                    <div className="space-y-8 text-gray-700">
                        {/* Widerrufsrecht */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Widerrufsrecht
                            </h2>
                            <div className="text-sm leading-relaxed space-y-3">
                                <p>
                                    Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von
                                    Gründen diesen Vertrag zu widerrufen.
                                </p>
                                <p>
                                    Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem
                                    Sie oder ein von Ihnen benannter Dritter, der nicht der
                                    Beförderer ist, die Waren in Besitz genommen haben bzw.
                                    hat.
                                </p>
                                <p>
                                    Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (CSS
                                    Berlin, Ceyhun Sabahattin Sorguç, Spandau, 13585 Berlin,
                                    E-Mail: info@cssberlin.de) mittels einer eindeutigen
                                    Erklärung (z.B. ein mit der Post versandter Brief oder
                                    E-Mail) über Ihren Entschluss, diesen Vertrag zu
                                    widerrufen, informieren.
                                </p>
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
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Folgen des Widerrufs
                            </h2>
                            <div className="text-sm leading-relaxed space-y-3">
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
                                    über den Widerruf dieses Vertrags unterrichten, an den
                                    Verkäufer zurückzusenden oder zu übergeben. Die Frist ist
                                    gewahrt, wenn Sie die Waren vor Ablauf der Frist von
                                    vierzehn Tagen absenden.
                                </p>
                                <p>
                                    Sie tragen die unmittelbaren Kosten der Rücksendung der
                                    Waren.
                                </p>
                                <p>
                                    Sie müssen für einen etwaigen Wertverlust der Waren nur
                                    aufkommen, wenn dieser Wertverlust auf einen zur Prüfung
                                    der Beschaffenheit, Eigenschaften und Funktionsweise der
                                    Waren nicht notwendigen Umgang mit ihnen zurückzuführen
                                    ist.
                                </p>
                            </div>
                        </section>

                        {/* Ausschluss */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Ausschluss des Widerrufsrechts
                            </h2>
                            <div className="text-sm leading-relaxed space-y-2">
                                <p>
                                    Das Widerrufsrecht besteht nicht bei folgenden Verträgen:
                                </p>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li>
                                        Verträge zur Lieferung von Waren, die nicht vorgefertigt
                                        sind und für deren Herstellung eine individuelle Auswahl
                                        oder Bestimmung durch den Verbraucher maßgeblich ist
                                    </li>
                                    <li>
                                        Verträge zur Lieferung versiegelter Waren, die aus
                                        Gründen des Gesundheitsschutzes oder der Hygiene nicht
                                        zur Rückgabe geeignet sind, wenn ihre Versiegelung nach
                                        der Lieferung entfernt wurde
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Wichtiger Hinweis */}
                        <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-amber-800 mb-2">
                                Wichtiger Hinweis für Private Verkäufer
                            </h2>
                            <p className="text-sm text-amber-700">
                                Das Widerrufsrecht gilt nur für Verkäufe durch gewerbliche
                                Verkäufer. Bei Käufen von privaten Verkäufern über den CSS
                                Berlin Marktplatz besteht kein gesetzliches Widerrufsrecht.
                                In diesen Fällen greift jedoch unser Käuferschutz, wenn der
                                Artikel erheblich von der Beschreibung abweicht oder nicht
                                ankommt.
                            </p>
                        </section>

                        {/* Muster-Widerrufsformular */}
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Muster-Widerrufsformular
                            </h2>
                            <div className="text-sm leading-relaxed">
                                <p className="mb-4">
                                    (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie
                                    bitte dieses Formular aus und senden Sie es zurück.)
                                </p>
                                <div className="bg-gray-50 border rounded-xl p-6 space-y-4">
                                    <p>
                                        An:
                                        <br />
                                        CSS Berlin
                                        <br />
                                        Ceyhun Sabahattin Sorguç
                                        <br />
                                        Spandau, 13585 Berlin
                                        <br />
                                        E-Mail: info@cssberlin.de
                                    </p>
                                    <p>
                                        Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
                                        abgeschlossenen Vertrag über den Kauf der folgenden
                                        Waren (*) / die Erbringung der folgenden
                                        Dienstleistung (*)
                                    </p>
                                    <p>
                                        __________________________________________________
                                    </p>
                                    <p>
                                        Bestellt am (*) / erhalten am (*)
                                        _________________________
                                    </p>
                                    <p>
                                        Name des/der Verbraucher(s)
                                        _________________________
                                    </p>
                                    <p>
                                        Anschrift des/der Verbraucher(s)
                                        _________________________
                                    </p>
                                    <p>
                                        __________________________________________________
                                    </p>
                                    <p>
                                        Unterschrift des/der Verbraucher(s) (nur bei
                                        Mitteilung auf Papier)
                                    </p>
                                    <p>
                                        __________________________________________________
                                    </p>
                                    <p>
                                        Datum: _________________________
                                    </p>
                                    <p className="text-gray-500 text-xs">
                                        (*) Unzutreffendes streichen.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
                    <Link href="/impressum" className="text-[#2E9E5C] hover:underline">
                        Impressum
                    </Link>
                    <Link href="/agb" className="text-[#2E9E5C] hover:underline">
                        AGB
                    </Link>
                    <Link href="/datenschutz" className="text-[#2E9E5C] hover:underline">
                        Datenschutz
                    </Link>
                </div>
            </div>
        </div>
    );
}
