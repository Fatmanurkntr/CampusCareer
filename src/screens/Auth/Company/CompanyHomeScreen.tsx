import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const COLORS = {
    background: '#F9FAFB',
    primary: '#7C3AED',
    white: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280',
    border: '#E5E7EB',
    red: '#EF4444'
};

const CompanyHomeScreen = ({ navigation }: any) => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [companyName, setCompanyName] = useState('Firma');

    const currentUser = auth().currentUser;

    useEffect(() => {
        if (!currentUser) return;

        const fetchProfile = async () => {
            try {
                const userDoc = await firestore().collection('Users').doc(currentUser.uid).get();
                const userData = userDoc.data();
                if (userData) {
                    setCompanyName(userData.companyName || 'Firma');
                }
            } catch (err) {
                console.error("Profil çekme hatası", err);
            }
        };
        fetchProfile();

        const unsubscribe = firestore()
            .collection('JobPostings')
            .where('companyId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const jobsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setJobs(jobsList);
                setLoading(false);
            }, error => {
                console.error("Hata:", error);
                setLoading(false);
            });

        return () => unsubscribe();
    }, [currentUser]);

    const renderJobItem = ({ item }: any) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('CompanyJobDetail', { job: item })}
        >
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.jobTitle}>{item.title}</Text>
                        <Text style={styles.jobLocation}>📍 {item.location} • {item.type}</Text>
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.editButton} 
                        onPress={() => navigation.navigate('EditJob', { job: item })}
                    >
                        <Text style={styles.editIcon}>✏️</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statGroup}>
                        <View style={styles.statBadgeInfo}>
                            <Text style={styles.statTextInfo}>
                                👁️ {item.views || 0}
                            </Text>
                        </View>
                        <View style={styles.statBadgeSuccess}>
                            <Text style={styles.statTextSuccess}>
                                🚀 {item.applicationCount || 0} Başvuru
                            </Text>
                        </View>
                    </View>
                    
                    <Text style={styles.dateText}>
                        {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('tr-TR') : ''}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hoşgeldin, 👋</Text>
                    <Text style={styles.companyName}>{companyName}</Text>
                </View>
                <TouchableOpacity onPress={() => auth().signOut()}>
                    <Text style={styles.logoutIcon}>🚪</Text> 
                </TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Yayınladığım İlanlar</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
            ) : (
                <FlatList
                    data={jobs}
                    renderItem={renderJobItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>📭</Text>
                            <Text style={styles.emptyText}>Henüz hiç ilan yayınlamadınız.</Text>
                        </View>
                    }
                />
            )}

            <TouchableOpacity 
                style={styles.fabExtended}
                onPress={() => navigation.navigate('AddJob')}
            >
                <Text style={styles.fabPlus}>+</Text>
                <Text style={styles.fabText}>İlan Ekle</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    greeting: { fontSize: 14, color: COLORS.textLight, fontWeight: '600' },
    companyName: { fontSize: 22, color: COLORS.text, fontWeight: 'bold' },
    sectionHeader: { paddingHorizontal: 20, marginBottom: 10, marginTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
    listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
    card: { backgroundColor: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    jobTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 4 },
    jobLocation: { fontSize: 13, color: COLORS.textLight },
    
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
    statGroup: { flexDirection: 'row' },
    
    dateText: { fontSize: 12, color: COLORS.textLight },
    
    emptyState: { alignItems: 'center', marginTop: 40 },
    emptyText: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
    
    fabExtended: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center', 
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    fabText: { fontSize: 16, color: 'white', fontWeight: 'bold' },

    titleContainer: { flex: 1 },
    editButton: { padding: 8 },
    editIcon: { fontSize: 20 },
    statBadgeInfo: { 
        backgroundColor: '#EFF6FF', 
        marginRight: 8,
        paddingHorizontal: 10, 
        paddingVertical: 4, 
        borderRadius: 8 
    },
    statTextInfo: { 
        color: '#3B82F6',
        fontSize: 12, 
        fontWeight: '700' 
    },
    statBadgeSuccess: { 
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 10, 
        paddingVertical: 4, 
        borderRadius: 8 
    },
    statTextSuccess: { 
        color: '#059669',
        fontSize: 12, 
        fontWeight: '700' 
    },
    logoutIcon: { fontSize: 24 },
    loader: { marginTop: 20 },
    emptyIcon: { fontSize: 40, marginBottom: 10 },
    fabPlus: { fontSize: 24, color: 'white', marginRight: 8 }
});

export default CompanyHomeScreen;