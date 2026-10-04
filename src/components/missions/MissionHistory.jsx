'use client';

import { CheckCircle2, Clock3, Coins, Target } from 'lucide-react';
import { useMissions } from '@/context/MissionsContext';
import styles from './MissionHistory.module.css';

export default function MissionHistory() {
  const { missionHistory, historyLoading } = useMissions();

  if (historyLoading) {
    return (
      <section className={styles.missionHistory}>
        <div className={styles.header}>
          <div>
            <h2>سجل المهام</h2>
            <p>المهام التي قمت بإكمالها</p>
          </div>
        </div>
        <div className={styles.loading}>
          جاري تحميل سجل المهام...
        </div>
      </section>
    );
  }

  return (
    <section className={styles.missionHistory}>
      <div className={styles.header}>
        <div>
          <h2>سجل المهام</h2>
          <p>المهام التي قمت بإكمالها والمكافآت التيحصلت عليها</p>
        </div>

        <div className={styles.count}>
          {missionHistory.length} مهمة مكتملة
        </div>
      </div>

      {missionHistory.length === 0 ? (
        <div className={styles.empty}>
          <Target size={32} />
          <h3>لا يوجد سجل بعد</h3>
          <p>عند إكمال أول مهمة، ستظهر تفاصيلها هنا.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {missionHistory.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.icon}>
                <CheckCircle2 size={22} />
              </div>

              <div className={styles.info}>
                <h3>{item.title}</h3>
                <div className={styles.date}>
                  <Clock3 size={14} />
                  <span>
                    {new Date(item.completedAt).toLocaleString('ar-SY', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>

              <div className={styles.reward}>
                <div className={styles.rewardIcon}>
                  <Coins size={17} />
                </div>
                <div>
                  <span>المكافأة</span>
                  <strong>+{item.reward.toFixed(2)}</strong>
                </div>
              </div>

              <div className={styles.details}>
                <div>
                  <span>الإيداع</span>
                  <strong>{item.depositBase.toFixed(2)}</strong>
                </div>
                <div>
                  <span>النسبة</span>
                  <strong>{item.percent}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}