import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { FooterSocials } from "@/components/footer-socials";

export function Footer() {
    return (
        <footer className="animate-footer-bg text-white/70 mt-auto">
            {/* Link Satiri */}
            <div className="page-container py-5">
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium">
                    <Link href="/about" className="hover:text-white transition-colors">Über uns</Link>
                    <span className="text-white/20">|</span>
                    <Link href="/help" className="hover:text-white transition-colors">Hilfe</Link>
                    <span className="text-white/20">|</span>
                    <Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link>
                    <span className="text-white/20">|</span>
                    <Link href="/agb" className="hover:text-white transition-colors">AGB</Link>
                    <span className="text-white/20">|</span>
                    <Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
                    <span className="text-white/20">|</span>
                    <Link href="/widerrufsbelehrung" className="hover:text-white transition-colors">Widerruf</Link>
                    <span className="text-white/20">|</span>
                    <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    <span className="text-white/20">|</span>
                    <Link href="/contact" className="hover:text-white transition-colors">Kontakt</Link>
                </div>
            </div>

            {/* Social Media Icons */}
            <div className="border-t border-white/10">
                <div className="page-container">
                    <FooterSocials />
                </div>
            </div>

            {/* Brand Stamp + Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="page-container py-3.5 flex flex-col items-center gap-4 text-[11px] text-white/40">
                    {/* Brand Stamp */}
                    <div className="flex items-baseline gap-0.5">
                        <span className="font-black text-lg tracking-tight text-css-orange leading-none">CSS</span>
                        <span className="font-light text-lg tracking-tight text-white/60 leading-none">berlin</span>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full">
                        <p>&copy; 2026 CSS Berlin. Alle Rechte vorbehalten.</p>
                        <div className="flex gap-5">
                            <span className="flex items-center gap-1.5">
                                <ShieldCheck className="h-3.5 w-3.5 text-css-orange" /> Sicher bezahlen
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Truck className="h-3.5 w-3.5 text-css-orange" /> Versicherter Versand
                            </span>
                            <span className="flex items-center gap-1.5">
                                <RefreshCw className="h-3.5 w-3.5 text-css-orange" /> Kostenlose Rückgabe
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
