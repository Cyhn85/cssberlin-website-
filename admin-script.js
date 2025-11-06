// ============================================
// CSS Berlin Admin Panel Script
// Kozmik Oda Terminal Commands
// ============================================

// ============================================
// NAVIGATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initTerminal();
    loadAdminInfo();
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('pageTitle');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Get section to show
            const sectionId = this.dataset.section;

            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));

            // Show selected section
            const targetSection = document.getElementById(`section-${sectionId}`);
            if (targetSection) {
                targetSection.classList.add('active');

                // Update page title
                const sectionName = this.querySelector('span').textContent;
                pageTitle.textContent = sectionName;
            }
        });
    });
}

// ============================================
// TERMINAL - KOZMIK ODA
// ============================================
function initTerminal() {
    const terminalInput = document.getElementById('terminalInput');

    if (!terminalInput) return;

    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim();
            if (command) {
                executeCommand(command);
                this.value = '';
            }
        }
    });

    // Auto focus terminal input when clicking in terminal body
    const terminalBody = document.getElementById('terminal');
    terminalBody.addEventListener('click', function() {
        terminalInput.focus();
    });
}

function executeCommand(command) {
    const output = document.getElementById('terminalOutput');

    // Display the command
    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line';
    commandLine.innerHTML = `<span class="terminal-prompt">admin@css-berlin:~$</span> <span class="terminal-command">${command}</span>`;
    output.appendChild(commandLine);

    // Parse and execute command
    const result = parseCommand(command);

    // Display the result
    const resultLine = document.createElement('div');
    resultLine.className = 'terminal-line terminal-output';
    resultLine.innerHTML = result;
    output.appendChild(resultLine);

    // Scroll to bottom
    const terminal = document.getElementById('terminal');
    terminal.scrollTop = terminal.scrollHeight;
}

function parseCommand(command) {
    const cmd = command.toLowerCase().split(' ')[0];

    switch(cmd) {
        case 'help':
            return `
                <div class="terminal-success">Available Commands:</div>
                <div>help      - Show this help message</div>
                <div>status    - Show system status</div>
                <div>products  - Show product statistics</div>
                <div>users     - Show user statistics</div>
                <div>orders    - Show order statistics</div>
                <div>analytics - Show website analytics</div>
                <div>backup    - Create database backup</div>
                <div>deploy    - Deploy latest changes</div>
                <div>logs      - View system logs</div>
                <div>clear     - Clear terminal</div>
                <div>exit      - Exit terminal</div>
            `;

        case 'status':
            return `
                <div class="terminal-success">System Status</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>🟢 Server: Online</div>
                <div>🟢 Database: Connected</div>
                <div>🟢 Payment Gateway: Active</div>
                <div>🟢 CDN: Operational</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>Uptime: 47 days, 12 hours</div>
                <div>Last backup: 2 hours ago</div>
                <div>CPU Usage: 23%</div>
                <div>Memory: 1.8GB / 8GB</div>
            `;

        case 'products':
            return `
                <div class="terminal-success">Product Statistics</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>Total Products: 1,234</div>
                <div>Active Listings: 1,156</div>
                <div>Pending Approval: 42</div>
                <div>Sold This Month: 328</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>Top Category: Damen (45%)</div>
                <div>Average Price: €34.50</div>
                <div>Total Value: €42,573.00</div>
            `;

        case 'users':
            return `
                <div class="terminal-success">User Statistics</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>Total Users: 8,921</div>
                <div>Active Today: 342</div>
                <div>New This Week: 127</div>
                <div>Sellers: 1,456 (16.3%)</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>Top Seller: GreenFashion_DE (78 sales)</div>
                <div>Average Session: 8m 34s</div>
            `;

        case 'orders':
            return `
                <div class="terminal-success">Order Statistics</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>Total Orders: 456</div>
                <div>Completed: 398 (87.3%)</div>
                <div>Processing: 42 (9.2%)</div>
                <div>Cancelled: 16 (3.5%)</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>Revenue This Month: €15,742.00</div>
                <div>Average Order Value: €34.52</div>
                <div>Refund Rate: 2.1%</div>
            `;

        case 'analytics':
            return `
                <div class="terminal-success">Website Analytics</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>Page Views Today: 12,456</div>
                <div>Unique Visitors: 3,891</div>
                <div>Bounce Rate: 32.4%</div>
                <div>Avg. Session Duration: 5m 42s</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>Top Pages:</div>
                <div>  1. /products - 4,523 views</div>
                <div>  2. /damen - 2,891 views</div>
                <div>  3. /herren - 1,967 views</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>Conversion Rate: 3.8%</div>
            `;

        case 'backup':
            return `
                <div class="terminal-success">Creating database backup...</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>[████████████████████] 100%</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>✓ Backup completed successfully!</div>
                <div>File: backup_${new Date().toISOString().split('T')[0]}.sql</div>
                <div>Size: 847 MB</div>
                <div>Location: /backups/</div>
            `;

        case 'deploy':
            return `
                <div class="terminal-success">Deploying to production...</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>✓ Building assets...</div>
                <div>✓ Running tests...</div>
                <div>✓ Uploading to CDN...</div>
                <div>✓ Updating DNS...</div>
                <div>✓ Clearing cache...</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div class="terminal-success">🚀 Deployment successful!</div>
                <div>Live URL: https://cssberlin.com</div>
            `;

        case 'logs':
            return `
                <div class="terminal-success">Recent System Logs</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>[${getTimestamp()}] INFO: User login successful (user_id: 1234)</div>
                <div>[${getTimestamp(-2)}] INFO: Product created (product_id: 5678)</div>
                <div>[${getTimestamp(-5)}] INFO: Order completed (order_id: 9012)</div>
                <div>[${getTimestamp(-8)}] WARN: High traffic detected</div>
                <div>[${getTimestamp(-12)}] INFO: Payment processed successfully</div>
                <div>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                <div>Use 'logs --full' for complete log history</div>
            `;

        case 'clear':
            document.getElementById('terminalOutput').innerHTML = '';
            return '';

        case 'exit':
            return '<div class="terminal-success">Goodbye! Type a command to continue...</div>';

        default:
            return `<div class="terminal-error">Error: Command '${command}' not found. Type 'help' for available commands.</div>`;
    }
}

function clearTerminal() {
    document.getElementById('terminalOutput').innerHTML = '';
    document.getElementById('terminalInput').value = '';
}

function getTimestamp(minutesAgo = 0) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - minutesAgo);
    return now.toTimeString().split(' ')[0];
}

// ============================================
// ADMIN INFO
// ============================================
function loadAdminInfo() {
    // You can customize this to load from localStorage or API
    const adminName = localStorage.getItem('adminName') || 'Admin';
    const adminEmail = localStorage.getItem('adminEmail') || 'admin@cssberlin.com';

    // Update admin name in header
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) {
        adminNameElement.textContent = adminName;
    }

    // Update admin email in settings
    const adminEmailInput = document.getElementById('adminEmail');
    if (adminEmailInput) {
        adminEmailInput.value = adminEmail;
    }
}

// ============================================
// LOGOUT
// ============================================
function logout() {
    if (confirm('Möchten Sie sich wirklich abmelden?')) {
        // Clear session data
        localStorage.removeItem('adminToken');

        // Redirect to login page (or home page)
        window.location.href = 'index.html';
    }
}

// ============================================
// CONSOLE INFO
// ============================================
console.log('%cKozmik Oda - CSS Berlin Admin', 'color: #FF8C42; font-size: 20px; font-weight: bold;');
console.log('%cClimate Smart Solutions Admin Panel', 'color: #2D5016; font-size: 14px;');
console.log('Terminal initialized successfully');
