import React from 'react';
import AuthStack from './AuthStack';
// @ts-ignore
import HomeScreen from '../screens/HomeScreen'; // Senin oluşturduğun sayfa
import { ThemeProps } from '../theme/types';

// Yeni bir prop ekledik: "user" (Kullanıcı var mı yok mu?)
interface AppNavigatorProps extends ThemeProps {
  user: any;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ activeTheme, user }) => {

  // MANTIK: Kullanıcı varsa Home, yoksa Login göster
  return (
    user ? (
      <HomeScreen activeTheme={activeTheme} />
    ) : (
      <AuthStack activeTheme={activeTheme} />
    )
  );
};

export default AppNavigator;