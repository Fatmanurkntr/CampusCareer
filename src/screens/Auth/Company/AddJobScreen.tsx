import React, { useState } from 'react';
import {
    View, Text, TextInput, StyleSheet, ScrollView,
    TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, StatusBar
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const COLORS = {
    background: '#F9FAFB',
    white: '#FFFFFF',
    primary: '#7C3AED', // Proje Mor Teması
    text: '#1F2937',
    border: '#E5E7EB',
    placeholder: '#9CA3AF'
};

const AddJobScreen = ({ navigation }: any) => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('Staj');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState(''); // 🔥 Düzeltildi: Artık kullanılıyor
    const [loading, setLoading] = useState(false);
    const [deadline, setDeadline] = useState('');
    const [category, setCategory] = useState('');
    const CATEGORIES = [
        'Yazılım & Bilişim', 'Tasarım & Kreatif', 'Pazarlama & Satış',
        'Mühendislik', 'Finans & Muhasebe', 'İnsan Kaynakları',
        'Hukuk', 'Sağlık', 'Operasyon', 'Yönetim'
    ];

    const handlePostJob = async () => {
        // Form doğrulamasına requirements eklendi
        if (!title || !location || !description || !requirements || !category) {
            Alert.alert("Eksik Bilgi", "Lütfen zorunlu alanları (Başlık, Konum, Link vb.) doldurun.");
            return;
        }

        setLoading(true);
        const currentUser = auth().currentUser;

        try {
            const userDoc = await firestore().collection('Users').doc(currentUser?.uid).get();
            const userData = userDoc.data();

            await firestore().collection('JobPostings').add({
                companyId: currentUser?.uid,
                companyName: userData?.companyName || 'Kurumsal Firma',
                title: title,
                location: location,
                type: type,
                description: description,
                requirements: requirements, // 🔥 Veritabanına aktarılıyor
                category: category,
                deadlineDate: deadline ? deadline : null,
                status: 'pending',
                views: 0,
                applicationCount: 0,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });

            setLoading(false);
            Alert.alert("Başarılı", "İlanınız onaylanmak üzere admine gönderildi.", [
                { text: "Tamam", onPress: () => navigation.goBack() }
            ]);

        } catch (error: any) {
            setLoading(false);
            Alert.alert("Hata", error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backText}>Geri</Text></TouchableOpacity>
                <Text style={styles.headerTitle}>YENİ İLAN OLUŞTUR</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.label}>İLAN BAŞLIĞI</Text>
                <TextInput style={styles.input} placeholder="Örn: React Native Geliştirici" value={title} onChangeText={setTitle} />

                <Text style={styles.label}>İLAN KATEGORİSİ</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoryChip,
                                category === cat && styles.activeCategoryChip
                            ]}
                            onPress={() => setCategory(cat)}
                        >
                            <Text style={[
                                styles.categoryText,
                                category === cat && styles.activeCategoryText
                            ]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.label}>KONUM</Text>
                <TextInput style={styles.input} placeholder="Örn: İstanbul / Uzaktan" value={location} onChangeText={setLocation} />

                <Text style={styles.label}>SON BAŞVURU TARİHİ(Opsiyonel)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="GG.AA.YYYY (Örn: 30.12.2025)"
                    value={deadline}
                    onChangeText={setDeadline}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>ÇALIŞMA ŞEKLİ</Text>
                <View style={styles.typeContainer}>
                    {['Staj', 'Yarı Zamanlı', 'Tam Zamanlı'].map((item) => (
                        <TouchableOpacity key={item} style={[styles.typeButton, type === item && styles.activeTypeButton]} onPress={() => setType(item)}>
                            <Text style={[styles.typeText, type === item && styles.activeTypeText]}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>İŞ TANIMI</Text>
                <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline placeholder="Pozisyon detaylarını yazın..." />

                {/* 🔥 DÜZELTME: Aranan Özellikler alanı eklendi, setRequirements bağlandı */}
                <Text style={styles.label}>ARANAN ÖZELLİKLER</Text>
                <TextInput style={[styles.input, styles.textArea]} value={requirements} onChangeText={setRequirements} multiline placeholder="Beklenen yetkinlikleri girin..." />

                <TouchableOpacity style={styles.submitButton} onPress={handlePostJob} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>İlanı Gönder</Text>}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: COLORS.border },
    backText: { color: '#6B7280', fontWeight: '600' },
    headerTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
    form: { padding: 20 },
    label: { fontSize: 10, fontWeight: '800', color: '#6B7280', marginBottom: 8, marginTop: 15 },
    input: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 15 },
    textArea: { height: 100, textAlignVertical: 'top' },
    typeContainer: { flexDirection: 'row', gap: 10 },
    typeButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
    activeTypeButton: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    typeText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
    activeTypeText: { color: '#FFF' },
    submitButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 30 },
    submitButtonText: { color: '#FFF', fontWeight: 'bold' }, // BURAYA VİRGÜL KOYMAYI UNUTMA

    // --- YENİ EKLENEN KISIMLAR ---
    categoryChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 8,
        backgroundColor: '#FFF'
    }, // <-- BURADAKİ VİRGÜL ÖNEMLİ
    activeCategoryChip: {
        backgroundColor: '#7C3AED', // Primary Color
        borderColor: '#7C3AED'
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280'
    },
    activeCategoryText: {
        color: '#FFF'
    }
});
export default AddJobScreen;