# CampusCareer
### Üniversite Öğrencileri İçin Entegre Kariyer ve Etkinlik Yönetim Sistemi

[cite_start]CampusCareer, üniversite öğrencilerinin ve yeni mezunların staj, iş ilanları ve teknik gelişim etkinliklerine (hackathon, bootcamp, workshop vb.) tek bir platform üzerinden erişebilmesini sağlayan React Native tabanlı bir mobil uygulamadır[cite: 9, 10, 24].

## Proje Amacı
[cite_start]Günümüzde öğrenciler, kariyer fırsatlarını takip ederken platform kirliliği ve odaklanma sorunu yaşamaktadır[cite: 22, 72]. [cite_start]CampusCareer, iş dünyası ile gelişim ekosistemini tek bir çatı altında birleştirerek kullanıcılara ilgi alanlarına göre özelleştirilmiş ve denetlenmiş bir kariyer akışı sunmayı amaçlar[cite: 73, 76, 95].

## Kullanılan Teknolojiler (Tech Stack)
* [cite_start]**Frontend:** React Native ve TypeScript kullanılarak çapraz platform desteği sağlanmıştır[cite: 25, 77, 249].
* [cite_start]**Backend:** Sunucusuz mimari (Serverless) yaklaşımıyla Google Firebase (Cloud Firestore ve Authentication) kullanılmıştır[cite: 26, 78, 251].
* [cite_start]**Durum Yönetimi:** Uygulama genelinde oturum ve tema yönetimi için Context API tercih edilmiştir[cite: 182, 253].
* [cite_start]**API Entegrasyonları:** Dinamik veri akışı için RapidAPI (JSearch) ve SerpApi (Google Events) servisleri entegre edilmiştir[cite: 27, 49, 233].
* [cite_start]**Bildirim Sistemi:** Notifee ve Firebase Cloud Messaging altyapısı kullanılmıştır[cite: 230].

## Yazılım Mimarisi
[cite_start]Proje, mantıksal katmanların birbirinden ayrıldığı **MVVM (Model-View-ViewModel)** tasarım deseni ve **Bileşen Tabanlı Mimari** üzerine kurgulanmıştır[cite: 25, 44, 177]:
* [cite_start]**Model:** Firestore ve dış API servisleri üzerinden veri yönetimini üstlenir[cite: 178].
* [cite_start]**View:** Kullanıcı odaklı ve minimalist arayüz bileşenlerini içerir[cite: 28, 180].
* [cite_start]**ViewModel:** İş mantığının ve uygulama durumunun (AuthContext vb.) yönetildiği katmandır[cite: 182, 183].

## Temel Özellikler
* [cite_start]**Rol Tabanlı Erişim Kontrolü (RBAC):** Öğrenci, Firma ve Admin rolleri için ayrıştırılmış yetki ve arayüzler sunulur[cite: 29, 30, 97].
* [cite_start]**Admin Onay Mekanizması:** Sisteme girilen ilanların yönetici denetiminden geçmeden yayına alınmaması sayesinde yüksek içerik kalitesi sağlanır[cite: 31, 116, 147].
* [cite_start]**Semantik Arama:** Kullanıcının Türkçe aramalarını global API parametrelerine dönüştüren akıllı sorgu mantığı geliştirilmiştir[cite: 240, 243].
* [cite_start]**Akıllı Takip:** Başvurulan ve favoriye alınan ilanlar için gerçek zamanlı senkronizasyon desteği mevcuttur[cite: 112, 188, 220].

## Yazılım Kalitesi ve Test Süreçleri
* [cite_start]**Birim Testler:** Jest kütüphanesi kullanılarak çekirdek iş mantığı üzerinde 33 kritik fonksiyon başarıyla test edilmiştir[cite: 56, 288, 291].
* [cite_start]**Statik Kod Analizi:** SonarQube entegrasyonu ile Güvenlik ve Bakım Yapılabilirlik kategorilerinde en yüksek not olan **A derecesi** alınmıştır[cite: 63, 316, 324].
* [cite_start]**Kod Kalitesi:** Modüler yapı sayesinde kod tekrarı oranı %0.3 seviyesinde tutulmuştur[cite: 315, 324].
* [cite_start]**API Testleri:** Postman platformu üzerinden servis uç noktalarının veri bütünlüğü ve hata kodları doğrulanmıştır[cite: 58, 297, 303].

## Kurulum
1. Proje deposunu yerel makinenize klonlayın.
2. `npm install` komutu ile gerekli bağımlılıkları yükleyin.
3. Firebase konfigürasyon dosyalarını (google-services.json) ilgili dizinlere yerleştirin.
4. `npx react-native run-android` veya `run-ios` komutu ile uygulamayı başlatın.

## Proje Ekibi
* [cite_start]**Sevde Gül Şahin:** Proje Yönetimi, API Orkestrasyonu, Admin Paneli[cite: 14].
* [cite_start]**Süeda Nur Sarıcan:** Firebase Entegrasyonu, Kimlik Doğrulama süreçleri, UI Geliştirme[cite: 15].
* [cite_start]**Fatımanur Kantar:** Veri Modelleme, Test süreçleri, Dokümantasyon[cite: 16].

---
[cite_start]*Bu çalışma BİL403 Yazılım Mühendisliği dersi dönem projesi kapsamında hazırlanmıştır[cite: 5, 6].*
