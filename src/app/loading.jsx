import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.page}>
      <div className={styles.spinner}>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <span className={styles.logo}>A</span>
      </div>
      <p className={styles.text}>جاري التحميل...</p>
    </div>
  );
}