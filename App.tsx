import React, { useState, useEffect } from 'react';
import { useColorScheme, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth'; // Firebase Auth ekledik

import { Themes } from './src/theme/colors';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  const scheme = useColorScheme();
  const activeTheme = scheme === 'dark' ? Themes.dark : Themes.light;

  // -- STATE YÖNETİMİ --
  const [initializing, setInitializing] = useState(true); // Uygulama ilk açılışta beklesin
  const [user, setUser] = useState(); // Kullanıcı bilgisini tutan state

  // Kullanıcı durumunu dinleyen fonksiyon (Firebase Listener)
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Component kapanırsa dinlemeyi durdur
  }, []);

  // Firebase bağlanırken boş beyaz ekran yerine dönen tekerlek gösterelim
  if (initializing) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#7C3AED" />
    </View>
  );

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* Kullanıcı bilgisini (user) navigasyona gönderiyoruz */}
        <AppNavigator activeTheme={activeTheme} user={user} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;