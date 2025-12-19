// src/navigation/AuthStack.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen'; 
import CompanyLoginScreen from '../screens/Auth/CompanyLoginScreen'; // 👈 YENİ IMPORT

import { ThemeProps } from '../theme/types'; 


const Stack = createNativeStackNavigator();

const AuthStack: React.FC<ThemeProps> = ({ activeTheme }) => {
  return (
    <Stack.Navigator>
      
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        initialParams={{ activeTheme }} 
        options={{ 
          headerShown: false, 
          navigationBarColor: activeTheme.background 
        }} 
      />

      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        initialParams={{ activeTheme }} 
        options={{ 
          headerShown: false, 
          navigationBarColor: activeTheme.background 
        }} 
      />

      <Stack.Screen 
        name="CompanyLogin" 
        component={CompanyLoginScreen} 
        initialParams={{ activeTheme }} 
        options={{ 
          headerShown: false, 
          navigationBarColor: activeTheme.background 
        }} 
      />

    </Stack.Navigator>
  );
};

export default AuthStack;