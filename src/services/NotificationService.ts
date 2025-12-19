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

    async displayImmediateNotification(title: string) {
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

    
    async scheduleSmartNotifications(item: any) {
        await notifee.requestPermission();
        const channelId = await this.createChannel();

        const now = Date.now();
        const title = item.title;
        const id = item.id;

        const isEvent = item.type === 'event' || item.type === 'Etkinlik' || !!item.date;

        const deadlineDate = parseDateString(item.deadlineDate);

        if (deadlineDate) {
            await this.scheduleCountdown(id, title, deadlineDate, channelId, 'deadline');
            console.log(`✅ [TARİHLİ]: ${title} için son başvuru tarihine göre kuruldu.`);
            return;
        }

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
                    timestamp: oneWeekLater, 
                    repeatFrequency: RepeatFrequency.WEEKLY, 
                    alarmManager: { allowWhileIdle: true },
                },
            );
            console.log(`✅ [HAFTALIK]: ${title} için her hafta tekrarlayan bildirim kuruldu.`);
        }
    }

    
    private async scheduleCountdown(id: string, title: string, targetDate: Date, channelId: string, typeSuffix: string) {
        const targetTime = targetDate.getTime();
        const now = Date.now();

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

    async cancelNotifications(id: string) {
        const possibleIds = [
            `${id}-deadline-7d`,
            `${id}-deadline-2d`,
            `${id}-event-start-7d`,
            `${id}-event-start-2d`,
            `${id}-weekly-reminder` 
        ];

        for (const notifId of possibleIds) {
            await notifee.cancelNotification(notifId);
        }
        console.log(`🗑️ ${id} için tüm bildirimler (varsa döngüler dahil) iptal edildi.`);
    }
}

export default new NotificationService();