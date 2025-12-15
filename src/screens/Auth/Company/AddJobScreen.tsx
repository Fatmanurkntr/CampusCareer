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
import auth from '@react-native-firebase/auth';

const COLORS = {
    background: '#F9FAFB',
    white: '#FFFFFF',
    primary: '#7C3AED',
    text: '#1F2937',
    border: '#E5E7EB',
    placeholder: '#9CA3AF'
};

const AddJobScreen = ({ navigation }: any) => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('Staj');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [applicationLink, setApplicationLink] = useState(''); 
    const [loading, setLoading] = useState(false);

    const handlePostJob = async () => {
        if (!title || !location || !description || !applicationLink) {
            Alert.alert("Eksik Bilgi", "Lütfen başlık, konum, açıklama ve başvuru linkini doldurun.");
            return;
        }

        setLoading(true);
        const currentUser = auth().currentUser;

        try {
            const userDoc = await firestore().collection('Users').doc(currentUser?.uid).get();
            const userData = userDoc.data();

            await firestore().collection('JobPostings').add({
                companyId: currentUser?.uid,
                companyName: userData?.companyName || 'Gizli Firma',
                companyLogo: userData?.profileImage || null,
                
                title: title,
                location: location,
                type: type,
                description: description,
                requirements: requirements,
                applicationLink: applicationLink, 
                
                // Sayaçlar
                views: 0, 
                applicationCount: 0, 
                
                createdAt: firestore.FieldValue.serverTimestamp(),
                applicants: [] 
            });

            setLoading(false);
            Alert.alert("Başarılı! 🎉", "İlanınız yayınlandı.", [
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
                    {/* DÜZELTME 1: Inline style kaldırıldı, styles.backIcon yapıldı */}
                    <Text style={styles.backIcon}>⬅️</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Yeni İlan Oluştur</Text>
                {/* DÜZELTME 2: Inline style kaldırıldı, styles.placeholderView yapıldı */}
                <View style={styles.placeholderView} /> 
            </View>

            <ScrollView contentContainerStyle={styles.form}>
                
                <Text style={styles.label}>İlan Başlığı</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Örn: React Native Geliştirici"
                    placeholderTextColor={COLORS.placeholder}
                    value={title}
                    onChangeText={setTitle}
                />

                <Text style={styles.label}>Konum</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Örn: İstanbul / Uzaktan"
                    value={location}
                    onChangeText={setLocation}
                />

                <Text style={styles.label}>Başvuru Linki</Text>
                <TextInput
                    style={styles.input}
                    placeholder="https://sirketim.com/basvuru"
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
                            {/* DÜZELTME 3: styles.activeTypeButtonText eklendi */}
                            <Text style={[
                                styles.typeText, 
                                type === item && styles.activeTypeButtonText
                            ]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>İş Tanımı</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Detaylar..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <Text style={styles.label}>Aranan Nitelikler</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Nitelikler..."
                    value={requirements}
                    onChangeText={setRequirements}
                    multiline
                />

                <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={handlePostJob}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>Yayınla 🚀</Text>}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        backgroundColor: COLORS.white, 
        borderBottomWidth: 1, 
        borderColor: COLORS.border 
    },
    backButton: { padding: 4 },
    // YENİ EKLENEN STİLLER 👇
    backIcon: { 
        fontSize: 24, 
        color: COLORS.text 
    },
    placeholderView: { 
        width: 40 
    },
    // 👆
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
    form: { padding: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 8, marginTop: 12 },
    input: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, fontSize: 16, color: COLORS.text },
    textArea: { height: 100, textAlignVertical: 'top' },
    typeContainer: { flexDirection: 'row', gap: 10 },
    typeButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
    activeTypeButton: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    typeText: { fontSize: 13, color: '#4B5563' },
    // YENİ EKLENEN STİL 👇 (Yazı rengini beyaz yapmak için)
    activeTypeButtonText: {
        color: '#FFFFFF'
    },
    submitButton: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 30, marginBottom: 40 },
    submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default AddJobScreen;