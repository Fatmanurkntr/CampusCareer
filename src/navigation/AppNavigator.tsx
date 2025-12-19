// src/navigation/AppNavigator.tsx

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import AuthStack from './AuthStack';
import StudentStack from './StudentStack';
import CompanyStack from './CompanyStack';

import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import AdminDetailScreen from '../screens/Admin/AdminDetailScreen';
import ProfileScreen from '../screens/Auth/Profile/ProfileScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { isAuthenticated, userRole, isLoading } = useAuth();
    const { activeTheme } = useTheme();

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: activeTheme?.background || '#FFFFFF' }]}>
                <ActivityIndicator size="large" color={activeTheme?.primary || '#7C3AED'} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <AuthStack activeTheme={activeTheme} />;
    }

    const isAdmin = (userRole as any) === 'admin' || auth().currentUser?.email === "sevdegulsahin25@gmail.com";

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: activeTheme?.background || '#FFFFFF' }
            }}
        >
            {/* 1. ANA AKIŞ */}
            <Stack.Screen name="Main">
                {(props) => {
                    // Admin ise de Student arayüzünü görsün
                    if (isAdmin) {
                        return <StudentStack {...props} activeTheme={activeTheme} />;
                    }
                    return userRole === 'company'
                        ? <CompanyStack {...props} activeTheme={activeTheme} />
                        : <StudentStack {...props} activeTheme={activeTheme} />;
                }}
            </Stack.Screen>

            {/* 2. ADMİN EKRANLARI - 🔥 DÜZELTME BURADA 🔥 */}
            {/* Şartı (isAdmin &&) kaldırıyoruz. Ekranlar her zaman tanımlı olsun. */}
            {/* Erişim kontrolünü zaten Buton görünürlüğü ile yapıyoruz. */}

            <Stack.Screen name="AdminDashboard">
                {(props) => <AdminDashboardScreen {...props} activeTheme={activeTheme} />}
            </Stack.Screen>

            <Stack.Screen name="AdminDetail">
                {(props) => <AdminDetailScreen {...props} activeTheme={activeTheme} />}
            </Stack.Screen>
            {/* ------------------------------------------- */}

            {/* 3. ORTAK EKRANLAR */}
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
        alignItems: 'center'
    },
});

export default AppNavigator;