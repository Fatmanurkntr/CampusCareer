import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    SafeAreaView, StatusBar, Image, Linking, Alert, ActivityIndicator
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import NotificationService from '../../services/NotificationService';
import { getAvatarStyle, getInitials } from '../../utils/uiHelpers';
import Ionicons from 'react-native-vector-icons/Ionicons';

const JobDetailScreen = ({ route, navigation, activeTheme: propsTheme }: any) => {

    const activeTheme = propsTheme || route.params?.activeTheme || {
        background: '#FFFFFF', text: '#111827', textSecondary: '#6B7280', primary: '#7C3AED', surface: '#F9FAFB'
    };

    const { item, job: paramJob } = route.params || {};
    const job = item || paramJob;

    // 🔥 SİSTEM HEADER GİZLEME
    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    if (!job) {
        return (
            <SafeAreaView style={[styles.center, { backgroundColor: activeTheme.background }]}>
                <ActivityIndicator color={activeTheme.primary} />
            </SafeAreaView>
        );
    }

    const [isFavorite, setIsFavorite] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(true);
    const currentUser = auth().currentUser;

    // Firma ilanı mı API mi?
    const isCompanyJob = !!job.companyId;

    useEffect(() => {
        if (!currentUser) { setLoading(false); return; }

        const unsubFav = firestore().collection('Favorites')
            .where('userId', '==', currentUser.uid).where('jobId', '==', job.id)
            .onSnapshot(snap => setIsFavorite(!snap?.empty));

        const unsubApp = firestore().collection('Applications')
            .where('userId', '==', currentUser.uid).where('jobId', '==', job.id)
            .onSnapshot(snap => {
                setIsApplied(!snap?.empty);
                setLoading(false);
            });

        return () => { unsubFav(); unsubApp(); };
    }, [job.id]);

    const toggleFavorite = async () => {
        if (!currentUser) return Alert.alert("Giriş Yap", "İşlem yapmak için giriş yapmalısınız.");
        try {
            const favRef = firestore().collection('Favorites');
            const query = await favRef.where('userId', '==', currentUser.uid).where('jobId', '==', job.id).get();

            if (query.empty) {
                // 1. Veritabanına Ekle
                await favRef.add({
                    userId: currentUser.uid,
                    jobId: job.id,
                    jobData: job,
                    type: 'job',
                    addedAt: firestore.FieldValue.serverTimestamp()
                });

                // 2. 🔥 ANLIK BİLDİRİM GÖNDER (FeedScreen'de olduğu gibi)
                // Bu satır sayesinde butona basar basmaz "Favorilere Eklendi" bildirimi alırsınız.
                await NotificationService.displayImmediateNotification(job.title);

                // 3. Akıllı Planlamayı Başlat
                await NotificationService.scheduleSmartNotifications(job);

            } else {
                // Favoriden Çıkarma
                const batch = firestore().batch();
                query.docs.forEach(doc => batch.delete(doc.ref));
                await batch.commit();

                // Bildirimleri İptal Et
                await NotificationService.cancelNotifications(job.id);
            }
        } catch (error) {
            console.error("Favori Hatası:", error);
        }
    };

    const handleApply = async () => {
        if (isApplied) return;
        const alertMsg = isCompanyJob ? "Başvurunuz şirkete iletilecektir." : "İlanı başvurdum olarak işaretle?";

        Alert.alert("Başvuru", alertMsg, [
            { text: "Vazgeç", style: "cancel" },
            {
                text: "Onayla", onPress: async () => {
                    try {
                        const batch = firestore().batch();
                        const appRef = firestore().collection('Applications').doc();

                        batch.set(appRef, {
                            userId: currentUser?.uid, jobId: job.id, jobTitle: job.title,
                            companyName: job.companyName || job.company || 'Dış Kaynak',
                            appliedAt: firestore.FieldValue.serverTimestamp(),
                            status: isCompanyJob ? 'Beklemede' : 'Dış Başvuru',
                            type: isCompanyJob ? 'company_application' : 'external_application',
                            jobData: job
                        });

                        if (isCompanyJob) {
                            const jobRef = firestore().collection('JobPostings').doc(job.id);
                            batch.update(jobRef, { applicationCount: firestore.FieldValue.increment(1) });
                        }

                        await batch.commit();
                        await NotificationService.cancelNotifications(job.id);
                        Alert.alert("Başarılı", "İşlem tamamlandı!");
                    } catch (e) { Alert.alert("Hata", "Bir sorun oluştu."); }
                }
            }
        ]);
    };

    if (loading) return <View style={[styles.center, { backgroundColor: activeTheme.background }]}><ActivityIndicator color={activeTheme.primary} /></View>;

    const avatarStyle = getAvatarStyle(job.company || job.companyName || '');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={28} color={activeTheme.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleFavorite}>
                    <Feather
                        // 🔥 heart-outline yerine sadece heart kullanıyoruz
                        name="heart"
                        size={26}
                        // Favori ise kırmızı, değilse tema rengi
                        color={isFavorite ? "#EF4444" : activeTheme.text}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.headerCard, { backgroundColor: activeTheme.surface }]}>
                    <View style={[styles.iconBox, { backgroundColor: job.logoUrl ? '#FFF' : avatarStyle.bg }]}>
                        {job.logoUrl ? (
                            <Image source={typeof job.logoUrl === 'string' ? { uri: job.logoUrl } : job.logoUrl} style={{ width: 44, height: 44 }} resizeMode="contain" />
                        ) : (
                            <Text style={{ fontSize: 24, fontWeight: '700', color: avatarStyle.text }}>
                                {getInitials(job.company || job.companyName || '')}
                            </Text>
                        )}
                    </View>
                    <Text style={[styles.title, { color: activeTheme.text }]}>{job.title}</Text>
                    <Text style={[styles.company, { color: activeTheme.textSecondary }]}>{job.company || job.companyName}</Text>

                    <View style={{ flexDirection: 'row', marginTop: 10, gap: 10 }}>
                        <View style={styles.badge}><Text style={styles.badgeText}>{job.location}</Text></View>
                        <View style={styles.badge}><Text style={styles.badgeText}>{job.type}</Text></View>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <Text style={[styles.sectionTitle, { color: activeTheme.text }]}>İş Tanımı</Text>
                    <Text style={[styles.description, { color: activeTheme.textSecondary }]}>
                        {job.description ? job.description.replace(/<[^>]+>/g, '') : "Detaylı açıklama ilanda mevcuttur."}
                    </Text>
                </View>
            </ScrollView>

            {/* 🔥 YENİLENMİŞ FOOTER (Event Stili) */}
            <View style={[styles.footer, { backgroundColor: activeTheme.background, borderTopColor: activeTheme.surface }]}>

                {/* Sol Taraf: Başvur Butonu (Her zaman var) */}
                <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: isApplied ? "#10B981" : activeTheme.primary }]}
                    onPress={handleApply}
                    disabled={isApplied}
                >
                    <Feather name={isApplied ? "check" : "briefcase"} size={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.btnTxt}>{isApplied ? (isCompanyJob ? "Başvuruldu" : "Eklendi") : (isCompanyJob ? "Hemen Başvur" : "Listeme Ekle")}</Text>
                </TouchableOpacity>

                {/* Sağ Taraf: Link Butonu (SADECE API İLANLARINDA ve LINK VARSA) */}
                {!isCompanyJob && (job.link || job.applicationLink) && (
                    <TouchableOpacity
                        style={[styles.linkBtn, { borderColor: activeTheme.primary }]}
                        onPress={() => Linking.openURL(job.link || job.applicationLink)}
                    >
                        <Feather name="external-link" size={20} color={activeTheme.primary} />
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
    scrollContent: { padding: 20, paddingBottom: 100 },

    headerCard: { padding: 30, borderRadius: 32, alignItems: 'center', marginBottom: 25 },
    iconBox: { width: 70, height: 70, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    company: { fontSize: 16, marginTop: 5, fontWeight: '500' },
    badge: { backgroundColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    badgeText: { fontSize: 12, fontWeight: '600', color: '#374151' },

    infoSection: { marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    description: { fontSize: 15, lineHeight: 24 },

    // 🔥 FOOTER (Event ile Birebir Aynı)
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, flexDirection: 'row', gap: 10, borderTopWidth: 1 },
    actionBtn: { flex: 1, height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    linkBtn: { width: 60, height: 60, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    btnTxt: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default JobDetailScreen;