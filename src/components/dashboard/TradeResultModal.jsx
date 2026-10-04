'use client';
import { useEffect } from 'react';
import {
  TrendingDown, X, Clock, DollarSign, Hash, AlertCircle
} from 'lucide-react';
import styles from './TradeResultModal.module.css';

export default function TradeResultModal({ result, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!result) return null;

  const { direction, symbol, entryPrice, exitPrice, amount, loss, balanceAfter } = result;
  const lossPct = ((loss / amount) * 100).toFixed(2);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="إغلاق">
          <X size={18} />
        </button>

        {/* Icon */}
        <div className={styles.iconWrap}>
          <TrendingDown size={36} />
        </div>

        {/* Title */}
        <h3 className={styles.title}>تم إغلاق الصفقة</h3>
        <p className={styles.subtitle}>
          {direction === 'up' ? 'صفقة صعود' : 'صفقة هبوط'} على {symbol}
        </p>

        {/* Result Box */}
        <div className={styles.resultBox}>
          <div className={styles.resultLabel}>صافي النتيجة</div>
          <div className={`${styles.resultValue} mono`}>
            -${loss.toFixed(2)}
          </div>
          <div className={styles.resultPct}>
            <AlertCircle size={12} />
            {lossPct}% من قيمة الصفقة
          </div>
        </div>

        {/* Details */}
        <div className={styles.details}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>
              <Hash size={12} /> سعر الدخول
            </span>
            <b className="mono">${entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</b>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>
              <Hash size={12} /> سعر الخروج
            </span>
            <b className="mono">${exitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</b>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>
              <DollarSign size={12} /> قيمة الصفقة
            </span>
            <b className="mono">${amount.toFixed(2)}</b>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>
              <Clock size={12} /> المدة
            </span>
            <b className="mono">~{Math.floor(Math.random() * 30 + 15)} ثانية</b>
          </div>
          <div className={`${styles.row} ${styles.rowTotal}`}>
            <span className={styles.rowLabel}>الرصيد المتبقي</span>
            <b className="mono text-gold">${balanceAfter.toFixed(2)}</b>
          </div>
        </div>

        {/* Hint */}
        <div className={styles.hint}>
          <AlertCircle size={14} />
          <span>
            هذه صفقة تجريبية. يمكنك المتابعة والمحاولة مرة أخرى.
          </span>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.retryBtn} onClick={onClose}>
            محاولة أخرى
          </button>
        </div>
      </div>
    </div>
  );
}