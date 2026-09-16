'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Target,
  ArrowDownToLine, ArrowUpFromLine, Users, Shield,
  Bell, Moon, Sun, User, Menu, X, LogOut, Wallet
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import styles from './Header.module.css';

const NAV_LINKS = [
  { href: '/dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
  { href: '/missions', label: 'المهام', icon: Target },
  { href: '/deposit', label: 'إيداع', icon: ArrowDownToLine },
  { href: '/withdraw', label: 'سحب', icon: ArrowUpFromLine },
  { href: '/referrals', label: 'الإحالات', icon: Users },
  { href: '/security', label: 'الأمان', icon: Shield },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`${styles.inner} container`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>A</span>
          </div>
          <div className={styles.brandText}>
            <div className={styles.brandName}>AURA TRADE</div>
            <div className={styles.brandSub}>& INVEST</div>
          </div>
        </div>

        <nav className={`${styles.nav} ${mobileOpen ? styles.navOpen : ''}`}>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.navLink} ${active ? styles.active : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          {/* زر تبديل المظهر */}
          <button
            className={styles.iconBtn}
            aria-label="تبديل المظهر"
            title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
            onClick={toggle}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className={styles.dropdownWrap}>
            <button
              className={styles.iconBtn}
              aria-label="الإشعارات"
              onClick={() => { setShowNotif(!showNotif); setShowUser(false); }}
            >
              <Bell size={18} />
              <span className={styles.badge}>3</span>
            </button>
            {showNotif && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHead}>الإشعارات</div>
                <div className={styles.notifItem}>
                  <span className={styles.notifDot} />
                  تم تنفيذ أمر شراء BTC/USDT بنجاح
                </div>
                <div className={styles.notifItem}>
                  <span className={styles.notifDot} />
                  مكافأة المهمة اليومية +2.50 USDT
                </div>
                <div className={styles.notifItem}>
                  <span className={styles.notifDot} />
                  إيداع جديد بقيمة 500 USDT
                </div>
              </div>
            )}
          </div>

          <div className={styles.dropdownWrap}>
            <button
              className={styles.userBtn}
              onClick={() => { setShowUser(!showUser); setShowNotif(false); }}
            >
              <div className={styles.avatar}>AV</div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>Alexander Vance</div>
                <div className={styles.userRole}>VIP 2</div>
              </div>
            </button>
            {showUser && (
              <div className={styles.dropdown}>
                <Link href="/settings" className={styles.dropdownItem}>
                  <User size={14} /> الملف الشخصي
                </Link>
                <Link href="/deposit" className={styles.dropdownItem}>
                  <Wallet size={14} /> محفظتي
                </Link>
                <Link href="/security" className={styles.dropdownItem}>
                  <Shield size={14} /> الأمان
                </Link>
                <div className={styles.dropdownDivider} />
                <button className={`${styles.dropdownItem} ${styles.danger}`}>
                  <LogOut size={14} /> تسجيل الخروج
                </button>
              </div>
            )}
          </div>

          <button
            className={styles.mobileToggle}
            aria-label="القائمة"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}