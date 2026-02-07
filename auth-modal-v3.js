// CSS BERLIN - CLERK AUTHENTICATION (V3.9 - GERMAN EDITION)
// Almanca Dil Desteği ve Geliştirilmiş Yönlendirme Ayarları

window.addEventListener("load", async function () {

    // Clerk kütüphanesinin yüklenmesini bekle
    if (!window.Clerk) {
        console.error("Clerk script could not be loaded. Check index.html head.");
        return;
    }

    // ALMANCA ÇEVİRİ PAKETİ (Manuel Tanımlama)
    // Clerk CDN ile kullanıldığı için paketi elle ekliyoruz.
    const localizationDE = {
        socialButtonsBlockButton: "Weiter mit {{provider|titleize}}",
        signIn: {
            start: {
                title: "Anmelden",
                subtitle: "Willkommen zurück bei CSS Berlin",
                actionText: "Haben Sie kein Konto?",
                actionLink: "Registrieren"
            },
            password: {
                title: "Passwort eingeben",
                subtitle: "zum Anmelden bei CSS Berlin"
            }
        },
        signUp: {
            start: {
                title: "Registrieren",
                subtitle: "Erstellen Sie ein neues Konto",
                actionText: "Haben Sie bereits ein Konto?",
                actionLink: "Anmelden"
            }
        },
        formFieldLabel__emailAddress: "E-Mail-Adresse",
        formFieldLabel__password: "Passwort",
        formFieldLabel__firstName: "Vorname",
        formFieldLabel__lastName: "Nachname",
        formFieldLabel__username: "Benutzername",
        formButtonPrimary: "Weiter",
        userButton: {
            action__manageAccount: "Konto verwalten",
            action__signOut: "Abmelden"
        },
        unstable__errors: {
            form_identifier_not_found: "Diese E-Mail-Adresse wurde nicht gefunden.",
            form_password_incorrect: "Falsches Passwort."
        }
    };

    try {
        // 1. CLERK'Ü BAŞLAT VE TASARIMINI AYARLA
        await window.Clerk.load({
            // ALMANCA DİL AYARI
            localization: localizationDE,

            appearance: {
                variables: {
                    colorPrimary: '#2D5016', // CSS Berlin Yeşili
                    colorText: '#111827',
                    colorBackground: '#ffffff',
                    colorInputText: '#111827',
                    borderRadius: '12px',
                    fontFamily: '"Inter", sans-serif'
                },
                elements: {
                    formButtonPrimary: {
                        backgroundColor: '#FF8C42', // CSS Berlin Turuncusu
                        color: 'white',
                        backgroundImage: 'linear-gradient(135deg, #FF8C42 0%, #E8854C 100%)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(255, 140, 66, 0.3)',
                        textTransform: 'uppercase',
                        fontSize: '14px',
                        fontWeight: '700'
                    },
                    card: {
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        borderRadius: '24px',
                        border: '1px solid rgba(0,0,0,0.05)'
                    },
                    headerTitle: {
                        fontFamily: '"Montserrat", sans-serif',
                        fontWeight: '800',
                        color: '#2D5016'
                    },
                    footerActionLink: {
                        color: '#FF8C42',
                        fontWeight: '600'
                    }
                }
            }
        });

        console.log("Clerk (Deutsch) loaded successfully.");

        // 2. BUTONLARI YÖNET
        const loginBtn = document.getElementById("header-login-btn");
        const userContainer = document.getElementById("user-button-container");

        // Kullanıcı giriş yapmış mı?
        if (window.Clerk.user) {
            // EVET GİRİŞ YAPMIŞ
            console.log("User is logged in:", window.Clerk.user.firstName);

            // Login butonunu gizle
            if (loginBtn) loginBtn.style.display = "none";

            // Profil butonunu (UserButton) yerleştir
            if (userContainer) {
                // Konteyner temizle (dublike olmaması için)
                userContainer.innerHTML = '';

                window.Clerk.mountUserButton(userContainer, {
                    afterSignOutUrl: "/",
                    signInUrl: "/" // Çıkış yapınca ana sayfaya dön
                });
            }

        } else {
            // HAYIR GİRİŞ YAPMAMIŞ
            if (loginBtn) {
                loginBtn.style.display = "flex"; // Butonu göster

                // Tıklanınca Login penceresini aç
                loginBtn.addEventListener("click", () => {
                    window.Clerk.openSignIn({
                        // Modern Redirect URL Parametreleri (Console Uyarısı Düzeltildi)
                        signInFallbackRedirectUrl: window.location.href,
                        signUpFallbackRedirectUrl: window.location.href
                    });
                });
            }
        }

    } catch (err) {
        console.error("Error starting Clerk:", err);
    }
});
