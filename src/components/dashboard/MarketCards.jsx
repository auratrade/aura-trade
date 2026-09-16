'use client';
import { Repeat, Zap } from 'lucide-react';
import { stocks } from '@/data/mockData';
import styles from './MarketCards.module.css';

function Sparkline({ data, up }) {
  const W = 100, H = 30;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.spark} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={up ? 'var(--green)' : 'var(--red)'} strokeWidth="2" />
    </svg>
  );
}

export default function MarketCards() {
  return (
    <div className={styles.grid}>
      {stocks.map((s) => (
        <div key={s.symbol} className={styles.card}>
          <div className={styles.top}>
            <div>
              <div className={styles.symbol}>{s.symbol}</div>
              <div className={styles.name}>{s.name}</div>
            </div>
            <div className={styles.sparkWrap}><Sparkline data={s.sparkline} up={s.up} /></div>
          </div>
          <div className={styles.priceRow}>
            <span className={`${styles.price} mono`}>${s.price.toFixed(2)}</span>
            <span className={`${styles.change} ${s.up ? 'text-green' : 'text-red'} mono`}>
              {s.up ? '+' : ''}{s.change}%
            </span>
          </div>
          <div className={styles.actions}>
            <button className={styles.tradeBtn}><Zap size={12} /> تداول سريع</button>
            <button className={styles.swapBtn}><Repeat size={12} /> مبادلة فورية</button>
          </div>
        </div>
      ))}
    </div>
  );
}