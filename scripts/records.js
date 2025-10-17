import { initState, getRecords, deleteRecord } from './state.js';
import { loadSettings } from './storage.js';
import { compileRegex, searchRecords, highlightText } from './search.js';
import { formatCurrency, formatDate, showStatus } from './ui.js';

let allRecords = [];
let filteredRecords = [];
let currentRegex = null;
let currentSort = { field: null, ascending: true };
let deleteTargetId = null;

function init() {
    initState();
    allRecords = getRecords();
    filteredRecords = [...allRecords];

    renderRecords();
    setupEventListeners();
    populateCategoryFilter();
}

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    const caseSensitive = document.getElementById('case-sensitive');
    if (caseSensitive) {
        caseSensitive.addEventListener('change', handleSearch);
    }

    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryFilter);
    }

    document.getElementById('sort-date')?.addEventListener('click', () => handleSort('date'));
    document.getElementById('sort-description')?.addEventListener('click', () => handleSort('description'));
    document.getElementById('sort-amount')?.addEventListener('click', () => handleSort('amount'));

    const modal = document.getElementById('delete-modal');
    document.getElementById('confirm-delete')?.addEventListener('click', confirmDelete);
    document.getElementById('cancel-delete')?.addEventListener('click', () => closeModal());

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.hidden) {
            closeModal();
        }
    });
}

function populateCategoryFilter() {
    const settings = loadSettings();
    const filterSelect = document.getElementById('category-filter');

    if (!filterSelect) return;

    settings.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterSelect.appendChild(option);
    });
}

function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const caseSensitive = document.getElementById('case-sensitive');
    const statusElement = document.getElementById('search-status');

    if (!searchInput || !statusElement) return;

    const pattern = searchInput.value.trim();

    if (!pattern) {
        currentRegex = null;
        statusElement.textContent = '';
        applyFilters();
        return;
    }

    const flags = caseSensitive?.checked ? '' : 'i';
    currentRegex = compileRegex(pattern, flags);

    if (!currentRegex) {
        statusElement.textContent = 'Invalid regex pattern';
        statusElement.className = 'status-message error';
        return;
    }

    statusElement.textContent = '';
    applyFilters();
}

function handleCategoryFilter() {
    applyFilters();
}

function applyFilters() {
    let records = [...allRecords];

    if (currentRegex) {
        records = searchRecords(records, currentRegex);
    }

    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter && categoryFilter.value) {
        records = records.filter(r => r.category === categoryFilter.value);
    }

    filteredRecords = records;

    if (currentSort.field) {
        sortRecords(currentSort.field, currentSort.ascending);
    } else {
        renderRecords();
    }
}

function handleSort(field) {
    if (currentSort.field === field) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.field = field;
        currentSort.ascending = true;
    }

    ['sort-date', 'sort-description', 'sort-amount'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.setAttribute('aria-pressed', 'false');
            const icon = btn.querySelector('.sort-icon');
            if (icon) icon.textContent = '↕';
        }
    });

    const currentBtn = document.getElementById(`sort-${field}`);
    if (currentBtn) {
        currentBtn.setAttribute('aria-pressed', 'true');
        const icon = currentBtn.querySelector('.sort-icon');
        if (icon) icon.textContent = currentSort.ascending ? '↑' : '↓';
    }

    sortRecords(field, currentSort.ascending);
}

function sortRecords(field, ascending) {
    filteredRecords.sort((a, b) => {
        let valA, valB;

        if (field === 'date') {
            valA = new Date(a.date);
            valB = new Date(b.date);
        } else if (field === 'amount') {
            valA = a.amount;
            valB = b.amount;
        } else {
            valA = a.description.toLowerCase();
            valB = b.description.toLowerCase();
        }

        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
    });

    renderRecords();
}

function renderRecords() {
    renderTable();
    renderCards();
}

function renderTable() {
    const tbody = document.getElementById('records-tbody');
    if (!tbody) return;

    if (filteredRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No records found</td></tr>';
        return;
    }

    tbody.innerHTML = filteredRecords.map(record => `
        <tr>
            <td>${highlightText(formatDate(record.date), currentRegex)}</td>
            <td>${highlightText(record.description, currentRegex)}</td>
            <td>${highlightText(record.category, currentRegex)}</td>
            <td>${highlightText(formatCurrency(record.amount), currentRegex)}</td>
            <td>
                <button class="btn-primary action-btn" onclick="window.editRecord('${record.id}')" aria-label="Edit ${record.description}">Edit</button>
                <button class="btn-danger action-btn" onclick="window.deleteRecordPrompt('${record.id}')" aria-label="Delete ${record.description}">Delete</button>
            </td>
        </tr>
    `).join('');
}

function renderCards() {
    const container = document.getElementById('records-cards');
    if (!container) return;

    if (filteredRecords.length === 0) {
        container.innerHTML = '<p class="empty-state">No records found</p>';
        return;
    }

    container.innerHTML = filteredRecords.map(record => `
        <div class="record-card">
            <div class="record-header">
                <div>
                    <div class="record-description">${highlightText(record.description, currentRegex)}</div>
                    <div class="record-date">${highlightText(formatDate(record.date), currentRegex)}</div>
                </div>
                <div class="record-amount">${highlightText(formatCurrency(record.amount), currentRegex)}</div>
            </div>
            <div class="record-category">${highlightText(record.category, currentRegex)}</div>
            <div class="record-actions">
                <button class="btn-primary action-btn" onclick="window.editRecord('${record.id}')">Edit</button>
                <button class="btn-danger action-btn" onclick="window.deleteRecordPrompt('${record.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function editRecord(id) {
    window.location.href = `add-edit.html?id=${id}`;
}

function deleteRecordPrompt(id) {
    deleteTargetId = id;
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.hidden = false;
        document.getElementById('confirm-delete')?.focus();
    }
}

function confirmDelete() {
    if (!deleteTargetId) return;

    const success = deleteRecord(deleteTargetId);

    if (success) {
        allRecords = getRecords();
        applyFilters();
        showStatus('record-status', 'Transaction deleted successfully', 'success');
    } else {
        showStatus('record-status', 'Error deleting transaction', 'error');
    }

    closeModal();
    deleteTargetId = null;
}

function closeModal() {
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.hidden = true;
        deleteTargetId = null;
    }
}

window.editRecord = editRecord;
window.deleteRecordPrompt = deleteRecordPrompt;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
