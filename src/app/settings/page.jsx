'use client';
import { useAuth } from '@/context/AuthContext';
import {
  User, Mail, Hash, Crown, Calendar, ShieldCheck, Lock, AlertCircle
} from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import { REFERRAL_TIERS } from '@/lib/referral-tiers';
import styles from './settings.module.css';

export default function SettingsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container" style={{ padding: 20 }}>
        <SectionTitle icon={ShieldCheck} title="الإعدادات" subtitle="معلومات الحساب" />
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
          جاري التحميل...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: 20 }}>
        <SectionTitle icon={ShieldCheck} title="الإعدادات" subtitle="معلومات الحساب" />
        <div style={{
          background: 'var(--bg-error-soft)',
          border: '1px solid var(--error)',
          borderRadius: 'var(--radius-lg)',
          padding: 20,
          color: 'var(--error)',
          textAlign: 'center'
        }}>
          لم يتم تحميل بيانات المستخدم
        </div>
      </div>
    );
  }

  // الحصول على معلومات المستوى
  const tierInfo = REFERRAL_TIERS.find(t => t.key === user.referralTier) || REFERRAL_TIERS[0];

  // تنسيق التاريخ
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const accountFields = [
    {
      label: 'اسم المستخدم',
      value: user.username,
      icon: User,
      key: 'username'
    },
    {
      label: 'البريد الإلكتروني',
      value: user.email,
      icon: Mail,
      key: 'email'
    },
    {
      label: 'معرّف الحساب',
      value: user.id.slice(0, 12) + '...',
      icon: Hash,
      key: 'id',
      mono: true
    },
    {
      label: 'الاسم الكامل',
      value: user.fullName || 'غير محدد',
      icon: User,
      key: 'fullName'
    },
    {
      label: 'مستوى الإحالة',
      value: tierInfo.name,
      icon: Crown,
      key: 'tier',
      color: tierInfo.color
    },
    {
      label: 'عدد الإحالات',
      value: (user.referralCount || 0).toString(),
      icon: User,
      key: 'referralCount',
      mono: true
    },
    {
      label: 'حالة الحساب',
      value: user.isVerified ? 'موثق ✓' : 'في الانتظار',
      icon: ShieldCheck,
      key: 'verified',
      badge: user.isVerified
    },
    {
      label: 'تاريخ الانضمام',
      value: formatDate(user.createdAt),
      icon: Calendar,
      key: 'createdAt'
    }
  ];

  return (
    <div className="container" style={{ padding: 20 }}>
      <SectionTitle
        icon={ShieldCheck}
        title="الإعدادات"
        subtitle="معلومات الحساب والملف الشخصي"
      />

      {/* إشعار القراءة فقط */}
      <div className={styles.noticeCard}>
        <Lock size={18} />
        <span>معلومات الحساب للعرض فقط ولا يمكن تعديلها مباشرة</span>
      </div>

      {/* بطاقة ملخص الحساب */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {user.username?.slice(0, 2).toUpperCase() || 'AV'}
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.profileName}>
            {user.fullName || user.username}
          </div>
          <div className={styles.profileMeta}>
            <span className={styles.metaItem}>
              <Crown size={12} style={{ color: tierInfo.color }} />
              {tierInfo.name}
            </span>
            <span className={styles.metaDot}>•</span>
            <span className={styles.metaItem}>
              {user.referralCount || 0} إحالة
            </span>
            {user.isVerified && (
              <>
                <span className={styles.metaDot}>•</span>
                <span className={styles.metaItem} style={{ color: 'var(--green)' }}>
                  ✓ موثق
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* حقول المعلومات */}
      <div className={styles.fieldsGrid}>
        {accountFields.map((field) => {
          const IconComponent = field.icon;
          return (
            <div key={field.key} className={styles.fieldCard}>
              <div className={styles.fieldHeader}>
                <IconComponent
                  size={16}
                  style={{ color: field.color || 'var(--text-secondary)' }}
                />
                <label className={styles.fieldLabel}>{field.label}</label>
              </div>
              <div className={styles.fieldValue}>
                <input
                  type="text"
                  value={field.value}
                  readOnly
                  className={`${styles.fieldInput} ${field.mono ? 'mono' : ''}`}
                />
                {field.badge && (
                  <span className={styles.badge}>موثق</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* معلومات إضافية */}
      <div className={styles.infoSection}>
        <div className={styles.infoTitle}>
          <AlertCircle size={16} />
          <span>ملاحظات مهمة</span>
        </div>
        <ul className={styles.infoList}>
          <li>معرّف الحساب فريد ولا يمكن تغييره.</li>
          <li>مستوى الإحالة يتم تحديثه تلقائياً عند الوصول إلى الإحالات المطلوبة.</li>
          <li>بيانات الحساب محمية وآمنة.</li>
        </ul>
      </div>
    </div>
  );
}