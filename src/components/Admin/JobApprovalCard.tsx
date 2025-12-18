import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeColors } from '../../theme/types';

// Kartın alacağı veri tipi
export interface PendingJob {
  id: string;
  title: string;
  company: string;
  postedBy: string; // İlanı giren öğrenci
  date: string;
  description: string;
}

interface Props {
  item: PendingJob;
  activeTheme: ThemeColors;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const JobApprovalCard: React.FC<Props> = ({ item, activeTheme, onApprove, onReject }) => {
  return (
    <View style={[styles.card, { backgroundColor: activeTheme.surface }]}>
      
      {/* Üst Bilgi */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: activeTheme.text }]}>{item.title}</Text>
            <Text style={[styles.company, { color: activeTheme.textSecondary }]}>{item.company}</Text>
        </View>
        <Text style={styles.date}>{item.date}</Text>
      </View>

      <Text style={[styles.user, { color: activeTheme.primary }]}>👤 {item.postedBy}</Text>
      
      <Text style={[styles.desc, { color: activeTheme.textSecondary }]} numberOfLines={2}>
        {item.description}
      </Text>

      {/* Aksiyon Butonları */}
      <View style={styles.actions}>
        <TouchableOpacity 
            style={[styles.btn, styles.btnReject]} 
            onPress={() => onReject(item.id)}
        >
            <Text style={styles.btnText}>Reddet ❌</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.btn, styles.btnApprove]} 
            onPress={() => onApprove(item.id)}
        >
            <Text style={styles.btnText}>Onayla ✅</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    // Hafif gölge
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  company: { fontSize: 14, fontWeight: '500' },
  date: { fontSize: 12, color: '#9CA3AF' },
  user: { fontSize: 12, fontWeight: '600', marginTop: 8, marginBottom: 4 },
  desc: { fontSize: 13, lineHeight: 18, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 12 },
  btn: { 
    flex: 1, paddingVertical: 10, borderRadius: 8, 
    alignItems: 'center', justifyContent: 'center' 
  },
  btnReject: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#EF4444' },
  btnApprove: { backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#22C55E' },
  btnText: { fontWeight: '700', fontSize: 13, color: '#000' }
});

export default JobApprovalCard;