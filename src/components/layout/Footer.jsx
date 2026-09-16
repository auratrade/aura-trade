import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} container`}>
        <div className={styles.brand}>
          <div className={styles.brandName}>AURA TRADE & INVEST PLATFORM</div>
          <div className={styles.copy}>
            © 2026 Aura Investment Platform. جميع الحقوق محفوظة.
          </div>
          <div className={styles.note}>
            إخلاء المسؤولية: التداول ينطوي على مخاطر. الأداء السابق لا يضمن النتائج المستقبلية.
          </div>
        </div>
        <div className={styles.links}>
          <Link href="#">الخصوصية</Link>
          <Link href="#">الشروط</Link>
          <Link href="#">الأمان</Link>
          <Link href="#">سياسة الاستخدام</Link>
          <Link href="#">الدعم</Link>
        </div>
      </div>
    </footer>
  );
}