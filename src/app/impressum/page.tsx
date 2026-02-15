import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Impressum | CSS Berlin",
    description: "Impressum von CSS Berlin – Climate Smart Solutions. Angaben gemäß § 5 TMG.",
};

export default function ImpressumPage() {
    return (
        <div className="page-container py-10">
            <h1 className="text-3xl font-black text-berlin-green mb-2">Impressum</h1>
            <div className="w-16 h-1 bg-css-orange rounded-full mb-8" />

            <div className="max-w-3xl space-y-8 text-gray-700 leading-relaxed">

                {/* Angaben gemäß § 5 TMG */}
                <section>
                    <h2 className="text-xl font-black text-gray-900 mb-3">Angaben gemäß § 5 TMG</h2>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-2">
                        <p className="font-bold text-gray-900">CSS Berlin – Climate Smart Solutions</p>
                        <p>Inh. Ceyhun Sabahattin Sorguç</p>
                        <p>Am Omnibushof 12</p>
                        <p>13593 Berlin, Deutschland</p>
                    </div>
                </section>

                {/* Kontakt */}
                <section>
                    <h2 className="text-xl font-black text-gray-900 mb-3">Kontakt</h2>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-1">
                        <p>Telefon: +49 163 263 4020</p>
                        <p>E-Mail: info@cssberlin.de</p>
                    </div>
                </section>

                {/* Umsatzsteuer-ID */}
                <section>
                    <h2 className="text-xl font-black text-gray-900 mb-3">Umsatzsteuer-ID</h2>
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <p>
                            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
                        </p>
                        <p className="font-bold mt-1">DE459278750</p>
                    </div>
                </section>

                {/* EU-Streitschlichtung */}
                <section>
                    <h2 className="text-xl font-black text-gray-900 mb-3">EU-Streitschlichtung</h2>
                    <p>
                        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                        <a
                            href="https://ec.europa.eu/consumers/odr/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-css-orange hover:underline font-bold"
                        >
                            https://ec.europa.eu/consumers/odr/
                        </a>
                    </p>
                    <p className="mt-2">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
                </section>

                {/* Verbraucherstreitbeilegung */}
                <section>
                    <h2 className="text-xl font-black text-gray-900 mb-3">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
                    <p>
                        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                        Verbraucherschlichtungsstelle teilzunehmen.
                    </p>
                </section>

                {/* Haftung für Inhalte */}
                <section>
                    <h2 className="text-xl font-black text-gray-900 mb-3">Haftung für Inhalte</h2>
                    <p>
                        Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen
                        Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir
                        als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
                        Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
                        rechtswidrige Tätigkeit hinweisen.
                    </p>
                    <p className="mt-2">
                        Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
                        allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist
                        jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
                        Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte
                        umgehend entfernen.
                    </p>
                </section>

                {/* Haftung für Links */}
                <section>
                    <h2 className="text-xl font-black text-gray-900 mb-3">Haftung für Links</h2>
                    <p>
                        Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir
                        keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine
                        Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
                        Anbieter oder Betreiber der Seiten verantwortlich.
                    </p>
                    <p className="mt-2">
                        Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
                        Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung
                        nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
                        jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
                        Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                    </p>
                </section>

                {/* Urheberrecht */}
                <section>
                    <h2 className="text-xl font-black text-gray-900 mb-3">Urheberrecht</h2>
                    <p>
                        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
                        unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
                        Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
                        bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                        Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen
                        Gebrauch gestattet.
                    </p>
                    <p className="mt-2">
                        Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
                        Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
                        gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam
                        werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
                        Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                    </p>
                </section>

                {/* Plattformhinweis */}
                <section className="p-5 bg-berlin-green/5 rounded-xl border border-berlin-green/10">
                    <h2 className="text-lg font-black text-berlin-green mb-2">Hinweis zur Plattform</h2>
                    <p className="text-sm">
                        CSS Berlin betreibt einen Online-Marktplatz, auf dem sowohl gewerbliche als auch
                        private Verkäufer Waren anbieten können. CSS Berlin tritt dabei als
                        Plattformbetreiber auf und ist nicht Vertragspartner der zwischen Käufern und
                        Verkäufern geschlossenen Kaufverträge, es sei denn, CSS Berlin ist selbst als
                        Verkäufer gekennzeichnet.
                    </p>
                </section>

                <div className="flex flex-wrap gap-4 pt-4 text-sm">
                    <Link href="/agb" className="text-css-orange hover:underline font-bold">AGB</Link>
                    <Link href="/datenschutz" className="text-css-orange hover:underline font-bold">Datenschutz</Link>
                    <Link href="/widerruf" className="text-css-orange hover:underline font-bold">Widerrufsrecht</Link>
                </div>
            </div>
        </div>
    );
}
