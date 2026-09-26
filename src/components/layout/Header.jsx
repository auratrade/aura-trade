'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Bell, CheckCheck, Crown, Wallet, Info, Gift,
  LayoutDashboard, Target, ArrowDownToLine, ArrowUpFromLine,
  Users, Shield, Moon, Sun, User, X, LogOut,
  MoreHorizontal, Settings
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import styles from './Header.module.css';
import { useToast } from '@/context/ToastContext';
import { useConfirm } from '@/context/ConfirmContext';

// ============ روابط التنقل الأساسية (تظهر في الأسفل) ============
const PRIMARY_LINKS = [
  { href: '/dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/missions', label: 'المهام', icon: Target },
  { href: '/deposit', label: 'إيداع', icon: ArrowDownToLine },
  { href: '/withdraw', label: 'سحب', icon: ArrowUpFromLine },
  { href: '/referrals', label: 'الإحالات', icon: Users },
];

// ============ روابط ثانوية (في قائمة المزيد) ============
const MORE_LINKS = [
  { href: '/security', label: 'الأمان', icon: Shield },
  { href: '/settings', label: 'الإعدادات', icon: Settings },
];

// ============ Icons Map ============
const NOTIF_ICONS = {
  crown: Crown,
  wallet: Wallet,
  info: Info,
  gift: Gift,
  bell: Bell,
};

const PRIORITY_COLORS = {
  low: '#7d8aab',
  normal: '#22d3ee',
  high: '#f5b041',
  urgent: '#ea3943',
};

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

  const [showNotif, setShowNotif] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notifRef = useRef(null);
  const userRef = useRef(null);
  const moreRef = useRef(null);

  // ============ جلب الإشعارات ============
  useEffect(() => {
    if (user) {
      loadNotifs();
      const iv = setInterval(loadNotifs, 30000);
      return () => clearInterval(iv);
    }
  }, [user]);

  // ============ إغلاق القوائم عند النقر خارجها ============
  useEffect(() => {
    function handleClickOutside(event) {
      if (showNotif && notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
      if (showUser && userRef.current && !userRef.current.contains(event.target)) {
        setShowUser(false);
      }
      if (showMore && moreRef.current && !moreRef.current.contains(event.target)) {
        setShowMore(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showNotif, showUser, showMore]);

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

  async function markAllRead() {
    try {
      await fetch('/api/user/notifications', { method: 'POST' });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  }

  function handleNotifClick(notif) {
    if (!notif.isRead) markRead(notif.id);
    if (notif.actionUrl) {
      window.location.href = notif.actionUrl;
    }
  }

  return (
    <>
      {/* ============ Bottom Navigation Bar ============ */}
      <nav className={styles.bottomNav}>
        <div className={styles.navInner}>
          {/* ============ PRIMARY LINKS ============ */}
          {PRIMARY_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.navItem} ${active ? styles.activeItem : ''}`}
              >
                <div className={styles.navIconWrap}>
                  <Icon size={20} />
                  {active && <span className={styles.activeDot} />}
                </div>
                <span className={styles.navLabel}>{label}</span>
              </Link>
            );
          })}

          {/* ============ MORE MENU ============ */}
          <div className={styles.dropdownWrap} ref={moreRef}>
            <button
              className={styles.navItem}
              onClick={() => {
                setShowMore(!showMore);
                setShowUser(false);
                setShowNotif(false);
              }}
              type="button"
            >
              <div className={styles.navIconWrap}>
                <MoreHorizontal size={20} />
              </div>
              <span className={styles.navLabel}>المزيد</span>
            </button>

            {showMore && (
              <div className={`${styles.dropdown} ${styles.moreDropdown}`}>
                {MORE_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={styles.dropdownItem}
                    onClick={() => setShowMore(false)}
                  >
                    <Icon size={16} /> {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ============ NOTIFICATIONS ============ */}
          <div className={styles.dropdownWrap} ref={notifRef}>
            <button
              className={styles.navItem}
              onClick={() => {
                // إذا كان سيتم فتح الإشعارات، علّم الكل كمقروء
                if (!showNotif && unreadCount > 0) {
                  markAllRead();
                }
                setShowNotif(!showNotif);
                setShowUser(false);
                setShowMore(false);
              }}
              type="button"
            >
              <div className={styles.navIconWrap}>
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className={styles.badge}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={styles.navLabel}>الإشعارات</span>
            </button>

            {showNotif && (
              <div className={`${styles.dropdown} ${styles.notifDropdown}`}>
                <div className={styles.notifHead}>
                  <span>الإشعارات</span>
                  {unreadCount > 0 && (
                    <button
                      className={styles.markAllBtn}
                      onClick={markAllRead}
                      type="button"
                    >
                      <CheckCheck size={12} /> تعليم الكل
                    </button>
                  )}
                </div>

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
                          {!n.isRead && <span className={styles.unreadDot} />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ============ USER MENU ============ */}
          <div className={styles.dropdownWrap} ref={userRef}>
            <button
              className={styles.navItem}
              onClick={() => {
                setShowUser(!showUser);
                setShowNotif(false);
                setShowMore(false);
              }}
              type="button"
            >
              <div className={styles.userAvatar}>
                {user?.username?.slice(0, 2).toUpperCase() || 'AV'}
              </div>
              <span className={styles.navLabel}>
                {user?.username?.slice(0, 8) || 'حسابي'}
              </span>
            </button>

            {showUser && (
              <div className={`${styles.dropdown} ${styles.userDropdown}`}>
                <div className={styles.userHead}>
                  <div className={styles.userHeadAvatar}>
                    {user?.username?.slice(0, 2).toUpperCase() || 'AV'}
                  </div>
                  <div>
                    <div className={styles.userHeadName}>
                      {user?.fullName || user?.username || 'مستخدم'}
                    </div>
                    <div className={styles.userHeadRole}>
                      {user?.accountLevel === 0 && 'مبتدئ'}
                      {user?.accountLevel === 1 && 'مستوى 1'}
                      {user?.accountLevel === 2 && 'مستوى 2'}
                      {user?.accountLevel === 3 && 'مستوى 3'}
                    </div>
                  </div>
                </div>

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
                  className={styles.dropdownItem}
                  onClick={() => {
                    toggle();
                    setShowUser(false);
                  }}
                  type="button"
                >
                  {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                  {theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
                </button>

                <div className={styles.dropdownDivider} />

                <button
                  className={`${styles.dropdownItem} ${styles.danger}`}
                  type="button"
                  onClick={async () => {
                    const ok = await confirm({
                      title: 'تسجيل الخروج',
                      message: 'هل أنت متأكد من تسجيل الخروج؟',
                      confirmText: 'تسجيل الخروج',
                      cancelText: 'إلغاء',
                      type: 'danger',
                    });
                    if (ok) {
                      await logout();
                      toast.success('تم تسجيل الخروج');
                    }
                  }}
                >
                  <LogOut size={14} /> تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}