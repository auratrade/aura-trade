'use client';
import { useState } from 'react';
import { Copy, Check, Users, Share2, TrendingUp } from 'lucide-react';
import { referral } from '@/data/mockData';
import styles from './ReferralPanel.module.css';

export default function ReferralPanel() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(referral.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div className={styles.codeBox}>
          <div className={styles.label}>كود الإحالة</div>
          <div className={styles.code}>{referral.code}</div>
        </div>
        <div className={styles.stat}>
          <Users size={16} className="text-cyan" />
          <div>
            <div className={styles.statValue}>{referral.totalReferrals}</div>
            <div className={styles.statLabel}>إجمالي الإحالات</div>
          </div>
        </div>
        <div className={styles.stat}>
          <TrendingUp size={16} className="text-green" />
          <div>
            <div className={styles.statValue}>{referral.commission}</div>
            <div className={styles.statLabel}>نسبة العمولة</div>
          </div>
        </div>
      </div>

      <div className={styles.linkRow}>
        <input value={referral.link} readOnly className={`${styles.input} mono`} />
        <button className={styles.copyBtn} onClick={copy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'تم النسخ' : 'نسخ'}
        </button>
        <button className={styles.shareBtn}><Share2 size={14} /> مشاركة</button>
      </div>

      <div className={styles.earnings}>
        <div>
          <span>أرباح الإحالات</span>
          <b className="mono text-green">+{referral.earnings.toLocaleString()} USDT</b>
        </div>
        <button className={styles.transferBtn}>نقل الأرباح إلى المحفظة</button>
      </div>
    </div>
  );
}