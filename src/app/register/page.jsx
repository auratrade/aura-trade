'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail, Lock, User, Gift, Eye, EyeOff, Loader2,
  UserPlus, AlertCircle, CheckCircle2, XCircle, Check
} from 'lucide-react';
import { registerSchema, formatZodErrors } from '@/lib/validations';
import styles from './register.module.css';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refFromUrl = searchParams.get('code') || searchParams.get('ref') || '';

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    referralCode: refFromUrl,
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [hasReferral, setHasReferral] = useState(!!refFromUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // تحديث كود الإحالة إذا تغير URL
  useEffect(() => {
    if (refFromUrl) {
      setForm((prev) => ({ ...prev, referralCode: refFromUrl }));
      setHasReferral(true);
    }
  }, [refFromUrl]);

  const update = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // قوة كلمة المرور
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    if (score <= 2) return { level: 1, text: 'ضعيفة', color: 'var(--red)' };
    if (score === 3) return { level: 2, text: 'متوسطة', color: 'var(--gold)' };
    if (score === 4) return { level: 3, text: 'قوية', color: 'var(--cyan)' };
    return { level: 4, text: 'قوية جداً', color: 'var(--green)' };
  };

  const passwordStrength = getPasswordStrength(form.password);

  // ============ إنشاء الحساب (بدون OTP) ============
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // 1) التحقق من صحة البيانات
    const result = registerSchema.safeParse({
      fullName: form.fullName,
      email: form.email,
      username: form.username,
      password: form.password,
      confirmPassword: form.confirmPassword,
      referralCode: form.referralCode,
    });

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      setFieldErrors(errors);
      setError('الرجاء تصحيح الأخطاء أعلاه');
      return;
    }

    setIsSubmitting(true);

    try {
      // 2) حفظ البيانات مؤقتاً (سيتم استخدامها في صفحة توثيق الهوية)
      const pendingData = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        username: form.username.trim(),
        password: form.password,
        confirmPassword: form.password,
        referralCode: form.referralCode?.trim() || null,
        createdAt: Date.now(),
        emailVerified: true, // ✅ نعتبرها موثقة
      };

      sessionStorage.setItem('aura-pending-registration', JSON.stringify(pendingData));
      localStorage.setItem('aura-pending-registration', JSON.stringify(pendingData));

      console.log('✅ [NO-OTP] Saved pending registration:', pendingData);

      // 3) الانتقال مباشرة إلى توثيق الهوية
      router.push('/verify-identity');
      
    } catch (err) {
      setError(err.message || 'حدث خطأ غير متوقع');
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>A</div>
          <h1 className={styles.title}>إنشاء حساب جديد</h1>
          <p className={styles.subtitle}>انضم إلى AURA TRADE & INVEST</p>
        </div>

        {/* بانر الإحالة */}
        {hasReferral && (
          <div className={styles.referralBanner}>
            <Gift size={16} />
            <div>
              <b>تم تطبيق كود الإحالة</b>
              <span className="mono">{form.referralCode}</span>
            </div>
          </div>
        )}

        {/* ============ نموذج التسجيل ============ */}
        <form onSubmit={handleCreateAccount} className={styles.form}>
          {error && (
            <div className={styles.error}>
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <label className={styles.field}>
            <span>الاسم الكامل</span>
            <div className={`${styles.inputWrap} ${fieldErrors.fullName ? styles.inputError : ''}`}>
              <User size={16} />
              <input
                type="text"
                value={form.fullName}
                onChange={update('fullName')}
                placeholder="أحمد محمد"
              />
            </div>
            {fieldErrors.fullName && (
              <small className={styles.fieldError}>
                <XCircle size={11} /> {fieldErrors.fullName}
              </small>
            )}
          </label>

          <label className={styles.field}>
            <span>البريد الإلكتروني</span>
            <div className={`${styles.inputWrap} ${fieldErrors.email ? styles.inputError : ''}`}>
              <Mail size={16} />
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
              />
            </div>
            {fieldErrors.email && (
              <small className={styles.fieldError}>
                <XCircle size={11} /> {fieldErrors.email}
              </small>
            )}
          </label>

          <label className={styles.field}>
            <span>اسم المستخدم</span>
            <div className={`${styles.inputWrap} ${fieldErrors.username ? styles.inputError : ''}`}>
              <User size={16} />
              <input
                type="text"
                value={form.username}
                onChange={update('username')}
                placeholder="ahmed_2026"
              />
            </div>
            {fieldErrors.username && (
              <small className={styles.fieldError}>
                <XCircle size={11} /> {fieldErrors.username}
              </small>
            )}
          </label>

          <div className={styles.row}>
            <label className={styles.field}>
              <span>كلمة المرور</span>
              <div className={`${styles.inputWrap} ${fieldErrors.password ? styles.inputError : ''}`}>
                <Lock size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className={styles.eyeBtn}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {form.password && (
                <div className={styles.passwordStrength}>
                  <div className={styles.strengthBars}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={styles.strengthBar}
                        style={{
                          background:
                            i <= passwordStrength.level
                              ? passwordStrength.color
                              : 'var(--bg-card-2)',
                        }}
                      />
                    ))}
                  </div>
                  <span className={styles.strengthText} style={{ color: passwordStrength.color }}>
                    {passwordStrength.text}
                  </span>
                </div>
              )}
              {fieldErrors.password && (
                <small className={styles.fieldError}>
                  <XCircle size={11} /> {fieldErrors.password}
                </small>
              )}
            </label>

            <label className={styles.field}>
              <span>تأكيد كلمة المرور</span>
              <div className={`${styles.inputWrap} ${fieldErrors.confirmPassword ? styles.inputError : ''}`}>
                <Lock size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  placeholder="••••••••"
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle2 size={14} className="text-green" />
                )}
              </div>
              {fieldErrors.confirmPassword && (
                <small className={styles.fieldError}>
                  <XCircle size={11} /> {fieldErrors.confirmPassword}
                </small>
              )}
            </label>
          </div>

          <label className={styles.field}>
            <span>كود الإحالة (اختياري)</span>
            <div className={`${styles.inputWrap} ${fieldErrors.referralCode ? styles.inputError : ''} ${hasReferral ? styles.inputHighlight : ''}`}>
              <Gift size={16} />
              <input
                type="text"
                value={form.referralCode}
                onChange={update('referralCode')}
                placeholder="AURA-XXXXXX"
                readOnly={hasReferral}
              />
              {hasReferral && <CheckCircle2 size={14} className="text-green" />}
            </div>
            {fieldErrors.referralCode && (
              <small className={styles.fieldError}>
                <XCircle size={11} /> {fieldErrors.referralCode}
              </small>
            )}
          </label>

          <div className={styles.requirements}>
            <div className={styles.reqTitle}>متطلبات كلمة المرور:</div>
            <div className={styles.reqList}>
              <ReqItem met={form.password.length >= 8} text="8 أحرف على الأقل" />
              <ReqItem met={/[a-z]/.test(form.password)} text="حرف صغير (a-z)" />
              <ReqItem met={/[A-Z]/.test(form.password)} text="حرف كبير (A-Z)" />
              <ReqItem met={/[0-9]/.test(form.password)} text="رقم (0-9)" />
            </div>
          </div>

          <button type="submit" className={styles.submit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className={styles.spin} /> جاري إنشاء الحساب...
              </>
            ) : (
              <>
                <UserPlus size={16} /> إنشاء الحساب
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <span>لديك حساب بالفعل؟</span>
          <Link href="/login" className={styles.link}>
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}

function ReqItem({ met, text }) {
  return (
    <div className={`${styles.reqItem} ${met ? styles.reqMet : ''}`}>
      {met ? <Check size={11} /> : <XCircle size={11} />}
      <span>{text}</span>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>جاري التحميل...</div>}>
      <RegisterForm />
    </Suspense>
  );
}