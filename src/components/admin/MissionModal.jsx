'use client';
import { useState } from 'react';
import {
  X, Save, Loader2, AlertCircle, Target,
  TrendingUp, TrendingDown
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import styles from './MissionModal.module.css';

const DIFFICULTIES = ['سهل', 'متوسط', 'صعب'];
const ICONS = [
  { value: 'chart', label: 'مخطط' },
  { value: 'shield', label: 'درع' },
  { value: 'wallet', label: 'محفظة' },
];

export default function MissionModal({ mission, mode = 'create', onClose, onRefresh }) {
  const toast = useToast();
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    title: mission?.title || '',
    description: mission?.description || '',
    symbol: mission?.symbol || '',
    name: mission?.name || '',
    price: mission?.price || '',
    change: mission?.change || 0,
    up: mission?.up !== undefined ? mission.up : true,
    icon: mission?.icon || 'chart',
    difficulty: mission?.difficulty || 'سهل',
    timeEstimate: mission?.timeEstimate || '30 ثانية',
    reward: mission?.reward || 0,
    isActive: mission?.isActive !== undefined ? mission.isActive : true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [key]: val });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // التحقق
    if (!form.title.trim()) { setError('العنوان مطلوب'); return; }
    if (!form.description.trim()) { setError('الوصف مطلوب'); return; }
    if (!form.symbol.trim()) { setError('الرمز مطلوب'); return; }
    if (!form.name.trim()) { setError('اسم الشركة مطلوب'); return; }
    if (!form.price) { setError('السعر مطلوب'); return; }

    setSaving(true);
    try {
      const url = isEdit
        ? `/api/admin/missions/${mission.id}`
        : '/api/admin/missions';

      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل الحفظ');

      toast.success(isEdit ? 'تم تعديل المهمة' : 'تم إنشاء المهمة');
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
              <Target size={20} />
            </div>
            <div>
              <h3 className={styles.title}>
                {isEdit ? 'تعديل المهمة' : 'مهمة جديدة'}
              </h3>
              <p className={styles.subtitle}>
                {isEdit ? mission.symbol : 'أنشئ مهمة جديدة للمستخدمين'}
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className={styles.grid}>
            <label className={styles.field} style={{ gridColumn: 'span 2' }}>
              <span>عنوان المهمة *</span>
              <input
                type="text"
                value={form.title}
                onChange={update('title')}
                placeholder="مثال: شراء سهم NVIDIA"
                className={styles.input}
              />
            </label>

            <label className={styles.field} style={{ gridColumn: 'span 2' }}>
              <span>الوصف *</span>
              <textarea
                value={form.description}
                onChange={update('description')}
                placeholder="قم بشراء سهم NVIDIA..."
                rows={2}
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span>الرمز *</span>
              <input
                type="text"
                value={form.symbol}
                onChange={update('symbol')}
                placeholder="NVDA"
                className={`${styles.input} mono`}
              />
            </label>

            <label className={styles.field}>
              <span>اسم الشركة *</span>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                placeholder="NVIDIA Corp."
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span>السعر (USDT) *</span>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={update('price')}
                placeholder="134.25"
                className={`${styles.input} mono`}
              />
            </label>

            <label className={styles.field}>
              <span>التغير (%)</span>
              <input
                type="number"
                step="0.01"
                value={form.change}
                onChange={update('change')}
                placeholder="3.85"
                className={`${styles.input} mono`}
              />
            </label>

            <label className={styles.field}>
              <span>الاتجاه</span>
              <select
                value={form.up ? 'up' : 'down'}
                onChange={(e) => setForm({ ...form, up: e.target.value === 'up' })}
                className={styles.input}
              >
                <option value="up">📈 صعود</option>
                <option value="down">📉 هبوط</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>الصعوبة</span>
              <select
                value={form.difficulty}
                onChange={update('difficulty')}
                className={styles.input}
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>الأيقونة</span>
              <select
                value={form.icon}
                onChange={update('icon')}
                className={styles.input}
              >
                {ICONS.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>الوقت المتوقع</span>
              <input
                type="text"
                value={form.timeEstimate}
                onChange={update('timeEstimate')}
                placeholder="30 ثانية"
                className={styles.input}
              />
            </label>

            <label className={styles.field}>
              <span>مكافأة ثابتة (USDT) — اختياري</span>
              <input
                type="number"
                step="0.01"
                value={form.reward}
                onChange={update('reward')}
                placeholder="0 = يُحسب من الإيداع"
                className={`${styles.input} mono`}
              />
            </label>

            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={update('isActive')}
              />
              <span>المهمة نشطة (تظهر للمستخدمين)</span>
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={saving}
          >
            إلغاء
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <><Loader2 size={14} className={styles.spin} /> جاري الحفظ...</>
            ) : (
              <><Save size={14} /> {isEdit ? 'حفظ التعديلات' : 'إنشاء المهمة'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}