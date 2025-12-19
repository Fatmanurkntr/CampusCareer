// src/utils/dateHelpers.ts

export const parseDateString = (dateStr: string): Date | null => {
    if (!dateStr) return null;

    // Temizlik: Bazen API'den gelen verinin başında sonunda boşluk olur
    const cleanStr = dateStr.trim();

    // ---------------------------------------------------------
    // SENARYO 1: "2025-12-16" (Yıl-Ay-Gün) -> Görsel 1'deki format
    // ---------------------------------------------------------
    // Regex ile format kontrolü: 4 rakam - 2 rakam - 2 rakam
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) {
        const parts = cleanStr.split('-').map(Number);
        // new Date(Yıl, Ay-1, Gün) -> Ay 0'dan başlar (Ocak=0)
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    // ---------------------------------------------------------
    // SENARYO 2: "16.12.2025" (Gün.Ay.Yıl) -> Bizim manuel format
    // ---------------------------------------------------------
    if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(cleanStr)) {
        const parts = cleanStr.split('.').map(Number);
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    // ---------------------------------------------------------
    // SENARYO 3: "Thu, Oct 1, 3 AM GMT+3" -> Görsel 2'deki format
    // ---------------------------------------------------------
    // JavaScript'in kendi Date yapıcısı bu İngilizce formatı %99 ihtimalle tanır.
    const nativeDate = new Date(cleanStr);

    // Tarih geçerli bir tarih mi diye kontrol et ("Invalid Date" olmasın)
    if (!isNaN(nativeDate.getTime())) {
        return nativeDate;
    }

    // Hiçbiri tutmazsa null dön
    console.warn(`⚠️ Tarih formatı tanınamadı: ${dateStr}`);
    return null;
};

/**
 * İlanın bildirim kurulacak tarihini hesaplar.
 */
export const getEffectiveDeadline = (item: any): Date | null => {
    // 1. Önce "deadlineDate" alanını kontrol et (Genelde iş ilanları)
    if (item.deadlineDate) {
        const parsed = parseDateString(item.deadlineDate);
        if (parsed) return parsed;
    }

    // 2. Yoksa "date" alanını kontrol et (Genelde etkinlikler)
    // API görseline göre "Thu, Oct 1..." gibi gelen yer burası olabilir
    if (item.date) {
        const parsed = parseDateString(item.date);
        if (parsed) return parsed;
    }

    // 3. Firestore Timestamp mi?
    if (item.deadlineDate && typeof item.deadlineDate.toDate === 'function') {
        return item.deadlineDate.toDate();
    }

    return null;
};