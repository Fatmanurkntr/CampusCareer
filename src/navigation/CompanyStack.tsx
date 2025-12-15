import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProps } from '../theme/types';

// 🔥 EKRANLAR (screens/Auth/Company klasöründen)
import CompanyHomeScreen from '../screens/Auth/Company/CompanyHomeScreen';
import AddJobScreen from '../screens/Auth/Company/AddJobScreen';
import CompanyJobDetailScreen from '../screens/Auth/Company/CompanyJobDetailScreen';
import EditJobScreen from '../screens/Auth/Company/EditJobScreen'; // ✅ YENİ EKLENDİ

const Stack = createNativeStackNavigator();

const CompanyStack: React.FC<ThemeProps> = ({ activeTheme }) => {
    return (
        <Stack.Navigator 
            screenOptions={{ 
                headerShown: false,
                contentStyle: { backgroundColor: activeTheme.background } 
            }}
            initialRouteName="CompanyHome"
        >
            {/* 1. Firma Ana Sayfası */}
            <Stack.Screen name="CompanyHome" component={CompanyHomeScreen} />
            
            {/* 2. İlan Ekleme Sayfası */}
            <Stack.Screen name="AddJob" component={AddJobScreen} />

            {/* 3. İlan Detay Sayfası */}
            <Stack.Screen name="CompanyJobDetail" component={CompanyJobDetailScreen} />

            {/* 4. İlan Düzenleme Sayfası (Kalem ikonuna tıklayınca burası açılacak) ✅ */}
            <Stack.Screen name="EditJob" component={EditJobScreen} />

        </Stack.Navigator>
    );
};

export default CompanyStack;