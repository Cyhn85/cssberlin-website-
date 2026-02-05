#!/usr/bin/env python3
"""
IONOS SMTP Test Script
Test IONOS email connection and send a test email
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load .env
load_dotenv()

# IONOS SMTP Settings
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.ionos.de")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "magic@cssberlin.de")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "magic@cssberlin.de")

print("=" * 60)
print("IONOS SMTP Test")
print("=" * 60)
print(f"SMTP Host: {SMTP_HOST}")
print(f"SMTP Port: {SMTP_PORT}")
print(f"SMTP User: {SMTP_USER}")
print(f"From Email: {FROM_EMAIL}")
print(f"Password: {'*' * len(SMTP_PASSWORD) if SMTP_PASSWORD else 'NOT SET'}")
print("=" * 60)

if not SMTP_PASSWORD:
    print("[!] HATA: SMTP_PASSWORD bos!")
    print("[*] .env dosyasinda SMTP_PASSWORD ayarini kontrol et")
    exit(1)

# Test email
TO_EMAIL = input("\n[*] Test email gonderilecek adres (ornek: cyhnsrgc@gmail.com): ").strip()

if not TO_EMAIL:
    print("[!] Email adresi gerekli!")
    exit(1)

print(f"\n[*] {FROM_EMAIL} -> {TO_EMAIL} email gonderiliyor...")

try:
    # Create message
    msg = MIMEMultipart("alternative")
    msg["From"] = FROM_EMAIL
    msg["To"] = TO_EMAIL
    msg["Subject"] = "🧪 CSS Berlin IONOS Test Email"

    # HTML body
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body style="font-family: Arial, sans-serif; padding: 40px; background: #f9fafb;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <h1 style="color: #2D5016; font-size: 28px; margin-bottom: 20px;">✅ IONOS SMTP Test Başarılı!</h1>

            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Bu email CSS Berlin backend'inden IONOS SMTP üzerinden gönderildi.
            </p>

            <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin: 30px 0;">
                <h3 style="color: #2D5016; margin: 0 0 10px 0;">📧 Email Detayları:</h3>
                <ul style="color: #374151; margin: 0; padding-left: 20px;">
                    <li>Gönderen: {FROM_EMAIL}</li>
                    <li>SMTP Host: {SMTP_HOST}</li>
                    <li>SMTP Port: {SMTP_PORT}</li>
                    <li>User: {SMTP_USER}</li>
                </ul>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
                🚀 CSS Berlin Email System - Test Successful!
            </p>
        </div>
    </body>
    </html>
    """

    html_part = MIMEText(html, "html", "utf-8")
    msg.attach(html_part)

    # Connect to IONOS SMTP
    print(f"🔌 {SMTP_HOST}:{SMTP_PORT} bağlanılıyor...")
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as server:
        print("🔐 TLS başlatılıyor...")
        server.starttls()

        print(f"🔑 Login: {SMTP_USER}")
        server.login(SMTP_USER, SMTP_PASSWORD)

        print("📨 Email gönderiliyor...")
        server.send_message(msg)

    print("\n" + "=" * 60)
    print("✅ EMAIL BAŞARIYLA GÖNDERİLDİ!")
    print("=" * 60)
    print(f"📬 {TO_EMAIL} adresini kontrol et!")
    print("📧 Gönderen: {FROM_EMAIL}")
    print("\n💡 Magic Link ve Password Reset artık çalışacak!")
    print("=" * 60)

except smtplib.SMTPAuthenticationError as e:
    print("\n" + "=" * 60)
    print("❌ SMTP Authentication Hatası!")
    print("=" * 60)
    print(f"Hata: {e}")
    print("\n🔧 Çözüm:")
    print("1. IONOS Dashboard'a git: https://login.ionos.de")
    print("2. Email & Office → Email Accounts")
    print("3. magic@cssberlin.de şifresini kontrol et")
    print("4. .env dosyasındaki SMTP_PASSWORD'u güncelle")
    print("=" * 60)

except smtplib.SMTPConnectError as e:
    print("\n" + "=" * 60)
    print("❌ SMTP Bağlantı Hatası!")
    print("=" * 60)
    print(f"Hata: {e}")
    print("\n🔧 Çözüm:")
    print("1. İnternet bağlantını kontrol et")
    print("2. SMTP_HOST doğru mu: smtp.ionos.de")
    print("3. SMTP_PORT doğru mu: 587")
    print("=" * 60)

except Exception as e:
    print("\n" + "=" * 60)
    print("❌ Beklenmeyen Hata!")
    print("=" * 60)
    print(f"Hata tipi: {type(e).__name__}")
    print(f"Hata: {e}")
    print("=" * 60)
