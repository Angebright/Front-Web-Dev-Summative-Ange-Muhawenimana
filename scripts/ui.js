export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date);
}

export function showStatus(elementId, message, type = 'success') {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.textContent = message;
    element.className = `status-message ${type}`;
    element.style.display = 'block';

    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

export function clearStatus(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.textContent = '';
    element.className = 'status-message';
    element.style.display = 'none';
}

export function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
        errorElement.textContent = message;
    }

    if (inputElement) {
        inputElement.setAttribute('aria-invalid', 'true');
        inputElement.classList.add('error');
    }
}

export function clearError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
        errorElement.textContent = '';
    }

    if (inputElement) {
        inputElement.removeAttribute('aria-invalid');
        inputElement.classList.remove('error');
    }
}

export function clearAllErrors(fieldIds) {
    fieldIds.forEach(fieldId => clearError(fieldId));
}

export function downloadJSON(data, filename) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}

export function renderChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (data.length === 0) {
        container.innerHTML = '<p class="empty-state">No data to display</p>';
        return;
    }

    const maxAmount = Math.max(...data.map(item => item.amount));

    container.innerHTML = data.map(item => {
        const percentage = (item.amount / maxAmount) * 100;
        return `
            <div class="chart-bar">
                <div class="chart-label">${item.category}</div>
                <div class="chart-bar-fill" style="width: ${percentage}%">
                    <span class="chart-bar-value">${formatCurrency(item.amount)}</span>
                </div>
            </div>
        `;
    }).join('');
}

export function announce(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', priority);
    announcer.className = 'sr-only';
    announcer.textContent = message;

    document.body.appendChild(announcer);

    setTimeout(() => {
        document.body.removeChild(announcer);
    }, 1000);
}

export function setPageTitle(title) {
    document.title = `${title} - Student Finance Tracker`;
}

export function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
