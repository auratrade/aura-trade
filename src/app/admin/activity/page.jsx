'use client';
import { useState, useEffect } from 'react';
import {
  Activity, RefreshCw, User, Trash2, Edit,
  CheckCircle2, XCircle
} from 'lucide-react';
import styles from './activity.module.css';

export default function AdminActivityPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/activity');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } finally {
      setLoading(false);
    }
  }

  const getIcon = (action) => {
    if (action.includes('approve')) return <CheckCircle2 size={14} />;
    if (action.includes('reject')) return <XCircle size={14} />;
    if (action.includes('delete')) return <Trash2 size={14} />;
    if (action.includes('update')) return <Edit size={14} />;
    if (action.includes('login')) return <User size={14} />;
    return <Activity size={14} />;
  };

  const getColor = (action) => {
    if (action.includes('approve')) return '#16c784';
    if (action.includes('reject')) return '#ea3943';
    if (action.includes('delete')) return '#ea3943';
    if (action.includes('update')) return '#f5b041';
    return '#22d3ee';
  };

  const getLabel = (action) => {
    const map = {
      admin_login: 'تسجيل دخول',
      admin_logout: 'تسجيل خروج',
      approve_deposit: 'موافقة على إيداع',
      reject_deposit: 'رفض إيداع',
      approve_withdrawal: 'موافقة على سحب',
      reject_withdrawal: 'رفض سحب',
      update_user: 'تعديل مستخدم',
      delete_user: 'حذف مستخدم',
      update_admin_profile: 'تعديل ملف أدمن',
      change_admin_password: 'تغيير كلمة مرور',
    };
    return map[action] || action;
  };

  const formatDate = (d) =>
    new Date(d).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>
          <Activity size={24} /> سجل العمليات
        </h1>
        <button className={styles.refreshBtn} onClick={loadLogs}>
          <RefreshCw size={14} className={loading ? styles.spin : ''} />
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>جاري التحميل...</div>
      ) : logs.length === 0 ? (
        <div className={styles.empty}>
          <Activity size={32} />
          <p>لا يوجد سجل عمليات</p>
        </div>
      ) : (
        <div className={styles.list}>
          {logs.map((log) => {
            const color = getColor(log.action);
            return (
              <div key={log.id} className={styles.item}>
                <div className={styles.icon} style={{ background: color + '22', color }}>
                  {getIcon(log.action)}
                </div>
                <div className={styles.content}>
                  <div className={styles.title}>{getLabel(log.action)}</div>
                  {log.targetType && (
                    <div className={styles.target}>
                      {log.targetType === 'user' ? 'مستخدم' : 'معاملة'}: {log.targetId?.slice(0, 8)}...
                    </div>
                  )}
                  {log.ipAddress && (
                    <div className={styles.ip}>IP: {log.ipAddress}</div>
                  )}
                </div>
                <div className={styles.date}>{formatDate(log.createdAt)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}