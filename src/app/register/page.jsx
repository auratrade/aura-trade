'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail, Lock, User, Gift, Eye, EyeOff, Loader2,
  UserPlus, AlertCircle, CheckCircle2, ArrowRight,
  ShieldCheck, Clock, XCircle, Check
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
    referralCode: refFromUrl, // ✅ تعبئة تلقائية
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [hasReferral, setHasReferral] = useState(!!refFromUrl);

  // OTP State
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef([]);

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

  // Countdown
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

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

  // ============ إرسال OTP ============
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

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

    setOtpSending(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: result.data.email,
          name: result.data.fullName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل إرسال الرمز');

      setStep(2);
      setOtp(['', '', '', '', '', '']);
      setCountdown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpSending(false);
    }
  };

  // ============ التحقق من OTP ============
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');

    const code = otp.join('');
    if (code.length !== 6) {
      setOtpError('الرجاء إدخال 6 أرقام');
      return;
    }

    setOtpVerifying(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          code,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'الرمز غير صحيح');

      // ✅ احفظ البيانات مع كود الإحالة
      const pendingData = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        username: form.username.trim(),
        password: form.password,
        confirmPassword: form.password,
        referralCode: form.referralCode?.trim() || null,
        createdAt: Date.now(),
        emailVerified: true,
      };

      // احفظ في كليهما للأمان
      sessionStorage.setItem(
        'aura-pending-registration',
        JSON.stringify(pendingData)
      );
      localStorage.setItem(
        'aura-pending-registration',
        JSON.stringify(pendingData)
      );

      console.log('✅ Saved pending:', pendingData);

      router.push('/verify-identity');
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setOtpVerifying(false);
    }
  };

  // OTP handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (!pasted) return;
    const newOtp = pasted.split('').concat(Array(6 - pasted.length).fill(''));
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const resendOtp = async () => {
    if (countdown > 0 || otpSending) return;
    setOtpError('');
    setOtpSending(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          name: form.fullName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setOtpSending(false);
    }
  };

  const goBackToForm = () => {
    setStep(1);
    setOtpError('');
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className={styles.page}>
      <div className={styles.glow} />
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>A</div>
          <h1 className={styles.title}>
            {step === 1 ? 'إنشاء حساب جديد' : 'تحقق من بريدك'}
          </h1>
          <p className={styles.subtitle}>
            {step === 1
              ? 'انضم إلى AURA TRADE & INVEST'
              : 'أدخل رمز التحقق المُرسل إلى بريدك'}
          </p>
        </div>

        {/* بانر الإحالة */}
        {hasReferral && step === 1 && (
          <div className={styles.referralBanner}>
            <Gift size={16} />
            <div>
              <b>تم تطبيق كود الإحالة</b>
              <span className="mono">{form.referralCode}</span>
            </div>
          </div>
        )}

        {/* ============ STEP 1 ============ */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className={styles.form}>
            {error && (
              <div className={styles.error}>
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <label className={styles.field}>
              <span>الاسم الكامل</span>
              <div
                className={`${styles.inputWrap} ${
                  fieldErrors.fullName ? styles.inputError : ''
                }`}
              >
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
              <div
                className={`${styles.inputWrap} ${
                  fieldErrors.email ? styles.inputError : ''
                }`}
              >
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
              <div
                className={`${styles.inputWrap} ${
                  fieldErrors.username ? styles.inputError : ''
                }`}
              >
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
                <div
                  className={`${styles.inputWrap} ${
                    fieldErrors.password ? styles.inputError : ''
                  }`}
                >
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
                    <span
                      className={styles.strengthText}
                      style={{ color: passwordStrength.color }}
                    >
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
                <div
                  className={`${styles.inputWrap} ${
                    fieldErrors.confirmPassword ? styles.inputError : ''
                  }`}
                >
                  <Lock size={16} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={update('confirmPassword')}
                    placeholder="••••••••"
                  />
                  {form.confirmPassword &&
                    form.password === form.confirmPassword && (
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
              <div
                className={`${styles.inputWrap} ${
                  fieldErrors.referralCode ? styles.inputError : ''
                } ${hasReferral ? styles.inputHighlight : ''}`}
              >
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

            <button
              type="submit"
              className={styles.submit}
              disabled={otpSending}
            >
              {otpSending ? (
                <>
                  <Loader2 size={16} className={styles.spin} /> جاري إرسال الرمز...
                </>
              ) : (
                <>
                  <UserPlus size={16} /> إنشاء الحساب
                </>
              )}
            </button>
          </form>
        )}

        {/* ============ STEP 2: OTP ============ */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className={styles.form}>
            <div className={styles.otpHeader}>
              <div className={styles.otpIconWrap}>
                <Mail size={26} />
              </div>
              <h3 className={styles.otpTitle}>أدخل رمز التحقق</h3>
              <p className={styles.otpSubtitle}>
                أرسلنا رمزاً مكوناً من 6 أرقام إلى
                <br />
                <b className="mono">{form.email}</b>
              </p>
            </div>

            {otpError && (
              <div className={styles.error}>
                <AlertCircle size={14} />
                {otpError}
              </div>
            )}

            <div className={styles.otpInputs} onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className={styles.otpInput}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            <div className={styles.otpTimer}>
              <Clock size={12} />
              {countdown > 0 ? (
                <span>
                  الرمز صالح لمدة <b>10 دقائق</b> — إعادة الإرسال بعد{' '}
                  <b className="text-gold">{countdown}ث</b>
                </span>
              ) : (
                <span>انتهت مدة الانتظار — يمكنك إعادة الإرسال</span>
              )}
            </div>

            <button
              type="submit"
              className={styles.submit}
              disabled={otpVerifying}
            >
              {otpVerifying ? (
                <>
                  <Loader2 size={16} className={styles.spin} /> جاري التحقق...
                </>
              ) : (
                <>
                  <ShieldCheck size={16} /> تأكيد الرمز
                </>
              )}
            </button>

            <div className={styles.resendRow}>
              <button
                type="button"
                onClick={resendOtp}
                disabled={countdown > 0 || otpSending}
                className={styles.resendBtn}
              >
                {otpSending
                  ? 'جاري الإرسال...'
                  : countdown > 0
                  ? `إعادة الإرسال (${countdown}ث)`
                  : 'لم يصلك الرمز؟ أعد الإرسال'}
              </button>

              <button
                type="button"
                onClick={goBackToForm}
                className={styles.changeEmailBtn}
              >
                <ArrowRight size={12} />
                تغيير البيانات
              </button>
            </div>
          </form>
        )}

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