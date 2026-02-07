// CSS BERLIN - CLERK AUTHENTICATION (V3.8 - FINAL)
window.addEventListener("load", async function () {

    // Clerk kütüphanesinin yüklenmesini bekle
    if (!window.Clerk) {
        console.error("Clerk script could not be loaded. Check index.html head.");
        return;
    }

    try {
        // 1. CLERK'Ü BAŞLAT VE TASARIMINI AYARLA
        await window.Clerk.load({
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
                    }
                }
            }
        });

        console.log("Clerk loaded successfully.");

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
                window.Clerk.mountUserButton(userContainer, {
                    afterSignOutUrl: "/"
                });
            }

            // Backend'e Token Gönderme Hazırlığı (Opsiyonel)
            // const token = await window.Clerk.session.getToken();
            // localStorage.setItem("clerk_token", token);

        } else {
            // HAYIR GİRİŞ YAPMAMIŞ
            if (loginBtn) {
                loginBtn.style.display = "flex"; // Butonu göster

                // Tıklanınca Login penceresini aç
                loginBtn.addEventListener("click", () => {
                    window.Clerk.openSignIn({
                        afterSignInUrl: "/",
                        afterSignUpUrl: "/"
                    });
                });
            }
        }

    } catch (err) {
        console.error("Error starting Clerk:", err);
    }
});
