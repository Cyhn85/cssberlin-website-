class MessageModal {
    constructor() {
        this.injectHTML();
        this.modal = document.getElementById('messageModal');
    }

    injectHTML() {
        if (document.getElementById('messageModal')) return;

        const html = `
            <div id="messageModal" class="message-modal">
                <div class="message-modal-content">
                    <button class="modal-close-btn" onclick="messageModal.close()">&times;</button>
                    <h2 class="modal-title">Nachricht an Verkäufer</h2>
                    <p class="modal-subtitle">Stelle eine Frage zu diesem Artikel.</p>
                    <div class="message-form">
                        <textarea id="msgText" placeholder="Hallo, ist der Artikel noch verfügbar?"></textarea>
                        <button class="send-msg-btn" onclick="messageModal.send()">Nachricht Senden</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        // CSS import if needed (but handled via link tag usually)
        if (!document.querySelector('link[href="message-modal.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'message-modal.css';
            document.head.appendChild(link);
        }
    }

    open() {
        if (!this.modal) this.modal = document.getElementById('messageModal');
        this.modal.classList.add('active');
        this.modal.style.display = 'flex';
        setTimeout(() => this.modal.style.opacity = '1', 10);
    }

    close() {
        if (!this.modal) return;
        this.modal.style.opacity = '0';
        setTimeout(() => {
            this.modal.classList.remove('active');
            this.modal.style.display = 'none';
        }, 300);
    }

    async send() {
        const text = document.getElementById('msgText').value;
        if (!text.trim()) {
            if (window.Toast) window.Toast.show('Fehler', 'Bitte geben Sie eine Nachricht ein.', 'error');
            return;
        }

        const sendBtn = this.modal.querySelector('.send-msg-btn');
        const originalText = sendBtn.innerText;
        sendBtn.innerText = 'Senden...';
        sendBtn.disabled = true;

        try {
            // Get user email if logged in (Clerk)
            let userEmail = 'Gast';
            if (window.Clerk && window.Clerk.user) {
                userEmail = window.Clerk.user.primaryEmailAddress.emailAddress;
            }

            // Get Product ID if on product page
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');

            const API_URL = window.API_BASE_URL || 'http://localhost:8000';

            const response = await fetch(`${API_URL}/api/send-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    email: userEmail,
                    product_id: productId
                })
            });

            if (response.ok) {
                if (window.Toast) window.Toast.show('Gesendet! 📬', 'Ihre Nachricht wurde erfolgreich übermittelt.', 'success');
                this.close();
                document.getElementById('msgText').value = '';
            } else {
                throw new Error('Send failed');
            }
        } catch (error) {
            console.error('Message Send Error:', error);
            if (window.Toast) window.Toast.show('Fehler', 'Nachricht konnte nicht gesendet werden.', 'error');
        } finally {
            sendBtn.innerText = originalText;
            sendBtn.disabled = false;
        }
    }
}

window.messageModal = new MessageModal();
