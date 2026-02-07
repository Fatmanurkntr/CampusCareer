# CampusCareer
### Üniversite Öğrencileri İçin Entegre Kariyer ve Etkinlik Yönetim Sistemi

CampusCareer, üniversite öğrencilerinin ve yeni mezunların staj, iş ilanları ve teknik gelişim etkinliklerine (hackathon, bootcamp, workshop vb.) tek bir platform üzerinden erişebilmesini sağlayan React Native tabanlı bir mobil uygulamadır.

## Proje Amacı
Günümüzde öğrenciler, kariyer fırsatlarını takip ederken platform kirliliği ve odaklanma sorunu yaşamaktadır. CampusCareer, iş dünyası ile gelişim ekosistemini tek bir çatı altında birleştirerek kullanıcılara ilgi alanlarına göre özelleştirilmiş ve denetlenmiş bir kariyer akışı sunmayı amaçlar.

## Kullanılan Teknolojiler (Tech Stack)
* Frontend: React Native ve TypeScript kullanılarak çapraz platform desteği sağlanmıştır.
* Backend: Sunucusuz mimari (Serverless) yaklaşımıyla Google Firebase (Cloud Firestore ve Authentication) kullanılmıştır.
* Durum Yönetimi: Uygulama genelinde oturum ve tema yönetimi için Context API tercih edilmiştir.
* API Entegrasyonları: Dinamik veri akışı için RapidAPI (JSearch) ve SerpApi (Google Events) servisleri entegre edilmiştir.
* Bildirim Sistemi: Notifee ve Firebase Cloud Messaging altyapısı kullanılmıştır.

## Yazılım Mimarisi
Proje, mantıksal katmanların birbirinden ayrıldığı MVVM (Model-View-ViewModel) tasarım deseni ve Bileşen Tabanlı Mimari üzerine kurgulanmıştır:
* Model: Firestore ve dış API servisleri üzerinden veri yönetimini üstlenir.
* View: Kullanıcı odaklı ve minimalist arayüz bileşenlerini içerir.
* ViewModel: İş mantığının ve uygulama durumunun (AuthContext vb.) yönetildiği katmandır.



## Temel Özellikler
* Rol Tabanlı Erişim Kontrolü (RBAC): Öğrenci, Firma ve Admin rolleri için ayrıştırılmış yetki ve arayüzler sunulur.
* Admin Onay Mekanizması: Sisteme girilen ilanların yönetici denetiminden geçmeden yayına alınmaması sayesinde yüksek içerik kalitesi sağlanır.
* Semantik Arama: Kullanıcının Türkçe aramalarını global API parametrelerine dönüştüren akıllı sorgu mantığı geliştirilmiştir.
* Akıllı Takip: Başvurulan ve favoriye alınan ilanlar için gerçek zamanlı senkronizasyon desteği mevcuttur.



## Yazılım Kalitesi ve Test Süreçleri
* Birim Testler: Jest kütüphanesi kullanılarak çekirdek iş mantığı üzerinde 33 kritik fonksiyon başarıyla test edilmiştir.
* Statik Kod Analizi: SonarQube entegrasyonu ile Güvenlik ve Bakım Yapılabilirlik kategorilerinde en yüksek not olan A derecesi alınmıştır.
* Kod Kalitesi: Modüler yapı sayesinde kod tekrarı oranı %0.3 seviyesinde tutulmuştur.
* Hata Yönetimi: Geliştirme sürecinde tespit edilen teknik hatalar (id undefined, onaysız ilan gösterimi vb.) dökümante edilmiş ve sprint süreçlerinde çözümlenmiştir.
  

<img width="981" height="556" alt="Ekran görüntüsü 2026-02-07 191858" src="https://github.com/user-attachments/assets/903e276b-dd3c-4931-9e32-6bbe1596a3fd" />
<img width="814" height="462" alt="Ekran görüntüsü 2026-02-07 191850" src="https://github.com/user-attachments/assets/eec0dc14-acbe-4673-a96d-525111aeb7a9" />

<img width="891" height="503" alt="Ekran görüntüsü 2026-02-07 191906" src="https://github.com/user-attachments/assets/ce80352b-2d27-4c54-9eb1-511bf60613c9" />
<img width="671" height="594" alt="Ekran görüntüsü 2026-02-07 191916" src="https://github.com/user-attachments/assets/f2c92242-c156-4ad1-992e-146267e0bac2" />





## Kurulum
1. Proje deposunu yerel makinenize klonlayın.
2. npm install komutu ile gerekli bağımlılıkları yükleyin.
3. Firebase konfigürasyon dosyalarını (google-services.json) ilgili dizinlere yerleştirin.
4. npx react-native run-android veya run-ios komutu ile uygulamayı başlatın.

## Proje Ekibi
* Sevde Gül Şahin: Proje Yönetimi, API Orkestrasyonu, Admin Paneli.
* Süeda Nur Sarıcan: Firebase Entegrasyonu, Kimlik Doğrulama süreçleri, UI Geliştirme.
* Fatımanur Kantar: Veri Modelleme, Test süreçleri, Dokümantasyon.

---
Bu çalışma BİL403 Yazılım Mühendisliği dersi dönem projesi kapsamında hazırlanmıştır.
