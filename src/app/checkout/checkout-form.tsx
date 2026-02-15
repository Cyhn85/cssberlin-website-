"use client";

import { useState } from "react";
import { Truck, Shield, CreditCard } from "lucide-react";

const shippingOptions = [
    { id: "dhl_small", label: "Kleines Paket (DHL)", desc: "Bis 2kg, 2-3 Werktage", price: 3.49 },
    { id: "dhl_medium", label: "Mittleres Paket (DHL)", desc: "Bis 5kg, 2-3 Werktage, versichert", price: 4.99 },
    { id: "dhl_large", label: "Großes Paket (DHL)", desc: "Bis 31.5kg, 2-3 Werktage, versichert", price: 6.99 },
];

interface CheckoutFormProps {
    productId: string;
    price: number;
}

export function CheckoutForm({ productId, price }: CheckoutFormProps) {
    const [selectedShipping, setSelectedShipping] = useState("dhl_medium");
    const [agbAccepted, setAgbAccepted] = useState(false);
    const [widerrufAccepted, setWiderrufAccepted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const canSubmit = agbAccepted && widerrufAccepted && !isProcessing;

    const handleCheckout = async () => {
        if (!canSubmit) return;

        setIsProcessing(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, shippingOption: selectedShipping }),
            });

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || "Ein Fehler ist aufgetreten.");
                setIsProcessing(false);
            }
        } catch {
            alert("Verbindungsfehler. Bitte versuchen Sie es erneut.");
            setIsProcessing(false);
        }
    };

    return (
        <>
            {/* Shipping Options */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-berlin-green" />
                    Versandart wählen
                </h2>
                <div className="space-y-3">
                    {shippingOptions.map((option) => (
                        <label
                            key={option.id}
                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedShipping === option.id
                                    ? "border-berlin-green bg-berlin-green/5"
                                    : "border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="shipping"
                                    checked={selectedShipping === option.id}
                                    onChange={() => setSelectedShipping(option.id)}
                                    className="w-4 h-4 text-berlin-green focus:ring-berlin-green"
                                />
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">{option.label}</div>
                                    <div className="text-xs text-gray-500">{option.desc}</div>
                                </div>
                            </div>
                            <span className="font-black text-gray-900">€{option.price.toFixed(2).replace(".", ",")}</span>
                        </label>
                    ))}
                    {price >= 50 && (
                        <p className="text-xs text-berlin-green font-bold mt-2">
                            Ab €50 Bestellwert: Kostenloser Versand!
                        </p>
                    )}
                </div>
            </div>

            {/* Payment Method Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-berlin-green" />
                    Zahlungsmethode
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                        Sie werden sicher zu <strong>Stripe</strong> weitergeleitet, um Ihre Zahlung abzuschließen.
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        <Shield className="w-4 h-4 text-berlin-green" />
                        SSL-verschlüsselt &bull; PCI DSS zertifiziert
                    </div>
                </div>
            </div>

            {/* AGB & Widerrufsbelehrung Checkboxes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">Bestätigung</h2>

                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={agbAccepted}
                        onChange={(e) => setAgbAccepted(e.target.checked)}
                        className="mt-1 w-4 h-4 text-berlin-green focus:ring-berlin-green rounded"
                    />
                    <span className="text-sm text-gray-600">
                        Ich habe die{" "}
                        <a href="/agb" className="text-berlin-green underline font-bold" target="_blank">
                            AGB
                        </a>{" "}
                        und{" "}
                        <a href="/datenschutz" className="text-berlin-green underline font-bold" target="_blank">
                            Datenschutzbestimmungen
                        </a>{" "}
                        gelesen und bin damit einverstanden. *
                    </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={widerrufAccepted}
                        onChange={(e) => setWiderrufAccepted(e.target.checked)}
                        className="mt-1 w-4 h-4 text-berlin-green focus:ring-berlin-green rounded"
                    />
                    <span className="text-sm text-gray-600">
                        Ich habe die{" "}
                        <a href="/widerruf" className="text-berlin-green underline font-bold" target="_blank">
                            Widerrufsbelehrung
                        </a>{" "}
                        zur Kenntnis genommen. *
                    </span>
                </label>

                {/* Buy Button - German legal requirement: "Zahlungspflichtig bestellen" */}
                <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={!canSubmit}
                    className="w-full bg-css-orange text-berlin-green py-4 rounded-lg font-black text-lg uppercase tracking-widest hover:bg-berlin-green hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                    {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-berlin-green/30 border-t-berlin-green rounded-full animate-spin" />
                            Weiterleitung...
                        </span>
                    ) : (
                        "Zahlungspflichtig bestellen"
                    )}
                </button>
            </div>
        </>
    );
}
