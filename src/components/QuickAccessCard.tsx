// src/components/QuickAccessCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ThemeColors } from '../theme/types';

const { width } = Dimensions.get('window');
const CARD_SIZE = width * 0.28;

interface QuickAccessProps {
  title: string;
  icon: any;
  color: string;
  activeTheme: ThemeColors;
  onPress: () => void;
}

const QuickAccessCard: React.FC<QuickAccessProps> = ({ title, icon, color, activeTheme, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.circleDecoration} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%', 
    aspectRatio: 1, 
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',

    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  content: {
    zIndex: 2,
    alignItems: 'center', 
  },
  icon: {
    fontSize: 28, 
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center', 
  },
  circleDecoration: {
    position: 'absolute',
    top: -10,
    left: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    zIndex: 1,
  },
});

export default QuickAccessCard;