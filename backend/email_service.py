"""
CSS Berlin Email Service
IONOS SMTP ile email gönderimi
noreply@cssberlin.de → Magic Link, şifre sıfırlama
info@cssberlin.de    → Sipariş bildirimleri
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# IONOS SMTP
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.ionos.de")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

SMTP_USER_MAGIC = os.getenv("SMTP_USER_MAGIC", "noreply@cssberlin.de")
SMTP_PASSWORD_MAGIC = os.getenv("SMTP_PASSWORD_MAGIC", "")
FROM_EMAIL_MAGIC = os.getenv("FROM_EMAIL_MAGIC", "noreply@cssberlin.de")

SMTP_USER_INFO = os.getenv("SMTP_USER_INFO", "info@cssberlin.de")
SMTP_PASSWORD_INFO = os.getenv("SMTP_PASSWORD_INFO", "")
FROM_EMAIL_INFO = os.getenv("FROM_EMAIL_INFO", "info@cssberlin.de")

DEV_MODE = os.getenv("EMAIL_DEV_MODE", "false").lower() == "true"


def _send_email(from_email: str, smtp_user: str, smtp_password: str,
                to_email: str, subject: str, html_body: str) -> bool:
    if DEV_MODE:
        print(f"[DEV_MODE] Email: {to_email} | Subject: {subject}")
        return True
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = from_email
        msg["To"] = to_email
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(from_email, to_email, msg.as_string())
        print(f"[EMAIL] Gonderildi: {to_email}")
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False


def send_magic_link_email(to_email: str, magic_link: str, user_name: str = None) -> bool:
    name = user_name or "Degerli Musteri"
    subject = "CSS Berlin - Giris Baglantiniz"
    html = f"""
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:40px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:28px;">CSS Berlin</h1>
    <p style="color:#a78bfa;margin:8px 0 0;">Climate Smart Solutions</p>
  </div>
  <div style="padding:40px;">
    <h2 style="color:#1f2937;">Merhaba {name},</h2>
    <p style="color:#4b5563;">Hesabiniza giris yapmak icin asagidaki butona tiklayin.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="{magic_link}"
         style="background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;
                padding:16px 40px;border-radius:8px;text-decoration:none;
                font-size:16px;font-weight:bold;">
        Giris Yap
      </a>
    </div>
    <p style="color:#6b7280;font-size:14px;">Bu baglanti 15 dakika gecerlidir.</p>
    <p style="color:#9ca3af;font-size:13px;">Bu emaili siz istemediyseniz dikkate almayin.</p>
  </div>
  <div style="background:#f9fafb;padding:24px;text-align:center;">
    <p style="color:#6b7280;font-size:13px;margin:0;">CSS Berlin — Sicheres Anmelden</p>
    <p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">
      &copy; 2026 CSS Berlin — Climate Smart Solutions
    </p>
  </div>
</div>
</body>
</html>
"""
    return _send_email(FROM_EMAIL_MAGIC, SMTP_USER_MAGIC, SMTP_PASSWORD_MAGIC,
                       to_email, subject, html)


def send_welcome_email(to_email: str, user_name: str = None) -> bool:
    name = user_name or "Degerli Musteri"
    subject = "CSS Berlin - Hos Geldiniz!"
    html = f"""
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:40px;text-align:center;">
    <h1 style="color:#fff;margin:0;">CSS Berlin</h1>
    <p style="color:#a78bfa;margin:8px 0 0;">Climate Smart Solutions</p>
  </div>
  <div style="padding:40px;">
    <h2 style="color:#1f2937;">Merhaba {name},</h2>
    <p style="color:#4b5563;">CSS Berlin ailesine hos geldiniz! Surdurulebilir modaya katkida bulundunuz icin tesekkurler.</p>
    <p style="color:#4b5563;">Simdi harika urunlerimizi kesfedebilirsiniz.</p>
  </div>
  <div style="background:#f9fafb;padding:24px;text-align:center;">
    <p style="color:#6b7280;font-size:13px;margin:0;">CSS Berlin — Climate Smart Solutions</p>
    <p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">&copy; 2026 CSS Berlin</p>
  </div>
</div>
</body>
</html>
"""
    return _send_email(FROM_EMAIL_MAGIC, SMTP_USER_MAGIC, SMTP_PASSWORD_MAGIC,
                       to_email, subject, html)


def send_order_confirmation_email(to_email: str, order_id: str,
                                  items: list, total: float,
                                  user_name: str = None) -> bool:
    name = user_name or "Degerli Musteri"
    subject = f"CSS Berlin - Siparis Onayı #{order_id}"
    items_html = "".join([
        f"<tr><td style='padding:8px;border-bottom:1px solid #e5e7eb;'>{i.get('name','')}</td>"
        f"<td style='padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;'>"
        f"{i.get('quantity',1)}x {i.get('price',0):.2f} EUR</td></tr>"
        for i in items
    ])
    html = f"""
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:40px;text-align:center;">
    <h1 style="color:#fff;margin:0;">CSS Berlin</h1>
  </div>
  <div style="padding:40px;">
    <h2 style="color:#1f2937;">Siparisiniz Onaylandi!</h2>
    <p style="color:#4b5563;">Merhaba {name}, #{order_id} numarali siparisiz alindi.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      {items_html}
      <tr>
        <td style="padding:12px;font-weight:bold;">Toplam</td>
        <td style="padding:12px;text-align:right;font-weight:bold;">{total:.2f} EUR</td>
      </tr>
    </table>
  </div>
  <div style="background:#f9fafb;padding:24px;text-align:center;">
    <p style="color:#6b7280;font-size:13px;margin:0;">CSS Berlin — Climate Smart Solutions</p>
    <p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">&copy; 2026 CSS Berlin</p>
  </div>
</div>
</body>
</html>
"""
    return _send_email(FROM_EMAIL_INFO, SMTP_USER_INFO, SMTP_PASSWORD_INFO,
                       to_email, subject, html)


def send_password_reset_email(to_email: str, reset_link: str,
                               user_name: str = None) -> bool:
    name = user_name or "Degerli Musteri"
    subject = "CSS Berlin - Sifre Sifirlama"
    html = f"""
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:40px;text-align:center;">
    <h1 style="color:#fff;margin:0;">CSS Berlin</h1>
  </div>
  <div style="padding:40px;">
    <h2 style="color:#1f2937;">Sifre Sifirlama</h2>
    <p style="color:#4b5563;">Merhaba {name}, sifrenizi sifirlamak icin butona tiklayin.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="{reset_link}"
         style="background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;
                padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:bold;">
        Sifremi Sifirla
      </a>
    </div>
    <p style="color:#6b7280;font-size:14px;">Bu baglanti 1 saat gecerlidir.</p>
  </div>
  <div style="background:#f9fafb;padding:24px;text-align:center;">
    <p style="color:#6b7280;font-size:13px;margin:0;">CSS Berlin — Climate Smart Solutions</p>
    <p style="color:#9ca3af;font-size:12px;margin:4px 0 0;">&copy; 2026 CSS Berlin</p>
  </div>
</div>
</body>
</html>
"""
    return _send_email(FROM_EMAIL_MAGIC, SMTP_USER_MAGIC, SMTP_PASSWORD_MAGIC,
                       to_email, subject, html)
