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
    
    subject = "🔐 Ihr CSS Berlin Login-Link"
    
    text_body = f"""
Hallo,

Hier ist Ihr sicherer Login-Link für CSS Berlin:

{magic_link}

Dieser Link ist 15 Minuten gültig.

Falls Sie diese E-Mail nicht angefordert haben, ignorieren Sie sie bitte.

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
            <h1>🔐 Ihr Login-Link</h1>
        </div>
        <div class="content">
            <p>Hallo,</p>
            <p>Klicken Sie auf den Button unten, um sich bei CSS Berlin anzumelden:</p>
            <p style="text-align: center;">
                <a href="{magic_link}" class="button">Jetzt anmelden</a>
            </p>
            <p style="color: #666; font-size: 12px;">
                Dieser Link ist 15 Minuten gültig.<br>
                Falls Sie diese E-Mail nicht angefordert haben, ignorieren Sie sie bitte.
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
