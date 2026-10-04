'use client';
import { useState } from 'react';
import {
  Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle,
  KeyRound
} from 'lucide-react';
import styles from './login.module.css';

export default function SecretAdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'فشل تسجيل الدخول');
      }

      // ✅ اذهب إلى الرابط المشفر
      if (data.redirectTo) {
        window.location.href = data.redirectTo;
      } else {
        throw new Error('لم يتم استلام رابط التحويل');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.glow} />

      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Shield size={32} />
          </div>
          <h1 className={styles.title}>منطقة محظورة</h1>
          <p className={styles.subtitle}>
            هذه المنطقة محمية. الدخول للمصرح لهم فقط.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <label className={styles.field}>
            <span>البريد الإلكتروني</span>
            <div className={styles.inputWrap}>
              <Mail size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aura-trade.com"
                required
                autoComplete="email"
              />
            </div>
          </label>

          <label className={styles.field}>
            <span>كلمة المرور</span>
            <div className={styles.inputWrap}>
              <Lock size={16} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className={styles.eyeBtn}
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className={styles.submit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className={styles.spin} />
                جاري التحقق...
              </>
            ) : (
              <>
                <KeyRound size={16} />
                دخول آمن
              </>
            )}
          </button>
        </form>

        <div className={styles.securityNote}>
          <Shield size={12} />
          <span>
            محمي بتشفير AES-256 • يتم تسجيل جميع محاولات الدخول
          </span>
        </div>
      </div>
    </div>
  );
}