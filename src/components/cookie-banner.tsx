"use client";

import { useState, useEffect } from "react";
import { Cookie, X, Check, Settings } from "lucide-react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "css_berlin_cookie_consent";

type ConsentType = "all" | "essential" | "custom" | null;

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [consent, setConsent] = useState<ConsentType>(null);

    // Client-side only: Check localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!stored) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        } else {
            setConsent(stored as ConsentType);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "all");
        setConsent("all");
        setIsVisible(false);
    };

    const handleAcceptEssential = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "essential");
        setConsent("essential");
        setIsVisible(false);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-x-0 bottom-0 z-[100] animate-in slide-in-from-bottom duration-500">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm -z-10"
                onClick={handleClose}
            />

            {/* Banner */}
            <div className="bg-[var(--css-green)] text-white p-6 shadow-2xl">
                <div className="container mx-auto max-w-5xl">
                    <div className="flex items-start gap-4">
                        {/* Cookie Icon */}
                        <div className="hidden sm:flex w-14 h-14 bg-white/10 rounded-full items-center justify-center shrink-0">
                            <Cookie className="w-7 h-7" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <Cookie className="w-5 h-5 sm:hidden" />
                                Wir verwenden Cookies 🍪
                            </h3>
                            <p className="text-white/90 text-sm leading-relaxed mb-4">
                                Wir nutzen Cookies, um dir die bestmögliche Erfahrung auf unserer Website zu bieten.
                                Einige sind notwendig für die Funktion der Seite, andere helfen uns, das Nutzererlebnis zu verbessern.
                                {" "}
                                <Link href="/datenschutz" className="underline hover:text-white font-medium">
                                    Mehr erfahren
                                </Link>
                            </p>

                            {/* Buttons */}
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={handleAcceptAll}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-[var(--css-orange)] text-[var(--css-green)] font-bold rounded-xl hover:bg-orange-400 transition-all hover:scale-105 shadow-lg"
                                >
                                    <Check className="w-4 h-4" />
                                    Alle akzeptieren
                                </button>
                                <button
                                    onClick={handleAcceptEssential}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white/10 border border-white/30 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
                                >
                                    Nur notwendige
                                </button>
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="flex items-center gap-1.5 px-4 py-2.5 text-white/80 hover:text-white text-sm font-medium transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    Einstellungen
                                </button>
                            </div>

                            {/* Details (Optional) */}
                            {showDetails && (
                                <div className="mt-4 pt-4 border-t border-white/20 animate-in slide-in-from-top-2 duration-300">
                                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                                        <div className="bg-white/10 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                                <span className="font-medium">Notwendig</span>
                                            </div>
                                            <p className="text-white/70 text-xs">
                                                Für Login, Warenkorb und grundlegende Funktionen.
                                            </p>
                                        </div>
                                        <div className="bg-white/10 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                                <span className="font-medium">Analyse</span>
                                            </div>
                                            <p className="text-white/70 text-xs">
                                                Helfen uns, die Website zu verbessern.
                                            </p>
                                        </div>
                                        <div className="bg-white/10 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                                                <span className="font-medium">Marketing</span>
                                            </div>
                                            <p className="text-white/70 text-xs">
                                                Personalisierte Inhalte und Werbung.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                            aria-label="Schließen"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
