'use client';
import { orderBook, activePair } from '@/data/mockData';
import styles from './OrderBook.module.css';

export default function OrderBook() {
  const price = activePair.price;
  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <h3 className={styles.title}>سجل الأوامر</h3>
        <span className={styles.mode}>سعر السوق</span>
      </div>

      <div className={styles.columns}>
        <span>السعر (USDT)</span>
        <span>الكمية (BTC)</span>
        <span>الإجمالي</span>
      </div>

      <div className={styles.rows}>
        {orderBook.sells.map((o, i) => {
          const pct = ((o.total / 15000) * 100);
          return (
            <div key={'s'+i} className={`${styles.row} ${styles.sellRow}`}>
              <span className={styles.bar} style={{ width: `${pct}%` }} />
              <span className="text-red mono">{o.price.toFixed(2)}</span>
              <span className="mono">{o.amount.toFixed(4)}</span>
              <span className="mono">{o.total.toFixed(2)}</span>
            </div>
          );
        })}

        <div className={styles.currentPrice}>
          <span className="mono">{price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          <span className="text-red">▼ {activePair.change}%</span>
        </div>

        {orderBook.buys.map((o, i) => {
          const pct = ((o.total / 15000) * 100);
          return (
            <div key={'b'+i} className={`${styles.row} ${styles.buyRow}`}>
              <span className={styles.bar} style={{ width: `${pct}%` }} />
              <span className="text-green mono">{o.price.toFixed(2)}</span>
              <span className="mono">{o.amount.toFixed(4)}</span>
              <span className="mono">{o.total.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}