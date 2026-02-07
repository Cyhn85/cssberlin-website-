# backend/email_service.py
"""
CSS Berlin — Email Service (Production Ready)
Handles Magic Link, Password Reset, and Welcome Emails
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

# Environment Variables
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@cssberlin.de")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5500")

# Development mode: If SMTP not configured, print to console
DEV_MODE = not (SMTP_USER and SMTP_PASSWORD)


def send_email(to_email: str, subject: str, html_body: str, text_body: Optional[str] = None) -> bool:
    """
    Send email via SMTP or print to console in dev mode
    
    Returns:
        bool: True if sent successfully, False otherwise
    """
    if DEV_MODE:
        print("\n" + "="*80)
        print("📧 EMAIL (DEV MODE - Not actually sent)")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"Body:\n{text_body or html_body}")
        print("="*80 + "\n")
        return True
    
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email
        
        # Attach text and HTML parts
        if text_body:
            part1 = MIMEText(text_body, 'plain', 'utf-8')
            msg.attach(part1)
        
        part2 = MIMEText(html_body, 'html', 'utf-8')
        msg.attach(part2)
        
        # Send via SMTP
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"✅ Email sent to {to_email}")
        return True
        
    except Exception as e:
        print(f"❌ Email send failed: {str(e)}")
        return False


def send_magic_link_email(to_email: str, magic_link: str) -> bool:
    """Send magic link for passwordless login"""
    
    subject = "🌱 Ihr magischer Zugang zu CSS Berlin"
    
    text_body = f"""
Hallo,

Wir freuen uns, dass Sie Teil der Veränderung sind! 🌍

Ihr magischer Zugangscode ist bereit. Mit jedem Login bei CSS Berlin unterstützen Sie unsere Mission, die Natur zu schützen, Meere sauber zu halten und Wälder wieder aufzuforsten.

Klicken Sie hier, um fortzufahren:
{magic_link}

"Kleine Schritte, große Wirkung. Gemeinsam für eine grünere Zukunft."

Dieser Link ist 15 Minuten gültig.

Mit nachhaltigen Grüßen,
Ihr CSS Berlin Team
    """
    
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a3409; background-color: #f4f7f2; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }}
        .header {{ background: linear-gradient(135deg, #2D5016 0%, #1a3409 100%); padding: 40px 30px; text-align: center; color: white; }}
        .content {{ padding: 40px 30px; text-align: center; }}
        .button {{ display: inline-block; background: #FF8C42; color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 25px 0; transition: transform 0.2s; }}
        .button:hover {{ transform: scale(1.05); background: #e67a35; }}
        .footer {{ background: #eaf2e3; padding: 20px; text-align: center; font-size: 12px; color: #5c7c4d; }}
        .quote {{ font-style: italic; color: #2D5016; margin-top: 20px; font-size: 14px; border-left: 3px solid #FF8C42; padding-left: 15px; display: inline-block; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin:0; font-size:24px;">CSS Berlin</h1>
            <p style="margin:10px 0 0; opacity:0.9;">Climate Smart Solutions</p>
        </div>
        <div class="content">
            <h2 style="color: #2D5016;">Willkommen zurück! 🌱</h2>
            <p>Schön, dass Sie wieder da sind. Gemeinsam können wir Berge versetzen – und erhalten.</p>
            <p>Ihr magischer Zugang zu einer nachhaltigeren Welt ist nur einen Klick entfernt.</p>
            
            <a href="{magic_link}" class="button">Jetzt Einloggen</a>
            
            <br>
            <div class="quote">
                "Der beste Weg, die Zukunft vorherzusagen, ist, sie zu gestalten.<br>
                Lassen Sie uns gemeinsam den Planeten für kommende Generationen bewahren."
            </div>
            
            <p style="margin-top: 30px; font-size: 13px; color: #666;">
                Dieser Link garantiert Ihnen sicheren Zugang für die nächsten 15 Minuten.
            </p>
        </div>
        <div class="footer">
            <p>🌱 100% Digital. 0% Papier. 100% Liebe zur Natur.</p>
            © 2026 CSS Berlin
        </div>
    </div>
</body>
</html>
    """
    
    return send_email(to_email, subject, html_body, text_body)


def send_password_reset_email(to_email: str, reset_link: str) -> bool:
    """Send password reset link"""
    
    subject = "🔑 CSS Berlin - Passwort zurücksetzen"
    
    text_body = f"""
Hallo,

Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.

Klicken Sie auf diesen Link, um ein neues Passwort zu erstellen:

{reset_link}

Dieser Link ist 30 Minuten gültig.

Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail bitte.

Mit freundlichen Grüßen,
CSS Berlin Team
    """
    
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
        .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
        .button {{ display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔑 Passwort zurücksetzen</h1>
        </div>
        <div class="content">
            <p>Hallo,</p>
            <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
            <p style="text-align: center;">
                <a href="{reset_link}" class="button">Neues Passwort erstellen</a>
            </p>
            <p style="color: #666; font-size: 12px;">
                Dieser Link ist 30 Minuten gültig.<br>
                Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail bitte.
            </p>
        </div>
        <div class="footer">
            © 2026 CSS Berlin - Climate Smart Solutions
        </div>
    </div>
</body>
</html>
    """
    
    return send_email(to_email, subject, html_body, text_body)


def send_welcome_email(to_email: str, first_name: str) -> bool:
    """Send welcome email to new users"""
    
    subject = "🎉 Willkommen bei CSS Berlin!"
    
    text_body = f"""
Hallo {first_name},

Willkommen bei CSS Berlin - Climate Smart Solutions!

Ihr Konto wurde erfolgreich erstellt. Sie können sich jetzt anmelden und unsere nachhaltigen Produkte entdecken.

Vielen Dank, dass Sie Teil unserer Community werden!

Mit freundlichen Grüßen,
CSS Berlin Team
    """
    
    html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
        .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
        .button {{ display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Willkommen bei CSS Berlin!</h1>
        </div>
        <div class="content">
            <p>Hallo {first_name},</p>
            <p>Willkommen bei CSS Berlin - Climate Smart Solutions!</p>
            <p>Ihr Konto wurde erfolgreich erstellt. Sie können sich jetzt anmelden und unsere nachhaltigen Produkte entdecken.</p>
            <p style="text-align: center;">
                <a href="{FRONTEND_URL}" class="button">Jetzt einkaufen</a>
            </p>
            <p>Vielen Dank, dass Sie Teil unserer Community werden!</p>
        </div>
        <div class="footer">
            © 2026 CSS Berlin - Climate Smart Solutions
        </div>
    </div>
</body>
</html>
    """
    
    return send_email(to_email, subject, html_body, text_body)
