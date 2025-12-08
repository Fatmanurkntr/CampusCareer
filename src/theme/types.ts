// src/theme/types.ts

// Renklerin yapısını tanımlıyoruz
export interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  success: string;
  error: string;
}

// Bir sayfaya tema gönderilirken kullanılacak yapı
export interface ThemeProps {
  activeTheme: ThemeColors;
}