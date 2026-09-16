import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/context/ThemeContext';
import { MissionsProvider } from '@/context/MissionsContext';

export const metadata = {
  title: 'AURA TRADE & INVEST | منصة التداول والاستثمار',
  description: 'منصة تداول واستثمار مالي احترافية',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <MissionsProvider>
            <Header />
            <main style={{ minHeight: 'calc(100vh - 200px)' }}>{children}</main>
            <Footer />
          </MissionsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}