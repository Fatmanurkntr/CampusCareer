import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, StatusBar, Linking } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const PURPLE_COLOR = '#7C3AED';

const CompanyEventDetailScreen = ({ route, navigation }: any) => {
    const { event } = route.params;

    const handleDelete = () => {
        Alert.alert("ETKİNLİĞİ SİL", "Bu etkinliği kalıcı olarak silmek istediğinize emin misiniz?", [
            { text: "VAZGEÇ", style: "cancel" },
            {
                text: "SİL",
                style: 'destructive',
                onPress: async () => {
                    try {
                        await firestore().collection('EventPostings').doc(event.id).delete();
                        navigation.goBack();
                    } catch (error) {
                        console.error("Silme Hatası:", error);
                        Alert.alert("HATA", "İşlem sırasında bir sorun oluştu.");
                    }
                }
            }
        ]);
    };

    const openEventLink = () => {
        if (event.eventLink) {
            Linking.openURL(event.eventLink).catch(() => {
                Alert.alert("HATA", "Link açılamadı.");
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>Geri</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ETKİNLİK YÖNETİMİ</Text>
                <TouchableOpacity onPress={() => navigation.navigate('EditEvent', { event })}>
                    <Text style={styles.editText}>Düzenle</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.mainCard}>
                    <View style={styles.badgeRow}>
                        <View style={[styles.typeBadge, { backgroundColor: '#E0F2FE' }]}>
                            <Text style={[styles.typeBadgeText, { color: '#0369A1' }]}>ETKİNLİK</Text>
                        </View>
                    </View>
                    <Text style={styles.title}>{event.title}</Text>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>TARİH:</Text>
                        <Text style={styles.infoValue}>{event.date}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>KONUM:</Text>
                        <Text style={styles.infoValue}>{event.location || 'Belirtilmedi'}</Text>
                    </View>

                    {event.eventLink && (
                        <TouchableOpacity onPress={openEventLink} style={styles.linkContainer}>
                            <Text style={styles.infoLabel}>LİNK:</Text>
                            <Text style={[styles.infoValue, { color: PURPLE_COLOR, textDecorationLine: 'underline' }]}>
                                Kayıt Adresine Git
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statVal}>{event.views || 0}</Text>
                        <Text style={styles.statLab}>Görüntülenme</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: '#F3E8FF' }]}>
                        <Text style={[styles.statVal, { color: PURPLE_COLOR }]}>{event.participantCount || 0}</Text>
                        <Text style={styles.statLab}>Tıklama / Katılım</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>ETKİNLİK AÇIKLAMASI</Text>
                <Text style={styles.descriptionText}>{event.description}</Text>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>ETKİNLİĞİ YAYINDAN KALDIR</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingVertical: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#F3F4F6' 
    },
    backText: { color: '#6B7280', fontWeight: '600', fontSize: 14 },
    editText: { color: PURPLE_COLOR, fontWeight: '700', fontSize: 14 },
    headerTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: '#111827' },
    content: { padding: 24 },
    mainCard: { 
        padding: 20, 
        borderRadius: 16, 
        backgroundColor: '#fff', 
        borderWidth: 1, 
        borderColor: '#E5E7EB', 
        marginBottom: 20 
    },
    badgeRow: { marginBottom: 12 },
    typeBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    typeBadgeText: { fontSize: 10, fontWeight: '800' },
    title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 15 },
    infoRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'center' },
    linkContainer: { flexDirection: 'row', marginTop: 4, alignItems: 'center' },
    infoLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', width: 60 },
    infoValue: { fontSize: 14, fontWeight: '600', color: '#374151' },
    statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 25 },
    statBox: { 
        flex: 1, 
        backgroundColor: '#F9FAFB', 
        padding: 16, 
        borderRadius: 14, 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6'
    },
    statVal: { fontSize: 20, fontWeight: '800', color: '#111827' },
    statLab: { fontSize: 10, color: '#6B7280', marginTop: 4, fontWeight: '600' },
    sectionTitle: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', marginTop: 10, marginBottom: 10, letterSpacing: 0.5 },
    descriptionText: { fontSize: 15, color: '#4B5563', lineHeight: 24 },
    deleteButton: { 
        marginTop: 40, 
        backgroundColor: '#FEF2F2', 
        padding: 16, 
        borderRadius: 12, 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#FECACA' 
    },
    deleteButtonText: { color: '#DC2626', fontWeight: '800', fontSize: 13, letterSpacing: 0.5 }
});

export default CompanyEventDetailScreen;