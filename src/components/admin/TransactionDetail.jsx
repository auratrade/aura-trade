'use client';
import { useState } from 'react';
import {
  X, User, Mail, DollarSign, Hash, Clock, Calendar,
  CheckCircle2, XCircle, AlertCircle, Loader2, ExternalLink,
  Copy, Shield
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useConfirm } from '@/context/ConfirmContext';
import styles from './TransactionDetail.module.css';

export default function TransactionDetail({ transaction, onClose, onRefresh }) {
  const toast = useToast();
  const { confirm } = useConfirm();
  const [loading, setLoading] = useState('');
  const [reason, setReason] = useState('');
  const [externalTxid, setExternalTxid] = useState('');
  const [showReject, setShowReject] = useState(false);

  const isDeposit = transaction.type === 'deposit';
  const isPending = transaction.status === 'pending';

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    toast.success('تم النسخ');
  };

  const handleAction = async (action) => {
    if (action === 'reject' && !showReject) {
      setShowReject(true);
      return;
    }

    const ok = await confirm({
      title: action === 'approve' ? 'موافقة على العملية' : 'رفض العملية',
      message:
        action === 'approve'
          ? `هل أنت متأكد من الموافقة على ${isDeposit ? 'إيداع' : 'سحب'} $${transaction.amount} USDT؟`
          : `هل أنت متأكد من رفض هذه العملية؟`,
      confirmText: action === 'approve' ? 'موافقة' : 'رفض',
      type: action === 'approve' ? 'success' : 'danger',
    });

    if (!ok) return;

    setLoading(action);
    try {
      const url = isDeposit
        ? `/api/admin/deposits/${transaction.id}`
        : `/api/admin/withdrawals/${transaction.id}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reason: reason || undefined,
          externalTxid: externalTxid || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشلت العملية');

      toast.success(
        action === 'approve' ? 'تمت الموافقة بنجاح' : 'تم الرفض'
      );
      onRefresh?.();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading('');
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={`${styles.typeIcon} ${isDeposit ? styles.dep : styles.wd}`}>
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className={styles.title}>
                {isDeposit ? 'طلب إيداع' : 'طلب سحب'}
              </h3>
              <p className={styles.subtitle}>
                {formatDate(transaction.createdAt)}
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Amount Box */}
        <div className={`${styles.amountBox} ${isDeposit ? styles.amountDep : styles.amountWd}`}>
          <div className={styles.amountLabel}>المبلغ</div>
          <div className={styles.amountValue}>
            ${transaction.amount.toFixed(2)} <span>USDT</span>
          </div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <Row icon={User} label="المستخدم" value={transaction.user?.username} />
          <Row icon={Mail} label="البريد" value={transaction.user?.email} />
          <Row icon={Shield} label="المستوى" value={`مستوى ${transaction.user?.accountLevel || 0}`} />
          <Row icon={Hash} label="الشبكة" value={transaction.network} />

          {isDeposit && transaction.txid && (
            <div className={styles.row}>
              <div className={styles.rowLabel}>
                <Hash size={14} /> TXID
              </div>
              <div className={styles.rowValue}>
                <span className="mono">{transaction.txid}</span>
                <button
                  className={styles.copyBtn}
                  onClick={() => copyToClipboard(transaction.txid)}
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
          )}

          {!isDeposit && transaction.address && (
            <div className={styles.row}>
              <div className={styles.rowLabel}>
                <Hash size={14} /> العنوان
              </div>
              <div className={styles.rowValue}>
                <span className="mono">{transaction.address}</span>
                <button
                  className={styles.copyBtn}
                  onClick={() => copyToClipboard(transaction.address)}
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
          )}

          <Row icon={Clock} label="الحالة" value={transaction.status} />
          <Row icon={Calendar} label="المعرّف" value={transaction.id} small />

          {/* رفض: سبب */}
          {showReject && (
            <div className={styles.reasonBox}>
              <label>سبب الرفض:</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="اكتب السبب (اختياري)..."
                rows={3}
              />
              <div className={styles.rejectActions}>
                <button
                  className={styles.cancelRejectBtn}
                  onClick={() => setShowReject(false)}
                >
                  إلغاء
                </button>
                <button
                  className={styles.confirmRejectBtn}
                  onClick={() => handleAction('reject')}
                  disabled={loading === 'reject'}
                >
                  {loading === 'reject' ? 'جاري...' : 'تأكيد الرفض'}
                </button>
              </div>
            </div>
          )}

          {/* موافقة سحب: TXID خارجي */}
          {!isDeposit && isPending && !showReject && (
            <div className={styles.reasonBox}>
              <label>هاش التحويل الخارجي (اختياري):</label>
              <input
                type="text"
                value={externalTxid}
                onChange={(e) => setExternalTxid(e.target.value)}
                placeholder="0x..."
                className={styles.txidInput}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {isPending && !showReject && (
          <div className={styles.footer}>
            <button
              className={styles.rejectBtn}
              onClick={() => handleAction('reject')}
              disabled={!!loading}
            >
              {loading === 'reject' ? (
                <><Loader2 size={14} className={styles.spin} /> جاري...</>
              ) : (
                <><XCircle size={14} /> رفض</>
              )}
            </button>
            <button
              className={styles.approveBtn}
              onClick={() => handleAction('approve')}
              disabled={!!loading}
            >
              {loading === 'approve' ? (
                <><Loader2 size={14} className={styles.spin} /> جاري...</>
              ) : (
                <><CheckCircle2 size={14} /> موافقة وتنفيذ</>
              )}
            </button>
          </div>
        )}

        {!isPending && (
          <div className={`${styles.statusFooter} ${transaction.status === 'completed' ? styles.completed : styles.rejected}`}>
            {transaction.status === 'completed' ? (
              <><CheckCircle2 size={16} /> مكتملة</>
            ) : (
              <><XCircle size={16} /> مرفوضة</>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, small }) {
  return (
    <div className={styles.row}>
      <div className={styles.rowLabel}>
        <Icon size={14} /> {label}
      </div>
      <div className={`${styles.rowValue} ${small ? styles.small : ''}`}>
        {value}
      </div>
    </div>
  );
}