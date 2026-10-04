'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail, Lock, Eye, EyeOff, Loader2, AlertCircle,
  CheckCircle2, ArrowLeft, KeyRound, ShieldCheck
} from 'lucide-react';
import styles from './forgot.module.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: email, 2: reset
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ============ STEP 1: إرسال OTP ============
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('تم إرسال الرمز إلى بريدك');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============ STEP 2: إعادة التعيين ============
  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    if (newPassword.length < 8) {
      setError('كلمة المرور 8 أحرف على الأقل');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('تم تغيير كلمة المرور! جاري التحويل...');

      setTimeout(() => router.push('/login'), 2000);
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
            <KeyRound size={28} />
          </div>
          <h1 className={styles.title}>
            {step === 1 ? 'استعادة كلمة المرور' : 'إعادة التعيين'}
          </h1>
          <p className={styles.subtitle}>
            {step === 1
              ? 'أدخل بريدك الإلكتروني لإرسال رمز التحقق'
              : 'أدخل الرمز وكلمة المرور الجديدة'}
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {success && (
          <div className={styles.success}>
            <CheckCircle2 size={14} />
            {success}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className={styles.form}>
            <label className={styles.field}>
              <span>البريد الإلكتروني</span>
              <div className={styles.inputWrap}>
                <Mail size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </label>

            <button
              type="submit"
              className={styles.submit}
              disabled={loading}
            >
              {loading ? (
                <><Loader2 size={16} className={styles.spin} /> جاري الإرسال...</>
              ) : (
                <>إرسال رمز التحقق</>
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleReset} className={styles.form}>
            <label className={styles.field}>
              <span>الرمز (6 أرقام)</span>
              <div className={styles.inputWrap}>
                <ShieldCheck size={16} />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className={`${styles.input} mono`}
                  required
                />
              </div>
            </label>

            <label className={styles.field}>
              <span>كلمة المرور الجديدة</span>
              <div className={styles.inputWrap}>
                <Lock size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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

            <label className={styles.field}>
              <span>تأكيد كلمة المرور</span>
              <div className={styles.inputWrap}>
                <Lock size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                {confirmPassword && newPassword === confirmPassword && (
                  <CheckCircle2 size={14} className="text-green" />
                )}
              </div>
            </label>

            <button
              type="submit"
              className={styles.submit}
              disabled={loading}
            >
              {loading ? (
                <><Loader2 size={16} className={styles.spin} /> جاري التغيير...</>
              ) : (
                <>تغيير كلمة المرور</>
              )}
            </button>
          </form>
        )}

        <div className={styles.footer}>
          <Link href="/login" className={styles.link}>
            <ArrowLeft size={12} /> العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}