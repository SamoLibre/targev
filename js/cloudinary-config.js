// ========================================
// TARGEV - Cloudinary Configuration
// ========================================
// Ücretsiz resim/video yükleme servisi
// https://cloudinary.com adresinden ücretsiz hesap oluşturun

const cloudinaryConfig = {
    cloudName: 'BURAYA_CLOUD_NAME',  // Cloudinary'den alın
    uploadPreset: 'targev_unsigned'   // Aşağıda nasıl oluşturulacağı yazıyor
};

// Cloudinary Upload Widget
class CloudinaryUploader {
    constructor() {
        this.cloudName = cloudinaryConfig.cloudName;
        this.uploadPreset = cloudinaryConfig.uploadPreset;
    }

    // Resim yükle
    async uploadImage(file) {
        return this.upload(file, 'image');
    }

    // Video yükle
    async uploadVideo(file) {
        return this.upload(file, 'video');
    }

    // Genel yükleme fonksiyonu
    async upload(file, resourceType = 'auto') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.uploadPreset);
        formData.append('folder', 'targev'); // Tüm dosyalar targev klasöründe

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error('Yükleme başarısız');
            }

            const data = await response.json();
            return {
                success: true,
                url: data.secure_url,
                publicId: data.public_id,
                format: data.format,
                width: data.width,
                height: data.height
            };
        } catch (error) {
            console.error('Cloudinary yükleme hatası:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Resim silme (opsiyonel - API key gerektirir)
    // Silme işlemi için backend gerekir, şimdilik sadece Cloudinary panelinden silebilirsiniz
}

// Global instance
const cloudinaryUploader = new CloudinaryUploader();
