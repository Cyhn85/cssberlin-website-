# backend/email_service.py
"""
CSS Berlin — Email Service
IONOS SMTP ile Magic Link, Password Reset, ve Notifications
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from pathlib import Path

# ─── IONOS SMTP Configuration ───────────────────────────────
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.ionos.de")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

# Magic Link & Password Reset
SMTP_USER_MAGIC = os.getenv("SMTP_USER_MAGIC", "noreply@cssberlin.de")
SMTP_PASSWORD_MAGIC = os.getenv("SMTP_PASSWORD_MAGIC", "")
FROM_EMAIL_MAGIC = os.getenv("FROM_EMAIL_MAGIC", "noreply@cssberlin.de")

# General Info & Notifications
SMTP_USER_INFO = os.getenv("SMTP_USER_INFO", "info@cssberlin.de")
SMTP_PASSWORD_INFO = os.getenv("SMTP_PASSWORD_INFO", "")
FROM_EMAIL_INFO = os.getenv("FROM_EMAIL_INFO", "info@cssberlin.de")

# Default (fallback to noreply)
SMTP_USER = os.getenv("SMTP_USER", SMTP_USER_MAGIC)
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", SMTP_PASSWORD_MAGIC)
FROM_EMAIL = os.getenv("FROM_EMAIL", FROM_EMAIL_MAGIC)

# Frontend URL for links
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5500")

# DEV MODE: Print emails to console instead of sending
DEV_MODE = os.getenv("EMAIL_DEV_MODE", "true").lower() == "true"


# ─── Email Sender (Generic) ─────────────────────────────────
def send_email(
    to_email: str,
    subject: str,
    html_body: str,
    from_email: Optional[str] = None,
    smtp_user: Optional[str] = None,
    smtp_password: Optional[str] = None,
) -> bool:
    """
    Generic email sender using IONOS SMTP

    Args:
        to_email: Recipient email
        subject: Email subject
        html_body: HTML email content
        from_email: Sender email (default: noreply@cssberlin.de)
        smtp_user: SMTP username (default: noreply@cssberlin.de)
        smtp_password: SMTP password

    Returns:
        bool: True if sent successfully
    """
    from_email = from_email or FROM_EMAIL
    smtp_user = smtp_user or SMTP_USER
    smtp_password = smtp_password or SMTP_PASSWORD

    # DEV MODE: Just print to console
    if DEV_MODE:
        print("\n" + "=" * 60)
        print("[DEV MODE] Email Preview")
        print("=" * 60)
        print(f"From: {from_email}")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print("-" * 60)
        print(html_body[:500])  # First 500 chars
        print("=" * 60 + "\n")
        return True

    try:
        # Create message
        msg = MIMEMultipart("alternative")
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = subject

        # Attach HTML body
        html_part = MIMEText(html_body, "html", "utf-8")
        msg.attach(html_part)

        # Connect to IONOS SMTP
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)

        print(f"[OK] Email sent: {to_email} (from {from_email})")
        return True

    except Exception as e:
        print(f"[ERROR] Email send failed: {e}")
        return False


# ─── Magic Link Email ───────────────────────────────────────
def send_magic_link_email(to_email: str, magic_link: str, user_name: Optional[str] = None) -> bool:
    """
    Magic Link email via noreply@cssberlin.de

    Args:
        to_email: User email
        magic_link: Full magic link URL
        user_name: User first name (optional)
    """
    subject = "🔐 Dein Magic Link für CSS Berlin"

    user_greeting = f"Hallo {user_name}," if user_name else "Hallo,"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; background: #f9fafb; margin: 0; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #FF8C42 0%, #2D5016 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; font-size: 32px; margin: 0; font-weight: 900;">CSS Berlin</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Climate Smart Solutions</p>
            </div>

            <!-- Body -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0; font-weight: 700;">Magic Link Login</h2>

                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    {user_greeting}
                </p>

                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Klicke auf den Button unten, um dich bei CSS Berlin anzumelden. Dieser Link ist <strong>15 Minuten gültig</strong>.
                </p>

                <!-- Magic Link Button -->
                <div style="text-align: center; margin: 40px 0;">
                    <a href="{magic_link}"
                       style="display: inline-block; background: linear-gradient(135deg, #FF8C42 0%, #2D5016 100%); color: white; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);">
                        🔓 Jetzt anmelden
                    </a>
                </div>

                <!-- Alternative Link -->
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                    Oder kopiere diesen Link in deinen Browser:<br>
                    <a href="{magic_link}" style="color: #FF8C42; word-break: break-all;">{magic_link}</a>
                </p>

                <!-- Warning -->
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 30px 0 0 0; border-radius: 8px;">
                    <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;">
                        <strong>⚠️ Sicherheitshinweis:</strong> Falls du diese Email nicht angefordert hast, ignoriere sie einfach.
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0;">
                    CSS Berlin — Sicheres Anmelden
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0 0 5px 0;">
                    © 2026 CSS Berlin — Climate Smart Solutions
                </p>
                <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                    Diese Email kann nicht beantwortet werden.
                </p>
            </div>

        </div>
    </body>
    </html>
    """

    return send_email(
        to_email=to_email,
        subject=subject,
        html_body=html_body,
        from_email=FROM_EMAIL_MAGIC,
        smtp_user=SMTP_USER_MAGIC,
        smtp_password=SMTP_PASSWORD_MAGIC,
    )


# ─── Password Reset Email ───────────────────────────────────
def send_password_reset_email(to_email: str, reset_link: str, user_name: Optional[str] = None) -> bool:
    """
    Password Reset email via noreply@cssberlin.de

    Args:
        to_email: User email
        reset_link: Full password reset URL
        user_name: User first name (optional)
    """
    subject = "🔑 Passwort zurücksetzen — CSS Berlin"

    user_greeting = f"Hallo {user_name}," if user_name else "Hallo,"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; background: #f9fafb; margin: 0; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #FF8C42 0%, #2D5016 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; font-size: 32px; margin: 0; font-weight: 900;">CSS Berlin</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Climate Smart Solutions</p>
            </div>

            <!-- Body -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0; font-weight: 700;">Passwort zurücksetzen</h2>

                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    {user_greeting}
                </p>

                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt. Klicke auf den Button unten, um ein neues Passwort zu erstellen. Dieser Link ist <strong>30 Minuten gültig</strong>.
                </p>

                <!-- Reset Button -->
                <div style="text-align: center; margin: 40px 0;">
                    <a href="{reset_link}"
                       style="display: inline-block; background: linear-gradient(135deg, #FF8C42 0%, #2D5016 100%); color: white; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);">
                        🔑 Neues Passwort erstellen
                    </a>
                </div>

                <!-- Alternative Link -->
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                    Oder kopiere diesen Link in deinen Browser:<br>
                    <a href="{reset_link}" style="color: #FF8C42; word-break: break-all;">{reset_link}</a>
                </p>

                <!-- Warning -->
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 30px 0 0 0; border-radius: 8px;">
                    <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;">
                        <strong>⚠️ Sicherheitshinweis:</strong> Falls du diese Anfrage nicht gestellt hast, ignoriere diese Email. Dein Passwort bleibt unverändert.
                    </p>
                </div>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0;">
                    CSS Berlin — Sicheres Anmelden
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0 0 5px 0;">
                    © 2026 CSS Berlin — Climate Smart Solutions
                </p>
                <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                    Diese Email kann nicht beantwortet werden.
                </p>
            </div>

        </div>
    </body>
    </html>
    """

    return send_email(
        to_email=to_email,
        subject=subject,
        html_body=html_body,
        from_email=FROM_EMAIL_MAGIC,
        smtp_user=SMTP_USER_MAGIC,
        smtp_password=SMTP_PASSWORD_MAGIC,
    )


# ─── Welcome Email (Info) ───────────────────────────────────
def send_welcome_email(to_email: str, user_name: str) -> bool:
    """
    Welcome email via info@cssberlin.de

    Args:
        to_email: New user email
        user_name: User first name
    """
    subject = "🎉 Willkommen bei CSS Berlin!"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; background: #f9fafb; margin: 0; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #FF8C42 0%, #2D5016 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; font-size: 32px; margin: 0; font-weight: 900;">CSS Berlin</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Climate Smart Solutions</p>
            </div>

            <!-- Body -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0; font-weight: 700;">Willkommen, {user_name}! 🎉</h2>

                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Schön, dass du jetzt Teil der CSS Berlin Community bist!
                </p>

                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Bei CSS Berlin kannst du nachhaltige Second-Hand-Artikel kaufen und verkaufen. Jeder Kauf hilft, CO₂ zu sparen und die Umwelt zu schützen.
                </p>

                <!-- Features -->
                <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 30px 0;">
                    <h3 style="color: #2D5016; font-size: 18px; margin: 0 0 15px 0; font-weight: 700;">🌱 Was du jetzt tun kannst:</h3>
                    <ul style="color: #374151; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                        <li>Stöbere in unseren <strong>nachhaltigen Produkten</strong></li>
                        <li>Verkaufe deine eigenen <strong>Second-Hand-Artikel</strong></li>
                        <li>Spare CO₂ mit jedem Kauf</li>
                        <li>Werde Teil der <strong>Climate Smart Community</strong></li>
                    </ul>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 40px 0;">
                    <a href="{FRONTEND_URL}"
                       style="display: inline-block; background: linear-gradient(135deg, #FF8C42 0%, #2D5016 100%); color: white; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(255, 140, 66, 0.3);">
                        🛍️ Jetzt entdecken
                    </a>
                </div>

                <!-- Support -->
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                    Hast du Fragen? Schreib uns an <a href="mailto:info@cssberlin.de" style="color: #FF8C42; text-decoration: none;">info@cssberlin.de</a>
                </p>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0;">
                    CSS Berlin — Dein nachhaltiger Marktplatz
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0 0 5px 0;">
                    © 2026 CSS Berlin — Climate Smart Solutions
                </p>
                <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                    Fragen? Antworte einfach auf diese Email.
                </p>
            </div>

        </div>
    </body>
    </html>
    """

    return send_email(
        to_email=to_email,
        subject=subject,
        html_body=html_body,
        from_email=FROM_EMAIL_INFO,
        smtp_user=SMTP_USER_INFO,
        smtp_password=SMTP_PASSWORD_INFO,
    )


# ─── Order Confirmation Email (Info) ────────────────────────
def send_order_confirmation_email(to_email: str, user_name: str, order_id: str, total: float) -> bool:
    """
    Order confirmation email via info@cssberlin.de

    Args:
        to_email: Customer email
        user_name: Customer name
        order_id: Order ID
        total: Order total amount
    """
    subject = f"✅ Bestellung bestätigt #{order_id}"

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; background: #f9fafb; margin: 0; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">

            <div style="background: linear-gradient(135deg, #FF8C42 0%, #2D5016 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; font-size: 32px; margin: 0;">CSS Berlin</h1>
            </div>

            <div style="padding: 40px 30px;">
                <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0;">Vielen Dank, {user_name}!</h2>

                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                    Deine Bestellung wurde erfolgreich aufgegeben.
                </p>

                <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 30px 0;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Bestellnummer:</p>
                    <p style="margin: 5px 0 15px 0; color: #111827; font-size: 20px; font-weight: 700;">#{order_id}</p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Gesamtbetrag:</p>
                    <p style="margin: 5px 0 0 0; color: #2D5016; font-size: 24px; font-weight: 700;">{total:.2f} €</p>
                </div>

                <p style="color: #6b7280; font-size: 14px; text-align: center;">
                    Bei Fragen: <a href="mailto:info@cssberlin.de" style="color: #FF8C42;">info@cssberlin.de</a>
                </p>
            </div>

            <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0;">
                    CSS Berlin — Bestellbestätigung
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0 0 5px 0;">
                    © 2026 CSS Berlin — Climate Smart Solutions
                </p>
                <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                    Fragen? Antworte einfach auf diese Email.
                </p>
            </div>

        </div>
    </body>
    </html>
    """

    return send_email(
        to_email=to_email,
        subject=subject,
        html_body=html_body,
        from_email=FROM_EMAIL_INFO,
        smtp_user=SMTP_USER_INFO,
        smtp_password=SMTP_PASSWORD_INFO,
    )
