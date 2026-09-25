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
  title: 'AURA TRADE & INVEST',
  description: 'منصة تداول واستثمار مالي احترافية',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
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