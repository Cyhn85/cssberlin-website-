import { formatDistanceToNow, format } from "date-fns";
import { de, tr } from "date-fns/locale";

/**
 * Renders date as "2 hours ago" or "Yesterday"
 * @param date 
 * @param locale Default 'tr'
 * @returns 
 */
export function formatTimeAgo(date: Date | string | number, locale: "tr" | "de" | "en" = "tr") {
    const d = new Date(date);
    const localeObj = locale === "de" ? de : tr; // fallback to tr for en for now or add en
    return formatDistanceToNow(d, { addSuffix: true, locale: localeObj });
}

/**
 * Formats currency to "€12,50" or "12,50 €"
 * @param amount 
 * @param currency Default "EUR"
 * @returns 
 */
export function formatCurrency(amount: number | string, currency = "EUR", locale = "de-DE") {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(num);
}
