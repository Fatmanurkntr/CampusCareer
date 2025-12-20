import React, { useEffect } from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import notifee, { EventType } from '@notifee/react-native'; 

import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';


import AppNavigator from './src/navigation/AppNavigator';
import { LogBox } from 'react-native';


LogBox.ignoreLogs([
    'This method is deprecated',
    'Firebase Web modular SDK API'
]);

const App = () => {

    
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
            <ThemeProvider>
                <AuthProvider>
                    <NavigationContainer>
                        <AppNavigator />
                    </NavigationContainer>
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
};

export default App;