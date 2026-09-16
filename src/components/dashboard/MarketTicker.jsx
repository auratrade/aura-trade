'use client';
import { markets } from '@/data/mockData';
import styles from './MarketTicker.module.css';

export default function MarketTicker() {
  return (
    <div className={styles.ticker}>
      <div className={styles.track}>
        {[...markets, ...markets].map((m, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.symbol}>{m.symbol}</span>
            <span className={`${styles.price} mono`}>{m.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span className={`${styles.change} ${m.up ? 'text-green' : 'text-red'} mono`}>
              {m.up ? '▲' : '▼'} {Math.abs(m.change)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}