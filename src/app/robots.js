// src/app/robots.js
export default function robots() {
  const baseUrl = 'https://yourdomain.com'; // ⚠️ استبدله بدومينك الحقيقي

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/dashboard/settings'], // حظر أرشفة اللوحات الخاصة
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

