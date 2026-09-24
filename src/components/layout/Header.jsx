'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Bell, CheckCheck, Crown, Wallet, Info, Gift,
  LayoutDashboard, Target, ArrowDownToLine, ArrowUpFromLine,
  Users, Shield, Moon, Sun, User, Menu, X, LogOut,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import styles from './Header.module.css';
import { useToast } from '@/context/ToastContext';
import { useConfirm } from '@/context/ConfirmContext';

const NAV_LINKS = [
  { href: '/dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
  { href: '/missions', label: 'المهام', icon: Target },
  { href: '/deposit', label: 'إيداع', icon: ArrowDownToLine },
  { href: '/withdraw', label: 'سحب', icon: ArrowUpFromLine },
  { href: '/referrals', label: 'الإحالات', icon: Users },
  { href: '/security', label: 'الأمان', icon: Shield },
];

// ============ Icons Map ============
const NOTIF_ICONS = {
  crown: Crown,
  wallet: Wallet,
  info: Info,
  gift: Gift,
  bell: Bell,
};

// ============ Priority Colors ============
const PRIORITY_COLORS = {
  low: '#7d8aab',
  normal: '#22d3ee',
  high: '#f5b041',
  urgent: '#ea3943',
};

// ============ Format Relative Time ============
function formatRelativeTime(date) {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now - d) / 1000);

  if (diff < 60) return 'الآن';
  if (diff < 3600) return `قبل ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `قبل ${Math.floor(diff / 3600)} ساعة`;
  if (diff < 604800) return `قبل ${Math.floor(diff / 86400)} يوم`;
  return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
}

export default function Header() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const toast = useToast();
  const { confirm } = useConfirm();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // ============ جلب الإشعارات ============
  useEffect(() => {
    if (user) {
      loadNotifs();
      const iv = setInterval(loadNotifs, 30000);
      return () => clearInterval(iv);
    }
  }, [user]);

  async function loadNotifs() {
    try {
      const res = await fetch('/api/user/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
  }

  // ============ تعليم إشعار واحد كمقروء ============
  async function markRead(id) {
    try {
      await fetch('/api/user/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  }

  // ============ تعليم الكل كمقروء ============
  async function markAllRead() {
    try {
      await fetch('/api/user/notifications', { method: 'POST' });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  }

  // ============ فتح الإشعار ============
  function handleNotifClick(notif) {
    if (!notif.isRead) markRead(notif.id);

    if (notif.actionUrl) {
      window.location.href = notif.actionUrl;
    }
  }

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
            type="button"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* ============ الإشعارات ============ */}
          <div className={styles.dropdownWrap}>
            <button
              className={styles.iconBtn}
              aria-label="الإشعارات"
              onClick={() => {
                setShowNotif(!showNotif);
                setShowUser(false);
              }}
              type="button"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className={styles.badge}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div className={`${styles.dropdown} ${styles.notifDropdown}`}>
                {/* رأس القائمة */}
                <div className={styles.notifHead}>
                  <span>الإشعارات</span>
                  {unreadCount > 0 && (
                    <button
                      className={styles.markAllBtn}
                      onClick={markAllRead}
                      type="button"
                    >
                      <CheckCheck size={12} /> تعليم الكل كمقروء
                    </button>
                  )}
                </div>

                {/* القائمة */}
                {notifications.length === 0 ? (
                  <div className={styles.emptyNotif}>
                    <Bell size={24} />
                    <span>لا توجد إشعارات</span>
                  </div>
                ) : (
                  <div className={styles.notifList}>
                    {notifications.slice(0, 10).map((n) => {
                      const Icon = NOTIF_ICONS[n.icon] || Bell;
                      const color = PRIORITY_COLORS[n.priority] || '#22d3ee';

                      return (
                        <div
                          key={n.id}
                          className={`${styles.notifItem} ${
                            !n.isRead ? styles.unreadNotif : ''
                          }`}
                          onClick={() => handleNotifClick(n)}
                          role="button"
                          tabIndex={0}
                        >
                          <div
                            className={styles.notifIcon}
                            style={{
                              background: color + '22',
                              color: color,
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <div className={styles.notifContent}>
                            <div className={styles.notifTitle}>{n.title}</div>
                            <div className={styles.notifMsg}>{n.message}</div>
                            <div className={styles.notifDate}>
                              {formatRelativeTime(n.createdAt)}
                            </div>
                          </div>
                          {!n.isRead && (
                            <span className={styles.unreadDot} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ============ بطاقة المستخدم ============ */}
          <div className={styles.dropdownWrap}>
            <button
              className={styles.userBtn}
              onClick={() => {
                setShowUser(!showUser);
                setShowNotif(false);
              }}
              type="button"
            >
              <div className={styles.avatar}>
                {user?.username?.slice(0, 2).toUpperCase() || 'AV'}
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>
                  {user?.fullName || user?.username || 'مستخدم'}
                </div>
                <div className={styles.userRole}>
                  {user?.accountLevel === 0 && 'مبتدئ'}
                  {user?.accountLevel === 1 && 'مستوى 1'}
                  {user?.accountLevel === 2 && 'مستوى 2'}
                  {user?.accountLevel === 3 && 'مستوى 3'}
                </div>
              </div>
            </button>

            {showUser && (
              <div className={styles.dropdown}>
                <Link
                  href="/settings"
                  className={styles.dropdownItem}
                  onClick={() => setShowUser(false)}
                >
                  <User size={14} /> الملف الشخصي
                </Link>
                <Link
                  href="/deposit"
                  className={styles.dropdownItem}
                  onClick={() => setShowUser(false)}
                >
                  <Wallet size={14} /> محفظتي
                </Link>
                <Link
                  href="/security"
                  className={styles.dropdownItem}
                  onClick={() => setShowUser(false)}
                >
                  <Shield size={14} /> الأمان
                </Link>
                <div className={styles.dropdownDivider} />
                <button
                  className={`${styles.dropdownItem} ${styles.danger}`}
                  type="button"
                  onClick={async () => {
                    const ok = await confirm({
                      title: 'تسجيل الخروج',
                      message: 'هل أنت متأكد من تسجيل الخروج من حسابك؟',
                      confirmText: 'تسجيل الخروج',
                      cancelText: 'إلغاء',
                      type: 'danger',
                    });
                    if (ok) {
                      await logout();
                      toast.success('تم تسجيل الخروج بنجاح');
                    }
                  }}
                >
                  <LogOut size={14} /> تسجيل الخروج
                </button>
              </div>
            )}
          </div>

          <button
            className={styles.mobileToggle}
            aria-label="القائمة"
            onClick={() => setMobileOpen(!mobileOpen)}
            type="button"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}