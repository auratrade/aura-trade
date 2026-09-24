import Link from 'next/link';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  { href: '/privacy', label: 'الخصوصية' },
  { href: '/terms', label: 'الشروط' },
  { href: '/support', label: 'الدعم' },
  { href: '/terms', label: 'سياسة الاستخدام' },
];

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
          {FOOTER_LINKS.map((link, i) => (
            <Link key={i} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}