// src/screens/Auth/LoginScreen.tsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { ThemeColors } from '../../theme/types';
import { loginUser } from '../../services/auth';

const LoginScreen = ({ route, navigation }: any) => {
  const activeTheme: ThemeColors = route.params.activeTheme;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert('Eksik Bilgi', 'Lütfen e-posta ve şifrenizi giriniz.');
        return;
    }
    
    setIsLoading(true);
    try {
        await loginUser(email, password);
    } catch (e) {
        // Hata servisten dönüyor
    } finally {
        setIsLoading(false);
    }
  };
  
  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
      <StatusBar barStyle={activeTheme.background === '#1A1C22' ? 'light-content' : 'dark-content'} />
      
      {/* Klavye açılınca tasarımı yukarı iten yapı */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        
        {/* 1. HEADER & LOGO ALANI */}
        <View style={styles.headerContainer}>
          <View style={[styles.logoPlaceholder, { backgroundColor: activeTheme.surface }]}>
            <Text style={{ fontSize: 40 }}>🎓</Text>
          </View>
          <Text style={[styles.welcomeText, { color: activeTheme.text }]}>
            Tekrar Hoş Geldin!
          </Text>
          <Text style={[styles.subText, { color: activeTheme.textSecondary }]}>
            Kariyer yolculuğuna devam etmek için giriş yap.
          </Text>
        </View>

        {/* 2. FORM ALANI */}
        <View style={styles.formContainer}>
          
          {/* Email Input */}
          <View style={[styles.inputContainer, { backgroundColor: activeTheme.surface }]}>
            <Text style={[styles.inputLabel, { color: activeTheme.textSecondary }]}>E-POSTA</Text>
            <TextInput
                placeholder="ornek@ogrenci.edu.tr"
                placeholderTextColor={activeTheme.textSecondary + '80'} // Hafif saydam
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, { color: activeTheme.text }]}
            />
          </View>
          
          {/* Şifre Input */}
          <View style={[styles.inputContainer, { backgroundColor: activeTheme.surface }]}>
            <Text style={[styles.inputLabel, { color: activeTheme.textSecondary }]}>ŞİFRE</Text>
            <TextInput
                placeholder="••••••••"
                placeholderTextColor={activeTheme.textSecondary + '80'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[styles.input, { color: activeTheme.text }]}
            />
          </View>

          {/* Şifremi Unuttum (Opsiyonel Görsel) */}
          <TouchableOpacity style={styles.forgotPassContainer}>
            <Text style={[styles.forgotPassText, { color: activeTheme.textSecondary }]}>
              Şifreni mi unuttun?
            </Text>
          </TouchableOpacity>

          {/* Giriş Butonu */}
          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={handleLogin}
              title="Giriş Yap"
              activeTheme={activeTheme}
              isLoading={isLoading}
              style={styles.shadowButton} // Ekstra gölge
            />
          </View>

        </View>

        {/* 3. FOOTER (Kayıt Ol) */}
        <View style={styles.footerContainer}>
          <Text style={{ color: activeTheme.textSecondary }}>Hesabın yok mu? </Text>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text style={[styles.registerText, { color: activeTheme.primary }]}>
              Hemen Kayıt Ol
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40, // Tam yuvarlak
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // Hafif gölge
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800', // Daha kalın font
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    borderRadius: 12, // Modern yuvarlatılmış köşeler
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)', // Çok hafif sınır
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 1, // Harf aralığı modern görünüm sağlar
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    padding: 0, // Default padding'i sıfırla
  },
  forgotPassContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPassText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 10,
  },
  shadowButton: {
    shadowColor: "#7C3AED", // Buton renginde gölge
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontWeight: 'bold',
  },
});

export default LoginScreen;