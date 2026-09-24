'use client';
import { useState, useEffect } from 'react';
import { Bell, RefreshCw, CheckCheck, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import styles from './notifications.module.css';

export default function AdminNotificationsPage() {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function markAllRead() {
    await fetch('/api/admin/notifications', { method: 'POST' });
    toast.success('تم تعليم الكل كمقروء');
    loadData();
  }

  const getIcon = (type) => {
    if (type === 'deposit') return <CheckCircle2 size={16} />;
    if (type === 'withdraw') return <XCircle size={16} />;
    return <Bell size={16} />;
  };

  const formatDate = (d) =>
    new Date(d).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>
          <Bell size={24} /> الإشعارات
        </h1>
        <div className={styles.actions}>
          <button className={styles.markBtn} onClick={markAllRead}>
            <CheckCheck size={14} /> تعليم الكل كمقروء
          </button>
          <button className={styles.refreshBtn} onClick={loadData}>
            <RefreshCw size={14} className={loading ? styles.spin : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>جاري التحميل...</div>
      ) : notifications.length === 0 ? (
        <div className={styles.empty}>
          <Bell size={32} />
          <p>لا توجد إشعارات</p>
        </div>
      ) : (
        <div className={styles.list}>
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`${styles.item} ${!n.isRead ? styles.unread : ''}`}
            >
              <div className={`${styles.icon} ${styles[n.type]}`}>
                {getIcon(n.type)}
              </div>
              <div className={styles.content}>
                <div className={styles.title}>{n.title}</div>
                <div className={styles.message}>{n.message}</div>
                <div className={styles.date}>{formatDate(n.createdAt)}</div>
              </div>
              {!n.isRead && <span className={styles.dot} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}