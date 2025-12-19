import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { ThemeColors } from '../theme/types';
import { JobPost } from './JobCard';
import { getAvatarStyle, getInitials } from '../utils/uiHelpers';

interface HorizontalJobCardProps {
  item: JobPost;
  activeTheme: ThemeColors;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

const HorizontalJobCard: React.FC<HorizontalJobCardProps> = ({
  item,
  activeTheme,
  onPress,
  onFavoritePress,
  isFavorite = false
}) => {
  const avatarStyle = getAvatarStyle(item.company || '');

  // Sadece gerçek ve uzunluğu yeterli bir link varsa logo göster
  const hasLogo = item.logoUrl && typeof item.logoUrl === 'string' && item.logoUrl.length > 10;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: activeTheme.surface }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <View style={[
          styles.logoContainer,
          { backgroundColor: hasLogo ? '#FFF' : avatarStyle.bg }
        ]}>
          {hasLogo ? (
            <Image
              source={{ uri: item.logoUrl as string }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <Text style={{ color: avatarStyle.text, fontWeight: '700', fontSize: 16 }}>
              {getInitials(item.company || '')}
            </Text>
          )}
        </View>

        <View style={styles.headerRight}>
          <View style={[styles.badge, { backgroundColor: activeTheme.primary + '15' }]}>
            <Text style={[styles.badgeText, { color: activeTheme.primary }]}>{item.type}</Text>
          </View>

          <TouchableOpacity
            style={[styles.favBtn, { backgroundColor: activeTheme.background }]}
            onPress={onFavoritePress}
          >
            <Feather
              name="heart"
              size={18}
              color={isFavorite ? "#EF4444" : activeTheme.textSecondary}

            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: activeTheme.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.company, { color: activeTheme.textSecondary }]}>
          {item.company} • {item.location}
        </Text>
      </View>
      <View style={[
        styles.footer,
        activeTheme.border ? { borderTopColor: activeTheme.border } : { borderTopColor: 'rgba(0,0,0,0.05)' }
      ]}>

        <Text style={[styles.date, { color: activeTheme.textSecondary, flex: 1, marginRight: 10 }]} numberOfLines={1}>
          {item.date || item.postedAt}
        </Text>
        <TouchableOpacity
          onPress={onPress}
          style={[styles.applyBtn, { backgroundColor: activeTheme.primary }]}
        >
          <Text style={styles.applyBtnText}>Detayları Gör</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { width: CARD_WIDTH, padding: 16, marginRight: 16, borderRadius: 24, elevation: 3, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoContainer: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  logo: { width: 36, height: 36 },
  favBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  badge: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  content: { marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '800', marginBottom: 6, letterSpacing: -0.5 },
  company: { fontSize: 14, fontWeight: '500' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1 },
  date: { fontSize: 12, fontWeight: '500' },
  applyBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 14 },
  applyBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' }
});

export default HorizontalJobCard;