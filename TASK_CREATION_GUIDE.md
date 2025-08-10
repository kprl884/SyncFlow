# Task Oluşturma ve Story Point Belirleme Kılavuzu

## 🎯 Yeni Task Oluşturma

### 1. Task Oluşturma Butonu
- Kanban board'da sağ üst köşede bulunan **"Yeni Task"** butonuna tıklayın
- Yeşil renkli buton ile kolayca erişilebilir

### 2. Temel Bilgiler
- **Task Başlığı**: Kısa ve açıklayıcı olmalı
- **Açıklama**: Detaylı açıklama ekleyin
- **Atanan Kişi**: Takım üyelerinden birini seçin
- **Takım**: Backend, Frontend, Mobile veya General
- **Öncelik**: Low, Medium, High
- **Durum**: Todo, In Progress, In Review, Done

## 📊 Story Points (SP) Belirleme

### Fibonacci Serisi
**1, 2, 3, 5, 8, 13, 21, 34**

### SP Belirleme Kriterleri

#### 1 SP - Çok Basit (1-2 saat)
- Küçük bug fix
- Basit text değişikliği
- CSS düzenleme
- Dokümantasyon güncelleme

#### 2 SP - Basit (2-4 saat)
- Küçük özellik ekleme
- Basit form validasyonu
- API endpoint testi
- Unit test yazma

#### 3 SP - Orta (4-8 saat)
- Orta karmaşıklıkta özellik
- Veritabanı sorgusu optimizasyonu
- UI component geliştirme
- Integration test

#### 5 SP - Karmaşık (1-2 gün)
- Karmaşık özellik geliştirme
- API entegrasyonu
- State management
- Error handling

#### 8 SP - Büyük (2-3 gün)
- Büyük özellik
- Çoklu component geliştirme
- Performance optimizasyonu
- Security implementation

#### 13+ SP - Çok Büyük (3+ gün)
- **⚠️ UYARI**: Bu boyutta task'lar bölünmelidir
- Çok karmaşık özellikler
- Architecture değişiklikleri
- Major refactoring

## 🧮 SP Yardımcısı (SP Helper)

### Teknik Karmaşıklık Hesaplama

#### API Etkisi (0-10)
- **0-2**: Mevcut API kullanımı
- **3-5**: Yeni endpoint ekleme
- **6-8**: API değişikliği
- **9-10**: Major API redesign

#### UI Etkisi (0-10)
- **0-2**: Mevcut component kullanımı
- **3-5**: Yeni component
- **6-8**: Component redesign
- **9-10**: Major UI overhaul

#### Veritabanı Değişikliği
- **False**: Mevcut veri kullanımı
- **True**: Schema değişikliği, yeni tablo, migration

### Belirsizlik Seviyesi

#### Düşük (Low)
- Requirements net
- Teknik yaklaşım belli
- Benzer task'lar daha önce yapıldı

#### Orta (Medium)
- Requirements kısmen net
- Teknik yaklaşım belirsiz
- Bazı riskler mevcut

#### Yüksek (High)
- Requirements belirsiz
- Teknik yaklaşım bilinmiyor
- Yüksek risk faktörü

## 🎨 Task Etiketleme

### Önerilen Etiketler
- **bug**: Hata düzeltme
- **feature**: Yeni özellik
- **enhancement**: İyileştirme
- **documentation**: Dokümantasyon
- **testing**: Test ile ilgili
- **refactor**: Kod temizleme
- **performance**: Performans iyileştirme
- **security**: Güvenlik

## 🔗 Bağımlılık Yönetimi

### Bağımlılık Türleri
- **Technical**: Teknik bağımlılık
- **Business**: İş mantığı bağımlılığı
- **Resource**: Kaynak bağımlılığı

### Bağımlılık Seçimi
- Ctrl/Cmd tuşu ile birden fazla seçim
- Mevcut task'lardan bağımlılık seçimi
- Task durumuna göre filtreleme

## 📋 En İyi Uygulamalar

### 1. Task Boyutlandırma
- **Maksimum 8 SP**: Daha büyük task'lar bölünmelidir
- **1-3 SP**: Sprint'te hızlı tamamlanabilir
- **5-8 SP**: Orta vadeli hedefler

### 2. SP Belirleme
- Takım ile birlikte belirleyin
- Planning poker kullanın
- Referans task'lar ile karşılaştırın

### 3. Task Açıklaması
- **GIVEN**: Başlangıç durumu
- **WHEN**: Yapılacak işlem
- **THEN**: Beklenen sonuç

### 4. Definition of Done
- Code review tamamlandı
- Testler yazıldı
- Dokümantasyon güncellendi
- Production'a deploy edildi

## 🚀 Hızlı Başlangıç

1. **"Yeni Task"** butonuna tıklayın
2. **Temel bilgileri** doldurun
3. **SP Yardımcısını** açın
4. **Teknik karmaşıklığı** belirleyin
5. **SP önerisini** hesaplayın
6. **Etiketleri** ekleyin
7. **Bağımlılıkları** seçin
8. **Task'ı oluşturun**

## 💡 İpuçları

- **Küçük başlayın**: 1-3 SP ile başlayın
- **Takım ile çalışın**: SP belirlemede konsensüs sağlayın
- **Referans kullanın**: Benzer task'ları referans alın
- **Düzenli gözden geçirin**: SP tahminlerini gerçek sürelerle karşılaştırın
- **Öğrenin**: Her sprint'te SP belirleme becerinizi geliştirin

## 🔄 Sprint Planning

### Velocity Hesaplama
- **Velocity = Tamamlanan SP toplamı / Sprint sayısı**
- **Kapasite = Takım üyesi sayısı × 8 SP (ortalama)**

### Sprint Backlog
- **Sprint Goal**: Sprint hedefi
- **Committed Items**: Taahhüt edilen task'lar
- **Stretch Goals**: Ek hedefler (opsiyonel)

---

**Not**: Bu kılavuz, Agile ve Scrum metodolojilerine uygun olarak hazırlanmıştır. Takımınızın ihtiyaçlarına göre özelleştirebilirsiniz.
