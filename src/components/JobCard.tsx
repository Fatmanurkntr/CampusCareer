import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { ThemeColors } from '../theme/types';
import { getAvatarStyle, getInitials } from '../utils/uiHelpers';

export interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  logoUrl: string;
  postedAt: string;
  link?: string;
  deadlineDate?: string;
  date?: string;
}

interface JobCardProps {
  item: JobPost;
  activeTheme: ThemeColors;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  item,
  activeTheme,
  onPress,
  onFavoritePress,
  isFavorite = false
}) => {
  const avatarStyle = getAvatarStyle(item.company || '');
  const hasLogo = item.logoUrl && typeof item.logoUrl === 'string' && item.logoUrl.length > 10;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: activeTheme.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.logoContainer,
        { backgroundColor: hasLogo ? '#FFF' : avatarStyle.bg }
      ]}>
        {hasLogo ? (
          <Image source={{ uri: item.logoUrl }} style={styles.logo} resizeMode="contain" />
        ) : (
          <Text style={{ color: avatarStyle.text, fontWeight: 'bold', fontSize: 18 }}>
            {getInitials(item.company)}
          </Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: activeTheme.text, flex: 1 }]} numberOfLines={1}>
            {item.title}
          </Text>

          <TouchableOpacity
            onPress={onFavoritePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather
              name="heart"
              size={24}
              color={isFavorite ? "#EF4444" : activeTheme.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.company, { color: activeTheme.textSecondary }]}>
          {item.company} • {item.location}
        </Text>

        <View style={styles.footer}>
          <View style={[styles.badge, { backgroundColor: activeTheme.background }]}>
            <Text style={[styles.badgeText, { color: activeTheme.primary }]}>{item.type}</Text>
          </View>
          <TouchableOpacity
            style={[styles.applyBtn, { backgroundColor: activeTheme.primary + '15' }]}
            onPress={onPress}
          >
            <Text style={[styles.applyText, { color: activeTheme.primary }]}>Detayları Gör</Text>
            <Feather name="chevron-right" size={14} color={activeTheme.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 16, marginBottom: 12, borderRadius: 16, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, marginHorizontal: 2 },
  logoContainer: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  logo: { width: 32, height: 32 },
  infoContainer: { flex: 1, justifyContent: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '700', marginRight: 8 },
  company: { fontSize: 13, marginBottom: 10, fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  applyBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 4 },
  applyText: { fontSize: 12, fontWeight: '700' }
});

export default JobCard;