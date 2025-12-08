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
    // ✅ KRİTER: Hatalı girişte uyarı mesajı
    if (error.code === 'auth/invalid-email') Alert.alert('Hata', 'Geçersiz e-posta adresi.');
    else if (error.code === 'auth/user-not-found') Alert.alert('Hata', 'Kullanıcı bulunamadı.');
    else if (error.code === 'auth/wrong-password') Alert.alert('Hata', 'Şifre yanlış.');
    else Alert.alert('Hata', error.message);
    throw error;
  }
};

// KAYIT FONKSİYONU
export const registerUser = async (email, password, userData) => {
  try {
    // 1. Auth'a kaydet
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // ✅ KRİTER: Firestore Users koleksiyonuna veri kaydetme
    await firestore().collection('Users').doc(user.uid).set({
      name: userData.name,
      surname: userData.surname,
      role: userData.role, // student veya company
      email: email,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    return user;
  } catch (error) {
    Alert.alert('Kayıt Hatası', error.message);
    throw error;
  }
};