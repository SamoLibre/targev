// ========================================
// TARGEV - Firebase Configuration
// ========================================
// BU DOSYAYI KENDİ FİREBASE BİLGİLERİNİZLE GÜNCELLEYİN!
// Firebase Console'dan alacağınız bilgileri buraya yapıştırın.

const firebaseConfig = {
    apiKey: "AIzaSyDcK8QERzjxD9ZXp2mo__nECfYNKKdxXhI",
    authDomain: "targevpanel.firebaseapp.com",
    projectId: "targevpanel",
    storageBucket: "targevpanel.firebasestorage.app",
    messagingSenderId: "222145074833",
    appId: "1:222145074833:web:408eb007153d8995ee9130",
    measurementId: "G-74XH74G09E"
};

// Firebase'i başlat
firebase.initializeApp(firebaseConfig);

// Servisleri export et
const auth = firebase.auth();
const db = firebase.firestore();
// Storage kullanılmıyor - Cloudinary kullanılıyor (ücretsiz)

// Auth state değişikliklerini dinle
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('Kullanıcı giriş yaptı:', user.email);
    } else {
        console.log('Kullanıcı çıkış yaptı');
    }
});
