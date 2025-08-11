# 🔍 Üye Yönetimi Debug Rehberi

## 📋 Mevcut Durum

### ✅ Düzeltilen Sorunlar:
1. **Mock Data Structure**: `workspace.members` artık object formatında (`{userId: 'role'}`)
2. **User Interface**: `email` field'ı eklendi
3. **Debug Logs**: `fetchWorkspaceUsers` fonksiyonuna detaylı loglar eklendi
4. **Mock User Integration**: Firebase yerine mock data kullanılıyor

### 🔧 Yapılan Değişiklikler:

#### 1. `data/mockData.ts`
```typescript
// ÖNCE (Hatalı):
members: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3]]

// SONRA (Doğru):
members: {
  'user-1': 'Admin',
  'user-2': 'Member',
  'user-3': 'Member',
  'user-4': 'Member'
}
```

#### 2. `types/index.ts`
```typescript
export interface User {
  id: string;
  name: string;
  email?: string; // ✅ Eklendi
  avatarUrl?: string;
}
```

#### 3. `components/kanban/MemberManagementModal.tsx`
```typescript
// Debug logları eklendi
console.log('🔍 fetchWorkspaceUsers başladı');
console.log('📋 Workspace data:', workspace);
console.log('👥 Workspace members:', workspace.members);

// Mock data integration
const mockUsers = [
  { id: 'user-1', name: 'Alex Johnson', email: 'alex@syncflow.com' },
  // ... diğer kullanıcılar
];
```

## 🧪 Test Adımları

### 1. Console Logları Kontrol Et
Tarayıcıda Developer Tools > Console'u aç ve şu logları ara:
- 🔍 fetchWorkspaceUsers başladı
- 📋 Workspace data: {...}
- 👥 Workspace members: {...}
- 🆔 User IDs found: [...]

### 2. Üye Sayısını Kontrol Et
- Workspace card'ında kaç üye gösteriliyor?
- Modal'da kaç üye listeleniyor?

### 3. Üye Davet Et
- `alex@syncflow.com` email'i ile test et
- `sarah@syncflow.com` email'i ile test et
- Console'da davet loglarını kontrol et

## 🐛 Beklenen Sonuçlar

### ✅ Başarılı Senaryo:
```
🔍 fetchWorkspaceUsers başladı
📋 Workspace data: {id: "workspace-1", name: "SyncFlow Development", ...}
👥 Workspace members: {user-1: "Admin", user-2: "Member", ...}
🆔 User IDs found: ["user-1", "user-2", "user-3", "user-4"]
✅ Mock user found: {id: "user-1", name: "Alex Johnson", ...}
📊 Final users data: [4 users]
```

### ❌ Hatalı Senaryo:
```
🔍 fetchWorkspaceUsers başladı
📋 Workspace data: {id: "workspace-1", ...}
👥 Workspace members: [] // Boş array
🆔 User IDs found: [] // Boş array
📊 Final users data: [] // Boş array
```

## 🔧 Sorun Giderme

### Eğer hala üyeler görünmüyorsa:

1. **Console'da logları kontrol et**
2. **Workspace data structure'ını kontrol et**
3. **Mock data'nın doğru yüklendiğini kontrol et**
4. **Component re-render'ını kontrol et**

### Eğer davet çalışmıyorsa:

1. **Email formatını kontrol et**
2. **Mock user listesinde email var mı kontrol et**
3. **Console'da davet loglarını kontrol et**

## 📱 Test Email'leri

```bash
# ✅ Çalışması gerekenler:
alex@syncflow.com    # user-1
sarah@syncflow.com   # user-2
mike@syncflow.com    # user-3
emily@syncflow.com   # user-4
david@syncflow.com   # user-5
lisa@syncflow.com    # user-6

# ❌ Çalışmaması gerekenler:
test@example.com     # Mock data'da yok
invalid-email        # Geçersiz format
```

## 🎯 Sonraki Adımlar

1. **Console loglarını kontrol et**
2. **Üye sayısını doğrula**
3. **Davet özelliğini test et**
4. **Hata varsa logları paylaş**

---

**Not**: Bu rehber mock data ile test için hazırlanmıştır. Production'da Firebase entegrasyonu gerekli olacaktır.
