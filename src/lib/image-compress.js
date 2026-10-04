/**
 * ضغط الصور في المتصفح قبل الرفع
 * يستخدم Canvas API لتقليل الأبعاد والجودة
 */

const MAX_WIDTH = 1280;      // الحد الأقصى للعرض
const MAX_HEIGHT = 1280;     // الحد الأقصى للارتفاع
const QUALITY = 0.75;        // جودة JPEG (0-1)
const MAX_SIZE_KB = 800;     // الهدف: أقل من 800KB لكل صورة

/**
 * ضغط صورة (File → Base64 data URL)
 * @param {File} file - ملف الصورة الأصلي
 * @returns {Promise<{dataUrl: string, size: number}>}
 */
export async function compressImage(file) {
  return new Promise((resolve, reject) => {
    // 1) التحقق من النوع
    if (!file.type.startsWith('image/')) {
      reject(new Error('الملف ليس صورة'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => reject(new Error('فشل قراءة الملف'));

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => reject(new Error('فشل تحميل الصورة'));

      img.onload = () => {
        try {
          // 2) حساب الأبعاد الجديدة مع الحفاظ على النسبة
          let { width, height } = img;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // 3) رسم الصورة على Canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // 4) ضغط تدريجي (تقليل الجودة حتى الوصول للحجم المطلوب)
          let quality = QUALITY;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);

          // إذا الحجم كبير، قلل الجودة تدريجياً
          while (dataUrl.length > MAX_SIZE_KB * 1024 * 1.4 && quality > 0.4) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          // 5) حساب الحجم الفعلي (تقريبي)
          const sizeInBytes = Math.round((dataUrl.length - 22) * 3 / 4);

          resolve({
            dataUrl,
            size: sizeInBytes,
            width,
            height,
            quality,
          });
        } catch (err) {
          reject(err);
        }
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * التحقق من حجم صورة (Base64)
 */
export function getBase64Size(dataUrl) {
  if (!dataUrl) return 0;
  return Math.round((dataUrl.length - 22) * 3 / 4);
}

/**
 * تنسيق الحجم
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}