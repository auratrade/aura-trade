'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield, Upload, Camera, CheckCircle2, AlertCircle,
  Loader2, FileImage, X, User, CreditCard, Globe,
  ArrowLeft, Lock, Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './verify.module.css';
import { useToast } from '@/context/ToastContext';
import { useConfirm } from '@/context/ConfirmContext';
const ID_TYPES = [
  {
    key: 'national_id',
    label: 'الهوية الوطنية',
    icon: CreditCard,
    desc: 'بطاقة الهوية الرسمية',
  },
  {
    key: 'residence',
    label: 'بطاقة الإقامة',
    icon: User,
    desc: 'بطاقة الإقامة الرسمية',
  },
  {
    key: 'passport',
    label: 'جواز السفر',
    icon: Globe,
    desc: 'جواز سفر ساري المفعول',
  },
];

export default function VerifyIdentityPage() {
  const router = useRouter();
  const { user, registerFromPending } = useAuth();
  const fileInputRef = useRef(null);
  const toast = useToast();
const { confirm } = useConfirm();

  const [idType, setIdType] = useState('national_id');
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: نوع الهوية، 2: الصور، 3: النجاح

 const handleFile = (e, setter) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    toast.error('الرجاء رفع صورة بصيغة صحيحة (JPG, PNG)');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error('حجم الصورة يجب أن يكون أقل من 5 ميغابايت');
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    setter({ file, preview: ev.target.result });
    toast.success('تم رفع الصورة بنجاح');
  };
  reader.readAsDataURL(file);
};

  const removeImage = (setter) => {
    setter(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ============ إنشاء الحساب بعد التحقق ============
 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  // التحقق
  if (!frontImage) { setError('الرجاء رفع الصورة الأمامية'); return; }
  if (idType !== 'passport' && !backImage) { setError('الرجاء رفع الصورة الخلفية'); return; }
  if (!selfieImage) { setError('الرجاء رفع صورة سيلفي'); return; }
  if (!agree) { setError('يجب الموافقة على الشروط'); return; }

  setLoading(true);

  try {
    // 1) أنشئ الحساب (إذا لم يكن موجوداً)
    await registerFromPending({
      identityType: idType,
      identityVerified: false,  // ⚠️ لم يُوثَّق بعد
    });

    // 2) أرسل الصور
    const res = await fetch('/api/user/verify-identity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idType,
        frontImage: frontImage.preview,
        backImage: backImage?.preview || null,
        selfieImage: selfieImage.preview,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'فشل إرسال الطلب');

    console.log('✅ Verification submitted');
    setStep(3);

    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  } catch (err) {
    console.error('🔥 Verify error:', err);
    setError(err.message);
    setLoading(false);
  }
};
  // ============ تخطي التحقق ============
  const skipVerification = async () => {
  const ok = await confirm({
    title: 'تخطي التحقق؟',
    message: 'لن تتمكن من السحب بدون تأكيد الهوية. يمكنك التفعيل لاحقاً.',
    confirmText: 'تخطي',
    cancelText: 'إلغاء',
    type: 'warning',
  });

  if (!ok) return;

  setLoading(true);
  setError('');

  try {
    await registerFromPending({
      identityType: null,
      identityVerified: false,
    });

    toast.success('تم إنشاء حسابك! جاري التحويل...');
    router.push('/dashboard');
  } catch (err) {
    console.error('🔴 Skip error:', err);
    toast.error(err.message || 'حدث خطأ');
    setError(err.message || 'حدث خطأ');
    setLoading(false);
  }
};

  return (
    <div className={styles.page}>
      <div className={styles.glow} />

      <div className={styles.container}>
        {/* Progress Bar */}
        <div className={styles.progress}>
          <div className={`${styles.progressStep} ${step >= 1 ? styles.active : ''}`}>
            <span>1</span>
            <label>نوع الهوية</label>
          </div>
          <div className={styles.progressLine} />
          <div className={`${styles.progressStep} ${step >= 2 ? styles.active : ''}`}>
            <span>2</span>
            <label>رفع الصور</label>
          </div>
          <div className={styles.progressLine} />
          <div className={`${styles.progressStep} ${step >= 3 ? styles.active : ''}`}>
            <span>3</span>
            <label>التأكيد</label>
          </div>
        </div>

        {/* ========== STEP 1: نوع الهوية ========== */}
        {step === 1 && (
          <div className={styles.card}>
            <div className={styles.header}>
              <div className={styles.iconWrap}>
                <Shield size={28} />
              </div>
              <h1 className={styles.title}>تأكيد الهوية</h1>
              <p className={styles.subtitle}>
                لحماية حسابك وأموالك، نحتاج للتحقق من هويتك.
                اختر نوع الوثيقة التي تريد استخدامها.
              </p>
            </div>

            <div className={styles.idTypes}>
              {ID_TYPES.map(({ key, label, icon: Icon, desc }) => (
                <button
                  key={key}
                  type="button"
                  className={`${styles.idCard} ${idType === key ? styles.selected : ''}`}
                  onClick={() => setIdType(key)}
                >
                  <div className={styles.idIcon}>
                    <Icon size={22} />
                  </div>
                  <div className={styles.idInfo}>
                    <div className={styles.idLabel}>{label}</div>
                    <div className={styles.idDesc}>{desc}</div>
                  </div>
                  <div className={styles.radio}>
                    {idType === key && <div className={styles.radioInner} />}
                  </div>
                </button>
              ))}
            </div>

            <div className={styles.infoBox}>
              <Lock size={14} />
              <div>
                <b>بياناتك محمية</b>
                <span>
                  تُستخدم الصور لأغراض التحقق فقط. جميع البيانات مشفّرة
                  ولا تُشارك مع أي طرف ثالث.
                </span>
              </div>
            </div>

            <button
              type="button"
              className={styles.nextBtn}
              onClick={() => setStep(2)}
            >
              متابعة
              <ArrowLeft size={16} />
            </button>
          </div>
        )}

        {/* ========== STEP 2: رفع الصور ========== */}
        {step === 2 && (
          <form className={styles.card} onSubmit={handleSubmit}>
            {error && (
              <div className={styles.errorBox}>
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div className={styles.header}>
              <div className={styles.iconWrap}>
                <Camera size={28} />
              </div>
              <h1 className={styles.title}>رفع صور الوثيقة</h1>
              <p className={styles.subtitle}>
                تأكد أن الصور واضحة وبإضاءة جيدة، وبدون انعكاسات.
              </p>
            </div>

            {/* Front */}
            <UploadBox
              label="الصورة الأمامية"
              hint="الوجه الذي يحتوي على صورتك الشخصية"
              image={frontImage}
              onUpload={(e) => handleFile(e, setFrontImage)}
              onRemove={() => removeImage(setFrontImage)}
              required
            />

            {/* Back */}
            {idType !== 'passport' && (
              <UploadBox
                label="الصورة الخلفية"
                hint="الوجه الخلفي للبطاقة"
                image={backImage}
                onUpload={(e) => handleFile(e, setBackImage)}
                onRemove={() => removeImage(setBackImage)}
                required
              />
            )}

            {/* Selfie */}
            <UploadBox
              label="صورة شخصية (سيلفي)"
              hint="صورة حديثة لوجهك بوضوح"
              image={selfieImage}
              onUpload={(e) => handleFile(e, setSelfieImage)}
              onRemove={() => removeImage(setSelfieImage)}
              required
            />

            {/* Agreement */}
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span className={styles.checkmark} />
              <span className={styles.checkLabel}>
                أُقرّ بأن جميع المعلومات والصور المرفوعة صحيحة وأتحمل مسؤولية صحتها.
              </span>
            </label>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setStep(1)}
                disabled={loading}
              >
                رجوع
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className={styles.spin} />
                    جاري الرفع...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    إرسال للتحقق
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              className={styles.skipBtn}
              onClick={skipVerification}
              disabled={loading}
            >
              تخطي الآن (يمكنك التفعيل لاحقاً)
            </button>
          </form>
        )}

        {/* ========== STEP 3: النجاح ========== */}
        {step === 3 && (
          <div className={styles.card}>
            <div className={styles.successContent}>
              <div className={styles.successIcon}>
                <CheckCircle2 size={48} />
              </div>
              <h1 className={styles.successTitle}>تم إرسال طلبك بنجاح!</h1>
              <p className={styles.successDesc}>
  شكراً لك! تم استلام وثائقك. <br />
  <b>سيتم مراجعتها من قبل الإدارة خلال 24 ساعة.</b><br />
  يمكنك استخدام المنصة الآن، لكن بعض الميزات ستبقى محدودة حتى الموافقة.
</p>

              <div className={styles.successInfo}>
                <Sparkles size={16} />
                <span>
                  سيتم تحويلك إلى لوحة التحكم خلال لحظات...
                </span>
              </div>

              <div className={styles.loaderBar}>
                <div className={styles.loaderFill} />
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className={styles.securityNote}>
          <Lock size={12} />
          <span>اتصال مشفّر • جميع البيانات محمية بتقنية AES-256</span>
        </div>
      </div>
    </div>
  );
}

// ============ مكوّن مساعد لرفع الصور ============
function UploadBox({ label, hint, image, onUpload, onRemove, required }) {
  const inputId = `upload-${label.replace(/\s/g, '-')}`;

  return (
    <div className={styles.uploadField}>
      <label htmlFor={inputId} className={styles.uploadLabel}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      {!image ? (
        <label htmlFor={inputId} className={styles.dropzone}>
          <input
            id={inputId}
            type="file"
            accept="image/*"
            onChange={onUpload}
            style={{ display: 'none' }}
          />
          <div className={styles.dropIcon}>
            <FileImage size={28} />
          </div>
          <div className={styles.dropTitle}>اضغط لرفع الصورة</div>
          <div className={styles.dropHint}>{hint}</div>
          <div className={styles.dropFormat}>
            JPG, PNG • الحد الأقصى 5MB
          </div>
        </label>
      ) : (
        <div className={styles.preview}>
          <img src={image.preview} alt={label} />
          <div className={styles.previewOverlay}>
            <div className={styles.previewInfo}>
              <CheckCircle2 size={16} />
              <span>تم الرفع</span>
            </div>
            <button
              type="button"
              className={styles.previewRemove}
              onClick={onRemove}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}