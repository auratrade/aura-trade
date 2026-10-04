'use client';
import { useState } from 'react';
import {
  Settings, Shield, Lock, Key, Save, Loader2,
  AlertCircle, User
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/context/ToastContext';
import styles from './settings.module.css';

export default function AdminSettingsPage() {
  const { admin, refresh } = useAdmin();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: admin?.fullName || '',
    email: admin?.email || '',
  });

  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const updatePwd = (key) => (e) => setPwdForm({ ...pwdForm, [key]: e.target.value });

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/settings/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('تم حفظ البيانات');
      if (refresh) refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    if (pwdForm.newPassword.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/settings/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pwdForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('تم تغيير كلمة المرور');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>
          <Settings size={24} /> الإعدادات
        </h1>
      </div>

      {error && (
        <div className={styles.errorBox}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <User size={18} />
          <h2 className={styles.sectionTitle}>الملف الشخصي</h2>
        </div>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span>الاسم الكامل</span>
            <input
              type="text"
              value={form.fullName}
              onChange={update('fullName')}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span>البريد الإلكتروني</span>
            <input
              type="email"
              value={form.email}
              onChange={update('email')}
              className={styles.input}
            />
          </label>
        </div>
        <button
          className={styles.saveBtn}
          onClick={handleSaveProfile}
          disabled={saving}
        >
          {saving ? <Loader2 size={14} className={styles.spin} /> : <Save size={14} />}
          حفظ التغييرات
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <Key size={18} />
          <h2 className={styles.sectionTitle}>تغيير كلمة المرور</h2>
        </div>
        <div className={styles.grid}>
          <label className={styles.field}>
            <span>كلمة المرور الحالية</span>
            <input
              type="password"
              value={pwdForm.currentPassword}
              onChange={updatePwd('currentPassword')}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span>كلمة المرور الجديدة</span>
            <input
              type="password"
              value={pwdForm.newPassword}
              onChange={updatePwd('newPassword')}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span>تأكيد كلمة المرور</span>
            <input
              type="password"
              value={pwdForm.confirmPassword}
              onChange={updatePwd('confirmPassword')}
              className={styles.input}
            />
          </label>
        </div>
        <button
          className={styles.saveBtn}
          onClick={handleChangePassword}
          disabled={saving}
        >
          {saving ? <Loader2 size={14} className={styles.spin} /> : <Lock size={14} />}
          تغيير كلمة المرور
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <Shield size={18} />
          <h2 className={styles.sectionTitle}>معلومات الأمان</h2>
        </div>
        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <span>الدور</span>
            <b>{admin?.role === 'superadmin' ? 'مدير عام' : 'مدير'}</b>
          </div>
          <div className={styles.infoItem}>
            <span>الجلسة</span>
            <b>صالحة لمدة 4 ساعات</b>
          </div>
          <div className={styles.infoItem}>
            <span>التشفير</span>
            <b>AES-256 + bcrypt</b>
          </div>
        </div>
      </div>
    </div>
  );
}