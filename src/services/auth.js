// src/services/auth.js
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

// GİRİŞ FONKSİYONU
export const loginUser = async (email, password) => {
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

// ÇIKIŞ YAP FONKSİYONU
export const logoutUser = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    Alert.alert('Hata', 'Çıkış yapılamadı.');
    throw error;
  }
};

// KAYIT FONKSİYONU (Güncellendi)
export const registerUser = async (email, password, userData) => {
  try {
    // 1. Auth'a kaydet
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // 2. Firestore'a kaydet
    await firestore().collection('Users').doc(user.uid).set({
      name: userData.name,
      surname: userData.surname,
      role: userData.role, // student veya company
      email: email,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    // --- YENİ EKLENEN KISIM: DOĞRULAMA MAİLİ ---

    // Doğrulama linki gönder
    await user.sendEmailVerification();

    // Kullanıcıyı hemen dışarı at (Otomatik giriş yapmasın)
    await auth().signOut();

    return user;
  } catch (error) {
    Alert.alert('Kayıt Hatası', error.message);
    throw error;
  }
};