'use client';
import { useState } from 'react';
import {
  X, User, Mail, Crown, DollarSign, Wallet, TrendingUp,
  Save, Loader2, AlertCircle, Lock, CheckCircle2, XCircle
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import styles from './UserModal.module.css';

const LEVELS = [
  { value: 0, label: 'مبتدئ', color: '#7d8aab' },
  { value: 1, label: 'مستوى 1', color: '#cd7f32' },
  { value: 2, label: 'مستوى 2', color: '#c0c0c0' },
  { value: 3, label: 'مستوى 3', color: '#f5b041' },
];

export default function UserModal({ user, mode = 'view', onClose, onRefresh }) {
  const toast = useToast();
  const [editing, setEditing] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    username: user.username || '',
    accountLevel: user.accountLevel || 0,
    availableBalance: user.availableBalance || 0,
    lockedBalance: user.lockedBalance || 0,
    totalProfit: user.totalProfit || 0,
    isVerified: user.isVerified || false,
  });

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [key]: value });
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        username: form.username,
        accountLevel: parseInt(form.accountLevel),
        availableBalance: parseFloat(form.availableBalance),
        lockedBalance: parseFloat(form.lockedBalance),
        totalProfit: parseFloat(form.totalProfit),
        isVerified: form.isVerified,
      };

      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل التعديل');

      toast.success('تم حفظ التعديلات');
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
            <div className={styles.avatar}>
              {(user.username || '?').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className={styles.title}>
                {user.fullName || user.username}
              </h3>
              <p className={styles.subtitle}>@{user.username}</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Info Grid */}
          <div className={styles.grid}>
            <Field
              icon={User}
              label="الاسم الكامل"
              value={form.fullName}
              onChange={update('fullName')}
              editing={editing}
            />
            <Field
              icon={Mail}
              label="البريد الإلكتروني"
              value={form.email}
              onChange={update('email')}
              editing={editing}
              type="email"
            />
            <Field
              icon={User}
              label="اسم المستخدم"
              value={form.username}
              onChange={update('username')}
              editing={editing}
            />
            <Field
              icon={Crown}
              label="المستوى"
              value={form.accountLevel}
              onChange={update('accountLevel')}
              editing={editing}
              type="select"
              options={LEVELS.map((l) => ({
                value: l.value,
                label: l.label,
              }))}
            />
            <Field
              icon={Wallet}
              label="الرصيد المتاح (USDT)"
              value={form.availableBalance}
              onChange={update('availableBalance')}
              editing={editing}
              type="number"
            />
            <Field
              icon={Lock}
              label="الرصيد المقفل (USDT)"
              value={form.lockedBalance}
              onChange={update('lockedBalance')}
              editing={editing}
              type="number"
            />
            <Field
              icon={TrendingUp}
              label="إجمالي الأرباح (USDT)"
              value={form.totalProfit}
              onChange={update('totalProfit')}
              editing={editing}
              type="number"
            />
            <div className={styles.field}>
              <label>
                <CheckCircle2 size={14} />
                حالة التوثيق
              </label>
              {editing ? (
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={form.isVerified}
                    onChange={update('isVerified')}
                  />
                  <span>{form.isVerified ? 'موثق' : 'غير موثق'}</span>
                </label>
              ) : (
                <div className={`${styles.value} ${form.isVerified ? styles.verified : styles.unverified}`}>
                  {form.isVerified ? (
                    <><CheckCircle2 size={14} /> موثق</>
                  ) : (
                    <><XCircle size={14} /> غير موثق</>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          {!editing && (
            <div className={styles.statsGrid}>
              <StatBox label="الإيداعات" value={user.totalDeposited} />
              <StatBox label="السحوبات" value={user.totalWithdrawn} />
              <StatBox label="الإحالات" value={user.referralCount} />
              <StatBox label="إجمالي القيمة" value={user.totalValue} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          {!editing ? (
            <>
              <button className={styles.cancelBtn} onClick={onClose}>
                إغلاق
              </button>
              <button
                className={styles.saveBtn}
                onClick={() => setEditing(true)}
              >
                تعديل البيانات
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.cancelBtn}
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                إلغاء
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <><Loader2 size={14} className={styles.spin} /> جاري الحفظ...</>
                ) : (
                  <><Save size={14} /> حفظ التعديلات</>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ Helper Components ============
function Field({ icon: Icon, label, value, onChange, editing, type = 'text', options }) {
  return (
    <div className={styles.field}>
      <label>
        <Icon size={14} />
        {label}
      </label>
      {editing ? (
        type === 'select' ? (
          <select value={value} onChange={onChange} className={styles.input}>
            {options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            className={styles.input}
            step={type === 'number' ? '0.01' : undefined}
          />
        )
      ) : (
        <div className={styles.value}>{value}</div>
      )}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className={styles.statBox}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>
        ${Number(value || 0).toFixed(2)}
      </div>
    </div>
  );
}