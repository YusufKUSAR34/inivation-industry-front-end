# Havayolu Rota Yönetim Sistemi - Frontend

## Kullanılan Teknolojiler

- Kullanıcı arayüzü geliştirmesi için **React 18** ve TypeScript
- Bileşen tasarımı ve tema yönetimi için **Material UI (MUI) v5**
- Sayfa yönlendirme ve gezinme için **React Router v6**
- Durum yönetimi için **Redux Toolkit**
- HTTP istekleri için **Axios**
- Geliştirme sunucusu ve derleme aracı olarak **Vite**

## Özellikler

### Kimlik Doğrulama
- JWT tabanlı kimlik doğrulama sistemi
- Giriş ve Kayıt sayfaları
- Korumalı rotalar ve kimlik doğrulama kontrolleri
- Otomatik token yenileme mekanizması
- localStorage'da güvenli token saklama

### Lokasyon Yönetimi
- Tüm lokasyonları görüntüleme (havaalanları ve şehir noktaları)
- İsim, şehir ve ülke bilgilerini içeren lokasyon detayları
- Lokasyon arama ve filtreleme

### Ulaşım Yönetimi
- Ulaşım araçları için CRUD (Oluşturma, Okuma, Güncelleme, Silme) işlemleri
- Uçuş ve diğer ulaşım türleri desteği
- Kalkış ve varış lokasyonu seçimi
- Ulaşım verisi için doğrulama kontrolleri

### Rota Yönetimi
- Lokasyonlar arası rota arama
- Gelişmiş rota doğrulama kuralları:
  - Her rotada en fazla 3 ulaşım aracı
  - Her rotada tam olarak 1 uçuş
  - Uçuş öncesi ve sonrasında sadece OTHER tipinde ulaşım araçları
  - Uçuş öncesi ve sonrasında en fazla birer transfer
  - Ulaşım araçları arasında geçerli bağlantılar
- İnteraktif rota detay görünümü:
  - Uçuş öncesi, ana uçuş ve uçuş sonrası için ayrı bölümler
  - Toplam durak, süre ve fiyat bilgileri
  - Hata yönetimi ve doğrulama geri bildirimi

## Proje Yapısı

```
aviation-frontend/
├── src/
│   ├── components/        # Yeniden kullanılabilir UI bileşenleri
│   ├── pages/            # Sayfa bileşenleri
│   ├── services/         # API servis katmanı
│   ├── store/           # Redux store yapılandırması
│   │   └── slices/      # Redux dilimleri
│   ├── types/           # TypeScript tip tanımlamaları
│   └── utils/           # Yardımcı fonksiyonlar
├── public/              # Statik dosyalar
└── package.json         # Proje bağımlılıkları
```

## Temel Bileşenler

### Sayfalar
- **LoginPage**: Kullanıcı kimlik doğrulama
- **LocationsPage**: Lokasyon yönetimi
- **TransportationsPage**: Ulaşım yönetimi
- **RoutesPage**: Rota arama ve görüntüleme

### Servisler
- **authService**: Kimlik doğrulama API çağrıları
- **locationService**: Lokasyon ile ilgili API çağrıları
- **transportationService**: Ulaşım ile ilgili API çağrıları
- **routeService**: Rota ile ilgili API çağrıları

### Yardımcı Araçlar
- **apiInterceptor**: JWT token yönetimi ile Axios örneği
- **validationUtils**: Frontend doğrulama yardımcıları

## Doğrulama Kuralları

### Rota Arama Doğrulaması
- Kalkış ve varış lokasyonları zorunlu
- Kalkış ve varış lokasyonları aynı olamaz
- Kullanıcı dostu API hata mesajları

### Rota Doğrulaması
1. Ulaşım Sayısı
   - En fazla 3 ulaşım aracı
   - En az 1 ulaşım aracı (uçuş)

2. Uçuş Gereksinimleri
   - Her rotada tam olarak bir uçuş
   - Uçuş, istenen kalkış ve varış noktalarını bağlamalı

3. Transfer Kuralları
   - Uçuş öncesi en fazla bir transfer
   - Uçuş sonrası en fazla bir transfer
   - Transferler sadece OTHER tipinde olabilir

4. Bağlantı Doğrulaması
   - Her ulaşım aracının varış noktası, sonraki ulaşım aracının kalkış noktası ile eşleşmeli

## Hata Yönetimi

- Anında geri bildirimli form doğrulaması
- Kullanıcı dostu API hata mesajları
- Rota detaylarında ayrıntılı doğrulama hatası gösterimi
- Net hata durumu yönetimi

## Kullanıcı Arayüzü Özellikleri

- Tüm ekran boyutları için uyumlu tasarım
- Hover efektli interaktif tablolar
- Detaylı bilgi için yandan açılır panel
- Net hata mesajları
- Yükleme durumu göstergeleri
- Tutarlı Material UI tasarımı

## Başlangıç

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Ortam değişkenlerini ayarlayın:
```bash
cp .env.example .env
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Üretim için derleyin:
```bash
npm run build
```

## Ortam Değişkenleri

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

