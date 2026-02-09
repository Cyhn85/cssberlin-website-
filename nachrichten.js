/**
 * CSS Berlin - Nachrichtensystem (API Integration)
 */

let currentConversationId = null; // This is the OTHER USER ID
let currentUser = null;
let conversations = [];

// API Base URL - assumes api-config.js is loaded
const API_BASE = window.API_BASE_URL || '/api';

document.addEventListener('DOMContentLoaded', async function () {
    // 1. Check Auth
    if (window.Clerk && window.Clerk.user) {
        currentUser = window.Clerk.user;
    } else {
        // Wait for Clerk
        await waitForClerk();
    }

    if (!currentUser) {
        if (typeof toast !== 'undefined') toast.error("Bitte melden Sie sich an.");
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }

    // 2. Load Conversations
    await loadConversations();

    // 2.5 Check URL Params for New Chat
    const urlParams = new URLSearchParams(window.location.search);
    const sellerId = urlParams.get('seller_id');
    const productId = urlParams.get('product_id');

    if (sellerId) {
        initiateChatWithUser(parseInt(sellerId), productId);
    }

    // 3. Setup socket or polling (Polling for now)
    setInterval(loadConversations, 10000); // Poll every 10s

    // 4. Input listeners
    setupInputListeners();
});

function initiateChatWithUser(userId, productId) {
    currentConversationId = userId;

    // Check if conversation already exists
    const existing = conversations.find(c => c.user.id == userId);

    if (existing) {
        selectConversation(userId);
    } else {
        // Setup UI for new chat
        document.getElementById('chatPanel').style.display = 'flex';
        document.getElementById('emptyStatePlaceholder').style.display = 'none';

        document.getElementById('activeChatName').textContent = "Neuer Chat"; // Ideally fetch user info
        document.getElementById('activeChatAvatar').textContent = "?";

        document.getElementById('chatMessages').innerHTML =
            '<div style="text-align:center;padding:20px;color:#666;">Schreiben Sie die erste Nachricht...</div>';

        // Pre-fill message if product context
        if (productId) {
            const input = document.getElementById('messageInput');
            if (input) input.value = `Ich habe eine Frage zu Artikel #${productId}.`;
        }
    }
}

async function waitForClerk() {
    return new Promise(resolve => {
        const check = () => {
            if (window.Clerk && window.Clerk.user) {
                currentUser = window.Clerk.user;
                resolve();
            } else if (window.Clerk && !window.Clerk.user && window.Clerk.isReady) {
                resolve(); // Ready but not logged in
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });
}

// ==========================================
// CONVERSATIONS
// ==========================================

async function loadConversations() {
    try {
        const token = await window.Clerk.session.getToken();
        const res = await fetch(`${API_BASE}/messages/conversations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to load conversations");

        conversations = await res.json();
        renderConversations();
    } catch (e) {
        console.error("Error loading conversations:", e);
        // Fallback or empty state handled by render
    }
}

function renderConversations() {
    const list = document.getElementById('conversationsList');
    if (!list) return;

    if (conversations.length === 0) {
        list.innerHTML = `
            <div class="chat-empty">
                <span>Keine Nachrichten vorhanden.</span>
            </div>`;
        return;
    }

    list.innerHTML = conversations.map(c => {
        const otherUser = c.user;
        const isActive = otherUser.id == currentConversationId ? 'active' : '';
        const timeDisplay = formatTime(c.last_message_time);

        // Avatar logic
        let avatarHtml = `<div class="conversation-avatar">${getInitials(otherUser.first_name, otherUser.last_name)}</div>`;
        if (otherUser.profile_picture) {
            avatarHtml = `<img src="${otherUser.profile_picture}" class="conversation-avatar" style="object-fit:cover;">`;
        }

        return `
        <div class="conversation-item ${isActive}" onclick="selectConversation(${otherUser.id})">
            ${avatarHtml}
            <div class="conversation-info">
                <div class="conversation-top">
                    <span class="conversation-name">${otherUser.first_name} ${otherUser.last_name}</span>
                    <span class="conversation-time">${timeDisplay}</span>
                </div>
                <div class="conversation-preview">${c.last_message}</div>
            </div>
            ${c.unread_count > 0 ? `<div class="conversation-unread">${c.unread_count}</div>` : ''}
        </div>
        `;
    }).join('');
}

window.selectConversation = async function (userId) {
    currentConversationId = userId;

    // UI Update
    document.querySelectorAll('.conversation-item').forEach(el => el.classList.remove('active'));
    // Try to find the element we just clicked (simple approach) or re-render
    renderConversations(); // Re-render to set active class properly

    // Show Chat Panel (mobile/desktop toggle)
    document.getElementById('chatPanel').style.display = 'flex';
    document.getElementById('emptyStatePlaceholder').style.display = 'none';

    // Set Header Info
    const conv = conversations.find(c => c.user.id == userId);
    if (conv) {
        document.getElementById('activeChatName').textContent = `${conv.user.first_name} ${conv.user.last_name}`;
        const avatarEl = document.getElementById('activeChatAvatar');
        if (conv.user.profile_picture) {
            avatarEl.innerHTML = `<img src="${conv.user.profile_picture}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
        } else {
            avatarEl.textContent = getInitials(conv.user.first_name, conv.user.last_name);
        }
    }

    await loadMessages(userId);
};

// ==========================================
// MESSAGES
// ==========================================

async function loadMessages(otherUserId) {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '<div style="text-align:center;padding:20px;">Lade...</div>';

    try {
        const token = await window.Clerk.session.getToken();
        const res = await fetch(`${API_BASE}/messages/${otherUserId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to load messages");

        const messages = await res.json();
        renderMessages(messages);
    } catch (e) {
        console.error("Error loading messages:", e);
        container.innerHTML = '<div style="text-align:center;color:red;">Fehler beim Laden.</div>';
    }
}

function renderMessages(messages) {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';

    messages.forEach(msg => {
        const isMe = msg.sender_id != currentConversationId; // If sender is NOT the other person, it's Me. 
        // Wait, currentConversationId is the OTHER user.
        // If msg.sender_id == currentConversationId, it's incoming.
        // If msg.sender_id != currentConversationId (which means it's my ID), it's sent.

        const div = document.createElement('div');
        div.className = `message ${isMe ? 'sent' : ''}`;

        const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        div.innerHTML = `
            <div class="message-content">
                <div class="message-bubble">${escapeHtml(msg.content)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        container.appendChild(div);
    });

    scrollToBottom();
}

// ==========================================
// SENDING
// ==========================================

function setupInputListeners() {
    const btn = document.getElementById('sendMessageBtn');
    const input = document.getElementById('messageInput');

    const send = async () => {
        const text = input.value.trim();
        if (!text || !currentConversationId) return;

        input.value = ''; // Clear early

        try {
            const token = await window.Clerk.session.getToken();
            const res = await fetch(`${API_BASE}/messages/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiver_id: currentConversationId,
                    content: text
                })
            });

            if (res.ok) {
                // Reload messages to show the new one
                loadMessages(currentConversationId);
                // Also refresh conversation list to update preview
                loadConversations();
            }
        } catch (e) {
            console.error("Send failed", e);
            if (typeof toast !== 'undefined') toast.error("Senden fehlgeschlagen");
        }
    };

    if (btn) btn.addEventListener('click', send);
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
            }
        });
    }
}

// ==========================================
// HELPERS
// ==========================================

function getInitials(first, last) {
    return (first[0] + (last ? last[0] : '')).toUpperCase();
}

function formatTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return 'Gestern';
    return date.toLocaleDateString();
}

function scrollToBottom() {
    const el = document.getElementById('chatMessages');
    if (el) el.scrollTop = el.scrollHeight;
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function closeChatMobile() {
    document.getElementById('chatPanel').style.display = 'none';
    document.getElementById('conversationsList').parentElement.style.display = 'flex';
}
