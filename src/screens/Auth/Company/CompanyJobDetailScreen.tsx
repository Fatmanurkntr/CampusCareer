import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
    Linking
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const COLORS = {
    background: '#F9FAFB',
    white: '#FFFFFF',
    primary: '#7C3AED',
    text: '#1F2937',
    textLight: '#6B7280',
    border: '#E5E7EB',
    red: '#EF4444'
};

const CompanyJobDetailScreen = ({ route, navigation }: any) => {
    const { job } = route.params;

    const handleDelete = () => {
        Alert.alert(
            "İlanı Sil",
            "Bu ilanı kalıcı olarak silmek istediğinize emin misiniz?",
            [
                { text: "Vazgeç", style: "cancel" },
                {
                    text: "Sil",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await firestore().collection('JobPostings').doc(job.id).delete();
                            navigation.goBack(); 
                        } catch (error) { // 👈 DÜZELTME: :any silindi
                            console.error(error);
                            Alert.alert("Hata", "Silme işlemi başarısız oldu.");
                        }
                    }
                }
            ]
        );
    };

    const handleOpenLink = () => {
        if (job.applicationLink) {
            Linking.openURL(job.applicationLink).catch(() => 
                Alert.alert("Hata", "Link açılamadı.")
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>⬅️</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>İlan Yönetimi</Text>
                <View style={styles.headerPlaceholder} /> 
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                
                <View style={styles.card}>
                    <Text style={styles.title}>{job.title}</Text>
                    <View style={styles.row}>
                        <Text style={styles.badge}>📍 {job.location}</Text>
                        <Text style={styles.badgeSecondary}>💼 {job.type}</Text>
                    </View>
                    <Text style={styles.date}>
                        Oluşturulma: {job.createdAt?.toDate ? job.createdAt.toDate().toLocaleDateString('tr-TR') : ''}
                    </Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{job.views || 0}</Text>
                        <Text style={styles.statLabel}>Görüntülenme</Text>
                    </View>
                    
                    <View style={[styles.statBox, styles.statBoxActive]}>
                        <Text style={[styles.statNumber, styles.statNumberActive]}>
                            {job.applicationCount || 0}
                        </Text>
                        <Text style={styles.statLabel}>Başvuru Tıklaması</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>İş Tanımı</Text>
                    <Text style={styles.text}>{job.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Aranan Nitelikler</Text>
                    <Text style={styles.text}>{job.requirements || 'Belirtilmemiş'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tanımlı Başvuru Linki</Text>
                    <TouchableOpacity onPress={handleOpenLink}>
                        <Text style={styles.linkText}>
                            {job.applicationLink || "Link Girilmemiş"}
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>🗑️ İlanı Yayından Kaldır</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderColor: COLORS.border
    },
    backButton: { padding: 8 },
    backIcon: { fontSize: 22 },
    headerPlaceholder: { width: 30 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
    content: { padding: 20, paddingBottom: 100 },
    
    card: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    title: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
    row: { flexDirection: 'row', marginBottom: 12 },
    badge: { 
        backgroundColor: '#F3F4F6', 
        paddingHorizontal: 10, 
        paddingVertical: 4, 
        borderRadius: 8, 
        fontSize: 12, 
        color: COLORS.textLight 
    },
    badgeSecondary: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        fontSize: 12,
        color: COLORS.textLight,
        marginLeft: 8 
    },
    date: { fontSize: 12, color: COLORS.textLight },

    statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    statBox: {
        flex: 1,
        backgroundColor: '#EDE9FE',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center'
    },
    statBoxActive: {
        backgroundColor: '#DEF7EC'
    },
    statNumber: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 },
    statNumberActive: {
        color: '#059669'
    },
    statLabel: { fontSize: 12, color: COLORS.textLight },

    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
    text: { fontSize: 15, color: COLORS.textLight, lineHeight: 22 },
    linkText: {
        color: COLORS.primary,
        textDecorationLine: 'underline'
    },

    footer: {
        padding: 20,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderColor: COLORS.border
    },
    deleteButton: {
        backgroundColor: '#FEE2E2',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FECACA'
    },
    deleteButtonText: { color: COLORS.red, fontWeight: 'bold', fontSize: 16 }
});

export default CompanyJobDetailScreen;