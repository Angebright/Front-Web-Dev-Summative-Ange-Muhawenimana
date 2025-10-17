import { loadRecords, saveRecords, loadSettings } from './storage.js';

let records = [];
let settings = {};

export function initState() {
    records = loadRecords();
    settings = loadSettings();
}

export function getRecords() {
    return [...records];
}

export function getSettings() {
    return { ...settings };
}

export function addRecord(recordData) {
    const newRecord = {
        id: generateId(),
        description: recordData.description,
        amount: recordData.amount,
        category: recordData.category,
        date: recordData.date,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    records.push(newRecord);
    saveRecords(records);
    return newRecord;
}

export function updateRecord(id, recordData) {
    const index = records.findIndex(r => r.id === id);

    if (index === -1) {
        return null;
    }

    records[index] = {
        ...records[index],
        description: recordData.description,
        amount: recordData.amount,
        category: recordData.category,
        date: recordData.date,
        updatedAt: new Date().toISOString()
    };

    saveRecords(records);
    return records[index];
}

export function deleteRecord(id) {
    const index = records.findIndex(r => r.id === id);

    if (index === -1) {
        return false;
    }

    records.splice(index, 1);
    saveRecords(records);
    return true;
}

export function getRecordById(id) {
    return records.find(r => r.id === id);
}

function generateId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `txn_${timestamp}_${random}`;
}

export function getTotalAmount() {
    return records.reduce((sum, record) => sum + record.amount, 0);
}

export function getTopCategory() {
    if (records.length === 0) return 'None';

    const categoryTotals = {};

    records.forEach(record => {
        categoryTotals[record.category] = (categoryTotals[record.category] || 0) + record.amount;
    });

    let topCategory = '';
    let maxAmount = 0;

    Object.entries(categoryTotals).forEach(([category, amount]) => {
        if (amount > maxAmount) {
            maxAmount = amount;
            topCategory = category;
        }
    });

    return topCategory || 'None';
}

export function getLast7DaysTotal() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    return records
        .filter(record => {
            const recordDate = new Date(record.date);
            return recordDate >= sevenDaysAgo;
        })
        .reduce((sum, record) => sum + record.amount, 0);
}

export function getCategoryTotals() {
    const categoryTotals = {};

    records.forEach(record => {
        categoryTotals[record.category] = (categoryTotals[record.category] || 0) + record.amount;
    });

    return Object.entries(categoryTotals)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);
}

export function getRecentRecords(limit = 5) {
    return [...records]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
}

export function getCurrentMonthTotal() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return records
        .filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getMonth() === currentMonth &&
                   recordDate.getFullYear() === currentYear;
        })
        .reduce((sum, record) => sum + record.amount, 0);
}
