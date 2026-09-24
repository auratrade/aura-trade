'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  ArrowUpFromLine, RefreshCw, Eye, CheckCircle2, XCircle,
  Clock, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import TransactionDetail from '@/components/admin/TransactionDetail';
import styles from './withdrawals.module.css';

const STATUS_TABS = [
  { value: 'pending', label: 'معلّقة', color: '#f5b041' },
  { value: 'completed', label: 'مكتملة', color: '#16c784' },
  { value: 'rejected', label: 'مرفوضة', color: '#ea3943' },
  { value: 'all', label: 'الكل', color: '#7d8aab' },
];

export default function AdminWithdrawalsPage() {
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/withdrawals?status=${status}&page=${page}`
      );
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error(e);
      toast.error('فشل التحميل');
    } finally {
      setLoading(false);
    }
  }, [status, page, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const formatDate = (d) => {
    return new Date(d).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (s) => {
    const config = {
      pending: { label: 'معلّقة', color: '#f5b041', icon: Clock },
      processing: { label: 'قيد المعالجة', color: '#22d3ee', icon: Clock },
      completed: { label: 'مكتملة', color: '#16c784', icon: CheckCircle2 },
      rejected: { label: 'مرفوضة', color: '#ea3943', icon: XCircle },
    };
    return config[s] || config.pending;
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>
            <ArrowUpFromLine size={24} /> طلبات السحب
          </h1>
          <p className={styles.pageSubtitle}>
            {pagination?.total || 0} طلب
          </p>
        </div>
        <button
          className={styles.refreshBtn}
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? styles.spin : ''} /> تحديث
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tab} ${status === tab.value ? styles.active : ''}`}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            style={
              status === tab.value
                ? { color: tab.color, borderColor: tab.color }
                : {}
            }
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
        ) : transactions.length === 0 ? (
          <div className={styles.empty}>
            <ArrowUpFromLine size={32} />
            <p>لا توجد طلبات {status === 'pending' ? 'معلّقة' : ''}</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>المبلغ</th>
                <th>الشبكة</th>
                <th>العنوان</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const badge = getStatusBadge(tx.status);
                const BadgeIcon = badge.icon;
                return (
                  <tr key={tx.id}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>
                          {(tx.user?.username || '?').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className={styles.userName}>
                            {tx.user?.username}
                          </div>
                          <div className={styles.userEmail}>
                            {tx.user?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`mono ${styles.amount}`}
                        style={{ color: 'var(--red)' }}
                      >
                        ${tx.amount.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span className={styles.network}>{tx.network}</span>
                    </td>
                    <td>
                      <span className={`mono ${styles.txid}`}>
                        {tx.address?.slice(0, 16)}...
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
                        {formatDate(tx.createdAt)}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.viewBtn}
                        onClick={() => setSelected(tx)}
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

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronRight size={14} /> السابق
          </button>
          <span>
            صفحة {page} من {pagination.totalPages}
          </span>
          <button
            className={styles.pageBtn}
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={page === pagination.totalPages}
          >
            التالي <ChevronLeft size={14} />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <TransactionDetail
          transaction={selected}
          onClose={() => setSelected(null)}
          onRefresh={loadData}
        />
      )}
    </div>
  );
}