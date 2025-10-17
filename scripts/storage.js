const STORAGE_KEY = 'finance_tracker_data';
const SETTINGS_KEY = 'finance_tracker_settings';

export function loadRecords() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading records:', error);
        return [];
    }
}

export function saveRecords(records) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        return true;
    } catch (error) {
        console.error('Error saving records:', error);
        return false;
    }
}

export function loadSettings() {
    try {
        const data = localStorage.getItem(SETTINGS_KEY);
        return data ? JSON.parse(data) : getDefaultSettings();
    } catch (error) {
        console.error('Error loading settings:', error);
        return getDefaultSettings();
    }
}

export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

function getDefaultSettings() {
    return {
        baseCurrency: 'USD',
        conversionRates: {
            EUR: 1.09,
            GBP: 1.27
        },
        categories: ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'],
        budgetCap: 0
    };
}

export function clearAllData() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
}

export function exportData() {
    const records = loadRecords();
    const settings = loadSettings();
    return {
        records,
        settings,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
}

export function validateImportData(data) {
    if (!data || typeof data !== 'object') {
        return { valid: false, error: 'Invalid data format' };
    }

    if (!Array.isArray(data.records)) {
        return { valid: false, error: 'Records must be an array' };
    }

    for (let i = 0; i < data.records.length; i++) {
        const record = data.records[i];

        if (!record.id || typeof record.id !== 'string') {
            return { valid: false, error: `Record ${i} missing valid id` };
        }

        if (!record.description || typeof record.description !== 'string') {
            return { valid: false, error: `Record ${i} missing valid description` };
        }

        if (typeof record.amount !== 'number' || record.amount < 0) {
            return { valid: false, error: `Record ${i} has invalid amount` };
        }

        if (!record.category || typeof record.category !== 'string') {
            return { valid: false, error: `Record ${i} missing valid category` };
        }

        if (!record.date || !isValidDateFormat(record.date)) {
            return { valid: false, error: `Record ${i} has invalid date` };
        }
    }

    return { valid: true };
}

function isValidDateFormat(dateString) {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    return regex.test(dateString);
}

export function importData(data) {
    const validation = validateImportData(data);

    if (!validation.valid) {
        return { success: false, error: validation.error };
    }

    try {
        saveRecords(data.records);

        if (data.settings) {
            saveSettings(data.settings);
        }

        return { success: true, count: data.records.length };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
