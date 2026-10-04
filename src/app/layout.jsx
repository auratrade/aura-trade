import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { MissionsProvider } from '@/context/MissionsContext';
import { ToastProvider } from '@/context/ToastContext';
import { ConfirmProvider } from '@/context/ConfirmContext';
import { AdminProvider } from '@/context/AdminContext';

export const metadata = {
  title: {
    default: 'AURA TRADE & INVEST | منصة التداول والاستثمار المالي',
    template: '%s | AURA TRADE',
  },
  description: 'منصة تداول واستثمار مالي احترافية توفر أدوات تحليل وتداول آمنة وسريعة.',
  keywords: ['تداول', 'استثمار', 'عملات رقمية', 'USDT', 'Aura Trade', 'تداول آمن', 'منصة استثمار'],
  authors: [{ name: 'AURA TRADE' }],
  manifest: '/manifest.json',
  
  // ✅ سماح لمحركات البحث بأرشفة الموقع ومتابعة الروابط
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ✅ ظهور رابط الموقع بشكل احترافي عند مشاركته في الواتساب وتليجرام
  openGraph: {
    title: 'AURA TRADE & INVEST',
    description: 'منصة تداول واستثمار مالي احترافية',
    url: 'https://yourdomain.com', // ⚠️ استبدله بدومين موقعك الحقيقي
    siteName: 'AURA TRADE',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'Aura Trade Logo',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0b0e14" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <ToastProvider>
            <ConfirmProvider>
              <AuthProvider>
                <AdminProvider>
                  <MissionsProvider>
                    {/* ⚠️ لا يوجد Header في الأعلى */}

                    <main className="main-content">
                      {children}
                    </main>

                    <Footer />

                    {/* ✅ Bottom Navigation */}
                    <Header />
                  </MissionsProvider>
                </AdminProvider>
              </AuthProvider>
            </ConfirmProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}