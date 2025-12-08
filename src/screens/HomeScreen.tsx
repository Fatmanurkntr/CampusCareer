import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { logoutUser } from '../services/auth'; // Auth servisini çağır

const HomeScreen = ({ activeTheme }: any) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>🏠 Ana Sayfa</Text>
                <Text style={styles.text}>Tebrikler! Başarıyla giriş yaptın.</Text>
                <Text style={styles.text}>Buraya iş ilanları gelecek.</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => logoutUser()}
                >
                    <Text style={styles.buttonText}>Çıkış Yap</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 20, alignItems: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
    text: { fontSize: 16, color: '#666', marginBottom: 20 },
    button: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 10 },
    buttonText: { color: 'white', fontWeight: 'bold' }
});

export default HomeScreen;