'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import styles from './error.module.css';

export default function Error({ error, reset }) {
  useEffect(() => {
    if (typeof console !== 'undefined') {
      console.error('App Error:', error);
    }
  }, [error]);

  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={`${styles.inner} container`}>
        <div className={styles.iconWrap}>
          <AlertTriangle size={40} />
        </div>

        <h1 className={styles.title}>حدث خطأ غير متوقع</h1>
        <p className={styles.desc}>
          نعتذر عن الإزعاج. حدث خطأ أثناء تحميل هذه الصفحة.
          يمكنك إعادة المحاولة أو العودة إلى الرئيسية.
        </p>

        {error?.message && (
          <div className={styles.errorBox}>
            <span className={styles.errorLabel}>تفاصيل الخطأ:</span>
            <code className={styles.errorCode}>{error.message}</code>
          </div>
        )}

        <div className={styles.actions}>
          <button onClick={reset} className={styles.primaryBtn}>
            <RefreshCw size={16} />
            إعادة المحاولة
          </button>
          <Link href="/dashboard" className={styles.secondaryBtn}>
            <Home size={16} />
            الرئيسية
          </Link>
        </div>

        <div className={styles.footNote}>
          رمز الخطأ: <b className="mono">500</b>
        </div>
      </div>
    </div>
  );
}