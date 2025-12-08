// src/components/CustomButton.tsx

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Tema ve stil tiplerini tanımla
interface ButtonProps {
  onPress: () => void;
  title: string;
  activeTheme: any; // activeTheme objesi (mor/koyu renkler)
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const CustomButton: React.FC<ButtonProps> = ({ 
  onPress, 
  title, 
  activeTheme, 
  isLoading = false, 
  disabled = false, 
  style 
}) => {
  const buttonColor = activeTheme.primary;
  const textColor = activeTheme.background; // Koyu mor üstünde açık renkli yazı

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        { backgroundColor: buttonColor },
        (disabled || isLoading) && styles.disabled, // Pasif/yükleniyor durumu
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6, // Yükleniyor veya pasifken rengi soluklaştır
  },
});

export default CustomButton;