'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut, Bell, Search, RefreshCw, Shield, User
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useConfirm } from '@/context/ConfirmContext';
import { useToast } from '@/context/ToastContext';
import styles from './AdminHeader.module.css';

export default function AdminHeader() {
  const router = useRouter();
  const { admin, adminLogout } = useAdmin();
  const { confirm } = useConfirm();
  const toast = useToast();
  const [notifCount, setNotifCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifCount();
  }, []);

  async function loadNotifCount() {
    try {
      const res = await fetch('/api/admin/notifications/count');
      if (res.ok) {
        const data = await res.json();
        setNotifCount(data.count || 0);
      }
    } catch {}
  }

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'تسجيل الخروج',
      message: 'هل أنت متأكد من تسجيل الخروج من لوحة التحكم؟',
      confirmText: 'تسجيل الخروج',
      cancelText: 'إلغاء',
      type: 'danger',
    });
    if (!ok) return;

    await adminLogout();
    toast.success('تم تسجيل الخروج');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifCount();
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>
          <Shield size={18} />
          لوحة تحكم الأدمن
        </h1>
        <div className={styles.badge}>
          <span className={styles.dot} />
          <span>متصل</span>
        </div>
      </div>

      <div className={styles.right}>
        <button
          className={styles.iconBtn}
          onClick={handleRefresh}
          disabled={refreshing}
          title="تحديث"
        >
          <RefreshCw size={16} className={refreshing ? styles.spin : ''} />
        </button>

        <button
          className={styles.iconBtn}
          onClick={() => router.push('/admin/notifications')}
          title="الإشعارات"
        >
          <Bell size={16} />
          {notifCount > 0 && (
            <span className={styles.notifBadge}>{notifCount}</span>
          )}
        </button>

        <button
          className={styles.logoutBtn}
          onClick={handleLogout}
          title="تسجيل الخروج"
        >
          <LogOut size={16} />
          <span>خروج</span>
        </button>
      </div>
    </header>
  );
}