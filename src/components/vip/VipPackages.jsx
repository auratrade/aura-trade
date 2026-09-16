'use client';
import { Crown, Check } from 'lucide-react';
import { vipPackages } from '@/data/mockData';
import styles from './VipPackages.module.css';

export default function VipPackages() {
  return (
    <div className={styles.grid}>
      {vipPackages.map((p) => (
        <div key={p.tier} className={`${styles.card} ${p.active ? styles.activeCard : ''}`}>
          {p.active && <div className={styles.badge}>نشطة</div>}
          <div className={styles.head}>
            <div className={`${styles.tierIcon} ${styles['tier_' + p.name.toLowerCase()]}`}>
              <Crown size={18} />
            </div>
            <div>
              <div className={styles.tier}>{p.tier}</div>
              <div className={styles.name}>{p.name}</div>
            </div>
          </div>

          <div className={styles.amountRow}>
            <div className={styles.amount}>${p.minAmount.toLocaleString()}</div>
            <div className={styles.amountLabel}>الحد الأدنى للاستثمار</div>
          </div>

          <div className={styles.rates}>
            <div>
              <span className={styles.rateLabel}>العائد اليومي</span>
              <span className={`${styles.rate} text-green`}>{p.dailyRate}</span>
              <span className={styles.rateSub}>≈ ${p.dailyUSD}/يوم</span>
            </div>
            <div>
              <span className={styles.rateLabel}>العائد الشهري</span>
              <span className={`${styles.rate} text-green`}>{p.monthlyRate}</span>
              <span className={styles.rateSub}>≈ ${p.monthlyUSD}/شهر</span>
            </div>
          </div>

          <div className={styles.meta}>
            <div><span>المدة</span><b>{p.duration}</b></div>
            <div><span>فترة القفل</span><b>{p.lock}</b></div>
          </div>

          {p.active && p.progress && (
            <div className={styles.progressWrap}>
              <div className={styles.progressHead}>
                <span>التقدم</span><b>{p.progress}%</b>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${p.progress}%` }} />
              </div>
              <div className={styles.progressFoot}>
                <span className="text-green">+ نقد</span>
                <span>متبقي 15 يوم</span>
              </div>
            </div>
          )}

          <ul className={styles.features}>
            {p.features.map((f, i) => (
              <li key={i}><Check size={12} className="text-green" /> {f}</li>
            ))}
          </ul>

          <button className={`${styles.btn} ${p.active ? styles.btnActive : ''}`}>
            {p.active ? 'ترقية إلى VIP 3' : 'اختيار الباقة'}
          </button>
        </div>
      ))}
    </div>
  );
}