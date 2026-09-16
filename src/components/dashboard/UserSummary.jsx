'use client';
import { useState } from 'react';
import { ChevronDown, Copy, Eye, EyeOff, TrendingUp, Wallet, Lock } from 'lucide-react';
import { user } from '@/data/mockData';
import styles from './UserSummary.module.css';

export default function UserSummary() {
  const [hidden, setHidden] = useState(false);
  const t = user.totals;
  const fmt = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <section className={styles.wrap}>
      <div className={styles.profile}>
        <div className={styles.avatar}>{user.avatar}</div>
        <div className={styles.info}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{user.name}</span>
            {user.verified && <span className={styles.verified}>موثق ✓</span>}
          </div>
          <div className={styles.meta}>
            <span>معرّف المستخدم: <b className="mono">{user.userId}</b></span>
            <span className={styles.dot}>•</span>
            <span>مستوى الحساب: <b className="text-gold">{user.level}</b></span>
          </div>
        </div>
        <button className={styles.modeBtn}>الوضع الداكن <ChevronDown size={14} /></button>
      </div>

      <div className={styles.stats}>
        <StatCard label="إجمالي القيمة" value={fmt(t.totalValue)} suffix="USDT" icon={TrendingUp} accent="gold" />
        <StatCard label="الرصيد المتاح" value={fmt(t.available)} suffix="USDT" icon={Wallet} accent="green" />
        <StatCard label="الأموال المقفلة" value={fmt(t.locked)} suffix="USDT" icon={Lock} accent="cyan" />
        <StatCard
  label="الأرباح / العوائد"
  value={t.profit > 0 ? `+${fmt(t.profit)}` : fmt(t.profit)}
  suffix={`(${t.profitPct}%)`}
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