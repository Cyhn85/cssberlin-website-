/**
 * CSS BERLIN - AUTH SYSTEM (v2026)
 * Bağlantı: api-config.js üzerinden 8001 portuna gider.
 */

const authGate = {
    isAuthenticated: false,
    currentUser: null,

    // SİSTEMİ BAŞLAT
    init: async function() {
        console.log("Auth Sistemi Başlatılıyor...");
        this.bindEvents();
        await this.checkAuthStatus();
    },

    // EVENTLERİ DİNLE (Login Formu vb.)
    bindEvents: function() {
        // Login Formu
        const loginForm = document.querySelector('form#auth-gate-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                await this.handleLogin({ email, password });
            });
        }

        // Register Formu
        const registerForm = document.querySelector('form#auth-gate-register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(registerForm);
                const data = Object.fromEntries(formData.entries());
                
                // Şifre kontrolü
                if (data.password !== data.confirm_password) {
                    this.showToast('Hata', 'Şifreler eşleşmiyor', 'error');
                    return;
                }
                
                await this.handleRegister(data);
            });
        }
    },

    // LOGIN İŞLEMİ
    handleLogin: async function(credentials) {
        const btn = document.querySelector('.auth-btn-login-submit');
        if (btn) btn.innerHTML = 'Giriş yapılıyor...';

        try {
            // URL alırken API_CONFIG kullanıyoruz
            const url = (window.API_CONFIG && window.API_CONFIG.getUrl) 
                ? window.API_CONFIG.getUrl('/auth/token')
                : 'https://195.201.146.224:8001/auth/token'; // Fallback

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    username: credentials.email,
                    password: credentials.password
                })
            });

            if (!response.ok) throw new Error('E-posta veya şifre hatalı');

            const data = await response.json();
            
            // Token'ı kaydet
            localStorage.setItem('auth_token', data.access_token);
            
            this.showToast('Başarılı', 'Giriş yapıldı, yönlendiriliyorsunuz...', 'success');
            
            // Kullanıcı verisini çek ve yönlendir
            await this.checkAuthStatus();
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);

        } catch (error) {
            console.error('Login Hatası:', error);
            this.showToast('Hata', error.message, 'error');
            if (btn) btn.innerHTML = 'Giriş Yap';
        }
    },

    // KAYIT İŞLEMİ
    handleRegister: async function(userData) {
        const btn = document.querySelector('.auth-btn-register-submit');
        if (btn) btn.innerHTML = 'Kaydediliyor...';

        try {
            const payload = {
                email: userData.email,
                password: userData.password,
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                role: 'user'
            };

            const url = (window.API_CONFIG && window.API_CONFIG.getUrl) 
                ? window.API_CONFIG.getUrl('/auth/register')
                : 'https://195.201.146.224:8001/auth/register';

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Kayıt başarısız');
            }

            this.showToast('Başarılı', 'Hesap oluşturuldu! Şimdi giriş yapabilirsiniz.', 'success');
            setTimeout(() => { window.location.href = 'login.html'; }, 2000);

        } catch (error) {
            console.error('Register Hatası:', error);
            this.showToast('Hata', error.message, 'error');
            if (btn) btn.innerHTML = 'Kayıt Ol';
        }
    },

    // KULLANICI DURUMUNU KONTROL ET
    checkAuthStatus: async function() {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            this.updateUI(false);
            return;
        }

        try {
            const url = (window.API_CONFIG && window.API_CONFIG.getUrl) 
                ? window.API_CONFIG.getUrl('/auth/me')
                : 'https://195.201.146.224:8001/auth/me';

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const user = await response.json();
                this.currentUser = user;
                this.isAuthenticated = true;
                localStorage.setItem('current_user', JSON.stringify(user));
                this.updateUI(true);
            } else {
                this.logout();
            }
        } catch (e) {
            console.error("Auth Check Hatası", e);
            this.logout();
        }
    },

    // ÇIKIŞ YAP
    logout: function() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        this.isAuthenticated = false;
        this.currentUser = null;
        this.updateUI(false);
        // Sadece login sayfasında değilsek yönlendir
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    },

    // ARAYÜZÜ GÜNCELLE
    updateUI: function(isLoggedIn) {
        if (window.GlobalHeader && typeof window.GlobalHeader.updateHeaderUI === 'function') {
            window.GlobalHeader.updateHeaderUI();
        }
    },

    // BİLDİRİM GÖSTER (Toast)
    showToast: function(title, message, type = 'info') {
        if (typeof toast !== 'undefined' && toast[type]) {
            toast[type](title, message);
        } else {
            alert(`${title}: ${message}`);
        }
    }
};

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    authGate.init();
});

// Global erişim
window.authGate = authGate;