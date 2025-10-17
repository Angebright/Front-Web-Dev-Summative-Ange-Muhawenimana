import { initState, getRecords, getTotalAmount, getTopCategory, getLast7DaysTotal, getCategoryTotals, getRecentRecords, getCurrentMonthTotal } from './state.js';
import { loadSettings, saveSettings } from './storage.js';
import { formatCurrency, formatDate, renderChart } from './ui.js';

let currentSettings = {};

function init() {
    initState();
    currentSettings = loadSettings();
    updateDashboard();
    setupEventListeners();
}

function setupEventListeners() {
    const setCapBtn = document.getElementById('set-cap-btn');
    if (setCapBtn) {
        setCapBtn.addEventListener('click', handleSetCap);
    }

    const budgetCapInput = document.getElementById('budget-cap');
    if (budgetCapInput && currentSettings.budgetCap) {
        budgetCapInput.value = currentSettings.budgetCap;
    }
}

function updateDashboard() {
    const records = getRecords();

    document.getElementById('total-records').textContent = records.length;

    const totalAmount = getTotalAmount();
    document.getElementById('total-amount').textContent = formatCurrency(totalAmount);

    const topCategory = getTopCategory();
    document.getElementById('top-category').textContent = topCategory;

    const last7Days = getLast7DaysTotal();
    document.getElementById('last-7-days').textContent = formatCurrency(last7Days);

    const categoryTotals = getCategoryTotals();
    renderChart('category-chart', categoryTotals);

    renderRecentTransactions();

    if (currentSettings.budgetCap > 0) {
        updateCapStatus();
    }
}

function renderRecentTransactions() {
    const container = document.getElementById('recent-transactions');
    if (!container) return;

    const recentRecords = getRecentRecords(5);

    if (recentRecords.length === 0) {
        container.innerHTML = '<p class="empty-state">No recent transactions</p>';
        return;
    }

    container.innerHTML = recentRecords.map(record => `
        <div class="recent-item">
            <div class="recent-info">
                <div class="recent-description">${escapeHtml(record.description)}</div>
                <div class="recent-meta">${escapeHtml(record.category)} • ${formatDate(record.date)}</div>
            </div>
            <div class="recent-amount">${formatCurrency(record.amount)}</div>
        </div>
    `).join('');
}

function handleSetCap() {
    const input = document.getElementById('budget-cap');
    const statusElement = document.getElementById('cap-status');

    if (!input || !statusElement) return;

    const value = parseFloat(input.value);

    if (isNaN(value) || value <= 0) {
        statusElement.textContent = 'Please enter a valid positive number';
        statusElement.className = 'cap-message danger';
        statusElement.setAttribute('aria-live', 'assertive');
        return;
    }

    currentSettings.budgetCap = value;
    saveSettings(currentSettings);

    updateCapStatus();
}

function updateCapStatus() {
    const statusElement = document.getElementById('cap-status');
    if (!statusElement) return;

    const monthTotal = getCurrentMonthTotal();
    const cap = currentSettings.budgetCap;

    if (cap <= 0) {
        statusElement.textContent = '';
        statusElement.className = 'cap-message';
        return;
    }

    const remaining = cap - monthTotal;
    const percentage = (monthTotal / cap) * 100;

    if (monthTotal > cap) {
        statusElement.textContent = `Budget exceeded by ${formatCurrency(Math.abs(remaining))}! (${percentage.toFixed(1)}% of cap)`;
        statusElement.className = 'cap-message danger';
        statusElement.setAttribute('aria-live', 'assertive');
    } else if (percentage >= 80) {
        statusElement.textContent = `Warning: ${formatCurrency(remaining)} remaining (${percentage.toFixed(1)}% of cap used)`;
        statusElement.className = 'cap-message warning';
        statusElement.setAttribute('aria-live', 'assertive');
    } else {
        statusElement.textContent = `${formatCurrency(remaining)} remaining of ${formatCurrency(cap)} (${percentage.toFixed(1)}% used)`;
        statusElement.className = 'cap-message success';
        statusElement.setAttribute('aria-live', 'polite');
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
