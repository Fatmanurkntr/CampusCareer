// src/navigation/StudentStack.tsx

import React from 'react';
import { View, Platform } from 'react-native'; // Text importunu kaldırdık (artık ikon var)
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { RouteProp, ParamListBase } from '@react-navigation/native'; 
// İkon Kütüphanesi
import Feather from 'react-native-vector-icons/Feather';

// SAYFALAR
import FeedScreen from '../screens/Home/FeedScreen';
import SearchScreen from '../screens/search/SearchScreen'; 
import ProfileScreen from '../screens/Auth/Profile/ProfileScreen'; 
import SettingsScreen from '../screens/Auth/Profile/SettingsScreen'; 
import FavoritesScreen from '../screens/Favorites/FavoritesScreen'; 
import ApplicationsScreen from '../screens/Applications/ApplicationsScreen';

import { ThemeProps, ThemeColors } from '../theme/types';

const Stack = createNativeStackNavigator<StudentStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// --- 1. TÜM ROTALARIN TİP TANIMLARI ---
type StudentStackParamList = {
    Dashboard: undefined; 
    Settings: { activeTheme: ThemeColors; currentUser: any; onUpdate?: (newData: any) => void };
    ProfileDetail: { activeTheme: ThemeColors }; 
};

type TabParamList = {
    'Ana Sayfa': undefined;
    'Keşfet': undefined;
    'Başvurularım': undefined;
    'Favorilerim': undefined;
};


// --- BÖLÜM 1: ALT MENÜ (TABS) ---
const BottomTabs: React.FC<ThemeProps> = ({ activeTheme }) => {
    
    const insets = useSafeAreaInsets(); 

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false, // 🔥 YAZILARI GİZLEDİK (MİNİMAL)
                tabBarStyle: {
                    // 🔥 MODERN GÖRÜNÜM AYARLARI
                    backgroundColor: activeTheme.background === '#000000' || activeTheme.background === '#0A0A32' 
                        ? '#121212' // Koyu modda daha koyu gri
                        : '#FFFFFF', // Açık modda beyaz
                    borderTopWidth: 0, // Üstteki ince çizgiyi kaldırdık
                    elevation: 10, // Android gölgesi
                    shadowColor: '#000', // iOS gölgesi
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    height: 60 + (insets.bottom > 0 ? insets.bottom : 10), 
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
                    paddingTop: 10, // Yazı kalktığı için ikonu ortaladık
                },
                tabBarActiveTintColor: activeTheme.primary,
                tabBarInactiveTintColor: activeTheme.textSecondary,
                
                // 🔥 EMOJİ YERİNE FEATHER İKONLARI
                tabBarIcon: ({ focused, color }) => {
                    let iconName = '';
                    
                    if (route.name === 'Ana Sayfa') iconName = 'home';
                    else if (route.name === 'Keşfet') iconName = 'compass'; 
                    else if (route.name === 'Başvurularım') iconName = 'briefcase'; 
                    else if (route.name === 'Favorilerim') iconName = 'heart'; 

                    return <Feather name={iconName} size={24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Ana Sayfa">
                {() => <FeedScreen activeTheme={activeTheme} />}
            </Tab.Screen>
            
            <Tab.Screen name="Keşfet">
                {() => <SearchScreen activeTheme={activeTheme} />}
            </Tab.Screen>

            <Tab.Screen name="Başvurularım">
                {() => <ApplicationsScreen activeTheme={activeTheme} />} 
            </Tab.Screen>
            
            <Tab.Screen name="Favorilerim">
                {() => <FavoritesScreen activeTheme={activeTheme} />}
            </Tab.Screen>

        </Tab.Navigator>
    );
};

// --- BÖLÜM 2: ÖĞRENCİ YIĞINI (STACK) ---
const StudentStack: React.FC<ThemeProps> = ({ activeTheme }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}> 
            
            {/* Alt Menüyü Tutan Ana Ekran */}
            <Stack.Screen name="Dashboard">
                {() => <BottomTabs activeTheme={activeTheme} />}
            </Stack.Screen>
            
            <Stack.Screen 
                name="Settings" 
                options={{ 
                    headerShown: true, 
                    title: 'Profili Düzenle',
                    headerStyle: { backgroundColor: activeTheme.background },
                    headerTintColor: activeTheme.text,
                    headerBackTitle: '', 
                }}
            >
                {({ route, navigation }) => (
                    <SettingsScreen 
                        activeTheme={activeTheme}
                        route={route} 
                        navigation={navigation}
                    />
                )}
            </Stack.Screen>
            
            <Stack.Screen 
                name="ProfileDetail" 
                options={{ 
                    headerShown: false,
                }} 
            >
                {({ route, navigation }) => (
                    <ProfileScreen 
                        activeTheme={activeTheme}
                        route={route} 
                        navigation={navigation}
                    />
                )}
            </Stack.Screen>
            
        </Stack.Navigator>
    );
};

export default StudentStack;