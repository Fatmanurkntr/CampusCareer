import React, { useState, useEffect, useRef } from 'react';
import { 
    View, Text, StyleSheet, FlatList, StatusBar, SafeAreaView, 
    TextInput, Dimensions, TouchableOpacity, Image, ActivityIndicator, Linking, Alert 
} from 'react-native';
import { ThemeColors } from '../../theme/types';
import JobCard, { JobPost } from '../../components/JobCard'; 
import HorizontalJobCard from '../../components/HorizontalJobCard'; 
import CategoryFilter from '../../components/CategoryFilter'; 
import QuickAccessCard from '../../components/QuickAccessCard'; 
import { useNavigation } from '@react-navigation/native'; 

// SERVİSLER VE YARDIMCILAR
import { fetchJobs, fetchEvents } from '../../services/opportunities';
import { buildSearchQuery } from '../../utils/searchLogic';

interface FeedScreenProps {
  activeTheme: ThemeColors;
}

const { width } = Dimensions.get('window');

const FeedScreen: React.FC<FeedScreenProps> = ({ activeTheme }) => {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null); 
  
  const [selectedCategory, setSelectedCategory] = useState('Tümü'); 
  // 🔥 KOTA KORUMASI: Başlangıçta null yaparak otomatik aramayı engelledik.
  const [activeTopic, setActiveTopic] = useState<string | null>(null); 
  const [searchText, setSearchText] = useState('');
  const [opportunities, setOpportunities] = useState<JobPost[]>([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [hasSearched, setHasSearched] = useState(false); 

  // --- VERİ ÇEKME MANTIĞI ---
  useEffect(() => {
    // 🔥 Eğer kullanıcı bir sektöre tıklamadıysa API'yi çağırma (Kota dostu)
    if (!activeTopic) return;

    const loadData = async () => {
        setOpportunities([]); 
        setIsLoading(true);
        setHasSearched(true);
        
        try {
            let allData: JobPost[] = [];
            
            if (selectedCategory === 'Tümü') {
                // İşler için profesyonel unvan, Etkinlikler için genel sorgu
                const [jobs, events] = await Promise.all([
                    fetchJobs(buildSearchQuery('İş', activeTopic), 'İş'),
                    fetchEvents(buildSearchQuery('Etkinlikler', activeTopic))
                ]);
                // Önce etkinlikleri, sonra iş ilanlarını birleştir
                allData = [...events, ...jobs];
            } 
            else if (selectedCategory === 'Etkinlikler') {
                allData = await fetchEvents(buildSearchQuery('Etkinlikler', activeTopic));
            } 
            else {
                allData = await fetchJobs(buildSearchQuery(selectedCategory, activeTopic), selectedCategory);
            }
            setOpportunities(allData);
        } catch (error) {
            console.error("Yükleme Hatası:", error);
            Alert.alert("Bağlantı Hatası", "Canlı verilere şu an ulaşılamıyor.");
        } finally {
            setIsLoading(false);
        }
    };

    loadData();
  }, [selectedCategory, activeTopic]); 

  // --- ETKİLEŞİMLER ---
  const handleCardPress = (link?: string) => {
      if (link && link.startsWith('http')) {
          Linking.openURL(link).catch(() => Alert.alert('Hata', 'Bağlantı şu an açılamıyor.'));
      } else {
          Alert.alert('Bilgi', 'Doğrudan bağlantı bulunamadı.');
      }
  };

  const handleQuickSearch = (topicName: string) => {
      setSearchText(''); 
      setActiveTopic(topicName); 
      // Arama yapıldığında listeyi en üste kaydır
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Arama barı üzerinden filtreleme
  const filteredList = opportunities.filter(item => {
    const searchLower = searchText.toLowerCase().trim();
    if (!searchLower) return true;
    return (item.title || '').toLowerCase().includes(searchLower) || 
           (item.company || '').toLowerCase().includes(searchLower);
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.background }]}>
      <StatusBar barStyle={activeTheme.background === '#1A1C22' ? 'light-content' : 'dark-content'} />
      
        <FlatList
          ref={flatListRef}
          data={[]} 
          renderItem={null}
          keyExtractor={() => 'main-scroll'}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
              <View>
                {/* 1. HEADER */}
                <View style={styles.headerTop}>
                  <View>
                    <Text style={[styles.greeting, { color: activeTheme.textSecondary }]}>Tekrar Hoş Geldin 👋</Text>
                    <Text style={[styles.title, { color: activeTheme.text }]}>Kariyerini Şekillendir</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.profilePlaceholder, { backgroundColor: activeTheme.surface }]}
                    onPress={() => navigation.navigate('ProfileDetail' as never)}
                  >
                    <Text style={{fontSize: 20}}>👩‍💻</Text>
                  </TouchableOpacity>
                </View>

                {/* 2. ARAMA BARI (Sonuçlar içinde filtreleme) */}
                <View style={[styles.searchContainer, { backgroundColor: activeTheme.surface }]}>
                    <Text style={{ fontSize: 18, marginRight: 10 }}>🔍</Text>
                    <TextInput 
                      placeholder="Sonuçlar içinde filtrele..." 
                      placeholderTextColor={activeTheme.textSecondary}
                      style={[styles.searchInput, { color: activeTheme.text }]}
                      value={searchText}
                      onChangeText={setSearchText}
                    />
                </View>
                
                {/* 3. KATEGORİ FİLTRELERİ */}
                <CategoryFilter 
                    activeTheme={activeTheme} 
                    selectedCategory={selectedCategory} 
                    onSelectCategory={setSelectedCategory} 
                />

                {/* 4. DİNAMİK SONUÇLAR (Sektöre tıklandığında görünür) */}
                {isLoading ? (
                    <View style={styles.statusContainer}>
                        <ActivityIndicator size="large" color={activeTheme.primary} />
                        <Text style={[styles.statusText, { color: activeTheme.textSecondary }]}>Canlı veriler taranıyor...</Text>
                    </View>
                ) : filteredList.length > 0 ? (
                    <View style={styles.sectionContainer}>
                      <Text style={[styles.sectionTitle, { color: activeTheme.text, paddingHorizontal: 20 }]}>
                          {activeTopic} Sonuçları ({filteredList.length})
                      </Text>
                      <FlatList
                        data={filteredList}
                        renderItem={({item}) => (
                            <HorizontalJobCard 
                                item={item} 
                                activeTheme={activeTheme} 
                                onPress={() => handleCardPress(item.link)} 
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
                      />
                    </View>
                ) : hasSearched && activeTopic && (
                    <View style={styles.statusContainer}>
                         <Text style={{ color: activeTheme.textSecondary, textAlign: 'center' }}>
                            "{activeTopic}" için şu an canlı sonuç bulunamadı.{"\n"}Lütfen başka bir sektör deneyin.
                         </Text>
                    </View>
                )}

                {/* 5. SEKTÖR SEÇİMİ (GRID - Arama tetikleyici burası) */}
                <View style={styles.sectionContainer}>
                  <Text style={[styles.sectionTitle, { color: activeTheme.text, paddingHorizontal: 20, marginBottom: 15 }]}>Sektör Seç & Keşfet</Text>
                  <View style={styles.gridContainer}>
                      {[
                          { id: '1', title: 'Yazılım', icon: '💻', color: '#4F46E5' },
                          { id: '2', title: 'Tasarım', icon: '🎨', color: '#EC4899' },
                          { id: '3', title: 'Yapay Zeka', icon: '🤖', color: '#8B5CF6' },
                          { id: '4', title: 'Girişim', icon: '🚀', color: '#F59E0B' },
                          { id: '5', title: 'Oyun Geliş.', icon: '🎮', color: '#10B981' },
                          { id: '6', title: 'Veri Bilimi', icon: '📊', color: '#6366F1' },
                          { id: '7', title: 'Siber Güv.', icon: '🛡️', color: '#EF4444' },
                          { id: '8', title: 'Web3', icon: '⛓️', color: '#3B82F6' },
                          { id: '9', title: 'Pazarlama', icon: '📈', color: '#14B8A6' },
                      ].map((item) => (
                          <View key={item.id} style={styles.gridItemWrapper}>
                              <QuickAccessCard 
                                  title={item.title} icon={item.icon} color={item.color} activeTheme={activeTheme} 
                                  onPress={() => handleQuickSearch(item.title)} 
                              />
                          </View>
                      ))}
                  </View>
                </View>

                {/* 6. POPÜLER ŞİRKETLER */}
                <View style={styles.sectionContainer}>
                  <Text style={[styles.sectionTitle, { color: activeTheme.text, paddingHorizontal: 20, marginBottom: 15 }]}>Popüler Şirketler 🚀</Text>
                  <FlatList 
                      data={[
                        { id: 'c1', name: 'Trendyol', logo: 'https://cdn.webrazzi.com/uploads/2018/06/trendyol-logo-518.png' },
                        { id: 'c2', name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png' },
                        { id: 'c3', name: 'Getir', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Getir_Logo.svg/1200px-Getir_Logo.svg.png' },
                      ]}
                      renderItem={({item}) => (
                        <View style={{ alignItems: 'center', marginRight: 20 }}>
                          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eee', elevation: 2 }}>
                            <Image source={{ uri: item.logo }} style={{ width: 35, height: 35 }} resizeMode="contain" />
                          </View>
                          <Text style={{ fontSize: 12, marginTop: 8, color: activeTheme.text, fontWeight: '500' }}>{item.name}</Text>
                        </View>
                      )}
                      keyExtractor={item => item.id}
                      horizontal showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 20 }}
                  />
                </View>

                {/* 7. KARİYER REHBERİ */}
                <View style={[styles.sectionContainer, { marginBottom: 40 }]}>
                  <Text style={[styles.sectionTitle, { color: activeTheme.text, paddingHorizontal: 20, marginBottom: 15 }]}>Kariyer Rehberi 💡</Text>
                  <FlatList 
                      data={[
                        { id: 'tip1', title: 'Etkili CV Hazırlama', duration: '5 dk', icon: '📄', bg: '#EEF2FF' },
                        { id: 'tip2', title: 'Mülakat Tüyoları', duration: '3 dk', icon: '🎥', bg: '#FFF7ED' },
                      ]}
                      renderItem={({item}) => (
                        <TouchableOpacity style={{ width: 160, height: 160, borderRadius: 24, padding: 16, marginRight: 16, backgroundColor: item.bg, justifyContent: 'space-between', elevation: 2 }}>
                            <Text style={{ fontSize: 28 }}>{item.icon}</Text>
                            <View>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 4 }}>{item.title}</Text>
                                <Text style={{ fontSize: 12, color: '#6B7280' }}>{item.duration} okuma</Text>
                            </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={item => item.id}
                      horizontal showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingHorizontal: 20 }}
                  />
                </View>
              </View>
          }
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 20 },
  headerTop: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 14, marginBottom: 4, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '800' },
  profilePlaceholder: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 24, paddingHorizontal: 15, height: 54, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500' },
  sectionContainer: { marginVertical: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, justifyContent: 'space-between' },
  gridItemWrapper: { width: (width - 60) / 3, marginBottom: 15 },
  statusContainer: { marginVertical: 50, alignItems: 'center', paddingHorizontal: 40 },
  statusText: { marginTop: 12, fontWeight: '600' }
});

export default FeedScreen;