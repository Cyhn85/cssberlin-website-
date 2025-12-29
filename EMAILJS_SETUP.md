# EmailJS Setup Guide für CSS Berlin

## Übersicht

EmailJS ermöglicht das direkte Versenden von E-Mails vom Browser ohne Backend-Server. Die E-Mails werden direkt von Ihrer Domain (noreply@cssberlin.com) versendet, nicht von einem Drittanbieter-Server.

## Vorteile von EmailJS

✅ **Direkte E-Mails** - Keine Weiterleitung, E-Mails erscheinen direkt von CSS Berlin
✅ **Kein Backend nötig** - Funktioniert rein client-seitig
✅ **Kostenlos** - 200 E-Mails/Monat kostenlos
✅ **SMTP Integration** - Nutzt Ihren eigenen Mail-Server
✅ **Sicher** - Public Key verhindert Missbrauch

## Setup-Schritte

### 1. EmailJS Account erstellen

1. Gehen Sie zu [EmailJS.com](https://www.emailjs.com/)
2. Klicken Sie auf "Sign Up" (Kostenlos)
3. Registrieren Sie sich mit Ihrer E-Mail

### 2. Email Service hinzufügen

1. Nach dem Login: Dashboard → "Email Services" → "Add New Service"
2. Wählen Sie Ihren E-Mail-Anbieter:
   - **Gmail** (einfach, aber zeigt gmail.com als Absender)
   - **Custom SMTP** (empfohlen für cssberlin.com)
   - Andere (Outlook, Yahoo, etc.)

#### Option A: Gmail (Schnell-Setup für Tests)

1. Service: "Gmail"
2. Service ID: `gmail_service` (notieren!)
3. Verbinden Sie Ihr Gmail-Konto
4. **Wichtig**: Aktivieren Sie "2-Step Verification" und erstellen Sie ein "App Password"

#### Option B: Custom SMTP (Empfohlen für Production)

1. Service: "Custom SMTP"
2. Service ID: `cssberlin_smtp` (notieren!)
3. SMTP Settings:
   ```
   SMTP Server: mail.cssberlin.com (oder Ihr Provider)
   Port: 587 (TLS) oder 465 (SSL)
   Username: noreply@cssberlin.com
   Password: [Ihr SMTP Passwort]
   Secure: true
   ```
4. From Name: `CSS Berlin`
5. From Email: `noreply@cssberlin.com`

### 3. Email Template erstellen

1. Dashboard → "Email Templates" → "Create New Template"
2. Template Name: `verification_email`
3. Template ID wird generiert (z.B. `template_abc123`) - **notieren!**

#### Template Inhalt:

**Subject:**
```
E-Mail Bestätigung - CSS Berlin
```

**Content (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #FF8C42, #2D5016);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .code-box {
            background: white;
            border: 2px solid #2D5016;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
        }
        .code {
            font-size: 32px;
            font-weight: bold;
            color: #2D5016;
            letter-spacing: 4px;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>CSS Berlin</h1>
        <p>Climate Smart Solutions</p>
    </div>
    <div class="content">
        <p>Hallo {{to_name}},</p>

        <p>vielen Dank für Ihre Registrierung bei CSS Berlin!</p>

        <p>Ihr Bestätigungscode lautet:</p>

        <div class="code-box">
            <div class="code">{{verification_code}}</div>
        </div>

        <p>Bitte geben Sie diesen Code auf der Bestätigungsseite ein, um Ihr Konto zu aktivieren.</p>

        <p><strong>Der Code ist 24 Stunden gültig.</strong></p>

        <p>Mit freundlichen Grüßen<br>
        Ihr CSS Berlin Team<br>
        Climate Smart Solutions</p>

        <div class="footer">
            <p>© 2025 CSS Berlin - Climate Smart Solutions</p>
            <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht darauf.</p>
        </div>
    </div>
</body>
</html>
```

**Template Variables** (Auto-Fill Settings):
- `{{to_email}}` - Empfänger E-Mail
- `{{to_name}}` - Empfänger Name
- `{{from_name}}` - CSS Berlin
- `{{verification_code}}` - 6-stelliger Code
- `{{message}}` - Zusätzliche Nachricht (optional)

### 4. Public Key generieren

1. Dashboard → "Account" → "General"
2. Finden Sie Ihren **Public Key** (z.B. `abc123XYZ`)
3. **Wichtig**: Notieren Sie diesen Key!

### 5. Code aktualisieren

Öffnen Sie [auth.js](auth.js) und ersetzen Sie die Platzhalter:

```javascript
await emailjs.send(
    'YOUR_SERVICE_ID',        // → 'cssberlin_smtp' oder 'gmail_service'
    'YOUR_TEMPLATE_ID',       // → 'template_abc123'
    templateParams,
    'YOUR_PUBLIC_KEY'         // → 'abc123XYZ'
);
```

**Beispiel mit echten Werten:**
```javascript
await emailjs.send(
    'cssberlin_smtp',         // Service ID aus Schritt 2
    'template_xy5k9m2',       // Template ID aus Schritt 3
    templateParams,
    'uJ8Kx_9mP4nL2zQ5V'      // Public Key aus Schritt 4
);
```

### 6. Testen

1. Öffnen Sie [registrieren.html](registrieren.html)
2. Füllen Sie das Registrierungsformular aus
3. Klicken Sie "Jetzt registrieren"
4. Überprüfen Sie Ihr E-Mail-Postfach
5. Geben Sie den 6-stelligen Code ein

## Troubleshooting

### E-Mails kommen nicht an

1. **Überprüfen Sie Spam-Ordner**
2. **Console öffnen** (F12): Sehen Sie Fehler?
3. **EmailJS Dashboard**: Überprüfen Sie "Email Log" für Fehler
4. **SMTP Settings**: Testen Sie mit einem SMTP-Test-Tool

### "EmailJS not loaded" Warnung

- Internetverbindung überprüfen
- Browser-Cache leeren
- Ad-Blocker deaktivieren

### 403 Forbidden Error

- Public Key ist falsch
- Service/Template ID ist falsch
- EmailJS Account nicht aktiviert

## Alternative: SendGrid

Falls EmailJS nicht funktioniert, können Sie auch **SendGrid** verwenden:

1. [SendGrid.com](https://sendgrid.com/) - 100 E-Mails/Tag kostenlos
2. API Key erstellen
3. Code in auth.js anpassen:

```javascript
const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_SENDGRID_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        personalizations: [{
            to: [{ email: email }],
            subject: 'E-Mail Bestätigung - CSS Berlin'
        }],
        from: {
            email: 'noreply@cssberlin.com',
            name: 'CSS Berlin'
        },
        content: [{
            type: 'text/html',
            value: emailTemplate
        }]
    })
});
```

## Kosten

### EmailJS (Empfohlen)
- **Free**: 200 E-Mails/Monat
- **Personal**: $7/Monat - 1000 E-Mails
- **Pro**: $15/Monat - 5000 E-Mails

### SendGrid
- **Free**: 100 E-Mails/Tag (3000/Monat)
- **Essentials**: $19.95/Monat - 50.000 E-Mails

## Sicherheit

⚠️ **Wichtige Hinweise:**

1. **Nie API Keys im Code** - Nur Public Keys verwenden
2. **Rate Limiting** - EmailJS hat eingebautes Rate-Limiting
3. **CAPTCHA** - Bei Spam-Problemen CAPTCHA hinzufügen
4. **SPF/DKIM** - Konfigurieren Sie diese für cssberlin.com Domain

## Support

- EmailJS Docs: https://www.emailjs.com/docs/
- EmailJS Support: support@emailjs.com
- CSS Berlin: info@cssberlin.com

---

**Erstellt am**: 2025-11-08
**Autor**: Claude Code
**Version**: 1.0
