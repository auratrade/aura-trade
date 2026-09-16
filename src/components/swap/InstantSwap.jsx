'use client';
import { useState } from 'react';
import { ArrowDownUp, Info, Zap } from 'lucide-react';
import { swapDefault } from '@/data/mockData';
import styles from './InstantSwap.module.css';

export default function InstantSwap({ compact = false }) {
  const [from, setFrom] = useState({ symbol: 'USDT', amount: 5000 });
  const [to, setTo] = useState({ symbol: 'BTC', amount: 0.0546 });
  const [dir, setDir] = useState('down');

  const flip = () => {
    setFrom({ symbol: to.symbol, amount: to.amount });
    setTo({ symbol: from.symbol, amount: from.amount });
    setDir(dir === 'down' ? 'up' : 'down');
  };

  return (
    <div className={`${styles.wrap} ${compact ? styles.compact : ''}`}>
      <div className={styles.head}>
        <h3 className={styles.title}>
          <Zap size={16} className="text-gold" />
          المبادلة الفورية للعملات
        </h3>
        <span className={styles.badge}>بدون رسوم شبكة</span>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldHead}>
          <span>من</span>
          <span>الرصيد: <b className="mono">320,150.00 USDT</b></span>
        </div>
        <div className={styles.row}>
          <input
            type="number"
            className={`${styles.input} mono`}
            value={from.amount}
            onChange={(e) => setFrom({ ...from, amount: e.target.value })}
          />
          <select className={styles.select} value={from.symbol} onChange={(e) => setFrom({ ...from, symbol: e.target.value })}>
            <option>USDT</option>
            <option>BTC</option>
            <option>ETH</option>
          </select>
        </div>
        <div className={styles.pcts}>
          {[25, 50, 75, 100].map(p => (
            <button key={p} onClick={() => setFrom({ ...from, amount: (5000 * p / 100).toFixed(2) })}>{p}%</button>
          ))}
        </div>
      </div>

      <button className={styles.flip} onClick={flip} aria-label="تبديل">
        <ArrowDownUp size={16} />
      </button>

      <div className={styles.field}>
        <div className={styles.fieldHead}>
          <span>إلى</span>
          <span>سعر الصرف: <b className="mono">{swapDefault.rate}</b></span>
        </div>
        <div className={styles.row}>
          <input
            type="text"
            className={`${styles.input} mono`}
            value={to.amount}
            readOnly
          />
          <select className={styles.select} value={to.symbol} onChange={(e) => setTo({ ...to, symbol: e.target.value })}>
            <option>BTC</option>
            <option>USDT</option>
            <option>ETH</option>
          </select>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailRow}><span>سعر الصرف</span><b className="mono">{swapDefault.rate}</b></div>
        <div className={styles.detailRow}><span>رسوم المبادلة</span><b className="mono">{swapDefault.fee}</b></div>
        <div className={styles.detailRow}><span>الحد الأدنى</span><b className="mono">{swapDefault.min}</b></div>
        <div className={styles.detailRow}><span>تأثير السعر</span><b className="mono text-green">{swapDefault.priceImpact}</b></div>
        <div className={styles.detailRow}>
          <span className={styles.routeLabel}><Info size={12} /> المسار</span>
          <b className={styles.route}>{swapDefault.route}</b>
        </div>
      </div>

      <button className={styles.submit}>مبادلة الآن</button>
    </div>
  );
}