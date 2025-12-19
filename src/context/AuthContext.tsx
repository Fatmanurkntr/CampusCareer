// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'; // Firebase Auth
import { AuthMode } from '../types/auth';
import { Alert } from 'react-native';

interface AuthContextType {
    isAuthenticated: boolean;
    user: FirebaseAuthTypes.User | null; 
    userRole: AuthMode | null;
    login: (role: AuthMode) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
    const [userRole, setUserRole] = useState<AuthMode | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (role: AuthMode) => {
        try {
            await AsyncStorage.setItem('userRole', role);
            setUserRole(role);
        } catch (error) {
            console.error("Giriş sırasında rol kaydetme hatası:", error);
        }
    };

    const logout = async () => {
        try {
            await auth().signOut();
            await AsyncStorage.removeItem('userRole');
            setUser(null);
            setUserRole(null);
        } catch (error) {
            console.error("Çıkış sırasında hata:", error);
            Alert.alert('Hata', 'Çıkış işlemi sırasında bir sorun oluştu.');
        }
    };

    React.useEffect(() => {
        const subscriber = auth().onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                const storedRole = await AsyncStorage.getItem('userRole') as AuthMode | null;
                setUserRole(storedRole);
            } else {
                setUserRole(null);
            }

            if (isLoading) {
                setIsLoading(false);
            }
        });

        return subscriber;
    }, []);

    const value = {
        isAuthenticated: !!user && !!userRole,
        user,
        userRole,
        login,
        logout,
        isLoading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth, AuthProvider içinde kullanılmalıdır.');
    }
    return context;
};