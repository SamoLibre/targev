# 🔥 TARGEV Firebase + Cloudinary Kurulum Rehberi

Bu rehber, TARGEV web sitesinin Firebase backend ve Cloudinary (ücretsiz resim depolama) kurulumunu açıklar.

---

## 📋 Gereksinimler

- Google hesabı
- Cloudinary hesabı (ücretsiz)
- Vercel hesabı (GitHub ile bağlı)

---

## 🚀 Adım 1: Firebase Projesi Oluşturma

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. **"Proje ekle"** veya **"Add project"** butonuna tıklayın
3. Proje adı: `targev-web` (veya istediğiniz bir isim)
4. Google Analytics'i etkinleştirin veya atlayın
5. **"Proje oluştur"** tıklayın

---

## 🌐 Adım 2: Web Uygulaması Ekleme

1. Proje panelinde **"Web"** ikonuna (</>) tıklayın
2. Uygulama adı: `TARGEV Web`
3. **"Firebase Hosting"** seçeneğini İŞARETLEMEYİN (Vercel kullanacağız)
4. **"Uygulamayı kaydet"** tıklayın
5. **Aşağıdaki bilgileri kopyalayın:**

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "targev-web.firebaseapp.com",
    projectId: "targev-web",
    storageBucket: "targev-web.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123..."
};
```

6. Bu bilgileri `js/firebase-config.js` dosyasına yapıştırın

---

## 🔐 Adım 3: Authentication (Kimlik Doğrulama) Kurulumu

1. Sol menüden **"Build" > "Authentication"** seçin
2. **"Get started"** tıklayın
3. **"Email/Password"** sağlayıcısını seçin ve **"Etkinleştir"** yapın
4. **"Kaydet"** tıklayın

### Admin Kullanıcısı Oluşturma:

1. **"Users"** sekmesine gidin
2. **"Add user"** tıklayın
3. Email: `admin@targev.org` (veya istediğiniz)
4. Şifre: Güçlü bir şifre belirleyin
5. **"Add user"** tıklayın

---

## 📚 Adım 4: Firestore Database Kurulumu

1. Sol menüden **"Build" > "Firestore Database"** seçin
2. **"Create database"** tıklayın
3. **"Start in production mode"** seçin
4. Konum: `europe-west1` (Frankfurt - Türkiye'ye yakın)
5. **"Enable"** tıklayın

### Güvenlik Kuralları:

**"Rules"** sekmesine gidin ve aşağıdaki kuralları yapıştırın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Herkes okuyabilir (site ziyaretçileri)
    match /{document=**} {
      allow read: if true;
    }
    
    // Sadece giriş yapmış kullanıcılar yazabilir (admin)
    match /slides/{slideId} {
      allow write: if request.auth != null;
    }
    
    match /news/{newsId} {
      allow write: if request.auth != null;
    }
    
    match /projects/{projectId} {
      allow write: if request.auth != null;
    }
  }
}
```

**"Publish"** tıklayın.

---

## � Adım 5: Cloudinary Kurulumu (Ücretsiz Resim/Video Depolama)

Firebase Storage ücretli olduğu için, ücretsiz **Cloudinary** kullanıyoruz.

### 5.1 Cloudinary Hesabı Oluşturma

1. [Cloudinary](https://cloudinary.com/users/register_free) adresine gidin
2. **Ücretsiz hesap** oluşturun (Google ile giriş yapabilirsiniz)
3. Dashboard'a gidin

### 5.2 Cloud Name'i Kopyalama

1. Dashboard'da sağ üstte **Cloud Name** yazan yeri bulun
2. Örnek: `dxyz123abc`
3. Bu değeri kopyalayın

### 5.3 Upload Preset Oluşturma

1. Sol menüden **Settings** (⚙️) → **Upload** seçin
2. Aşağı kaydırın ve **"Upload presets"** bölümünü bulun
3. **"Add upload preset"** tıklayın
4. Ayarlar:
   - **Upload preset name**: `targev_unsigned`
   - **Signing Mode**: `Unsigned` (ÖNEMLİ!)
   - **Folder**: `targev` (opsiyonel)
5. **Save** tıklayın

### 5.4 cloudinary-config.js Güncelleme

`js/cloudinary-config.js` dosyasını açın:

```javascript
const cloudinaryConfig = {
    cloudName: 'BURAYA_CLOUD_NAME',      // Cloudinary'den aldığınız cloud name
    uploadPreset: 'targev_unsigned'       // Oluşturduğunuz preset adı
};
```

**Örnek:**
```javascript
const cloudinaryConfig = {
    cloudName: 'dxyz123abc',
    uploadPreset: 'targev_unsigned'
};
```

---

## ⚙️ Adım 6: firebase-config.js Güncelleme

`js/firebase-config.js` dosyasını açın ve Firebase bilgilerinizi yapıştırın:

```javascript
const firebaseConfig = {
    apiKey: "BURAYA_API_KEY",
    authDomain: "PROJE_ID.firebaseapp.com",
    projectId: "PROJE_ID",
    storageBucket: "PROJE_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};
```

---

## 🚀 Adım 7: GitHub'a Yükleme

```bash
cd targev

# Git başlat (ilk kez ise)
git init

# Tüm dosyaları ekle
git add .

# Commit yap
git commit -m "Firebase backend eklendi"

# GitHub repo oluştur ve bağla
git remote add origin https://github.com/KULLANICIADI/targev.git

# Push et
git push -u origin main
```

---

## 🌍 Adım 8: Vercel Deployment

1. [Vercel](https://vercel.com) adresine gidin
2. GitHub hesabınızla giriş yapın
3. **"New Project"** tıklayın
4. `targev` repository'sini seçin
5. **"Deploy"** tıklayın
6. Birkaç dakika bekleyin

**Site adresiniz:** `https://targev.vercel.app` (veya özel domain)

---

## ✅ Adım 9: Test

1. Sitenizi açın: `https://site-adresiniz.vercel.app`
2. Admin paneline gidin: `https://site-adresiniz.vercel.app/admin`
3. Firebase'de oluşturduğunuz email/şifre ile giriş yapın
4. Slider, Haber veya Proje ekleyin
5. Ana sayfaya gidin ve içeriğin göründüğünü kontrol edin

---

## 🔄 İçerik Güncelleme Akışı

1. **Admin paneline giriş yapın** (`/admin`)
2. Slider, Haber veya Proje ekleyin/düzenleyin
3. **Değişiklikler anında yayınlanır!** 
4. GitHub'a push gerekmez
5. Site otomatik olarak Firebase'den güncel içeriği çeker

---

## 🛠️ Sorun Giderme

### "Firebase is not defined" hatası
- `js/firebase-config.js` dosyasının doğru olduğundan emin olun
- Tarayıcı konsolunu kontrol edin

### Giriş yapamıyorum
- Firebase Authentication'da kullanıcı oluşturduğunuzdan emin olun
- Email/Password provider'ın aktif olduğunu kontrol edin

### Resimler yüklenmiyor
- Cloudinary yapılandırmasını kontrol edin (`js/cloudinary-config.js`)
- Cloud name ve upload preset'in doğru olduğundan emin olun
- Upload preset'in **"Unsigned"** modda olduğunu kontrol edin

### İçerik görünmüyor
- Firestore'da veri olduğunu kontrol edin
- Firestore güvenlik kurallarını kontrol edin
- Tarayıcı konsolunda hata var mı bakın

---

## 📞 Destek

Sorun yaşarsanız:
1. Tarayıcı konsolunu kontrol edin (F12 > Console)
2. Firebase Console'da hataları kontrol edin
3. Firestore ve Storage kurallarını gözden geçirin

---

**İyi çalışmalar! 🎉**
