import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

/**
 * Kullanıcı Girişi
 */
export const loginUser = async (email, password, mode) => { 
    console.log(`${mode} girişi yapılıyor...`);
    try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        if (error.code === 'auth/invalid-email') Alert.alert('Hata', 'Geçersiz e-posta adresi.');
        else if (error.code === 'auth/user-not-found') Alert.alert('Hata', 'Kullanıcı bulunamadı.');
        else if (error.code === 'auth/wrong-password') Alert.alert('Hata', 'Şifre yanlış.');
        else Alert.alert('Hata', error.message);
        throw error;
    }
};

/**
 * Çıkış Yapma
 */
export const logoutUser = async () => {
    try {
        await auth().signOut();
    } catch (error) {
        Alert.alert('Hata', 'Çıkış yapılamadı.');
        throw error;
    }
};

/**
 * KAYIT OLMA (Frontend verilerini veritabanına bağlayan kısım)
 */
export const registerUser = async (email, password, role, additionalData) => {
    try {
        // 1. Kullanıcıyı oluştur
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // 2. Temel veriyi hazırla
        let dbData = {
            uid: user.uid,
            email: email,
            role: role, // 'student' veya 'company'
            createdAt: firestore.FieldValue.serverTimestamp(),
            profileImage: null,
        };

        // 3. Rolüne göre (Öğrenci veya Şirket) ek verileri kaydet
        if (role === 'student') {
            dbData = {
                ...dbData,
                name: additionalData.name || '',
                surname: additionalData.surname || '',
                school: additionalData.school || '',       // Okul verisi buraya kaydediliyor
                department: additionalData.department || '', // Bölüm verisi buraya kaydediliyor
                bio: '',
                ghostMode: false,
            };
        } else if (role === 'company') {
            dbData = {
                ...dbData,
                companyName: additionalData.companyName || '', // Şirket adı buraya kaydediliyor
                sector: additionalData.sector || '',
                website: additionalData.website || '',
                description: '',
            };
        }

        // 4. Veritabanına yaz
        await firestore().collection('Users').doc(user.uid).set(dbData);

        console.log('Kullanıcı ve detayları başarıyla kaydedildi.');

        // 👇 EKLENEN KISIM BURASI 👇
        // Bu iki satır mail gönderip kullanıcıyı giriş ekranına atar.
        await user.sendEmailVerification();
        await auth().signOut(); 
        // 👆 EKLENEN KISIM BURASI 👆

        return user;
    } catch (error) {
        console.error("Kayıt hatası:", error);
        Alert.alert('Kayıt Hatası', error.message);
        throw error;
    }
};

/**
 * Profil Getirme (Profil Sayfasında veriyi göstermek için)
 */
export const getUserProfile = async (uid) => {
    try {
        const userDoc = await firestore().collection('Users').doc(uid).get();
        if (userDoc.exists) {
            return userDoc.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Veri çekme hatası:', error);
        throw error;
    }
};

/**
 * Profil Güncelleme (Ayarlar Sayfası için)
 */
export const updateUserProfile = async (uid, data) => {
    try {
        await firestore().collection('Users').doc(uid).update({
            ...data,
            updatedAt: firestore.FieldValue.serverTimestamp(),
        });
        console.log('Profil güncellendi!');
    } catch (error) {
        console.error('Güncelleme hatası:', error);
        throw error;
    }
};