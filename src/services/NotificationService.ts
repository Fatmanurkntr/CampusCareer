import notifee, { TriggerType, AndroidImportance, RepeatFrequency } from '@notifee/react-native';
import { parseDateString } from '../utils/dateHelpers';

const CHANNEL_ID = 'kariyer-firsatlari-v3';

class NotificationService {

    constructor() {
        this.createChannel();
    }

    async createChannel() {
        return await notifee.createChannel({
            id: CHANNEL_ID,
            name: 'Kariyer Takipçisi',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibration: true,
        });
    }

    // Favoriye ilk eklendiğinde çıkan anlık bildirim
    async displayImmediateNotification(title: string) {
        // İsteğe bağlı: Kanalın oluşturulduğundan emin ol
        await this.createChannel();
        try {
            await notifee.displayNotification({
                title: 'Takibe Alındı!',
                body: `${title} favorilerine eklendi. Gelişmeleri sana haber vereceğim.`,
                android: {
                    channelId: CHANNEL_ID,
                    smallIcon: 'ic_launcher',
                    pressAction: { id: 'default' },
                },
            });
        } catch (e) { console.error(e); }
    }

    /**
     * 🔥 YENİ AKILLI ZAMANLAMA MANTIĞI 🔥
     * @param item İlan veya Etkinlik objesinin tamamı
     */
    async scheduleSmartNotifications(item: any) {
        await notifee.requestPermission();
        const channelId = await this.createChannel();

        const now = Date.now();
        const title = item.title;
        const id = item.id;

        // Tür Kontrolü (Veritabanında 'type' alanı: 'Staj', 'İş', 'Event' vs. olabilir)
        // Senin kodunda etkinlikler type='event' veya farklı bir tablo olabiliyor.
        // Genelleme yapalım:
        const isEvent = item.type === 'event' || item.type === 'Etkinlik' || !!item.date;

        // 1. ADIM: Kesin bir Son Başvuru Tarihi (Deadline) var mı?
        const deadlineDate = parseDateString(item.deadlineDate);

        // --- SENARYO A: Kesin Bitiş Tarihi VAR (Hem İş Hem Etkinlik İçin Geçerli) ---
        if (deadlineDate) {
            await this.scheduleCountdown(id, title, deadlineDate, channelId, 'deadline');
            console.log(`✅ [TARİHLİ]: ${title} için son başvuru tarihine göre kuruldu.`);
            return;
        }

        // --- SENARYO B: Etkinlik ama Deadline Yok -> Etkinlik Tarihini Baz Al ---
        if (isEvent) {
            const eventDate = parseDateString(item.date);
            if (eventDate) {
                await this.scheduleCountdown(id, title, eventDate, channelId, 'event-start');
                console.log(`✅ [ETKİNLİK]: ${title} için etkinlik gününe göre kuruldu.`);
            } else {
                console.warn(`⚠️ [ETKİNLİK]: ${title} için ne deadline ne etkinlik tarihi bulundu.`);
            }
            return;
        }

        // --- SENARYO C: İş/Staj ve Tarih YOK -> Haftalık Hatırlatma (Recurring) ---
        // "Başvurdum" diyene kadar veya favoriden çıkana kadar haftada 1 atar.
        if (!isEvent && !deadlineDate) {
            const oneWeekLater = now + (7 * 24 * 60 * 60 * 1000);

            await notifee.createTriggerNotification(
                {
                    id: `${id}-weekly-reminder`,
                    title: 'Hatırlatma: Başvurdun mu? 🤔',
                    body: `${title} ilanını favorilerine eklemiştin. Hâlâ başvurmadıysan göz atmayı unutma!`,
                    android: {
                        channelId,
                        smallIcon: 'ic_launcher',
                        pressAction: { id: 'default', launchActivity: 'default' },
                    },
                },
                {
                    type: TriggerType.TIMESTAMP,
                    timestamp: oneWeekLater, // İlk bildirim 1 hafta sonra
                    repeatFrequency: RepeatFrequency.WEEKLY, // 🔥 HAFTALIK DÖNGÜ
                    alarmManager: { allowWhileIdle: true },
                },
            );
            console.log(`✅ [HAFTALIK]: ${title} için her hafta tekrarlayan bildirim kuruldu.`);
        }
    }

    /**
     * Yardımcı Fonksiyon: Geriye Sayım Kurucu (1 Hafta ve 2 Gün kala)
     */
    private async scheduleCountdown(id: string, title: string, targetDate: Date, channelId: string, typeSuffix: string) {
        const targetTime = targetDate.getTime();
        const now = Date.now();

        // 7 Gün Önce
        const sevenDaysBefore = targetTime - (7 * 24 * 60 * 60 * 1000);
        if (sevenDaysBefore > now) {
            await this.createOneShotNotification(
                `${id}-${typeSuffix}-7d`,
                `⏳ Zaman Daralıyor: ${title}`,
                'Son 1 hafta! Başvurunu veya kaydını tamamlamayı unutma.',
                sevenDaysBefore,
                channelId
            );
        }

        // 2 Gün Önce
        const twoDaysBefore = targetTime - (2 * 24 * 60 * 60 * 1000);
        if (twoDaysBefore > now) {
            await this.createOneShotNotification(
                `${id}-${typeSuffix}-2d`,
                `🚨 Son 2 Gün: ${title}`,
                'Çok az zaman kaldı. Hemen işlemleri tamamla!',
                twoDaysBefore,
                channelId
            );
        }
    }

    // Tek seferlik bildirim oluşturma (Helper)
    private async createOneShotNotification(notifId: string, title: string, body: string, timestamp: number, channelId: string) {
        try {
            await notifee.createTriggerNotification(
                {
                    id: notifId,
                    title,
                    body,
                    android: { channelId, smallIcon: 'ic_launcher', pressAction: { id: 'default', launchActivity: 'default' } },
                },
                {
                    type: TriggerType.TIMESTAMP,
                    timestamp,
                    alarmManager: { allowWhileIdle: true },
                }
            );
        } catch (e) { console.error('Bildirim kurma hatası:', e); }
    }

    // Bildirimleri İptal Et (Favoriden çıkınca veya "Başvurdum" deyince)
    async cancelNotifications(id: string) {
        // Kurulabilecek tüm ID varyasyonlarını sil
        const possibleIds = [
            `${id}-deadline-7d`,
            `${id}-deadline-2d`,
            `${id}-event-start-7d`,
            `${id}-event-start-2d`,
            `${id}-weekly-reminder` // Haftalık döngüyü de siler
        ];

        for (const notifId of possibleIds) {
            await notifee.cancelNotification(notifId);
        }
        console.log(`🗑️ ${id} için tüm bildirimler (varsa döngüler dahil) iptal edildi.`);
    }
}

export default new NotificationService();