/**
 * CSS Berlin - Chat/Messaging System
 * Handles real-time messaging between users
 */

// ============================================
// CHAT STATE
// ============================================

let currentConversation = null;
let conversations = [];
let messages = {};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!window.isLoggedIn || !window.isLoggedIn()) {
        // Redirect to login
        sessionStorage.setItem('redirect_after_login', 'messages.html');
        if (typeof toast !== 'undefined') {
            toast.info('Anmeldung erforderlich', 'Bitte melden Sie sich an, um Nachrichten zu sehen. Weiterleitung...', 3000);
        }
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return;
    }

    // Load conversations
    loadConversations();

    // Initialize event listeners
    initializeEventListeners();

    // Auto-scroll to bottom
    scrollToBottom();
});

// ============================================
// CONVERSATIONS
// ============================================

/**
 * Load conversations from localStorage
 */
function loadConversations() {
    const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
    if (!currentUser) return;

    // Get conversations from localStorage
    const storedConversations = localStorage.getItem(`cssberlin_conversations_${currentUser.userId}`);
    conversations = storedConversations ? JSON.parse(storedConversations) : getDemoConversations();

    // Render conversations list
    renderConversationsList();

    // Load first conversation
    if (conversations.length > 0) {
        selectConversation(conversations[0].userId);
    }
}

/**
 * Get demo conversations (for testing)
 */
function getDemoConversations() {
    return [
        {
            userId: 'user1',
            name: 'Max Klammer',
            avatar: 'MK',
            lastMessage: 'Ist der Artikel noch verfügbar?',
            lastMessageTime: new Date().toISOString(),
            unreadCount: 2,
            online: true
        },
        {
            userId: 'user2',
            name: 'Anna Schmidt',
            avatar: 'AS',
            lastMessage: 'Vielen Dank für die schnelle Lieferung!',
            lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
            unreadCount: 0,
            online: false
        },
        {
            userId: 'user3',
            name: 'Tom Müller',
            avatar: 'TM',
            lastMessage: 'Können wir den Preis verhandeln?',
            lastMessageTime: new Date(Date.now() - 172800000).toISOString(),
            unreadCount: 0,
            online: false
        }
    ];
}

/**
 * Render conversations list
 */
function renderConversationsList() {
    const listContainer = document.getElementById('conversationsList');
    if (!listContainer) return;

    listContainer.innerHTML = conversations.map(conv => `
        <div class="conversation-item ${conv.userId === currentConversation ? 'active' : ''}"
             data-user-id="${conv.userId}"
             onclick="selectConversation('${conv.userId}')">
            <div class="conversation-avatar">${conv.avatar}</div>
            <div class="conversation-info">
                <div class="conversation-top">
                    <span class="conversation-name">${conv.name}</span>
                    <span class="conversation-time">${formatTime(conv.lastMessageTime)}</span>
                </div>
                <div class="conversation-preview">${conv.lastMessage}</div>
            </div>
            ${conv.unreadCount > 0 ? `<div class="conversation-unread">${conv.unreadCount}</div>` : ''}
        </div>
    `).join('');
}

/**
 * Select a conversation
 */
function selectConversation(userId) {
    currentConversation = userId;

    // Update active state
    document.querySelectorAll('.conversation-item').forEach(item => {
        if (item.dataset.userId === userId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Mark as read
    markConversationAsRead(userId);

    // Load messages
    loadMessages(userId);

    // Update header
    updateChatHeader(userId);
}

/**
 * Mark conversation as read
 */
function markConversationAsRead(userId) {
    const conversation = conversations.find(c => c.userId === userId);
    if (conversation) {
        conversation.unreadCount = 0;
        saveConversations();
        renderConversationsList();
    }
}

// ============================================
// MESSAGES
// ============================================

/**
 * Load messages for a conversation
 */
function loadMessages(userId) {
    const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
    if (!currentUser) return;

    // Get messages from localStorage
    const storageKey = `cssberlin_messages_${currentUser.userId}_${userId}`;
    const storedMessages = localStorage.getItem(storageKey);

    messages[userId] = storedMessages ? JSON.parse(storedMessages) : getDemoMessages(userId);

    // Render messages
    renderMessages();
}

/**
 * Get demo messages
 */
function getDemoMessages(userId) {
    if (userId === 'user1') {
        return [
            {
                id: 'msg1',
                from: userId,
                text: 'Hallo! Ich interessiere mich für die Nike Air Max. Ist der Artikel noch verfügbar?',
                time: new Date(Date.now() - 1800000).toISOString(),
                read: true
            },
            {
                id: 'msg2',
                from: 'me',
                text: 'Ja, der Artikel ist noch verfügbar! Haben Sie Fragen zur Größe oder dem Zustand?',
                time: new Date(Date.now() - 1500000).toISOString(),
                read: true
            },
            {
                id: 'msg3',
                from: userId,
                text: 'Perfekt! Ist der Preis verhandelbar?',
                time: new Date(Date.now() - 300000).toISOString(),
                read: false
            }
        ];
    }

    return [];
}

/**
 * Render messages in chat
 */
function renderMessages() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer || !currentConversation) return;

    const conversationMessages = messages[currentConversation] || [];

    messagesContainer.innerHTML = conversationMessages.map(msg => `
        <div class="message ${msg.from === 'me' ? 'sent' : ''}">
            <div class="message-avatar">${msg.from === 'me' ? getMyAvatar() : getUserAvatar(currentConversation)}</div>
            <div class="message-content">
                <div class="message-bubble">${escapeHtml(msg.text)}</div>
                <div class="message-time">${formatTime(msg.time)}</div>
            </div>
        </div>
    `).join('');

    scrollToBottom();
}

/**
 * Send a message
 */
function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();

    if (!text || !currentConversation) return;

    const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
    if (!currentUser) return;

    // Create message object
    const message = {
        id: `msg_${Date.now()}`,
        from: 'me',
        text: text,
        time: new Date().toISOString(),
        read: false
    };

    // Add to messages
    if (!messages[currentConversation]) {
        messages[currentConversation] = [];
    }
    messages[currentConversation].push(message);

    // Save to localStorage
    const storageKey = `cssberlin_messages_${currentUser.userId}_${currentConversation}`;
    localStorage.setItem(storageKey, JSON.stringify(messages[currentConversation]));

    // Update conversation
    updateConversationLastMessage(currentConversation, text);

    // Clear input
    input.value = '';

    // Re-render
    renderMessages();

    // In production: Send to API
    // sendToAPI(currentConversation, message);
}

/**
 * Update conversation's last message
 */
function updateConversationLastMessage(userId, text) {
    const conversation = conversations.find(c => c.userId === userId);
    if (conversation) {
        conversation.lastMessage = text;
        conversation.lastMessageTime = new Date().toISOString();
        saveConversations();
        renderConversationsList();
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function initializeEventListeners() {
    // Send button
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    // Message input (Enter to send)
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-resize textarea
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }

    // Search conversations
    const searchInput = document.getElementById('searchConversations');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterConversations(e.target.value);
        });
    }
}

// ============================================
// HELPERS
// ============================================

/**
 * Update chat header
 */
function updateChatHeader(userId) {
    const conversation = conversations.find(c => c.userId === userId);
    if (!conversation) return;

    const headerAvatar = document.querySelector('.chat-header-avatar');
    const headerName = document.querySelector('.chat-header-name');
    const headerStatus = document.querySelector('.chat-header-status');

    if (headerAvatar) headerAvatar.textContent = conversation.avatar;
    if (headerName) headerName.textContent = conversation.name;
    if (headerStatus) {
        headerStatus.textContent = conversation.online ? '● Online' : 'Offline';
        headerStatus.style.color = conversation.online ? 'var(--success)' : 'var(--text-secondary)';
    }
}

/**
 * Get my avatar
 */
function getMyAvatar() {
    const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
    if (currentUser && currentUser.firstName) {
        return currentUser.firstName.charAt(0).toUpperCase();
    }
    return 'D';
}

/**
 * Get user avatar
 */
function getUserAvatar(userId) {
    const conversation = conversations.find(c => c.userId === userId);
    return conversation ? conversation.avatar : '?';
}

/**
 * Format time
 */
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) {
        // Today - show time
        return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
        return 'Gestern';
    } else if (diffDays < 7) {
        return `${diffDays} Tage`;
    } else {
        return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    }
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Scroll to bottom
 */
function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }
}

/**
 * Filter conversations
 */
function filterConversations(query) {
    const items = document.querySelectorAll('.conversation-item');
    const lowerQuery = query.toLowerCase();

    items.forEach(item => {
        const name = item.querySelector('.conversation-name').textContent.toLowerCase();
        const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();

        if (name.includes(lowerQuery) || preview.includes(lowerQuery)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Save conversations to localStorage
 */
function saveConversations() {
    const currentUser = window.getCurrentUser ? window.getCurrentUser() : null;
    if (currentUser) {
        localStorage.setItem(`cssberlin_conversations_${currentUser.userId}`, JSON.stringify(conversations));
    }
}

// Make functions available globally
window.selectConversation = selectConversation;
