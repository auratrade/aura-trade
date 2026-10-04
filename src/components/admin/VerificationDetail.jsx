'use client';
import { useState } from 'react';
import {
  X, Shield, User, Mail, Calendar, CheckCircle2, XCircle,
  AlertCircle, Loader2, ZoomIn
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useConfirm } from '@/context/ConfirmContext';
import styles from './VerificationDetail.module.css';

export default function VerificationDetail({ verification, onClose, onRefresh }) {
  const toast = useToast();
  const { confirm } = useConfirm();
  const [loading, setLoading] = useState('');
  const [reason, setReason] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);

  const isPending = verification.status === 'pending';

  const getTypeLabel = (t) => {
    const map = {
      national_id: 'الهوية الوطنية',
      residence: 'بطاقة الإقامة',
      passport: 'جواز السفر',
    };
    return map[t] || t;
  };

  const handleAction = async (action) => {
    if (action === 'reject' && !showReject) {
      setShowReject(true);
      return;
    }

    const ok = await confirm({
      title: action === 'approve' ? 'موافقة على التوثيق' : 'رفض التوثيق',
      message:
        action === 'approve'
          ? 'سيتم توثيق الحساب وحذف الصور نهائياً. هل أنت متأكد؟'
          : 'سيتم رفض الطلب وحذف الصور. هل أنت متأكد؟',
      confirmText: action === 'approve' ? 'موافقة' : 'رفض',
      type: action === 'approve' ? 'success' : 'danger',
    });

    if (!ok) return;

    setLoading(action);
    try {
      const res = await fetch(`/api/admin/verifications/${verification.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason: reason || undefined }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل الإجراء');

      toast.success(action === 'approve' ? 'تم التوثيق وحذف الصور' : 'تم الرفض');
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

  const statusInfo = {
    pending: { label: 'قيد المراجعة', color: '#f5b041', icon: AlertCircle },
    approved: { label: 'موافق عليه', color: '#16c784', icon: CheckCircle2 },
    rejected: { label: 'مرفوض', color: '#ea3943', icon: XCircle },
  }[verification.status];

  const StatusIcon = statusInfo.icon;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrap} style={{ background: statusInfo.color + '22', color: statusInfo.color }}>
              <Shield size={22} />
            </div>
            <div>
              <h3 className={styles.title}>طلب تحقق هوية</h3>
              <p className={styles.subtitle}>
                <span className={styles.status} style={{ color: statusInfo.color }}>
                  <StatusIcon size={12} /> {statusInfo.label}
                </span>
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* User Info */}
          <div className={styles.userBox}>
            <div className={styles.userAvatar}>
              {(verification.user?.username || '?').slice(0, 2).toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                {verification.user?.fullName || verification.user?.username}
              </div>
              <div className={styles.userMeta}>
                <Mail size={11} /> {verification.user?.email}
              </div>
              <div className={styles.userMeta}>
                <Calendar size={11} /> {formatDate(verification.createdAt)}
              </div>
            </div>
          </div>

          {/* ID Type */}
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>نوع الوثيقة</span>
            <span className={styles.typeValue}>{getTypeLabel(verification.idType)}</span>
          </div>

          {/* Rejection Reason */}
          {verification.status === 'rejected' && verification.reason && (
            <div className={styles.reasonBox}>
              <span className={styles.reasonLabel}>سبب الرفض:</span>
              <p>{verification.reason}</p>
            </div>
          )}

          {/* Images - only if pending */}
          {isPending && (
            <>
              <div className={styles.imagesTitle}>
                <AlertCircle size={14} />
                راجع الصور بعناية
              </div>

              <div className={styles.imagesGrid}>
                {/* Front */}
                <div className={styles.imageCard}>
                  <div className={styles.imageLabel}>الصورة الأمامية</div>
                  <div
                    className={styles.imageWrap}
                    onClick={() => setZoomImage(verification.frontImage)}
                  >
                    <img src={verification.frontImage} alt="Front" />
                    <div className={styles.zoomOverlay}>
                      <ZoomIn size={20} />
                    </div>
                  </div>
                </div>

                {/* Back */}
                {verification.backImage && (
                  <div className={styles.imageCard}>
                    <div className={styles.imageLabel}>الصورة الخلفية</div>
                    <div
                      className={styles.imageWrap}
                      onClick={() => setZoomImage(verification.backImage)}
                    >
                      <img src={verification.backImage} alt="Back" />
                      <div className={styles.zoomOverlay}>
                        <ZoomIn size={20} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Selfie */}
                <div className={styles.imageCard}>
                  <div className={styles.imageLabel}>السيلفي</div>
                  <div
                    className={styles.imageWrap}
                    onClick={() => setZoomImage(verification.selfieImage)}
                  >
                    <img src={verification.selfieImage} alt="Selfie" />
                    <div className={styles.zoomOverlay}>
                      <ZoomIn size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Reason Input (for rejection) */}
          {showReject && (
            <div className={styles.reasonInput}>
              <label>سبب الرفض:</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="اكتب السبب..."
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
                <><CheckCircle2 size={14} /> موافقة وتوثيق</>
              )}
            </button>
          </div>
        )}

        {/* Zoom Modal */}
        {zoomImage && (
          <div className={styles.zoomOverlay} onClick={() => setZoomImage(null)}>
            <img src={zoomImage} alt="Zoom" onClick={(e) => e.stopPropagation()} />
            <button className={styles.zoomClose} onClick={() => setZoomImage(null)}>
              <X size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}