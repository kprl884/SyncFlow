# 🚀 SyncFlow - Proje Yönetim Aracı

SyncFlow, modern ekipler için tasarlanmış kapsamlı bir proje yönetim aracıdır. Kanban board, sprint yönetimi, raporlama ve notlar sistemi ile projelerinizi etkili bir şekilde yönetin.

## ✨ Özellikler

### 🎯 **Kanban Board**
- Sürükle-bırak ile görev yönetimi
- Özelleştirilebilir sütunlar (To Do, In Progress, Done)
- Görev detayları ve açıklamaları
- Blocker yönetimi
- Üye atama ve yönetimi
- Standup kontrolleri

### 📊 **Sprint Yönetimi**
- Sprint planlama ve takibi
- Velocity analizi
- Sprint retrospektifleri
- Görev-sprint ilişkilendirmesi

### 📈 **Raporlama Sistemi**
- Sprint performans metrikleri
- Takım verimliliği analizi
- Burndown chart'ları
- Trend analizleri

### 📝 **Notlar Sistemi**
- Kategorilere göre not organizasyonu
- Etiketleme sistemi
- Görev ve sprint bağlantıları
- Arama ve filtreleme
- Görünürlük kontrolü (genel/özel)

### 🤖 **AI Asistan**
- Gemini AI entegrasyonu
- Proje önerileri
- Otomatik görev özetleri
- Akıllı sprint planlama

## 🛠️ Teknoloji Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Firebase (Firestore, Authentication)
- **AI**: Google Gemini AI
- **Build Tool**: Vite
- **Package Manager**: npm

## 📋 Gereksinimler

- Node.js 18+ 
- npm 9+
- Firebase hesabı
- Google Gemini AI API anahtarı

## 🚀 Kurulum

### 1. Repository'yi klonlayın
```bash
git clone https://github.com/yourusername/syncflow.git
cd syncflow
```

### 2. Bağımlılıkları yükleyin
```bash
npm install
```

### 3. Environment değişkenlerini ayarlayın

`.env.local` dosyası oluşturun:
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Firebase projesini kurun

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. Yeni proje oluşturun
3. Authentication'ı etkinleştirin (Email/Password)
4. Firestore Database'i oluşturun
5. Proje ayarlarından config bilgilerini kopyalayın

### 5. Gemini AI API anahtarı alın

1. [Google AI Studio](https://makersuite.google.com/app/apikey)'ya gidin
2. API anahtarı oluşturun
3. `.env.local` dosyasına ekleyin

### 6. Uygulamayı başlatın
```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

## 🔑 API Anahtarları ve Güvenlik

### ⚠️ **ÖNEMLİ**: Kendi API Anahtarlarınızı Alın

Bu proje Firebase ve Gemini AI servislerini kullanır. Bu servisler **ücretli** olabilir ve kendi API anahtarlarınızı kullanmanız gerekir.

**Neden kendi anahtarlarınızı kullanmalısınız:**
- Güvenlik: API anahtarları kişisel bilgilerdir
- Maliyet kontrolü: Kendi kullanımınızı takip edebilirsiniz
- Limitler: Kişisel kotalarınızı aşmazsınız

**Gizli tutulması gereken dosyalar:**
- `.env.local`
- `src/lib/firebase.ts`
- `src/lib/gemini.ts`
- Firebase config dosyaları

## 💰 Maliyet Bilgileri

### Firebase
- **Firestore**: İlk 1GB ücretsiz, sonrası $0.18/GB
- **Authentication**: Ücretsiz (10,000 kullanıcıya kadar)
- **Hosting**: Ücretsiz (1GB depolama, 10GB transfer)

### Gemini AI
- **Gemini Pro**: $0.0025/1K karakter (input), $0.01/1K karakter (output)
- **Gemini Flash**: $0.00075/1K karakter (input), $0.003/1K karakter (output)

**Tahmini aylık maliyet (küçük ekip):**
- Firebase: $0-5
- Gemini AI: $1-10
- **Toplam**: $1-15/ay

## 📁 Proje Yapısı

```
syncflow/
├── components/          # UI bileşenleri
│   ├── kanban/         # Kanban board bileşenleri
│   └── ui/             # Genel UI bileşenleri
├── data/               # Mock veri ve test verileri
├── pages/              # Sayfa bileşenleri
├── src/
│   ├── context/        # React context'leri
│   └── lib/            # Harici servis entegrasyonları
├── types/               # TypeScript tip tanımları
└── App.tsx             # Ana uygulama bileşeni
```

## 🔧 Geliştirme

### Scripts
```bash
npm run dev          # Geliştirme sunucusunu başlat
npm run build        # Production build oluştur
npm run preview      # Production build'i önizle
npm run lint         # ESLint ile kod kontrolü
```

### Kod Standartları
- TypeScript strict mode
- ESLint + Prettier
- Functional components
- Hooks kullanımı
- Responsive design

## 🚧 Yapılan İşler

### ✅ Tamamlanan Özellikler
- [x] Proje yapısı ve routing
- [x] Firebase entegrasyonu
- [x] Kullanıcı kimlik doğrulama
- [x] Workspace yönetimi
- [x] Kanban board sistemi
- [x] Sprint yönetimi
- [x] Görev yönetimi
- [x] Üye yönetimi
- [x] Blocker sistemi
- [x] Standup kontrolleri
- [x] Raporlama sistemi
- [x] Notlar sistemi
- [x] AI asistan entegrasyonu
- [x] Responsive tasarım
- [x] Dark mode desteği

### 🔄 Devam Eden Geliştirmeler
- [ ] Gerçek zamanlı işbirliği
- [ ] Dosya yükleme sistemi
- [ ] Bildirim sistemi
- [ ] Email entegrasyonu
- [ ] Mobil uygulama

### 📋 Gelecek Özellikler
- [ ] Gantt chart'ları
- [ ] Zaman takibi
- [ ] Bütçe yönetimi
- [ ] Risk yönetimi
- [ ] Dokümantasyon sistemi
- [ ] API entegrasyonları
- [ ] Webhook desteği
- [ ] Export/Import özellikleri

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 🆘 Destek

- **Issues**: [GitHub Issues](https://github.com/yourusername/syncflow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/syncflow/discussions)
- **Email**: support@syncflow.com

## 🙏 Teşekkürler

- [React](https://reactjs.org/) ekibine
- [Firebase](https://firebase.google.com/) ekibine
- [Google AI](https://ai.google.dev/) ekibine
- [Tailwind CSS](https://tailwindcss.com/) ekibine
- [Lucide](https://lucide.dev/) ekibine

---

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!**
