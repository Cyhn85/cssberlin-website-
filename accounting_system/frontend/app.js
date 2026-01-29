// API Base URL
const API_BASE = 'http://localhost:8000';

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href').substring(1);
        
        // Active link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show section
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(target).classList.add('active');
        
        // Load data
        if (target === 'dashboard') loadDashboard();
        if (target === 'transactions') loadTransactions();
        if (target === 'reports') loadReports();
        if (target === 'reminders') loadReminders();
        if (target === 'compliance') loadCompliance();
    });
});

// Dashboard
async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE}/api/stats/summary?year=2025`);
        const data = await response.json();
        
        document.getElementById('total-income').textContent = `${data.total_income.toFixed(2)} €`;
        document.getElementById('total-expense').textContent = `${data.total_expense.toFixed(2)} €`;
        document.getElementById('net-result').textContent = `${data.net_result.toFixed(2)} €`;
        
        // KDV limit kontrolü
        const compliance = await fetch(`${API_BASE}/api/compliance/kleinunternehmer/2025`);
        const complianceData = await compliance.json();
        document.getElementById('vat-limit').textContent = `${complianceData.percentage_used.toFixed(1)}%`;
    } catch (error) {
        console.error('Dashboard yüklenirken hata:', error);
    }
}

// Transactions
async function loadTransactions() {
    try {
        const response = await fetch(`${API_BASE}/api/transactions?limit=100`);
        const transactions = await response.json();
        
        const tbody = document.getElementById('transactions-table');
        tbody.innerHTML = transactions.map(t => `
            <tr>
                <td>${t.date}</td>
                <td>${t.platform}</td>
                <td>${t.transaction_type}</td>
                <td>${t.description}</td>
                <td>${t.amount.toFixed(2)} €</td>
                <td>
                    <button onclick="editTransaction(${t.id})">Düzenle</button>
                    <button onclick="deleteTransaction(${t.id})">Sil</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('İşlemler yüklenirken hata:', error);
    }
}

// Reports
async function loadReports() {
    try {
        const response = await fetch(`${API_BASE}/api/reports`);
        const reports = await response.json();
        
        const list = document.getElementById('reports-list');
        list.innerHTML = reports.map(r => `
            <div class="report-card">
                <h3>${r.report_type} - ${r.period_start} / ${r.period_end}</h3>
                <p>Gelir: ${r.total_income.toFixed(2)} € | Gider: ${r.total_expense.toFixed(2)} € | Net: ${r.net_result.toFixed(2)} €</p>
                <button onclick="downloadReport(${r.id})">PDF İndir</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Beyannameler yüklenirken hata:', error);
    }
}

// Reminders
async function loadReminders() {
    try {
        const response = await fetch(`${API_BASE}/api/reminders/upcoming?days=30`);
        const reminders = await response.json();
        
        const list = document.getElementById('reminders-list');
        list.innerHTML = reminders.map(r => `
            <div class="reminder-card ${r.is_urgent ? 'urgent' : ''}">
                <h3>${r.title}</h3>
                <p>${r.description}</p>
                <p><strong>Son Tarih:</strong> ${r.due_date} (${r.days_until_due} gün kaldı)</p>
                <button onclick="completeReminder(${r.id})">Tamamlandı</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Hatırlatmalar yüklenirken hata:', error);
    }
}

// Compliance
async function loadCompliance() {
    try {
        const response = await fetch(`${API_BASE}/api/compliance/2025`);
        const data = await response.json();
        
        const status = document.getElementById('compliance-status');
        status.innerHTML = `
            <div class="compliance-card">
                <h3>Kleinunternehmer Limit</h3>
                <p>Toplam Gelir: ${data.kleinunternehmer.total_income.toFixed(2)} €</p>
                <p>Limit: ${data.kleinunternehmer.limit.toFixed(2)} €</p>
                <p>Kullanım: ${data.kleinunternehmer.percentage_used.toFixed(1)}%</p>
                <p>Durum: ${data.kleinunternehmer.is_under_limit ? '✅ Limit Altında' : '⚠️ Limit Aşıldı'}</p>
            </div>
            <div class="compliance-card">
                <h3>Muhasebeci Zorunluluğu</h3>
                <p>Durum: ${data.accountant_requirement.requires_accountant ? '⚠️ Muhasebeci Gerekli' : '✅ Muhasebeci Gerekmiyor'}</p>
            </div>
        `;
    } catch (error) {
        console.error('Uyumluluk kontrolü yüklenirken hata:', error);
    }
}

// Generate EÜR Report
async function generateEuerReport() {
    const year = prompt('Yıl:', '2025');
    const month = prompt('Ay (boş bırakılırsa yıllık):', '');
    
    try {
        const url = `${API_BASE}/api/reports/generate/euer?year=${year}${month ? `&month=${month}` : ''}`;
        const response = await fetch(url, { method: 'POST' });
        const data = await response.json();
        
        alert(`Beyanname oluşturuldu: ${data.pdf_path}`);
        loadReports();
    } catch (error) {
        console.error('Beyanname oluşturulurken hata:', error);
    }
}

// Check Duplicates
async function checkDuplicates() {
    try {
        const response = await fetch(`${API_BASE}/api/transactions/duplicates`);
        const data = await response.json();
        
        if (data.count > 0) {
            if (confirm(`${data.count} tekrar eden işlem bulundu. Temizlemek ister misiniz?`)) {
                await fetch(`${API_BASE}/api/transactions/remove-duplicates`, { method: 'POST' });
                alert('Tekrarlar temizlendi!');
                loadTransactions();
            }
        } else {
            alert('Tekrar eden işlem bulunamadı.');
        }
    } catch (error) {
        console.error('Tekrar kontrolü yapılırken hata:', error);
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});

