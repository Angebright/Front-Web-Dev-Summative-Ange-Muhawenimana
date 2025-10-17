export function validateDescription(value) {
    const trimmed = value.trim();

    if (!trimmed) {
        return { valid: false, error: 'Description is required' };
    }

    const regex = /^\S(?:.*\S)?$/;

    if (!regex.test(trimmed)) {
        return { valid: false, error: 'No leading/trailing spaces or double spaces allowed' };
    }

    const doubleSpaceRegex = /  /;
    if (doubleSpaceRegex.test(trimmed)) {
        return { valid: false, error: 'Double spaces are not allowed' };
    }

    const duplicateWordRegex = /\b(\w+)\s+\1\b/i;
    if (duplicateWordRegex.test(trimmed)) {
        return { valid: false, error: 'Duplicate consecutive words detected' };
    }

    return { valid: true, value: trimmed };
}

export function validateAmount(value) {
    const trimmed = value.trim();

    if (!trimmed) {
        return { valid: false, error: 'Amount is required' };
    }

    const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

    if (!regex.test(trimmed)) {
        return { valid: false, error: 'Enter a valid positive number with up to 2 decimal places' };
    }

    const numValue = parseFloat(trimmed);

    if (numValue === 0) {
        return { valid: false, error: 'Amount must be greater than zero' };
    }

    return { valid: true, value: numValue };
}

export function validateDate(value) {
    const trimmed = value.trim();

    if (!trimmed) {
        return { valid: false, error: 'Date is required' };
    }

    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    if (!regex.test(trimmed)) {
        return { valid: false, error: 'Date must be in YYYY-MM-DD format' };
    }

    const date = new Date(trimmed);
    const [year, month, day] = trimmed.split('-').map(Number);

    if (date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day) {
        return { valid: false, error: 'Invalid date (check day/month combination)' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date > today) {
        return { valid: false, error: 'Date cannot be in the future' };
    }

    return { valid: true, value: trimmed };
}

export function validateCategory(value) {
    const trimmed = value.trim();

    if (!trimmed) {
        return { valid: false, error: 'Category is required' };
    }

    const regex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

    if (!regex.test(trimmed)) {
        return { valid: false, error: 'Category can only contain letters, spaces, and hyphens' };
    }

    return { valid: true, value: trimmed };
}

export function validateAllFields(formData) {
    const errors = {};
    let isValid = true;

    const descValidation = validateDescription(formData.description);
    if (!descValidation.valid) {
        errors.description = descValidation.error;
        isValid = false;
    }

    const amountValidation = validateAmount(formData.amount);
    if (!amountValidation.valid) {
        errors.amount = amountValidation.error;
        isValid = false;
    }

    const categoryValidation = validateCategory(formData.category);
    if (!categoryValidation.valid) {
        errors.category = categoryValidation.error;
        isValid = false;
    }

    const dateValidation = validateDate(formData.date);
    if (!dateValidation.valid) {
        errors.date = dateValidation.error;
        isValid = false;
    }

    return {
        valid: isValid,
        errors,
        values: isValid ? {
            description: descValidation.value,
            amount: amountValidation.value,
            category: categoryValidation.value,
            date: dateValidation.value
        } : null
    };
}
