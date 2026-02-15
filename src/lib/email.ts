import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
    if (!_resend) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error("RESEND_API_KEY is not set");
        }
        _resend = new Resend(apiKey);
    }
    return _resend;
}

const FROM_NOREPLY = "CSS Berlin <noreply@cssberlin.de>";

// ============================================
// WELCOME EMAIL - sent after first registration
// ============================================
export async function sendWelcomeEmail(to: string, name: string) {
    try {
        await getResend().emails.send({
            from: FROM_NOREPLY,
            to,
            subject: "Willkommen bei CSS Berlin! 🌿",
            html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f8f7f4;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;margin-top:32px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td style="background:#1a3b28;padding:40px 32px;text-align:center;">
    <h1 style="margin:0;color:#e05e00;font-size:32px;font-weight:900;font-style:italic;letter-spacing:-1px;">CSS<span style="color:#ffffff;font-weight:300;">berlin</span></h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.5);font-size:10px;letter-spacing:3px;text-transform:uppercase;">Climate Smart Solutions</p>
  </td></tr>
  <tr><td style="padding:40px 32px;">
    <h2 style="margin:0 0 16px;color:#1a3b28;font-size:24px;font-weight:800;">Hallo ${name}!</h2>
    <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.7;">
      Willkommen in der CSS Berlin Community! Du bist jetzt Teil einer nachhaltigen Bewegung,
      die Mode und Umweltbewusstsein vereint.
    </p>
    <div style="background:#f0faf0;border-radius:12px;padding:20px;margin-bottom:24px;border-left:4px solid #1a3b28;">
      <p style="margin:0;color:#1a3b28;font-weight:700;font-size:14px;">Was dich erwartet:</p>
      <ul style="margin:12px 0 0;padding-left:20px;color:#555;font-size:14px;line-height:2;">
        <li><strong>Kaufen</strong> – Einzigartige Second-Hand-Schätze entdecken</li>
        <li><strong>Verkaufen</strong> – Bis zu 95% des Erlöses behalten</li>
        <li><strong>Käuferschutz</strong> – Sicheres Einkaufen garantiert</li>
        <li><strong>Climate Smart</strong> – Jeder Kauf spart ~3,6 kg CO₂</li>
      </ul>
    </div>
    <a href="https://cssberlin.de/catalog" style="display:inline-block;background:#e05e00;color:#1a3b28;font-weight:900;font-size:12px;text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:2px;text-transform:uppercase;">Jetzt entdecken</a>
  </td></tr>
  <tr><td style="padding:24px 32px;background:#fafaf8;border-top:1px solid #eee;text-align:center;">
    <p style="margin:0;color:#999;font-size:11px;">CSS Berlin – Climate Smart Solutions</p>
    <p style="margin:4px 0 0;color:#bbb;font-size:10px;">Am Omnibushof 12, 13593 Berlin | info@cssberlin.de</p>
  </td></tr>
</table>
</body>
</html>`,
        });
        return { success: true };
    } catch (error) {
        console.error("Welcome email error:", error);
        return { success: false, error };
    }
}

// ============================================
// ORDER CONFIRMATION - sent to buyer after purchase
// ============================================
export async function sendOrderConfirmationEmail(
    to: string,
    buyerName: string,
    productTitle: string,
    price: string,
    orderId: string
) {
    try {
        await getResend().emails.send({
            from: FROM_NOREPLY,
            to,
            subject: `Bestellung bestätigt: ${productTitle}`,
            html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f8f7f4;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;margin-top:32px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td style="background:#1a3b28;padding:32px;text-align:center;">
    <h1 style="margin:0;color:#e05e00;font-size:28px;font-weight:900;font-style:italic;">CSS<span style="color:#fff;font-weight:300;">berlin</span></h1>
  </td></tr>
  <tr><td style="padding:40px 32px;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="width:64px;height:64px;background:#f0faf0;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <span style="font-size:28px;">✓</span>
      </div>
      <h2 style="margin:0;color:#1a3b28;font-size:22px;font-weight:800;">Bestellung bestätigt!</h2>
    </div>
    <p style="color:#555;font-size:15px;line-height:1.7;">Hallo ${buyerName}, deine Bestellung wurde erfolgreich aufgegeben.</p>
    <div style="background:#fafaf8;border-radius:12px;padding:20px;margin:24px 0;border:1px solid #eee;">
      <p style="margin:0 0 8px;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Bestelldetails</p>
      <p style="margin:0 0 4px;color:#1a3b28;font-weight:700;font-size:16px;">${productTitle}</p>
      <p style="margin:0;color:#e05e00;font-weight:900;font-size:20px;">€${price}</p>
      <p style="margin:8px 0 0;color:#bbb;font-size:11px;">Bestell-Nr: ${orderId}</p>
    </div>
    <p style="color:#555;font-size:14px;line-height:1.7;">
      Der Verkäufer wird benachrichtigt und den Artikel innerhalb von 5 Werktagen versenden.
      Du erhältst eine Versandbestätigung mit Sendungsverfolgung per E-Mail.
    </p>
    <div style="background:#fff8f0;border-radius:12px;padding:16px;margin-top:24px;border:1px solid #f0e0c0;">
      <p style="margin:0;color:#1a3b28;font-weight:700;font-size:13px;">🛡️ Käuferschutz aktiv</p>
      <p style="margin:4px 0 0;color:#777;font-size:12px;">Dein Geld ist geschützt, bis du den Artikel erhalten und bestätigt hast.</p>
    </div>
  </td></tr>
  <tr><td style="padding:24px 32px;background:#fafaf8;border-top:1px solid #eee;text-align:center;">
    <p style="margin:0;color:#999;font-size:11px;">CSS Berlin – Climate Smart Solutions | Am Omnibushof 12, 13593 Berlin</p>
  </td></tr>
</table>
</body>
</html>`,
        });
        return { success: true };
    } catch (error) {
        console.error("Order confirmation email error:", error);
        return { success: false, error };
    }
}

// ============================================
// SALE NOTIFICATION - sent to seller when item is sold
// ============================================
export async function sendSaleNotificationEmail(
    to: string,
    sellerName: string,
    productTitle: string,
    price: string,
    buyerName: string
) {
    try {
        await getResend().emails.send({
            from: FROM_NOREPLY,
            to,
            subject: `Verkauft! ${productTitle} wurde gekauft`,
            html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f8f7f4;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;margin-top:32px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td style="background:#1a3b28;padding:32px;text-align:center;">
    <h1 style="margin:0;color:#e05e00;font-size:28px;font-weight:900;font-style:italic;">CSS<span style="color:#fff;font-weight:300;">berlin</span></h1>
  </td></tr>
  <tr><td style="padding:40px 32px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:48px;">🎉</span>
      <h2 style="margin:8px 0 0;color:#1a3b28;font-size:22px;font-weight:800;">Dein Artikel wurde verkauft!</h2>
    </div>
    <p style="color:#555;font-size:15px;line-height:1.7;">Hallo ${sellerName}, großartige Neuigkeiten!</p>
    <div style="background:#f0faf0;border-radius:12px;padding:20px;margin:24px 0;border:1px solid #d0e8d0;">
      <p style="margin:0 0 4px;color:#1a3b28;font-weight:700;font-size:16px;">${productTitle}</p>
      <p style="margin:0;color:#e05e00;font-weight:900;font-size:20px;">€${price}</p>
      <p style="margin:8px 0 0;color:#777;font-size:13px;">Käufer: ${buyerName}</p>
    </div>
    <p style="color:#555;font-size:14px;line-height:1.7;"><strong>Nächster Schritt:</strong> Bitte versende den Artikel innerhalb von 5 Werktagen. Gib die Sendungsverfolgungsnummer in deinem Dashboard ein.</p>
    <a href="https://cssberlin.de/profile/orders" style="display:inline-block;background:#e05e00;color:#1a3b28;font-weight:900;font-size:12px;text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:2px;text-transform:uppercase;margin-top:16px;">Versand verwalten</a>
  </td></tr>
  <tr><td style="padding:24px 32px;background:#fafaf8;border-top:1px solid #eee;text-align:center;">
    <p style="margin:0;color:#999;font-size:11px;">CSS Berlin – Climate Smart Solutions | Am Omnibushof 12, 13593 Berlin</p>
  </td></tr>
</table>
</body>
</html>`,
        });
        return { success: true };
    } catch (error) {
        console.error("Sale notification email error:", error);
        return { success: false, error };
    }
}

// ============================================
// NEW OFFER - sent to seller when buyer makes an offer
// ============================================
export async function sendOfferNotificationEmail(
    to: string,
    sellerName: string,
    productTitle: string,
    offerPrice: string,
    buyerName: string
) {
    try {
        await getResend().emails.send({
            from: FROM_NOREPLY,
            to,
            subject: `Neuer Preisvorschlag für ${productTitle}`,
            html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f8f7f4;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;margin-top:32px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td style="background:#1a3b28;padding:32px;text-align:center;">
    <h1 style="margin:0;color:#e05e00;font-size:28px;font-weight:900;font-style:italic;">CSS<span style="color:#fff;font-weight:300;">berlin</span></h1>
  </td></tr>
  <tr><td style="padding:40px 32px;">
    <h2 style="margin:0 0 16px;color:#1a3b28;font-size:22px;font-weight:800;">Neuer Preisvorschlag!</h2>
    <p style="color:#555;font-size:15px;line-height:1.7;">Hallo ${sellerName}, du hast einen neuen Preisvorschlag erhalten.</p>
    <div style="background:#fff8f0;border-radius:12px;padding:20px;margin:24px 0;border:1px solid #f0e0c0;">
      <p style="margin:0 0 4px;color:#333;font-weight:700;font-size:16px;">${productTitle}</p>
      <p style="margin:0;color:#e05e00;font-weight:900;font-size:24px;">€${offerPrice}</p>
      <p style="margin:8px 0 0;color:#777;font-size:13px;">von ${buyerName}</p>
    </div>
    <a href="https://cssberlin.de/inbox" style="display:inline-block;background:#e05e00;color:#1a3b28;font-weight:900;font-size:12px;text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:2px;text-transform:uppercase;">Angebot ansehen</a>
  </td></tr>
  <tr><td style="padding:24px 32px;background:#fafaf8;border-top:1px solid #eee;text-align:center;">
    <p style="margin:0;color:#999;font-size:11px;">CSS Berlin – Climate Smart Solutions | Am Omnibushof 12, 13593 Berlin</p>
  </td></tr>
</table>
</body>
</html>`,
        });
        return { success: true };
    } catch (error) {
        console.error("Offer notification email error:", error);
        return { success: false, error };
    }
}

// ============================================
// PASSWORD RESET - custom template (Clerk handles sending, this is for reference)
// ============================================
export async function sendPasswordResetEmail(to: string, name: string, resetLink: string) {
    try {
        await getResend().emails.send({
            from: FROM_NOREPLY,
            to,
            subject: "Passwort zurücksetzen – CSS Berlin",
            html: `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#f8f7f4;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;margin-top:32px;margin-bottom:32px;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td style="background:#1a3b28;padding:32px;text-align:center;">
    <h1 style="margin:0;color:#e05e00;font-size:28px;font-weight:900;font-style:italic;">CSS<span style="color:#fff;font-weight:300;">berlin</span></h1>
  </td></tr>
  <tr><td style="padding:40px 32px;">
    <h2 style="margin:0 0 16px;color:#1a3b28;font-size:22px;font-weight:800;">Passwort zurücksetzen</h2>
    <p style="color:#555;font-size:15px;line-height:1.7;">Hallo ${name}, du hast angefordert, dein Passwort zurückzusetzen. Klicke auf den Button unten:</p>
    <a href="${resetLink}" style="display:inline-block;background:#e05e00;color:#1a3b28;font-weight:900;font-size:12px;text-decoration:none;padding:14px 32px;border-radius:8px;letter-spacing:2px;text-transform:uppercase;margin-top:16px;">Passwort zurücksetzen</a>
    <p style="color:#999;font-size:12px;margin-top:24px;">Wenn du dies nicht angefordert hast, kannst du diese E-Mail ignorieren.</p>
  </td></tr>
  <tr><td style="padding:24px 32px;background:#fafaf8;border-top:1px solid #eee;text-align:center;">
    <p style="margin:0;color:#999;font-size:11px;">CSS Berlin – Climate Smart Solutions | Am Omnibushof 12, 13593 Berlin</p>
  </td></tr>
</table>
</body>
</html>`,
        });
        return { success: true };
    } catch (error) {
        console.error("Password reset email error:", error);
        return { success: false, error };
    }
}
