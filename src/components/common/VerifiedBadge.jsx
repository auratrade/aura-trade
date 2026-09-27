'use client';

import styles from './VerifiedBadge.module.css';

/**
 * علامة توثيق الحساب (جانب العميل)
 * @param {boolean} isVerified - هل الحساب موثق؟
 * @param {'sm' | 'md' | 'lg'} size - حجم العلامة
 * @param {boolean} showTooltip - إظهار تلميح عند المرور
 */
export default function VerifiedBadge({ 
  isVerified, 
  size = 'md',
  showTooltip = true 
}) {
  if (!isVerified) return null;

  return (
    <span
      className={`${styles.badge} ${styles[size]}`}
      title={showTooltip ? 'حساب موثّق' : undefined}
      aria-label="حساب موثّق"
      role="img"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
      >
        <path
          d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"
          fill="currentColor"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}