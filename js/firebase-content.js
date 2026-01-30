// ========================================
// TARGEV - Firebase Content Manager
// ========================================
// Firestore ile içerik yönetimi

const FirebaseContent = {
    // ========================================
    // SLIDER İŞLEMLERİ
    // ========================================
    
    // Tüm slider'ları getir
    async getSlides() {
        try {
            const snapshot = await db.collection('slides').orderBy('order', 'asc').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Slider getirme hatası:', error);
            return [];
        }
    },

    // Slider ekle
    async addSlide(slideData) {
        try {
            const docRef = await db.collection('slides').add({
                ...slideData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                order: slideData.order || 0
            });
            return { id: docRef.id, ...slideData };
        } catch (error) {
            console.error('Slider ekleme hatası:', error);
            throw error;
        }
    },

    // Slider güncelle
    async updateSlide(id, slideData) {
        try {
            await db.collection('slides').doc(id).update({
                ...slideData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id, ...slideData };
        } catch (error) {
            console.error('Slider güncelleme hatası:', error);
            throw error;
        }
    },

    // Slider sil
    async deleteSlide(id) {
        try {
            await db.collection('slides').doc(id).delete();
            return true;
        } catch (error) {
            console.error('Slider silme hatası:', error);
            throw error;
        }
    },

    // ========================================
    // HABER İŞLEMLERİ
    // ========================================
    
    // Tüm haberleri getir
    async getNews(limit = null) {
        try {
            let query = db.collection('news').orderBy('date', 'desc');
            if (limit) query = query.limit(limit);
            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Haber getirme hatası:', error);
            return [];
        }
    },

    // Haber ekle
    async addNews(newsData) {
        try {
            const docRef = await db.collection('news').add({
                ...newsData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: docRef.id, ...newsData };
        } catch (error) {
            console.error('Haber ekleme hatası:', error);
            throw error;
        }
    },

    // Haber güncelle
    async updateNews(id, newsData) {
        try {
            await db.collection('news').doc(id).update({
                ...newsData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id, ...newsData };
        } catch (error) {
            console.error('Haber güncelleme hatası:', error);
            throw error;
        }
    },

    // Haber sil
    async deleteNews(id) {
        try {
            await db.collection('news').doc(id).delete();
            return true;
        } catch (error) {
            console.error('Haber silme hatası:', error);
            throw error;
        }
    },

    // ========================================
    // PROJE İŞLEMLERİ
    // ========================================
    
    // Tüm projeleri getir
    async getProjects(limit = null) {
        try {
            let query = db.collection('projects').orderBy('createdAt', 'desc');
            if (limit) query = query.limit(limit);
            const snapshot = await query.get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Proje getirme hatası:', error);
            return [];
        }
    },

    // Proje ekle
    async addProject(projectData) {
        try {
            const docRef = await db.collection('projects').add({
                ...projectData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id: docRef.id, ...projectData };
        } catch (error) {
            console.error('Proje ekleme hatası:', error);
            throw error;
        }
    },

    // Proje güncelle
    async updateProject(id, projectData) {
        try {
            await db.collection('projects').doc(id).update({
                ...projectData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { id, ...projectData };
        } catch (error) {
            console.error('Proje güncelleme hatası:', error);
            throw error;
        }
    },

    // Proje sil
    async deleteProject(id) {
        try {
            await db.collection('projects').doc(id).delete();
            return true;
        } catch (error) {
            console.error('Proje silme hatası:', error);
            throw error;
        }
    },

    // ========================================
    // DOSYA YÜKLEME (Cloudinary - Ücretsiz)
    // ========================================
    
    // Resim yükle (Cloudinary)
    async uploadImage(file, folder = 'images') {
        try {
            // Cloudinary config kontrolü
            if (!window.cloudinaryConfig || cloudinaryConfig.cloudName === 'BURAYA_CLOUD_NAME') {
                throw new Error('Cloudinary yapılandırması eksik! js/cloudinary-config.js dosyasını kontrol edin.');
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', cloudinaryConfig.uploadPreset);
            formData.append('folder', `targev/${folder}`);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
                { method: 'POST', body: formData }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Yükleme başarısız');
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Resim yükleme hatası:', error);
            throw error;
        }
    },

    // Video yükle (Cloudinary)
    async uploadVideo(file) {
        try {
            if (!window.cloudinaryConfig || cloudinaryConfig.cloudName === 'BURAYA_CLOUD_NAME') {
                throw new Error('Cloudinary yapılandırması eksik!');
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', cloudinaryConfig.uploadPreset);
            formData.append('folder', 'targev/videos');

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/video/upload`,
                { method: 'POST', body: formData }
            );

            if (!response.ok) {
                throw new Error('Video yükleme başarısız');
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Video yükleme hatası:', error);
            throw error;
        }
    },

    // Dosya sil - Cloudinary'de unsigned ile silme yapılamaz
    // Silmek için Cloudinary panelini kullanın
    async deleteFile(url) {
        console.log('Cloudinary dosyalarını silmek için Cloudinary panelini kullanın:', url);
        return true;
    }
};

// Export
window.FirebaseContent = FirebaseContent;
