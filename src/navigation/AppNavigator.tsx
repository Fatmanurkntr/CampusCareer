// src/navigation/AppNavigator.tsx

import React from 'react';
import AuthStack from './AuthStack';
// Tip dosyasını içeri aktar
import { ThemeProps } from '../theme/types'; 

// import MainTabs from './MainTabs'; // Ana sayfa navigasyonu (Daha sonra eklenecek)

// "AppNavigator" bileşenine "ThemeProps" tipini atadık
const AppNavigator: React.FC<ThemeProps> = ({ activeTheme }) => {
  
  // TODO: Gelecek sprintlerde bu kısma Firebase'den kullanıcının giriş yapıp yapmadığı kontrolü gelecek.
  const userLoggedIn = false; // Şimdilik hep Login ekranına gitsin.

  return (
    // Eğer kullanıcı giriş yapmadıysa AuthStack'i gösterir.
    <AuthStack activeTheme={activeTheme} /> 
  );
};

export default AppNavigator;