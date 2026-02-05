/**
 * CSS Berlin - AI Chat Bot Widget
 * Canlı yardım asistanı - Sağ alt köşe
 * 2026 Modern Design
 */

// ============================================
// CHAT BOT CONFIG
// ============================================
const CHAT_BOT_CONFIG = {
    botName: 'CSS Assistent',
    welcomeMessage: 'Hallo! 👋 Ich bin der CSS Berlin Assistent. Wie kann ich Ihnen helfen?',
    placeholder: 'Schreiben Sie Ihre Frage...',
    quickReplies: [
        'Wie funktioniert der Kauf?',
        'Versandkosten?',
        'Rückgabe möglich?',
        'Kontakt zu Verkäufer'
    ],
    responses: {
        'Wie funktioniert der Kauf?': 'Ganz einfach! Wählen Sie ein Produkt, legen Sie es in den Warenkorb und bezahlen Sie sicher per PayPal, Klarna oder Kreditkarte. Der Verkäufer wird benachrichtigt und versendet das Produkt.',
        'Versandkosten?': 'Die Versandkosten werden vom Verkäufer festgelegt. Ab 2 Produkten ist der 3. Versand GRATIS! 📦',
        'Rückgabe möglich?': 'Sie haben 14 Tage Widerrufsrecht. Kontaktieren Sie den Verkäufer für eine einfache Rückgabe.',
        'Kontakt zu Verkäufer': 'Klicken Sie auf das Produkt und dann auf "Nachricht senden" um den Verkäufer zu kontaktieren.',
        'default': 'Vielen Dank für Ihre Nachricht! Für weitere Hilfe kontaktieren Sie uns unter info@cssberlin.de'
    }
};

// ============================================
// CREATE CHAT WIDGET HTML
// ============================================
function createChatWidget() {
    const widget = document.createElement('div');
    widget.id = 'aiChatWidget';
    widget.className = 'ai-chat-widget';
    widget.innerHTML = `
        <!-- Chat Toggle Button -->
        <button class="ai-chat-toggle" id="aiChatToggle" aria-label="Chat öffnen">
            <div class="ai-chat-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 7v1m0 4v1m0 4v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
                </svg>
            </div>
            <span class="ai-chat-label">Hilfe</span>
            <span class="ai-chat-pulse"></span>
        </button>

        <!-- Chat Window -->
        <div class="ai-chat-window" id="aiChatWindow">
            <div class="ai-chat-header">
                <div class="ai-chat-header-info">
                    <div class="ai-chat-avatar">
                        <svg viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                            <circle cx="12" cy="12" r="3" fill="currentColor"/>
                        </svg>
                    </div>
                    <div>
                        <span class="ai-chat-name">${CHAT_BOT_CONFIG.botName}</span>
                        <span class="ai-chat-status">Online</span>
                    </div>
                </div>
                <button class="ai-chat-close" id="aiChatClose" aria-label="Chat schließen">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <div class="ai-chat-messages" id="aiChatMessages">
                <!-- Messages will be added here -->
            </div>

            <div class="ai-chat-quick-replies" id="aiQuickReplies">
                ${CHAT_BOT_CONFIG.quickReplies.map(q => `
                    <button class="ai-quick-reply" data-reply="${q}">${q}</button>
                `).join('')}
            </div>

            <div class="ai-chat-input-area">
                <input type="text" id="aiChatInput" placeholder="${CHAT_BOT_CONFIG.placeholder}" autocomplete="off">
                <button class="ai-chat-send" id="aiChatSend" aria-label="Senden">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(widget);
}

// ============================================
// CHAT FUNCTIONALITY
// ============================================
function initChatBot() {
    createChatWidget();

    const toggle = document.getElementById('aiChatToggle');
    const window = document.getElementById('aiChatWindow');
    const close = document.getElementById('aiChatClose');
    const input = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('aiChatSend');
    const messages = document.getElementById('aiChatMessages');
    const quickReplies = document.getElementById('aiQuickReplies');

    let isOpen = false;

    // Toggle chat
    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        window.classList.toggle('open', isOpen);
        toggle.classList.toggle('hidden', isOpen);

        if (isOpen && messages.children.length === 0) {
            addBotMessage(CHAT_BOT_CONFIG.welcomeMessage);
        }
    });

    close.addEventListener('click', () => {
        isOpen = false;
        window.classList.remove('open');
        toggle.classList.remove('hidden');
    });

    // Send message
    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        addUserMessage(text);
        input.value = '';

        // Hide quick replies after first message
        quickReplies.style.display = 'none';

        // Simulate typing
        setTimeout(() => {
            const response = CHAT_BOT_CONFIG.responses[text] || CHAT_BOT_CONFIG.responses['default'];
            addBotMessage(response);
        }, 800);
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Quick replies
    document.querySelectorAll('.ai-quick-reply').forEach(btn => {
        btn.addEventListener('click', () => {
            const reply = btn.dataset.reply;
            input.value = reply;
            sendMessage();
        });
    });
}

function addBotMessage(text) {
    const messages = document.getElementById('aiChatMessages');
    const msg = document.createElement('div');
    msg.className = 'ai-chat-message bot';
    msg.innerHTML = `
        <div class="ai-message-avatar">
            <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
        </div>
        <div class="ai-message-content">${text}</div>
    `;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

function addUserMessage(text) {
    const messages = document.getElementById('aiChatMessages');
    const msg = document.createElement('div');
    msg.className = 'ai-chat-message user';
    msg.innerHTML = `
        <div class="ai-message-content">${text}</div>
    `;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

// ============================================
// AUTO-INIT
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatBot);
} else {
    initChatBot();
}
