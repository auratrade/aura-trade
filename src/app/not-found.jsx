import Link from 'next/link';
import { Home, ArrowLeft, Search, TrendingUp, LifeBuoy } from 'lucide-react';
import styles from './not-found.module.css';

export const metadata = {
  title: 'الصفحة غير موجودة | AURA TRADE',
  description: 'عذراً، الصفحة التي تبحث عنها غير موجودة',
};

export default function NotFound() {
  const suggestions = [
    { href: '/dashboard', label: 'نظرة عامة', icon: TrendingUp },
    { href: '/missions', label: 'المهام اليومية', icon: Search },
    { href: '/deposit', label: 'الإيداع', icon: Home },
    { href: '/security', label: 'الأمان', icon: LifeBuoy },
  ];

  return (
    <div className={styles.page}>
      {/* Background glow */}
      <div className={styles.glow} aria-hidden="true" />

      <div className={`${styles.inner} container`}>
        {/* 404 Big Number */}
        <div className={styles.numberWrap}>
          <span className={styles.num}>4</span>
          <span className={`${styles.num} ${styles.middle}`}>0</span>
          <span className={styles.num}>4</span>
        </div>

        {/* Message */}
        <h1 className={styles.title}>الصفحة غير موجودة</h1>
        <p className={styles.desc}>
          عذراً، الرابط الذي تحاول الوصول إليه غير متوفر أو تم نقله.
          تحقق من العنوان، أو استخدم أحد الروابط أدناه للمتابعة.
        </p>

        {/* Actions */}
        <div className={styles.actions}>
          <Link href="/dashboard" className={styles.primaryBtn}>
            <Home size={16} />
            العودة إلى الرئيسية
          </Link>
          <Link href="/missions" className={styles.secondaryBtn}>
            <ArrowLeft size={16} />
            الذهاب إلى المهام
          </Link>
        </div>

        {/* Suggestions */}
        <div className={styles.suggestions}>
          <div className={styles.suggTitle}>روابط مقترحة</div>
          <div className={styles.suggGrid}>
            {suggestions.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={styles.suggCard}>
                <span className={styles.suggIcon}><Icon size={16} /></span>
                <span className={styles.suggLabel}>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className={styles.footNote}>
          <span>رمز الخطأ: <b className="mono">404</b></span>
          <span className={styles.dot}>•</span>
          <span>إذا كنت تعتقد أن هذا خطأ، تواصل مع الدعم</span>
        </div>
      </div>
    </div>
  );
}