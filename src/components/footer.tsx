import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, ShieldCheck, Truck, RefreshCw, Mail, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[var(--css-green)] text-white/80 pt-16 pb-8 mt-auto border-t border-white/10">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand & Mission */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-white text-lg tracking-wide mb-2">CSS Berlin</h3>
                        <p className="text-sm leading-relaxed text-white/70">
                            Deine Plattform für Second-Hand Mode in Berlin. Entdecke einzigartige Stücke, verkaufe, was du nicht mehr trägst, und shoppe nachhaltig.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-[var(--css-orange)] hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-[var(--css-orange)] hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-[var(--css-orange)] hover:text-white transition-colors">
                                <Youtube className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Entdecken */}
                    <div>
                        <h3 className="font-bold text-white text-lg tracking-wide mb-4">Entdecken</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/catalog/women" className="hover:text-[var(--css-orange)] transition-colors">Damen</Link></li>
                            <li><Link href="/catalog/men" className="hover:text-[var(--css-orange)] transition-colors">Herren</Link></li>
                            <li><Link href="/catalog/kids" className="hover:text-[var(--css-orange)] transition-colors">Kinder</Link></li>
                            <li><Link href="/catalog/home" className="hover:text-[var(--css-orange)] transition-colors">Home & Living</Link></li>
                            <li><Link href="/brands" className="hover:text-[var(--css-orange)] transition-colors">Marken</Link></li>
                        </ul>
                    </div>

                    {/* Hilfe & Support */}
                    <div>
                        <h3 className="font-bold text-white text-lg tracking-wide mb-4">Hilfe & Support</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/help" className="hover:text-[var(--css-orange)] transition-colors">Hilfe-Center</Link></li>
                            <li><Link href="/selling-guide" className="hover:text-[var(--css-orange)] transition-colors">Verkaufen</Link></li>
                            <li><Link href="/buying-guide" className="hover:text-[var(--css-orange)] transition-colors">Kaufen</Link></li>
                            <li><Link href="/safety" className="hover:text-[var(--css-orange)] transition-colors">Sicherheit & Vertrauen</Link></li>
                            <li><Link href="/contact" className="hover:text-[var(--css-orange)] transition-colors">Kontakt</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Info */}
                    <div>
                        <h3 className="font-bold text-white text-lg tracking-wide mb-4">Rechtliches</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/about" className="hover:text-[var(--css-orange)] transition-colors">Über uns</Link></li>
                            <li><Link href="/impressum" className="hover:text-[var(--css-orange)] transition-colors">Impressum</Link></li>
                            <li><Link href="/agb" className="hover:text-[var(--css-orange)] transition-colors">AGB</Link></li>
                            <li><Link href="/datenschutz" className="hover:text-[var(--css-orange)] transition-colors">Datenschutz</Link></li>
                            <li><Link href="/widerrufsbelehrung" className="hover:text-[var(--css-orange)] transition-colors">Widerrufsbelehrung</Link></li>
                            <li><Link href="/cookies" className="hover:text-[var(--css-orange)] transition-colors">Cookie-Einstellungen</Link></li>
                        </ul>
                        <div className="mt-6 pt-6 border-t border-white/10 text-xs text-white/50 space-y-2">
                            <p className="flex items-center gap-2"><MapPin className="h-3 w-3" /> Berlin, Deutschland</p>
                            <p className="flex items-center gap-2"><Mail className="h-3 w-3" /> hallo@cssberlin.de</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
                    <p>&copy; 2026 CSS Berlin. Alle Rechte vorbehalten.</p>
                    <div className="flex gap-6">
                        <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[var(--css-orange)]" /> Sicher bezahlen</span>
                        <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-[var(--css-orange)]" /> Versicherter Versand</span>
                        <span className="flex items-center gap-1.5"><RefreshCw className="h-4 w-4 text-[var(--css-orange)]" /> Kostenlose Rückgabe*</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
