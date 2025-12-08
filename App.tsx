// App.tsx

import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Senin oluşturduğun dosyaları içe aktarıyoruz
import { Themes } from './src/theme/colors'; 
import AppNavigator from './src/navigation/AppNavigator'; 

function App() {
  // 1. Telefonun temasını al (light, dark, null veya undefined olabilir)
  const scheme = useColorScheme(); 

  // 2. TEMA SEÇİMİ (DÜZELTİLDİ ✅)
  // Basitçe soruyoruz: "Tema dark mı?" 
  // Evetse DarkColors, değilse (light, null, undefined vs.) LightColors kullan.
  const activeTheme = scheme === 'dark' ? Themes.dark : Themes.light;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* Temayı navigasyona gönderiyoruz */}
        <AppNavigator activeTheme={activeTheme} /> 
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;