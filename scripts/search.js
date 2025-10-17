export function compileRegex(pattern, flags = 'i') {
    try {
        if (!pattern || pattern.trim() === '') {
            return null;
        }
        return new RegExp(pattern, flags);
    } catch (error) {
        return null;
    }
}

export function searchRecords(records, regex) {
    if (!regex) {
        return records;
    }

    return records.filter(record => {
        return regex.test(record.description) ||
               regex.test(record.category) ||
               regex.test(record.amount.toString()) ||
               regex.test(record.date);
    });
}

export function highlightText(text, regex) {
    if (!regex || !text) {
        return escapeHtml(String(text));
    }

    const textStr = String(text);

    try {
        const result = textStr.replace(regex, match => `<mark>${escapeHtml(match)}</mark>`);
        return result;
    } catch (error) {
        return escapeHtml(textStr);
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

export function getSuggestedPatterns() {
    return [
        {
            name: 'Find amounts with cents',
            pattern: '\\.\\d{2}\\b',
            description: 'Matches amounts like 12.50, 8.75'
        },
        {
            name: 'Find beverage purchases',
            pattern: '(coffee|tea|juice)',
            description: 'Case-insensitive match for beverages'
        },
        {
            name: 'Find duplicate words',
            pattern: '\\b(\\w+)\\s+\\1\\b',
            description: 'Detects repeated consecutive words'
        },
        {
            name: 'Find specific date range',
            pattern: '2025-09-',
            description: 'All transactions from September 2025'
        },
        {
            name: 'Find large amounts',
            pattern: '^[1-9]\\d{2,}',
            description: 'Amounts 100 or greater'
        }
    ];
}
