// src/theme/colors.js

// -- LIGHT (NORMAL) MOD İÇİN RENKLER --
const LightColors = {
  primary: '#7C3AED',       // Derin Mor/Violet (Ana Butonlar)
  background: '#F9FAFB',    // Hafif Kirli Beyaz
  surface: '#FFFFFF',       // Kartlar, Alanlar
  text: '#1F2937',          // Koyu Gri Metin
  textSecondary: '#6B7280', // İkincil Metin
  success: '#059669',
  error: '#DC2626',
};

// -- DARK (KOYU) MOD İÇİN RENKLER --
const DarkColors = {
  primary: '#C4A7FF',       // Yumuşak Leylak Moru (Koyu Arka Planda Parlak Görünür)
  background: '#1A1C22',    // Koyu Gri Arka Plan
  surface: '#2C2E35',       // Kartlar, Input alanları
  text: '#F0F2F5',          // Beyazımsı Metin
  textSecondary: '#A0A6B2', // İkincil Metin ve Simgeler
  success: '#4CAF50',
  error: '#F46060',
};

// Tüm temaları bir arada tutan obje
export const Themes = {
  light: LightColors,
  dark: DarkColors,
};