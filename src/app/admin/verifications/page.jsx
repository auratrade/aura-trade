'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Shield, RefreshCw, Eye, Clock, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import VerificationDetail from '@/components/admin/VerificationDetail';
import styles from './verifications.module.css';

const STATUS_TABS = [
  { value: 'pending', label: 'قيد المراجعة', color: '#f5b041' },
  { value: 'approved', label: 'موافق عليها', color: '#16c784' },
  { value: 'rejected', label: 'مرفوضة', color: '#ea3943' },
  { value: 'all', label: 'الكل', color: '#7d8aab' },
];

export default function AdminVerificationsPage() {
  const toast = useToast();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending');
  const [selected, setSelected] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/verifications?status=${status}`);
      if (res.ok) {
        const data = await res.json();
        setVerifications(data.verifications || []);
      }
    } catch (e) {
      console.error(e);
      toast.error('فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, [status, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getStatusBadge = (s) => {
    const config = {
      pending: { label: 'قيد المراجعة', color: '#f5b041', icon: Clock },
      approved: { label: 'موافق عليه', color: '#16c784', icon: CheckCircle2 },
      rejected: { label: 'مرفوض', color: '#ea3943', icon: XCircle },
    };
    return config[s] || config.pending;
  };

  const getTypeLabel = (t) => {
    const map = {
      national_id: 'هوية وطنية',
      residence: 'بطاقة إقامة',
      passport: 'جواز سفر',
    };
    return map[t] || t;
  };

  const formatDate = (d) =>
    new Date(d).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>
            <Shield size={24} /> التحقق من الهوية
          </h1>
          <p className={styles.pageSubtitle}>
            {verifications.length} طلب
          </p>
        </div>
        <button
          className={styles.refreshBtn}
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? styles.spin : ''} />
          تحديث
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tab} ${status === tab.value ? styles.active : ''}`}
            onClick={() => setStatus(tab.value)}
            style={status === tab.value ? { color: tab.color, borderColor: tab.color } : {}}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.loading}>
            <RefreshCw size={20} className={styles.spin} />
            جاري التحميل...
          </div>
        ) : verifications.length === 0 ? (
          <div className={styles.empty}>
            <Shield size={32} />
            <p>لا توجد طلبات {status === 'pending' ? 'معلّقة' : ''}</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>البريد</th>
                <th>نوع الوثيقة</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((v) => {
                const badge = getStatusBadge(v.status);
                const BadgeIcon = badge.icon;
                return (
                  <tr key={v.id}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>
                          {(v.user?.username || '?').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className={styles.userName}>
                            {v.user?.username || 'غير معروف'}
                          </div>
                          <div className={styles.userFullName}>
                            {v.user?.fullName || '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.email}>{v.user?.email}</span>
                    </td>
                    <td>
                      <span className={styles.typeBadge}>
                        {getTypeLabel(v.idType)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={styles.statusBadge}
                        style={{
                          background: badge.color + '22',
                          color: badge.color,
                        }}
                      >
                        <BadgeIcon size={11} /> {badge.label}
                      </span>
                    </td>
                    <td>
                      <span className={styles.date}>
                        {formatDate(v.createdAt)}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.viewBtn}
                        onClick={() => setSelected(v)}
                        title="عرض التفاصيل"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <VerificationDetail
          verification={selected}
          onClose={() => setSelected(null)}
          onRefresh={loadData}
        />
      )}
    </div>
  );
}