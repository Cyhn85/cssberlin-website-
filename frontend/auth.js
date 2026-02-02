/* ============================================
   CSS BERLIN AUTHENTICATION BRIDGE
   Handles both Registration and Login Forms
   ============================================ */

const API_URL = "http://localhost:8000"; // Geliştirme ortamı için
// const API_URL = "https://api.cssberlin.de"; // Canlı ortam için (Deploy ederken bunu aç)

// --- Helper: Toast Message (Eğer toast.js yoksa basit alert kullanır) ---
function showMessage(type, title, message) {
    if (typeof toast !== 'undefined' && toast[type]) {
        toast[type](title, message);
    } else {
        alert(`${title}: ${message}`);
    }
}

// --- Auth Gate Object (login.html uyumluluğu için) ---
const authGate = {
    handleLogin: async function(credentials) {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                // Token'ı kaydet
                localStorage.setItem("css_access_token", data.access_token);
                localStorage.setItem("css_user_name", data.user_name);
                
                showMessage('success', 'Erfolg', 'Anmeldung erfolgreich! Weiterleitung...');
                
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            } else {
                showMessage('error', 'Fehler', data.detail || "Login fehlgeschlagen.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            showMessage('error', 'Verbindungsfehler', "Server nicht erreichbar.");
        }
    },
    
    loginWithGoogle: function() {
        showMessage('info', 'Info', 'Google Login ist bald verfügbar!');
    },

    showLoginModal: function(a, b, type) {
        // Header butonları için yönlendirme
        if(type === 'login') window.location.href = 'login.html';
        if(type === 'register') window.location.href = 'registrieren.html';
    }
};

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. KAYIT FORMU (registrieren.html)
    const registerForm = document.getElementById("registerForm");
    
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const submitBtn = registerForm.querySelector(".submit-btn");
            const originalText = submitBtn.innerHTML;
            
            // Verileri Topla (HTML ID'lerine göre)
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const terms = document.getElementById("terms").checked;

            // Basit Doğrulamalar
            if (password !== confirmPassword) {
                showMessage('error', 'Fehler', 'Passwörter stimmen nicht überein.');
                return;
            }
            if (!terms) {
                showMessage('error', 'Fehler', 'Bitte akzeptieren Sie die AGB.');
                return;
            }

            submitBtn.innerHTML = "Verarbeitung...";
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_URL}/api/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        first_name: firstName,
                        last_name: lastName
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem("css_access_token", data.access_token);
                    localStorage.setItem("css_user_name", data.user_name);
                    showMessage('success', 'Willkommen', 'Konto erfolgreich erstellt!');
                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 2000);
                } else {
                    showMessage('error', 'Fehler', data.detail || "Registrierung fehlgeschlagen.");
                }
            } catch (error) {
                console.error("Register Error:", error);
                showMessage('error', 'Fehler', "Server Verbindung fehlgeschlagen.");
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // 2. GİRİŞ FORMU (login.html)
    // Not: login.html içinde inline script var, ancak biz buraya da listener ekleyelim.
    const loginForm = document.getElementById("auth-gate-login-form");
    // login.html içindeki inline script authGate.handleLogin'i çağırıyor,
    // authGate nesnesini yukarıda tanımladığımız için sorun çıkmayacak.
});