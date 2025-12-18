// src/navigation/AppNavigator.tsx

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'; 

// Context
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Stack'ler
import AuthStack from './AuthStack';
import StudentStack from './StudentStack';
import CompanyStack from './CompanyStack'; 

// 🔥 YENİ EKLENEN EKRANLAR
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import ProfileScreen from '../screens/Auth/Profile/ProfileScreen'; 

const Stack = createStackNavigator(); 

const AppNavigator = () => {
    const { isAuthenticated, userRole, isLoading } = useAuth();
    const { activeTheme } = useTheme(); 

    // Yükleme Ekranı
    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: activeTheme.background }]}>
                <ActivityIndicator size="large" color={activeTheme.primary} />
            </View>
        );
    }

    // Oturum Yoksa -> Auth
    if (!isAuthenticated) {
        return <AuthStack activeTheme={activeTheme} />;
    }

    // Firma -> Company
    if (userRole === 'company') {
        return <CompanyStack activeTheme={activeTheme} />;
    }

    // Öğrenci -> Student + Admin + Profil
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            
            {/* 1. Ana Uygulama (Alt Menülerin olduğu yer: Feed, Keşfet, Başvurular) */}
            <Stack.Screen name="StudentMain">
                {(props) => <StudentStack {...props} activeTheme={activeTheme} />}
            </Stack.Screen>

            {/* 2. Admin Paneli (Profil sayfasındaki butondan gidilecek) */}
            <Stack.Screen name="AdminDashboard">
                {(props) => <AdminDashboardScreen {...props} activeTheme={activeTheme} />}
            </Stack.Screen>

            {/* 3. Profil Detay Ekranı (Ana Sayfa sağ üst ikonundan gidilecek) */}
            <Stack.Screen name="ProfileDetail">
                {(props) => <ProfileScreen {...props} activeTheme={activeTheme} />}
            </Stack.Screen>

        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AppNavigator;