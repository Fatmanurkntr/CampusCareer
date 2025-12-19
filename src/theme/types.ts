// src/theme/types.ts


export interface ThemeColors {
    primary: string;
    background: string; 
    surface: string; 
    text: string; 
    textSecondary: string; 
    success: string;
    border?: string;
    error: string; 
}

export const lightTheme: ThemeColors = {
    primary: '#7C3AED', 
    background: '#F9FAFB', 
    surface: '#FFFFFF', 
    text: '#1F2937', 
    textSecondary: '#6B7280', 
    success: '#10B981',
    error: '#EF4444',
};

export const darkTheme: ThemeColors = {
    primary: '#9D66F9',
    background: '#1A1C22', 
    surface: '#252830', 
    text: '#F9FAFB', 
    textSecondary: '#BCC1C9', 
    success: '#34D399',
    error: '#F87171',
};

export interface ThemeProps {
    activeTheme: ThemeColors;
}