// src/navigation/StudentStack.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import Feather from 'react-native-vector-icons/Feather';

import FeedScreen from '../screens/Home/FeedScreen';
import SearchScreen from '../screens/search/SearchScreen'; 
import ProfileScreen from '../screens/Auth/Profile/ProfileScreen'; 
import SettingsScreen from '../screens/Auth/Profile/SettingsScreen'; 
import FavoritesScreen from '../screens/Favorites/FavoritesScreen'; 
import ApplicationsScreen from '../screens/Applications/ApplicationsScreen';
import JobDetailScreen from '../screens/Jobs/JobDetailScreen'; 

import EventDetailScreen from '../screens/Events/EventDetailScreen';

import { ThemeProps, ThemeColors } from '../theme/types';

export type StudentStackParamList = {
    Dashboard: undefined; 
    Settings: { activeTheme: ThemeColors; currentUser: any; onUpdate?: (newData: any) => void };
    ProfileDetail: { activeTheme: ThemeColors }; 
    JobDetail: { job: any }; 
    EventDetail: { item: any };
};

export type TabParamList = {
    'Ana Sayfa': undefined;
    'Keşfet': undefined;
    'Başvurularım': undefined;
    'Favorilerim': undefined;
};

const Stack = createNativeStackNavigator<StudentStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const getTabBarIcon = (routeName: string, color: string) => {
    let iconName = '';
    switch (routeName) {
        case 'Ana Sayfa': iconName = 'home'; break;
        case 'Keşfet': iconName = 'compass'; break;
        case 'Başvurularım': iconName = 'briefcase'; break;
        case 'Favorilerim': iconName = 'heart'; break;
        default: iconName = 'circle';
    }
    return <Feather name={iconName} size={24} color={color} />;
};

const BottomTabs: React.FC<ThemeProps> = ({ activeTheme }) => {
    const insets = useSafeAreaInsets(); 
    
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: (activeTheme.background === '#000000' || activeTheme.background === '#0A0A32') 
                        ? '#121212' : '#FFFFFF',
                    borderTopWidth: 0,
                    height: 60 + (insets.bottom > 0 ? insets.bottom : 10), 
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: activeTheme.primary,
                tabBarInactiveTintColor: activeTheme.textSecondary,
                tabBarIcon: ({ color }) => getTabBarIcon(route.name, color),
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

const StudentStack: React.FC<ThemeProps> = ({ activeTheme }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}> 
            <Stack.Screen name="Dashboard">
                {() => <BottomTabs activeTheme={activeTheme} />}
            </Stack.Screen>

            <Stack.Screen 
                name="JobDetail" 
                options={{ 
                    headerShown: true, 
                    title: 'İlan Detayı',
                    headerStyle: { backgroundColor: activeTheme.background },
                    headerTintColor: activeTheme.text,
                }}
            >
                {(props) => <JobDetailScreen {...props} activeTheme={activeTheme} />}
            </Stack.Screen>

            <Stack.Screen 
                name="EventDetail" 
                options={{ 
                    headerShown: true, 
                    title: 'Etkinlik Detayı',
                    headerStyle: { backgroundColor: activeTheme.background },
                    headerTintColor: activeTheme.text,
                }}
            >
                {(props) => <EventDetailScreen {...props} activeTheme={activeTheme} />}
            </Stack.Screen>
            
            <Stack.Screen name="Settings" options={{ headerShown: true, title: 'Profili Düzenle' }}>
                {(props) => <SettingsScreen {...props} activeTheme={activeTheme} />}
            </Stack.Screen>
            
            <Stack.Screen name="ProfileDetail">
                {(props) => <ProfileScreen {...props} activeTheme={activeTheme} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default StudentStack;