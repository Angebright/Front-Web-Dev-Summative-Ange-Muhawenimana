import { initState, addRecord, updateRecord, getRecordById } from './state.js';
import { validateDescription, validateAmount, validateDate, validateCategory, validateAllFields } from './validators.js';
import { showError, clearError, clearAllErrors, showStatus, getTodayDate } from './ui.js';

let editMode = false;
let editId = null;

function init() {
    initState();
    checkEditMode();
    setupEventListeners();
    setDefaultDate();
}

function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    editId = urlParams.get('id');

    if (editId) {
        editMode = true;
        const record = getRecordById(editId);

        if (record) {
            document.getElementById('form-title').textContent = 'Edit Transaction';
            document.getElementById('submit-text').textContent = 'Update Transaction';
            populateForm(record);
        } else {
            window.location.href = 'records.html';
        }
    }
}

function populateForm(record) {
    document.getElementById('description').value = record.description;
    document.getElementById('amount').value = record.amount;
    document.getElementById('category').value = record.category;
    document.getElementById('date').value = record.date;
}

function setDefaultDate() {
    if (!editMode) {
        const dateInput = document.getElementById('date');
        if (dateInput && !dateInput.value) {
            dateInput.value = getTodayDate();
        }
    }
}

function setupEventListeners() {
    const form = document.getElementById('transaction-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = 'records.html';
        });
    }

    const descriptionInput = document.getElementById('description');
    if (descriptionInput) {
        descriptionInput.addEventListener('blur', () => validateField('description', descriptionInput.value, validateDescription));
        descriptionInput.addEventListener('input', () => clearError('description'));
    }

    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.addEventListener('blur', () => validateField('amount', amountInput.value, validateAmount));
        amountInput.addEventListener('input', () => clearError('amount'));
    }

    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.addEventListener('blur', () => validateField('date', dateInput.value, validateDate));
        dateInput.addEventListener('change', () => clearError('date'));
    }

    const categoryInput = document.getElementById('category');
    if (categoryInput) {
        categoryInput.addEventListener('blur', () => validateField('category', categoryInput.value, validateCategory));
        categoryInput.addEventListener('change', () => clearError('category'));
    }
}

function validateField(fieldId, value, validator) {
    const result = validator(value);

    if (!result.valid) {
        showError(fieldId, result.error);
        return false;
    }

    clearError(fieldId);
    return true;
}

function handleSubmit(event) {
    event.preventDefault();

    clearAllErrors(['description', 'amount', 'category', 'date']);

    const formData = {
        description: document.getElementById('description').value,
        amount: document.getElementById('amount').value,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value
    };

    const validation = validateAllFields(formData);

    if (!validation.valid) {
        Object.entries(validation.errors).forEach(([field, error]) => {
            showError(field, error);
        });

        showStatus('form-status', 'Please fix the errors above', 'error');
        return;
    }

    try {
        if (editMode) {
            updateRecord(editId, validation.values);
            showStatus('form-status', 'Transaction updated successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'records.html';
            }, 1500);
        } else {
            addRecord(validation.values);
            showStatus('form-status', 'Transaction added successfully!', 'success');

            setTimeout(() => {
                window.location.href = 'records.html';
            }, 1500);
        }
    } catch (error) {
        showStatus('form-status', 'Error saving transaction. Please try again.', 'error');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
