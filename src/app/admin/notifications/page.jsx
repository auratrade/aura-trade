'use client';
import { useState, useEffect } from 'react';
import { Bell, RefreshCw, CheckCheck, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import styles from './notifications.module.css';

export default function AdminNotificationsPage() {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    // جلب البيانات الأولية
    loadData();
    
    // بدء التحديث الدوري كل 10 ثواني
    const interval = setInterval(loadData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      setPolling(true);
      const res = await fetch('/api/admin/notifications');
      
      if (!res.ok) {
        throw new Error(`خطأ في الخادم: ${res.status}`);
      }
      
      const data = await res.json();
      setNotifications(data.notifications || []);
      setError(null);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError(err.message || 'فشل تحميل الإشعارات');
      toast.error(`خطأ: ${err.message}`);
    } finally {
      setLoading(false);
      setPolling(false);
    }
  }

  async function markAllRead() {
    try {
      const res = await fetch('/api/admin/notifications', { method: 'POST' });
      
      if (!res.ok) {
        throw new Error('فشل تعليم الإشعارات');
      }
      
      setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
      toast.success('تم تعليم جميع الإشعارات كمقروءة');
      await loadData();
    } catch (err) {
      console.error('Error marking all as read:', err);
      toast.error('خطأ: ' + err.message);
    }
  }

  async function markSingleRead(id) {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: true }),
      });
      
      if (!res.ok) {
        throw new Error('فشل تحديث الإشعار');
      }
      
      setNotifications((prev) =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Error marking single notification as read:', err);
      toast.error('خطأ: ' + err.message);
    }
  }

  async function deleteNotification(id) {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (!res.ok) {
        throw new Error('فشل حذف الإشعار');
      }
      
      setNotifications((prev) => prev.filter(n => n.id !== id));
      toast.success('تم حذف الإشعار');
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('خطأ: ' + err.message);
    }
  }

  const getIcon = (type) => {
    if (type === 'deposit') return <CheckCircle2 size={16} />;
    if (type === 'withdraw') return <XCircle size={16} />;
    if (type === 'system') return <AlertCircle size={16} />;
    return <Bell size={16} />;
  };

  const formatDate = (d) =>
    new Date(d).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <div className={styles.titleWrap}>
          <h1 className={styles.pageTitle}>
            <Bell size={24} /> الإشعارات
          </h1>
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount} جديد</span>
          )}
        </div>
        <div className={styles.actions}>
          {unreadCount > 0 && (
            <button className={styles.markBtn} onClick={markAllRead}>
              <CheckCheck size={14} /> تعليم الكل كمقروء
            </button>
          )}
          <button
            className={styles.refreshBtn}
            onClick={loadData}
            disabled={loading || polling}
          >
            <RefreshCw size={14} className={(loading || polling) ? styles.spin : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorBox}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={loadData} title="إعادة محاولة">
            <RefreshCw size={14} />
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>
          <Loader2 size={24} className={styles.spin} />
          جاري التحميل...
        </div>
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
                <div className={styles.meta}>
                  <span className={styles.date}>{formatDate(n.createdAt)}</span>
                  {n.priority && (
                    <span className={`${styles.priority} ${styles[n.priority]}`}>
                      {n.priority === 'high' && '🔴 عاجل'}
                      {n.priority === 'normal' && '🟡 عادي'}
                      {n.priority === 'low' && '🟢 منخفض'}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.actions}>
                {!n.isRead && (
                  <button
                    className={styles.actionBtn}
                    onClick={() => markSingleRead(n.id)}
                    title="تعليم كمقروء"
                  >
                    <CheckCircle2 size={14} />
                  </button>
                )}
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteNotification(n.id)}
                  title="حذف"
                >
                  ✕
                </button>
              </div>
              {!n.isRead && <span className={styles.dot} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}