'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn, AlertCircle, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './login.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(identifier, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>A</div>
          <h1 className={styles.title}>تسجيل الدخول</h1>
          <p className={styles.subtitle}>مرحباً بك في AURA TRADE & INVEST</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <label className={styles.field}>
            <span>البريد الإلكتروني أو اسم المستخدم</span>
            <div className={styles.inputWrap}>
              <User size={16} />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="username"
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

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? (
              <><Loader2 size={16} className={styles.spin} /> جاري الدخول...</>
            ) : (
              <><LogIn size={16} /> دخول</>
            )}
          </button>
        </form>

        <div style={{
  textAlign: 'center',
  marginTop: 12,
  fontSize: 12,
}}>
  <Link
    href="/forgot-password"
    style={{ color: 'var(--gold)', fontWeight: 600 }}
  >
    نسيت كلمة المرور؟
  </Link>
</div>

        <div className={styles.footer}>
          <span>ليس لديك حساب؟</span>
          <Link href="/register" className={styles.link}>
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </div>
  );
}