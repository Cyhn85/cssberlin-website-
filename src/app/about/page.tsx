import { Leaf, Heart, Recycle, MapPin } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="page-container py-10">
            <h1 className="text-3xl font-black text-berlin-green mb-2">Über uns</h1>
            <div className="w-16 h-1 bg-css-orange rounded-full mb-8" />

            <div className="max-w-3xl space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg font-medium text-gray-900">
                    <strong>CSS Berlin</strong> – Climate Smart Solutions – ist deine Plattform für nachhaltige Second-Hand Mode aus Berlin-Spandau.
                </p>

                <p>
                    Wir glauben daran, dass jedes gebrauchte Kleidungsstück, das weiterverkauft wird, einen positiven Beitrag für unsere Umwelt leistet. Weniger Abfall, weniger Produktion, mehr Nachhaltigkeit.
                </p>

                <div className="grid md:grid-cols-2 gap-6 py-6">
                    <div className="flex gap-4 p-5 bg-green-50 rounded-xl">
                        <Leaf className="w-8 h-8 text-berlin-green flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-berlin-green mb-1">Nachhaltigkeit</h3>
                            <p className="text-sm text-gray-600">Jeder Kauf bei uns schont Ressourcen und reduziert den ökologischen Fußabdruck.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-5 bg-orange-50 rounded-xl">
                        <Heart className="w-8 h-8 text-css-orange flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-css-orange mb-1">Gemeinschaft</h3>
                            <p className="text-sm text-gray-600">Eine aktive Community aus Berlin, die gemeinsam für eine grünere Zukunft sorgt.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-5 bg-green-50 rounded-xl">
                        <Recycle className="w-8 h-8 text-berlin-green flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-berlin-green mb-1">Kreislaufwirtschaft</h3>
                            <p className="text-sm text-gray-600">Mode im Kreislauf halten – kaufen, tragen, weiterverkaufen.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-5 bg-orange-50 rounded-xl">
                        <MapPin className="w-8 h-8 text-css-orange flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-css-orange mb-1">Lokal aus Berlin</h3>
                            <p className="text-sm text-gray-600">Gegründet in Berlin-Spandau. Für Berliner, von Berlinern.</p>
                        </div>
                    </div>
                </div>

                <p>
                    Unser Motto: <strong className="text-berlin-green">Wenn du Second-Hand kaufst, unterstützt du die Natur – und alles wird grüner.</strong>
                </p>

                <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
                    <p>CSS Berlin – Climate Smart Solutions</p>
                    <p>Berlin-Spandau, Deutschland</p>
                    <p>E-Mail: hallo@cssberlin.de</p>
                </div>
            </div>
        </div>
    );
}
