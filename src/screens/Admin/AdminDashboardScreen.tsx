// src/screens/Admin/AdminDashboardScreen.tsx

import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    SafeAreaView, 
    TouchableOpacity, 
    Alert, 
    StatusBar,
    TextInput,
    Image
} from 'react-native';
import { ThemeColors } from '../../theme/types';
import { useNavigation } from '@react-navigation/native';

// 🛠️ TİP TANIMI VE MOCK DATA
interface PendingItem {
  id: string;
  type: 'job' | 'internship' | 'event';
  title: string;
  organization: string;
  postedBy: string;
  date: string;
  description: string;
}

const INITIAL_DATA: PendingItem[] = [
  { id: '1', type: 'internship', title: 'React Native Stajyeri', organization: 'SoftTech', postedBy: 'Ahmet Yılmaz', date: '10 dk önce', description: 'React Native konusunda hevesli stajyer arıyoruz.' },
  { id: '2', type: 'event', title: 'Yazılım Zirvesi 2025', organization: 'Kodluyoruz', postedBy: 'Selin Demir', date: '20 Ara, 14:00', description: 'Sektörün liderleriyle buluşma etkinliği.' },
  { id: '3', type: 'job', title: 'Backend Geliştirici', organization: 'Global IT', postedBy: 'Mehmet Öz', date: 'Dün', description: 'Node.js ve MongoDB tecrübesi olan uzman aranıyor.' },
  { id: '4', type: 'event', title: 'Blockchain Workshop', organization: 'Web3 TR', postedBy: 'Canan Dağ', date: '25 Ara, 10:00', description: 'Ethereum geliştirme üzerine uygulamalı atölye.' },
  { id: '5', type: 'internship', title: 'Grafik Tasarım', organization: 'Ajans 360', postedBy: 'Emre Can', date: '3 gün önce', description: 'Photoshop ve Illustrator bilen stajyer.' },
];

interface Props {
  activeTheme: ThemeColors;
}

// --- İSTATİSTİK KARTI ---
const StatCard = ({ label, count, color, bg, activeTheme }: any) => (
    <View style={[styles.statCard, { backgroundColor: activeTheme.surface }]}>
        <View style={[styles.statIconBadge, { backgroundColor: bg }]}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: color }}>{count}</Text>
        </View>
        <Text style={{ fontSize: 12, color: activeTheme.textSecondary, marginTop: 8, fontWeight: '600' }}>{label}</Text>
    </View>
);

const AdminDashboardScreen: React.FC<Props> = ({ activeTheme }) => {
  const navigation = useNavigation();
  
  const [items, setItems] = useState<PendingItem[]>(INITIAL_DATA);
  const [approvedItems, setApprovedItems] = useState<PendingItem[]>([]);
  const [rejectedItems, setRejectedItems] = useState<PendingItem[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchText, setSearchText] = useState('');

  // --- İŞLEMLER ---
  const handleApprove = (id: string) => {
    const item = items.find(j => j.id === id);
    if (item) {
        setApprovedItems(prev => [item, ...prev]);
        setItems(prev => prev.filter(j => j.id !== id));
    }
  };

  const handleReject = (id: string) => {
    const item = items.find(j => j.id === id);
    if (item) {
        setRejectedItems(prev => [item, ...prev]);
        setItems(prev => prev.filter(j => j.id !== id));
    }
  };

  const getTypeBadge = (type: string) => {
      switch(type) {
          case 'event': return { label: 'Etkinlik 🎉', bg: '#F3E8FF', color: '#9333EA' };
          case 'internship': return { label: 'Staj 🎓', bg: '#EFF6FF', color: '#2563EB' };
          default: return { label: 'İş İlanı 💼', bg: '#ECFDF5', color: '#059669' };
      }
  };

  const getFilteredList = () => {
    let list = activeTab === 'pending' ? items : activeTab === 'approved' ? approvedItems : rejectedItems;
    if (!searchText) return list;
    return list.filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()) || item.organization.toLowerCase().includes(searchText.toLowerCase()));
  };

  // --- KART RENDER ---
  const renderCard = ({ item }: { item: PendingItem }) => {
    const badge = getTypeBadge(item.type);
    return (
        <View style={[styles.card, { backgroundColor: activeTheme.surface }]}>
            <View style={styles.cardHeader}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={[styles.cardTitle, { color: activeTheme.text }]}>{item.title}</Text>
                    <Text style={[styles.cardOrg, { color: activeTheme.textSecondary }]}>{item.organization}</Text>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: badge.bg }]}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: badge.color }}>{badge.label}</Text>
                </View>
            </View>
            <Text style={[styles.cardDesc, { color: activeTheme.textSecondary }]} numberOfLines={2}>{item.description}</Text>
            <View style={styles.divider} />
            <View style={styles.cardFooter}>
                <View>
                    <View style={styles.userInfo}>
                        <Text style={{ fontSize: 12 }}>👤</Text>
                        <Text style={[styles.userName, { color: activeTheme.textSecondary }]}>{item.postedBy}</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                        {item.type === 'event' ? '🗓️ ' : '🕒 '}{item.date}
                    </Text>
                </View>
                {activeTab === 'pending' && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#FEE2E2' }]} onPress={() => handleReject(item.id)}>
                            <Text style={{ fontSize: 14 }}>✕</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#DCFCE7', marginLeft: 10 }]} onPress={() => handleApprove(item.id)}>
                            <Text style={{ fontSize: 14 }}>✓</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {activeTab !== 'pending' && (
                     <View style={[styles.statusTag, { backgroundColor: activeTab === 'approved' ? '#DCFCE7' : '#FEE2E2' }]}>
                        <Text style={{ color: activeTab === 'approved' ? '#166534' : '#991B1B', fontSize: 12, fontWeight: '700' }}>
                            {activeTab === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                        </Text>
                     </View>
                )}
            </View>
        </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
      <StatusBar barStyle={activeTheme.background === '#1A1C22' ? 'light-content' : 'dark-content'} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={{ fontSize: 22, color: activeTheme.text }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: activeTheme.text }]}>Panel</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={getFilteredList()}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        
        ListHeaderComponent={
            <View style={{ paddingHorizontal: 20 }}>
                {/* İSTATİSTİKLER */}
                <View style={styles.statsRow}>
                    <StatCard activeTheme={activeTheme} label="Bekleyen" count={items.length} color="#F59E0B" bg="#FEF3C7" />
                    <StatCard activeTheme={activeTheme} label="Onaylı" count={approvedItems.length} color="#10B981" bg="#D1FAE5" />
                    <StatCard activeTheme={activeTheme} label="Red" count={rejectedItems.length} color="#EF4444" bg="#FEE2E2" />
                </View>

                {/* ARAMA */}
                <View style={[styles.searchBox, { backgroundColor: activeTheme.surface }]}>
                    <Text style={{ fontSize: 16, color: activeTheme.primary }}>🔍</Text> 
                    <TextInput 
                        placeholder="Ara..."
                        placeholderTextColor={activeTheme.textSecondary}
                        style={[styles.searchInput, { color: activeTheme.text }]}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                {/* TABS - 🔥 GÜNCELLENDİ: Lacivert yerine Mor Tema Rengi */}
                <View style={styles.tabsWrapper}>
                    {['pending', 'approved', 'rejected'].map(tab => (
                        <TouchableOpacity 
                            key={tab}
                            style={[
                                styles.tabItem, 
                                activeTab === tab && { backgroundColor: activeTheme.primary } // 🔥 BURASI DEĞİŞTİ
                            ]}
                            onPress={() => setActiveTab(tab as any)}
                        >
                            <Text style={[styles.tabText, { color: activeTab === tab ? '#FFF' : activeTheme.textSecondary }]}>
                                {tab === 'pending' ? 'Bekleyen' : tab === 'approved' ? 'Onaylı' : 'Geçmiş'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        }
        renderItem={renderCard}
        ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 60, opacity: 0.5 }}>
                <Text style={{ fontSize: 40, marginBottom: 10 }}>📭</Text>
                <Text style={{ color: activeTheme.text }}>Kayıt bulunamadı</Text>
            </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  backBtn: { padding: 5 },

  // İSTATİSTİK
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { 
    width: '31%', paddingVertical: 15, borderRadius: 16, alignItems: 'center',
    shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity:0.03, elevation:2
  },
  statIconBadge: {
    width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 4
  },

  // ARAMA
  searchBox: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 48, borderRadius: 14, marginBottom: 20
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, fontWeight: '500' },

  // TABS
  tabsWrapper: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.04)', padding: 4, borderRadius: 12, marginBottom: 20 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10 },
  // activeTabItem stili kaldırıldı, artık dinamik olarak veriliyor.
  tabText: { fontSize: 13, fontWeight: '600' },

  // KART
  card: {
    marginHorizontal: 20, marginBottom: 16, padding: 16, borderRadius: 20,
    shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity:0.05, elevation:3
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardOrg: { fontSize: 13, fontWeight: '500' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  cardDesc: { marginTop: 12, fontSize: 13, lineHeight: 19 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginVertical: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  userName: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
  actionButtons: { flexDirection: 'row' },
  iconBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  statusTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }
});

export default AdminDashboardScreen;