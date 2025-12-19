// src/utils/dateHelpers.ts

export const parseDateString = (dateStr: string): Date | null => {
    if (!dateStr) return null;

    const cleanStr = dateStr.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) {
        const parts = cleanStr.split('-').map(Number);
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(cleanStr)) {
        const parts = cleanStr.split('.').map(Number);
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    const nativeDate = new Date(cleanStr);

    if (!isNaN(nativeDate.getTime())) {
        return nativeDate;
    }

    console.warn(`⚠️ Tarih formatı tanınamadı: ${dateStr}`);
    return null;
};


export const getEffectiveDeadline = (item: any): Date | null => {
    if (item.deadlineDate) {
        const parsed = parseDateString(item.deadlineDate);
        if (parsed) return parsed;
    }

    if (item.date) {
        const parsed = parseDateString(item.date);
        if (parsed) return parsed;
    }

    if (item.deadlineDate && typeof item.deadlineDate.toDate === 'function') {
        return item.deadlineDate.toDate();
    }

    return null;
};