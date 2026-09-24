'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, ArrowDownToLine, ArrowUpFromLine,
  Bell, Settings, LogOut, Menu, X, Shield, TrendingUp,
  FileText, Activity, Crown, Target
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import styles from './AdminSidebar.module.css';

const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/users', label: 'المستخدمون', icon: Users },
  { href: '/admin/deposits', label: 'الإيداعات', icon: ArrowDownToLine, badge: 'new' },
  { href: '/admin/withdrawals', label: 'السحوبات', icon: ArrowUpFromLine, badge: 'new' },
  { href: '/admin/notifications', label: 'الإشعارات', icon: Bell },
  { href: '/admin/activity', label: 'سجل العمليات', icon: Activity },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
  { href: '/admin/missions', label: 'المهام', icon: Target },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { admin } = useAdmin();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className={styles.mobileToggle}
        onClick={() => setOpen(!open)}
        aria-label="القائمة"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandLogo}>A</div>
          <div className={styles.brandText}>
            <div className={styles.brandTitle}>AURA ADMIN</div>
            <div className={styles.brandSub}>
              <Shield size={10} /> لوحة التحكم
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <div className={styles.adminInfo}>
          <div className={styles.adminAvatar}>
            {(admin?.username || 'A').slice(0, 2).toUpperCase()}
          </div>
          <div className={styles.adminMeta}>
            <div className={styles.adminName}>
              {admin?.fullName || admin?.username || 'Admin'}
            </div>
            <div className={styles.adminRole}>
              <Crown size={10} /> {admin?.role === 'superadmin' ? 'مدير عام' : 'مدير'}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {NAV_LINKS.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.navLink} ${active ? styles.active : ''}`}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                <span>{label}</span>
                {badge && <span className={styles.navBadge}>جديد</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={styles.footer}>
          <Link href="/dashboard" className={styles.viewSiteBtn}>
            <TrendingUp size={14} />
            عرض الموقع
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}