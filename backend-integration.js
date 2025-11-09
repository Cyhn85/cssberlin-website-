/**
 * CSS Berlin - Backend Integration
 * Connects admin panel to FastAPI backend
 */

// API Configuration
const API_CONFIG = {
    // Local development
    LOCAL: 'http://localhost:8000',

    // Production (Hetzner)
    PRODUCTION: 'http://195.201.146.224:8000',

    // Use local by default, can be changed via UI
    current: 'http://localhost:8000'
};

// Global state
let motorStatus = {
    status: 'offline',
    active_searches: 0,
    total_searches_today: 0,
    uptime_seconds: 0
};

let currentSearchId = null;
let searchWebSocket = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Backend integration loaded');

    // Check motor status on load
    checkMotorStatus();

    // Poll motor status every 5 seconds
    setInterval(checkMotorStatus, 5000);

    // Load stats
    loadAllStats();
});

// ============================================
// MOTOR CONTROL
// ============================================

async function checkMotorStatus() {
    try {
        const response = await fetch(`${API_CONFIG.current}/api/motor/status`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        motorStatus = data;

        updateMotorUI(data);

    } catch (error) {
        console.error('Motor status check failed:', error);
        // Set offline status
        updateMotorUI({
            status: 'offline',
            active_searches: 0,
            total_searches_today: 0,
            uptime_seconds: 0
        });
    }
}

function updateMotorUI(status) {
    // Top nav motor status
    const motorStatusEl = document.getElementById('motorStatus');
    const motorTextEl = document.getElementById('motorText');

    if (motorStatusEl && motorTextEl) {
        if (status.status === 'online') {
            motorStatusEl.classList.remove('offline');
            motorTextEl.textContent = `Motor: Online (${status.active_searches} aktiv)`;
        } else {
            motorStatusEl.classList.add('offline');
            motorTextEl.textContent = 'Motor: Offline';
        }
    }

    // Motor control panel
    const statusCircle = document.querySelector('#motorStatusDisplay .status-circle');
    const statusText = document.getElementById('motorStatusText');
    const activeSearchesEl = document.getElementById('activeSearches');
    const searchesTodayEl = document.getElementById('searchesToday');
    const motorUptimeEl = document.getElementById('motorUptime');
    const startBtn = document.getElementById('startMotorBtn');
    const stopBtn = document.getElementById('stopMotorBtn');

    if (statusCircle && statusText) {
        if (status.status === 'online') {
            statusCircle.classList.remove('offline');
            statusText.textContent = 'Online';
            statusText.style.color = '#10b981';
        } else {
            statusCircle.classList.add('offline');
            statusText.textContent = 'Offline';
            statusText.style.color = '#ef4444';
        }
    }

    if (activeSearchesEl) activeSearchesEl.textContent = status.active_searches || 0;
    if (searchesTodayEl) searchesTodayEl.textContent = status.total_searches_today || 0;
    if (motorUptimeEl) motorUptimeEl.textContent = formatUptime(status.uptime_seconds || 0);

    // Button states
    if (startBtn && stopBtn) {
        if (status.status === 'online') {
            startBtn.disabled = true;
            stopBtn.disabled = false;
        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    }
}

async function startMotor() {
    try {
        const response = await fetch(`${API_CONFIG.current}/api/motor/start`, {
            method: 'POST'
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ Motor started');
            showNotification('Motor erfolgreich gestartet!', 'success');
            checkMotorStatus();
        } else {
            throw new Error(data.message || 'Motor start failed');
        }

    } catch (error) {
        console.error('Failed to start motor:', error);
        showNotification('Fehler beim Starten des Motors: ' + error.message, 'error');
    }
}

async function stopMotor() {
    try {
        const response = await fetch(`${API_CONFIG.current}/api/motor/stop`, {
            method: 'POST'
        });

        const data = await response.json();

        if (data.success) {
            console.log('🛑 Motor stopped');
            showNotification('Motor erfolgreich gestoppt!', 'success');
            checkMotorStatus();
        } else {
            throw new Error(data.message || 'Motor stop failed');
        }

    } catch (error) {
        console.error('Failed to stop motor:', error);
        showNotification('Fehler beim Stoppen des Motors: ' + error.message, 'error');
    }
}

// ============================================
// MULTI-TERMINAL SEARCH
// ============================================

async function startMultiSearch() {
    const keyword = document.getElementById('searchKeyword').value.trim();

    if (!keyword) {
        showNotification('Bitte Suchbegriff eingeben!', 'warning');
        return;
    }

    // Check motor status
    if (motorStatus.status !== 'online') {
        const confirm = window.confirm('Motor ist offline. Möchten Sie ihn jetzt starten?');
        if (confirm) {
            await startMotor();
            // Wait for motor to start
            await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
            return;
        }
    }

    // Get selected terminals
    const terminals = [];
    if (document.getElementById('terminalT1').checked) terminals.push('T1');
    if (document.getElementById('terminalT2').checked) terminals.push('T2');
    if (document.getElementById('terminalT3').checked) terminals.push('T3');
    if (document.getElementById('terminalT4').checked) terminals.push('T4');

    if (terminals.length === 0) {
        showNotification('Bitte mindestens ein Terminal auswählen!', 'warning');
        return;
    }

    // Disable search button
    const searchBtn = document.getElementById('startSearchBtn');
    searchBtn.disabled = true;
    searchBtn.textContent = 'Suche läuft...';

    // Show progress panel
    const progressPanel = document.getElementById('searchProgress');
    progressPanel.style.display = 'block';

    // Reset progress bars
    terminals.forEach(t => {
        const progress = document.getElementById(`progress${t}`);
        if (progress) {
            const fill = progress.querySelector('.progress-fill');
            const status = progress.querySelector('.terminal-status');
            fill.style.width = '0%';
            status.textContent = 'Warten...';
        }
    });

    try {
        const response = await fetch(`${API_CONFIG.current}/api/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                keyword: keyword,
                terminals: terminals
            })
        });

        const data = await response.json();

        if (data.success) {
            currentSearchId = data.search_id;
            console.log(`🔍 Search started: ${currentSearchId}`);
            showNotification(`Suche gestartet für ${terminals.length} Terminals!`, 'success');

            // Connect WebSocket for real-time updates
            connectSearchWebSocket(data.search_id, terminals);

        } else {
            throw new Error(data.message || 'Search failed');
        }

    } catch (error) {
        console.error('Failed to start search:', error);
        showNotification('Fehler beim Starten der Suche: ' + error.message, 'error');

        // Re-enable button
        searchBtn.disabled = false;
        searchBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg> Suche starten';
        progressPanel.style.display = 'none';
    }
}

function clearSearchForm() {
    document.getElementById('searchKeyword').value = '';
    document.getElementById('terminalT1').checked = true;
    document.getElementById('terminalT2').checked = true;
    document.getElementById('terminalT3').checked = true;
    document.getElementById('terminalT4').checked = true;
    document.getElementById('searchProgress').style.display = 'none';
}

// ============================================
// WEBSOCKET FOR REAL-TIME UPDATES
// ============================================

function connectSearchWebSocket(searchId, terminals) {
    const wsUrl = `ws${API_CONFIG.current.includes('https') ? 's' : ''}://${API_CONFIG.current.replace(/^https?:\/\//, '')}/ws/search/${searchId}`;

    console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);

    try {
        searchWebSocket = new WebSocket(wsUrl);

        searchWebSocket.onopen = () => {
            console.log('✅ WebSocket connected');
        };

        searchWebSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            updateSearchProgress(data, terminals);
        };

        searchWebSocket.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            // Fall back to polling
            pollSearchStatus(searchId, terminals);
        };

        searchWebSocket.onclose = () => {
            console.log('🔌 WebSocket closed');
        };

    } catch (error) {
        console.error('Failed to create WebSocket:', error);
        // Fall back to polling
        pollSearchStatus(searchId, terminals);
    }
}

function pollSearchStatus(searchId, terminals) {
    const pollInterval = setInterval(async () => {
        try {
            const response = await fetch(`${API_CONFIG.current}/api/search/${searchId}/status`);
            const data = await response.json();

            updateSearchProgress(data, terminals);

            if (data.status === 'completed' || data.status === 'failed') {
                clearInterval(pollInterval);
                onSearchComplete(data);
            }

        } catch (error) {
            console.error('Poll error:', error);
            clearInterval(pollInterval);
        }
    }, 2000); // Poll every 2 seconds
}

function updateSearchProgress(data, terminals) {
    terminals.forEach(terminalId => {
        const progress = document.getElementById(`progress${terminalId}`);
        if (!progress) return;

        const fill = progress.querySelector('.progress-fill');
        const status = progress.querySelector('.terminal-status');

        if (data.results && data.results[terminalId]) {
            const result = data.results[terminalId];

            if (result.success) {
                fill.style.width = '100%';
                status.textContent = `✓ ${result.count} Produkte`;
                status.style.color = '#10b981';
            } else {
                fill.style.width = '100%';
                fill.style.background = '#ef4444';
                status.textContent = '❌ Fehler';
                status.style.color = '#ef4444';
            }
        } else {
            // In progress
            fill.style.width = '50%';
            status.textContent = 'Lädt...';
        }
    });

    // Check if all complete
    if (data.status === 'completed') {
        onSearchComplete(data);
    }
}

function onSearchComplete(data) {
    console.log('✅ Search completed:', data);

    // Close WebSocket
    if (searchWebSocket) {
        searchWebSocket.close();
        searchWebSocket = null;
    }

    // Re-enable search button
    const searchBtn = document.getElementById('startSearchBtn');
    searchBtn.disabled = false;
    searchBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg> Suche starten';

    // Show results notification
    let totalProducts = 0;
    if (data.results) {
        Object.values(data.results).forEach(result => {
            if (result.success) {
                totalProducts += result.count || 0;
            }
        });
    }

    showNotification(`Suche abgeschlossen! Insgesamt ${totalProducts} Produkte gefunden.`, 'success');

    // Reload stats
    loadAllStats();
}

// ============================================
// STATISTICS
// ============================================

async function loadAllStats() {
    try {
        const response = await fetch(`${API_CONFIG.current}/api/stats/all`);
        const data = await response.json();

        if (data.success) {
            updateStatsUI(data);
        }

    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

function updateStatsUI(data) {
    const totalProductsEl = document.getElementById('totalProducts');
    const scrapedTodayEl = document.getElementById('scrapedToday');

    if (totalProductsEl && data.total_products) {
        totalProductsEl.textContent = formatNumber(data.total_products);
    }

    // Count today's products from terminals
    let todayCount = 0;
    if (data.terminals) {
        Object.values(data.terminals).forEach(terminal => {
            todayCount += terminal.recent_24h || 0;
        });
    }

    if (scrapedTodayEl) {
        scrapedTodayEl.textContent = formatNumber(todayCount);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatNumber(num) {
    return new Intl.NumberFormat('de-DE').format(num);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Backend integration ready!');
