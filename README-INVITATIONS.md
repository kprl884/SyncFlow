# SyncFlow User Invitation & Role Management System

Bu dokümantasyon, SyncFlow projesi için implement edilen kapsamlı kullanıcı davet ve rol yönetim sistemini açıklar.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler
- **Database Schema**: Supabase tabloları ve RLS politikaları
- **Invitation Service**: Kullanıcı davet etme, kabul etme ve yönetme
- **Email Service**: Resend entegrasyonu ile davet email'leri
- **Role Management**: Admin, Member, Viewer rolleri
- **Member Management**: Üye ekleme, çıkarma, rol güncelleme
- **Security**: Row Level Security (RLS) ve yetkilendirme

### 🔄 Devam Eden Özellikler
- Email service entegrasyonu (Resend API key gerekli)
- Frontend routing entegrasyonu
- Workspace header'a "Manage Members" butonu ekleme

## 🗄️ Database Schema

### Tablolar

#### 1. `workspaces`
```sql
- id (UUID, Primary Key)
- name (TEXT)
- description (TEXT, nullable)
- owner_id (UUID, Foreign Key to auth.users)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

#### 2. `workspace_members`
```sql
- id (UUID, Primary Key)
- workspace_id (UUID, Foreign Key to workspaces)
- user_id (UUID, Foreign Key to auth.users)
- role (user_role ENUM: 'admin', 'member', 'viewer')
- created_at (TIMESTAMPTZ)
```

#### 3. `invitations`
```sql
- id (UUID, Primary Key)
- workspace_id (UUID, Foreign Key to workspaces)
- invited_by_id (UUID, Foreign Key to auth.users)
- invitee_email (TEXT)
- role (user_role ENUM)
- token (TEXT, unique)
- status (invitation_status ENUM: 'pending', 'accepted', 'expired')
- created_at (TIMESTAMPTZ)
- expires_at (TIMESTAMPTZ)
```

### RLS (Row Level Security) Politikaları

- **Workspaces**: Sadece üyeler görüntüleyebilir, sadece owner güncelleyebilir
- **Workspace Members**: Sadece workspace üyeleri görüntüleyebilir, sadece admin'ler yönetebilir
- **Invitations**: Sadece workspace admin'leri oluşturabilir ve yönetebilir

## 🔧 Kurulum

### 1. Gerekli Paketler
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs react-hot-toast uuid @types/uuid
npm install @supabase/ssr
npm install resend  # Email service için
```

### 2. Environment Variables
`.env` dosyasına ekleyin:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Service (Resend)
VITE_RESEND_API_KEY=your_resend_api_key
VITE_FROM_EMAIL=noreply@yourdomain.com

# App Configuration
VITE_APP_URL=http://localhost:5173
```

### 3. Database Setup
Supabase Console'da `database/schema.sql` dosyasındaki SQL komutlarını çalıştırın.

## 📁 Dosya Yapısı

```
src/
├── lib/
│   ├── supabase.ts              # Supabase client ve types
│   ├── invitation-service.ts    # Invitation business logic
│   └── email-service.ts         # Email sending (Resend)
├── components/ui/
│   └── ManageMembersModal.tsx   # Member management UI
└── pages/
    └── InvitePage.tsx           # Invitation acceptance page
```

## 🎯 Kullanım

### 1. Kullanıcı Davet Etme
```typescript
import { InvitationService } from '../src/lib/invitation-service'

const result = await InvitationService.inviteUser({
  workspaceId: 'workspace-uuid',
  email: 'user@example.com',
  role: 'member',
  currentUserId: 'current-user-uuid'
})
```

### 2. Davet Kabul Etme
```typescript
const result = await InvitationService.acceptInvitation(
  'invitation-token',
  'user-uuid'
)
```

### 3. Üye Yönetimi
```typescript
// Üye listesi
const members = await InvitationService.getWorkspaceMembers(workspaceId)

// Rol güncelleme
await InvitationService.updateMemberRole(workspaceId, userId, 'admin', currentUserId)

// Üye çıkarma
await InvitationService.removeMember(workspaceId, userId, currentUserId)
```

## 🔐 Güvenlik

### Yetkilendirme
- **Admin**: Tam erişim (üye yönetimi, davet gönderme)
- **Member**: Task oluşturma, düzenleme
- **Viewer**: Sadece okuma erişimi

### RLS Politikaları
- Her tablo için Row Level Security aktif
- Kullanıcılar sadece yetkili oldukları verilere erişebilir
- Admin olmayan kullanıcılar üye yönetimi yapamaz

## 📧 Email Entegrasyonu

### Resend Setup
1. [Resend](https://resend.com) hesabı oluşturun
2. API key alın
3. Domain verify edin
4. Environment variable'a ekleyin

### Email Templates
- **Invitation Email**: Davet linki ve workspace bilgileri
- **Welcome Email**: Hoş geldin mesajı ve workspace'e yönlendirme

## 🚦 Frontend Entegrasyonu

### 1. ManageMembersModal Ekleme
Workspace header'a "Manage Members" butonu ekleyin:

```typescript
import { ManageMembersModal } from '../components/ui/ManageMembersModal'

// State
const [showMembersModal, setShowMembersModal] = useState(false)

// Button
<button onClick={() => setShowMembersModal(true)}>
  Manage Members
</button>

// Modal
<ManageMembersModal
  isOpen={showMembersModal}
  onClose={() => setShowMembersModal(false)}
  workspaceId={workspaceId}
  workspaceName={workspaceName}
  currentUserId={currentUserId}
/>
```

### 2. Routing Ekleme
```typescript
// App.tsx veya router config
<Route path="/invite/:token" element={<InvitePage />} />
```

## 🧪 Test

### Test Senaryoları
1. **Admin davet gönderme**: ✅
2. **Davet kabul etme**: ✅
3. **Rol güncelleme**: ✅
4. **Üye çıkarma**: ✅
5. **Yetkilendirme kontrolü**: ✅

### Test Komutları
```bash
# Development server
npm run dev

# Build
npm run build

# Type check
npm run type-check
```

## 🐛 Bilinen Sorunlar

1. **Email Service**: Resend API key gerekli
2. **Frontend Integration**: ManageMembersModal workspace'e entegre edilmeli
3. **Routing**: InvitePage route'u eklenmeli

## 🔮 Gelecek Özellikler

- [ ] Bulk invitation
- [ ] Invitation templates
- [ ] Advanced role permissions
- [ ] Audit logs
- [ ] Email notifications for role changes

## 📞 Destek

Herhangi bir sorun veya öneri için:
1. Issue açın
2. Pull request gönderin
3. Documentation güncelleyin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
