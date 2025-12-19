import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    title: string;
    
    activeTheme?: any; 
    
    isLoading?: boolean;
    disabled?: boolean;
    
    buttonStyle?: ViewStyle; 
    textStyle?: TextStyle;   
}

const CustomButton: React.FC<ButtonProps> = ({ 
    onPress, 
    title, 
    activeTheme, 
    isLoading = false, 
    disabled = false, 
    buttonStyle, 
    textStyle   
}) => {
    
    const defaultTheme = activeTheme || { primary: '#6366F1', background: '#FFFFFF' }; // Varsayılan Mor Tema
    
    const defaultButtonColor = defaultTheme.primary;
    const defaultTextColor = defaultTheme.background; 

    const finalButtonColor = buttonStyle?.backgroundColor || defaultButtonColor;
    const finalTextColor = textStyle?.color || defaultTextColor;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || isLoading}
            style={[
                styles.button,
                { backgroundColor: finalButtonColor }, 
                (disabled || isLoading) && styles.disabled, 
                buttonStyle, 
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={finalTextColor} size="small" />
            ) : (
                <Text style={[styles.text, { color: finalTextColor }, textStyle]}> 
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
        opacity: 0.6, 
    },
});

export default CustomButton;