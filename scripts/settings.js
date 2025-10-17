import { loadSettings, saveSettings, exportData, importData, clearAllData } from './storage.js';
import { validateCategory } from './validators.js';
import { showStatus, downloadJSON } from './ui.js';

let currentSettings = {};

function init() {
    currentSettings = loadSettings();
    populateSettings();
    setupEventListeners();
}

function populateSettings() {
    const baseCurrency = document.getElementById('base-currency');
    if (baseCurrency) {
        baseCurrency.value = currentSettings.baseCurrency;
    }

    const rateEur = document.getElementById('rate-eur');
    if (rateEur) {
        rateEur.value = currentSettings.conversionRates.EUR;
    }

    const rateGbp = document.getElementById('rate-gbp');
    if (rateGbp) {
        rateGbp.value = currentSettings.conversionRates.GBP;
    }

    renderCategories();
}

function setupEventListeners() {
    document.getElementById('save-rates-btn')?.addEventListener('click', handleSaveRates);
    document.getElementById('add-category-btn')?.addEventListener('click', handleAddCategory);
    document.getElementById('import-btn')?.addEventListener('click', handleImport);
    document.getElementById('export-btn')?.addEventListener('click', handleExport);
    document.getElementById('clear-data-btn')?.addEventListener('click', handleClearData);

    const baseCurrency = document.getElementById('base-currency');
    if (baseCurrency) {
        baseCurrency.addEventListener('change', handleCurrencyChange);
    }

    document.getElementById('confirm-yes')?.addEventListener('click', confirmClearData);
    document.getElementById('confirm-no')?.addEventListener('click', closeModal);

    const modal = document.getElementById('confirm-modal');
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function handleCurrencyChange() {
    const baseCurrency = document.getElementById('base-currency');
    if (!baseCurrency) return;

    currentSettings.baseCurrency = baseCurrency.value;
    saveSettings(currentSettings);
    showStatus('currency-status', 'Base currency updated', 'success');
}

function handleSaveRates() {
    const rateEur = parseFloat(document.getElementById('rate-eur').value);
    const rateGbp = parseFloat(document.getElementById('rate-gbp').value);

    if (isNaN(rateEur) || rateEur <= 0 || isNaN(rateGbp) || rateGbp <= 0) {
        showStatus('currency-status', 'Invalid conversion rates', 'error');
        return;
    }

    currentSettings.conversionRates.EUR = rateEur;
    currentSettings.conversionRates.GBP = rateGbp;

    saveSettings(currentSettings);
    showStatus('currency-status', 'Conversion rates saved successfully', 'success');
}

function renderCategories() {
    const container = document.getElementById('categories-list');
    if (!container) return;

    const defaultCategories = ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'];

    container.innerHTML = currentSettings.categories.map(category => {
        const isDefault = defaultCategories.includes(category);
        return `
            <div class="category-item">
                <span>${escapeHtml(category)}</span>
                <button
                    type="button"
                    class="btn-icon"
                    onclick="window.deleteCategory('${escapeHtml(category)}')"
                    aria-label="Delete ${escapeHtml(category)} category"
                    ${isDefault ? 'disabled' : ''}>
                    <span aria-hidden="true">×</span>
                </button>
            </div>
        `;
    }).join('');
}

function handleAddCategory() {
    const input = document.getElementById('new-category');
    if (!input) return;

    const value = input.value.trim();

    const validation = validateCategory(value);

    if (!validation.valid) {
        showStatus('category-status', validation.error, 'error');
        return;
    }

    if (currentSettings.categories.includes(validation.value)) {
        showStatus('category-status', 'Category already exists', 'error');
        return;
    }

    currentSettings.categories.push(validation.value);
    saveSettings(currentSettings);
    renderCategories();

    input.value = '';
    showStatus('category-status', 'Category added successfully', 'success');
}

function deleteCategory(category) {
    const index = currentSettings.categories.indexOf(category);

    if (index > -1) {
        currentSettings.categories.splice(index, 1);
        saveSettings(currentSettings);
        renderCategories();
        showStatus('category-status', 'Category deleted successfully', 'success');
    }
}

function handleImport() {
    const fileInput = document.getElementById('import-file');
    if (!fileInput || !fileInput.files.length) {
        showStatus('data-status', 'Please select a file', 'error');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            const result = importData(data);

            if (result.success) {
                showStatus('data-status', `Successfully imported ${result.count} records`, 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                showStatus('data-status', `Import failed: ${result.error}`, 'error');
            }
        } catch (error) {
            showStatus('data-status', 'Invalid JSON file', 'error');
        }
    };

    reader.onerror = () => {
        showStatus('data-status', 'Error reading file', 'error');
    };

    reader.readAsText(file);
}

function handleExport() {
    try {
        const data = exportData();
        const timestamp = new Date().toISOString().split('T')[0];
        downloadJSON(data, `finance-tracker-backup-${timestamp}.json`);
        showStatus('data-status', 'Data exported successfully', 'success');
    } catch (error) {
        showStatus('data-status', 'Error exporting data', 'error');
    }
}

function handleClearData() {
    const modal = document.getElementById('confirm-modal');
    const message = document.getElementById('confirm-message');

    if (modal && message) {
        message.textContent = 'Are you sure you want to delete all transaction data? This action cannot be undone.';
        modal.hidden = false;
        document.getElementById('confirm-yes')?.focus();
    }
}

function confirmClearData() {
    const success = clearAllData();

    if (success) {
        showStatus('data-status', 'All data cleared successfully', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    } else {
        showStatus('data-status', 'Error clearing data', 'error');
    }

    closeModal();
}

function closeModal() {
    const modal = document.getElementById('confirm-modal');
    if (modal) {
        modal.hidden = true;
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

window.deleteCategory = deleteCategory;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
