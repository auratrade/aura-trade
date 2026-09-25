'use client';
import { useState } from 'react';
import { X, Target, Loader2, AlertCircle, Play } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import styles from './MissionModal.module.css';

export default function MissionModal({ onClose, onRefresh }) {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('الرجاء إدخال اسم المهمة');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/admin/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل إنشاء المهمة');

      toast.success('✅ تم بدء المهمة! ستنتهي بعد 60 دقيقة');
      onRefresh?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrap}>
              <Target size={22} />
            </div>
            <div>
              <h3 className={styles.title}>إضافة مهمة جديدة</h3>
              <p className={styles.subtitle}>ستبدأ فوراً وتنتهي بعد 60 دقيقة</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className={styles.body}>
          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <label className={styles.field}>
            <span>اسم المهمة</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: شراء سهم NVIDIA"
              className={styles.input}
              autoFocus
              maxLength={100}
            />
          </label>

          <div className={styles.infoBox}>
            <Play size={14} />
            <span>
              المهمة ستبدأ <b>فوراً</b> وستنتهي تلقائياً بعد <b>60 دقيقة</b> من الآن.
              يمكنك إنهاؤها يدوياً في أي وقت.
            </span>
          </div>

          {/* Footer */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={saving}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={styles.startBtn}
              disabled={saving}
            >
              {saving ? (
                <><Loader2 size={14} className={styles.spin} /> جاري البدء...</>
              ) : (
                <><Play size={14} /> بدء المهمة</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}