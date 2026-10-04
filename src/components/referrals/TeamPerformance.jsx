'use client';
import { useState, useEffect } from 'react';
import {
  Users, TrendingUp, Target, Award, RefreshCw, Crown
} from 'lucide-react';
import {
  getCurrentLevel,
  getNextLevel,
  getReferralsToNext,
} from '@/lib/levels';
import { useToast } from '@/context/ToastContext';
import styles from './TeamPerformance.module.css';

export default function TeamPerformance() {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const res = await fetch('/api/referral/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !stats) {
    return (
      <div className={styles.wrap}>
        <div className={styles.loading}>
          <RefreshCw size={16} className={styles.spin} />
          جاري التحميل...
        </div>
      </div>
    );
  }

  // ============ حساب المستوى الحالي والتالي ============
  const referralCount = stats.referralCount || 0;
  const currentLevel = getCurrentLevel(referralCount);
  const nextLevel = getNextLevel(referralCount);
  const toNext = getReferralsToNext(referralCount);

  // ============ حساب النسبة ============
  let progressPercent = 100;
  if (nextLevel) {
    const range = nextLevel.minReferrals - currentLevel.minReferrals;
    if (range > 0) {
      const done = referralCount - currentLevel.minReferrals;
      progressPercent = Math.min(100, Math.max(0, (done / range) * 100));
    }
  }

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>إحصائيات الفريق</h3>
        <button
          className={styles.refreshBtn}
          onClick={loadStats}
          disabled={loading}
        >
          <RefreshCw size={12} className={loading ? styles.spin : ''} />
        </button>
      </div>

      {/* ============ الإحصائيات ============ */}
      <div className={styles.grid}>
        <div className={styles.item}>
          <Users size={14} className="text-cyan" />
          <div>
            <div className={styles.value}>{referralCount}</div>
            <div className={styles.label}>إجمالي الفريق</div>
          </div>
        </div>
        <div className={styles.item}>
          <TrendingUp size={14} className="text-green" />
          <div>
            <div className={styles.value}>+{stats.totalReferred || 0}</div>
            <div className={styles.label}>مُحالون مسجّلون</div>
          </div>
        </div>
      </div>

      {/* ============ توزيع الأرباح حسب المستوى ============ */}
      <div className={styles.profits}>
        <div>
          <span>أرباح المستوى الأول</span>
          <b className="mono text-green">
            +${((stats.referralEarnings || 0) * 0.7).toFixed(2)}
          </b>
        </div>
        <div>
          <span>أرباح المستوى الثاني</span>
          <b className="mono text-green">
            +${((stats.referralEarnings || 0) * 0.3).toFixed(2)}
          </b>
        </div>
      </div>

      {/* ============ التقدم نحو المستوى التالي ============ */}
      <div className={styles.volume}>
        <div className={styles.volumeHead}>
          <span>
            <Target size={12} /> التقدم نحو{' '}
            {nextLevel ? (
              <b style={{ color: nextLevel.color }}>{nextLevel.name}</b>
            ) : (
              <b className="text-gold">أعلى مستوى</b>
            )}
          </span>
          <b className="mono">
            {referralCount} / {nextLevel ? nextLevel.minReferrals : '—'}
          </b>
        </div>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={{
              width: `${progressPercent}%`,
              background: nextLevel
                ? `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})`
                : 'linear-gradient(90deg, var(--gold), var(--orange))',
            }}
          />
        </div>
        <div className={styles.progressFoot}>
          {nextLevel ? (
            <>
              <span>
                باقي <b className="text-gold">{toNext}</b> إحالة
              </span>
              <span>
                عمولة جديدة:{' '}
                <b className="text-green">{nextLevel.commission}%</b>
              </span>
            </>
          ) : (
            <span className="text-gold">
              <Crown size={11} /> وصلت لأعلى مستوى
            </span>
          )}
        </div>
      </div>

      {/* ============ إجمالي الأرباح ============ */}
      <div className={styles.earningsBox}>
        <Award size={16} className="text-gold" />
        <div>
          <span>أرباح الإحالات الإجمالية</span>
          <b className="mono text-green">
            ${(stats.referralEarnings || 0).toFixed(2)}
          </b>
        </div>
      </div>
    </div>
  );
}