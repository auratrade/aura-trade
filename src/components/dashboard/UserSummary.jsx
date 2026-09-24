'use client';
import { useState, useEffect } from 'react';
import {
  ChevronDown, Eye, EyeOff, TrendingUp, Wallet, Lock, Crown, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getCurrentLevel, getNextLevel, getReferralsToNext } from '@/utils/levels';
import styles from './UserSummary.module.css';

export default function UserSummary() {
  const { user, refreshBalance } = useAuth();
  const [hidden, setHidden] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // حدّث الرصيد عند التحميل
  useEffect(() => {
    if (user) {
      refreshBalance();
    }
  }, [user?.id]);

  if (!user) return null;

  const fmt = (n) =>
    Number(n || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const currentLevel = getCurrentLevel(user.referralCount || 0);
  const nextLevel = getNextLevel(user.referralCount || 0);
  const toNext = getReferralsToNext(user.referralCount || 0);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBalance();
    setTimeout(() => setRefreshing(false), 500);
  };

  const profitPct =
    user.totalDeposited > 0
      ? ((user.totalProfit / user.totalDeposited) * 100).toFixed(2)
      : '0.00';

  return (
    <section className={styles.wrap}>
      <div className={styles.profile}>
        <div className={styles.avatar}>
          {user.username?.slice(0, 2).toUpperCase() || 'AV'}
        </div>
        <div className={styles.info}>
          <div className={styles.nameRow}>
            <span className={styles.name}>
              {user.fullName || user.username}
            </span>
            {user.isVerified && <span className={styles.verified}>موثق ✓</span>}
          </div>
          <div className={styles.meta}>
            <span>معرّف: <b className="mono">{user.id.slice(0, 8)}</b></span>
            <span className={styles.dot}>•</span>
            <span className={styles.levelInline}>
              <Crown size={12} style={{ color: currentLevel.color }} />
              <b style={{ color: currentLevel.color }}>{currentLevel.name}</b>
            </span>
            <span className={styles.dot}>•</span>
            <span>الإحالات: <b className="mono">{user.referralCount || 0}</b></span>
          </div>
        </div>

        <button
          className={styles.modeBtn}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={12} className={refreshing ? styles.spin : ''} />
          تحديث
        </button>
      </div>

      {/* شريط الترقية */}
      {nextLevel && (
        <div className={styles.upgradeBar}>
          <div className={styles.upgradeText}>
            <Crown size={14} style={{ color: currentLevel.color }} />
            <span>
              باقي <b className="text-gold">{toNext}</b> إحالة للترقية إلى
              <b style={{ color: nextLevel.color }}> {nextLevel.name}</b>
            </span>
          </div>
          <div className={styles.upgradeProgress}>
            <div
              className={styles.upgradeFill}
              style={{
                width: `${(user.referralCount / nextLevel.minReferrals) * 100}%`,
                background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})`,
              }}
            />
          </div>
          <span className={styles.upgradeCount}>
            {user.referralCount || 0} / {nextLevel.minReferrals}
          </span>
        </div>
      )}

      <div className={styles.stats}>
        <StatCard
          label="إجمالي القيمة"
          value={fmt(user.totalValue)}
          suffix="USDT"
          icon={TrendingUp}
          accent="gold"
        />
        <StatCard
          label="الرصيد المتاح"
          value={fmt(user.availableBalance)}
          suffix="USDT"
          icon={Wallet}
          accent="green"
        />
        <StatCard
          label="الأموال المقفلة"
          value={fmt(user.lockedBalance)}
          suffix="USDT"
          icon={Lock}
          accent="cyan"
        />
        <StatCard
          label="الأرباح / العوائد"
          value={user.totalProfit > 0 ? `+${fmt(user.totalProfit)}` : fmt(user.totalProfit)}
          suffix={`(${profitPct}%)`}
          accent="green"
          hidden={hidden}
          onToggle={() => setHidden(!hidden)}
        />
      </div>
    </section>
  );
}

function StatCard({ label, value, suffix, accent, hidden, onToggle, icon: Icon }) {
  return (
    <div className={`${styles.card} ${styles['accent_' + accent]}`}>
      <div className={styles.cardHead}>
        <span className={styles.cardLabel}>{label}</span>
        {Icon && <Icon size={14} className={styles.cardIcon} />}
      </div>
      <div className={styles.cardValue}>
        {hidden ? '••••••' : value}
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      {onToggle && (
        <button className={styles.toggle} onClick={onToggle} aria-label="إظهار/إخفاء">
          {hidden ? <EyeOff size={12} /> : <Eye size={12} />}
        </button>
      )}
    </div>
  );
}