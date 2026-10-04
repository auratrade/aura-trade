'use client';
import { useState } from 'react';
import { activePair, user } from '@/data/mockData';
import styles from './TradePanel.module.css';

const PCTS = [25, 50, 75, 100];

export default function TradePanel() {
  const [side, setSide] = useState('buy');
  const [orderType, setOrderType] = useState('limit');
  const [price, setPrice] = useState(activePair.price);
  const [amount, setAmount] = useState('');
  const [pct, setPct] = useState(0);

  const total = (parseFloat(amount) || 0) * (parseFloat(price) || 0);

  const handlePct = (p) => {
    setPct(p);
    const bal = side === 'buy' ? user.totals.available : 0.5;
    if (side === 'buy') {
      setAmount(((bal * (p / 100)) / parseFloat(price)).toFixed(4));
    } else {
      setAmount((bal * (p / 100)).toFixed(4));
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${side === 'buy' ? styles.buyTab : ''}`}
          onClick={() => setSide('buy')}
        >شراء</button>
        <button
          className={`${styles.tab} ${side === 'sell' ? styles.sellTab : ''}`}
          onClick={() => setSide('sell')}
        >بيع</button>
      </div>

      <div className={styles.typeRow}>
        {['limit', 'market'].map(t => (
          <button
            key={t}
            className={`${styles.typeBtn} ${orderType === t ? styles.typeActive : ''}`}
            onClick={() => setOrderType(t)}
          >
            {t === 'limit' ? 'محدد' : 'سوق'}
          </button>
        ))}
        <span className={styles.balance}>
          متاح: <b className="mono">{side === 'buy' ? user.totals.available.toLocaleString() : '0.5'}</b>
        </span>
      </div>

      <label className={styles.field}>
        <span>السعر</span>
        <div className={styles.inputWrap}>
          <input
            type="number"
            className={`${styles.input} mono`}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <span className={styles.suffix}>USDT</span>
        </div>
      </label>

      <label className={styles.field}>
        <span>الكمية</span>
        <div className={styles.inputWrap}>
          <input
            type="number"
            className={`${styles.input} mono`}
            value={amount}
            placeholder="0.0000"
            onChange={(e) => setAmount(e.target.value)}
          />
          <span className={styles.suffix}>BTC</span>
        </div>
      </label>

      <div className={styles.pcts}>
        {PCTS.map(p => (
          <button
            key={p}
            className={`${styles.pctBtn} ${pct === p ? styles.pctActive : ''}`}
            onClick={() => handlePct(p)}
          >{p}%</button>
        ))}
      </div>

      <div className={styles.totalRow}>
        <span>إجمالي الطلب</span>
        <b className="mono">{total.toFixed(2)} USDT</b>
      </div>

      <button className={`${styles.submit} ${side === 'buy' ? styles.buyBtn : styles.sellBtn}`}>
        {side === 'buy' ? 'تنفيذ أمر الشراء' : 'تنفيذ أمر البيع'}
      </button>
    </div>
  );
}