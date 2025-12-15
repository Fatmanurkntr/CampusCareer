import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Context Import'ları
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Stack Import'ları
import AuthStack from './AuthStack';
import StudentStack from './StudentStack';
import CompanyStack from './CompanyStack'; 

const AppNavigator = () => {
    // Auth ve Tema bilgilerini çekiyoruz
    const { isAuthenticated, userRole, isLoading } = useAuth();
    const { activeTheme } = useTheme(); 

    // 1. YÜKLEME EKRANI
    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: activeTheme.background }]}>
                <ActivityIndicator size="large" color={activeTheme.primary} />
            </View>
        );
    }

    // 2. OTURUM AÇILMAMIŞSA -> AuthStack
    // activeTheme prop'unu buraya ekledik çünkü AuthStack bunu bekliyor
    if (!isAuthenticated) {
        return <AuthStack activeTheme={activeTheme} />;
    }

    // 3. FİRMA İSE -> CompanyStack
    // Tutarlılık olması için buraya da ekliyoruz
    if (userRole === 'company') {
        return <CompanyStack activeTheme={activeTheme} />;
    }

    // 4. ÖĞRENCİ İSE -> StudentStack
    // HATA VEREN KISIM BURASIYDI: Artık activeTheme gönderiyoruz
    return <StudentStack activeTheme={activeTheme} />;
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AppNavigator;