import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    StatusBar
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const COLORS = {
    background: '#F9FAFB',
    white: '#FFFFFF',
    primary: '#7C3AED',
    text: '#1F2937',
    border: '#E5E7EB',
    placeholder: '#9CA3AF'
};

const EditJobScreen = ({ route, navigation }: any) => {
    // Navigasyondan gelen mevcut ilan verisi
    const { job } = route.params;

    // State'leri mevcut verilerle dolduruyoruz
    const [title, setTitle] = useState(job.title);
    const [location, setLocation] = useState(job.location);
    const [type, setType] = useState(job.type);
    const [description, setDescription] = useState(job.description);
    const [requirements, setRequirements] = useState(job.requirements);
    const [applicationLink, setApplicationLink] = useState(job.applicationLink || ''); 
    const [loading, setLoading] = useState(false);

    const handleUpdateJob = async () => {
        if (!title || !location || !description) {
            Alert.alert("Eksik Bilgi", "Lütfen gerekli alanları doldurun.");
            return;
        }

        setLoading(true);

        try {
            // 🔥 GÜNCELLEME İŞLEMİ (Update)
            await firestore().collection('JobPostings').doc(job.id).update({
                title,
                location,
                type,
                description,
                requirements,
                applicationLink,
                updatedAt: firestore.FieldValue.serverTimestamp(), // Güncellenme tarihi
            });

            setLoading(false);
            Alert.alert("Başarılı", "İlan güncellendi! ✅", [
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
            
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={{ fontSize: 24 }}>⬅️</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>İlanı Düzenle</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.form}>
                
                <Text style={styles.label}>İlan Başlığı</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Konum</Text>
                <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={setLocation}
                />

                <Text style={styles.label}>Başvuru Linki</Text>
                <TextInput
                    style={styles.input}
                    value={applicationLink}
                    onChangeText={setApplicationLink}
                    keyboardType="url"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Çalışma Şekli</Text>
                <View style={styles.typeContainer}>
                    {['Staj', 'Yarı Zamanlı', 'Tam Zamanlı'].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.typeButton,
                                type === item && styles.activeTypeButton
                            ]}
                            onPress={() => setType(item)}
                        >
                            <Text style={[styles.typeText, type === item && { color: '#FFF' }]}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>İş Tanımı</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <Text style={styles.label}>Aranan Nitelikler</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={requirements}
                    onChangeText={setRequirements}
                    multiline
                />

                <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={handleUpdateJob}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>Değişiklikleri Kaydet 💾</Text>}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: COLORS.border },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
    form: { padding: 20, paddingBottom: 50 },
    label: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 8, marginTop: 12 },
    input: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 16, color: COLORS.text },
    textArea: { height: 100, textAlignVertical: 'top' },
    typeContainer: { flexDirection: 'row', gap: 10 },
    typeButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
    activeTypeButton: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    typeText: { fontSize: 13, color: '#4B5563' },
    submitButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 30, marginBottom: 40 },
    submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default EditJobScreen;