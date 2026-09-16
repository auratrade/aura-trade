'use client';
import { useState } from 'react';
import { Star, ChevronDown } from 'lucide-react';
import { activePair, candles } from '@/data/mockData';
import styles from './TradingChart.module.css';

const INTERVALS = ['15د', '1س', '4س', '1ي', '1أ'];

export default function TradingChart() {
  const [interval, setInterval] = useState('1س');
  const [chartType, setChartType] = useState('candles');

  const W = 700, H = 260, padB = 40;
  const min = Math.min(...candles.map(c => c.l));
  const max = Math.max(...candles.map(c => c.h));
  const range = max - min;
  const cw = W / candles.length;
  const yScale = (v) => H - padB - ((v - min) / range) * (H - padB - 10);
  const maxVol = Math.max(...candles.map(c => c.v));

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div className={styles.pair}>
          <button className={styles.star}><Star size={14} /></button>
          <div>
            <div className={styles.pairName}>
              BTC/USDT <ChevronDown size={12} />
            </div>
            <div className={styles.pairMeta}>مؤشر أسعار العقود الآجلة المرتفع</div>
          </div>
        </div>
        <div className={styles.priceBox}>
          <div className={`${styles.price} mono`}>{activePair.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div className={`${styles.change} mono text-red`}>{activePair.change}% ▼</div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.intervals}>
          {INTERVALS.map(i => (
            <button
              key={i}
              className={`${styles.intervalBtn} ${interval === i ? styles.active : ''}`}
              onClick={() => setInterval(i)}
            >{i}</button>
          ))}
        </div>
        <div className={styles.rightTools}>
          <button className={`${styles.tool} ${chartType === 'candles' ? styles.active : ''}`} onClick={() => setChartType('candles')}>شموع</button>
          <button className={`${styles.tool} ${chartType === 'line' ? styles.active : ''}`} onClick={() => setChartType('line')}>خط</button>
        </div>
      </div>

      <div className={styles.chartBox}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} preserveAspectRatio="none">
          {/* grid */}
          {[0.2, 0.4, 0.6, 0.8].map(p => (
            <line key={p} x1="0" y1={H * p} x2={W} y2={H * p} stroke="#141c33" strokeWidth="1" />
          ))}

          {/* candles */}
          {chartType === 'candles' && candles.map((c, i) => {
            const x = i * cw + cw / 2;
            const green = c.c >= c.o;
            const color = green ? '#16c784' : '#ea3943';
            const yO = yScale(c.o), yC = yScale(c.c);
            const bodyH = Math.max(2, Math.abs(yC - yO));
            const bodyY = Math.min(yO, yC);
            const bw = cw * 0.55;
            return (
              <g key={i}>
                <line x1={x} y1={yScale(c.h)} x2={x} y2={yScale(c.l)} stroke={color} strokeWidth="1" />
                <rect x={x - bw/2} y={bodyY} width={bw} height={bodyH} fill={color} />
                {/* volume */}
                <rect
                  x={x - bw/2}
                  y={H - 8 - (c.v / maxVol) * 24}
                  width={bw}
                  height={(c.v / maxVol) * 24}
                  fill={color}
                  opacity="0.45"
                />
              </g>
            );
          })}

          {chartType === 'line' && (
            <polyline
              fill="none"
              stroke="#16c784"
              strokeWidth="2"
              points={candles.map((c, i) => `${i * cw + cw/2},${yScale(c.c)}`).join(' ')}
            />
          )}
        </svg>
      </div>

      <div className={styles.statsRow}>
        <span>أعلى: <b className="mono">
{activePair.high.toLocaleString('en-US')}</b></span>
        <span>أدنى: <b className="mono">{activePair.low.toLocaleString('en-US')}</b></span>
        <span>حجم 24س: <b className="mono">{activePair.volume}</b></span>
      </div>
    </div>
  );
}