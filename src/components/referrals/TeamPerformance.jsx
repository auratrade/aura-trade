'use client';
import { Users, TrendingUp, Target } from 'lucide-react';
import { teamStats } from '@/data/mockData';
import styles from './TeamPerformance.module.css';

export default function TeamPerformance() {
  const progress = (teamStats.totalVolume / teamStats.targetVolume) * 100;
  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.item}>
          <Users size={14} className="text-cyan" />
          <div>
            <div className={styles.value}>{teamStats.total}</div>
            <div className={styles.label}>إجمالي الفريق</div>
          </div>
        </div>
        <div className={styles.item}>
          <TrendingUp size={14} className="text-green" />
          <div>
            <div className={styles.value}>+{teamStats.thisWeek}</div>
            <div className={styles.label}>أعضاء هذا الأسبوع</div>
          </div>
        </div>
      </div>

      <div className={styles.profits}>
        <div>
          <span>أرباح المستوى الأول</span>
          <b className="mono text-green">+${teamStats.level1Profit.toLocaleString()}</b>
        </div>
        <div>
          <span>أرباح المستوى الثاني</span>
          <b className="mono text-green">+${teamStats.level2Profit.toLocaleString()}</b>
        </div>
      </div>

      <div className={styles.volume}>
        <div className={styles.volumeHead}>
          <span><Target size={12} /> حجم الإحالات الإجمالي</span>
          <b className="mono">${teamStats.totalVolume.toLocaleString()} / ${teamStats.targetVolume.toLocaleString()}</b>
        </div>
        <div className={styles.bar}>
          <div className={styles.fill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.rate}>
          نسبة العمولة: <b className="text-gold">{teamStats.rate}</b> — الحد الأقصى: <b>{teamStats.maxRate}</b>
        </div>
      </div>

      <button className={styles.btn}>نقل الإحالات إلى المحفظة</button>
    </div>
  );
}