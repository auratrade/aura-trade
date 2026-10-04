'use client';
import { useState } from 'react';
import {
  ArrowDownToLine, ArrowUpFromLine, Clock, CheckCircle2,
  XCircle, Loader2, ExternalLink
} from 'lucide-react';
import { transactions } from '@/data/mockData';
import styles from './TransactionsHistory.module.css';

const STATUS_MAP = {
  pending: { label: 'قيد المراجعة', icon: Clock, cls: 'pending' },
  processing: { label: 'قيد المعالجة', icon: Loader2, cls: 'processing' },
  completed: { label: 'مكتملة', icon: CheckCircle2, cls: 'completed' },
  rejected: { label: 'مرفوضة', icon: XCircle, cls: 'rejected' },
};

export default function TransactionsHistory() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter);

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h3 className={styles.title}>سجل العمليات</h3>
        <div className={styles.filters}>
          {[
            { key: 'all', label: 'الكل' },
            { key: 'deposit', label: 'إيداع' },
            { key: 'withdraw', label: 'سحب' },
          ].map(f => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${filter === f.key ? styles.filterActive : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <Clock size={24} />
          <p>لا توجد عمليات بعد</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>النوع</th>
                <th>المبلغ</th>
                <th>الشبكة</th>
                <th>التاريخ</th>
                <th>الحالة</th>
                <th>التفاصيل</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => {
                const st = STATUS_MAP[tx.status] || STATUS_MAP.pending;
                const StatusIcon = st.icon;
                const isDeposit = tx.type === 'deposit';
                return (
                  <tr key={tx.id}>
                    <td>
                      <div className={`${styles.type} ${isDeposit ? styles.dep : styles.wd}`}>
                        {isDeposit ? <ArrowDownToLine size={12} /> : <ArrowUpFromLine size={12} />}
                        {isDeposit ? 'إيداع' : 'سحب'}
                      </div>
                    </td>
                    <td className={`${styles.amount} mono ${isDeposit ? 'text-green' : 'text-red'}`}>
                      {isDeposit ? '+' : '-'}{tx.amount.toLocaleString()} USDT
                    </td>
                    <td className={styles.network}>{tx.network}</td>
                    <td className={`${styles.date} mono`}>{tx.date}</td>
                    <td>
                      <span className={`${styles.status} ${styles[st.cls]}`}>
                        <StatusIcon size={11} />
                        {st.label}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.hash} mono`}>
                        {tx.txid || tx.address || '—'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}