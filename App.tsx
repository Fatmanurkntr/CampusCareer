import React, { useEffect } from 'react'; // useEffect eklendi
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import notifee, { EventType } from '@notifee/react-native'; // 🔥 Notifee eklendi

// Context Provider'lar
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';

// Ana Navigatör
import AppNavigator from './src/navigation/AppNavigator';
import { LogBox } from 'react-native';

// Uyarıları gizleme
LogBox.ignoreLogs([
    'This method is deprecated',
    'Firebase Web modular SDK API'
]);

const App = () => {

    // 🔥 BU BLOĞU EKLEDİK: Uygulama ön plandayken bildirim olaylarını dinler
    useEffect(() => {
        return notifee.onForegroundEvent(({ type, detail }) => {
            switch (type) {
                case EventType.DISMISSED:
                    console.log('Kullanıcı bildirimi sildi:', detail.notification);
                    break;
                case EventType.PRESS:
                    console.log('Kullanıcı bildirime bastı:', detail.notification);
                    break;
            }
        });
    }, []);

    return (
        <SafeAreaProvider>
            {/* 1. ThemeProvider dışta olmalı */}
            <ThemeProvider>
                {/* 2. AuthProvider hemen içinde olmalı */}
                <AuthProvider>
                    {/* 3. NavigationContainer en içte olmalı */}
                    <NavigationContainer>
                        <AppNavigator />
                    </NavigationContainer>
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
};

export default App;