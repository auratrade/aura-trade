'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Star, ChevronDown, Radio } from 'lucide-react';
import { activePair, candles as initialCandles } from '@/data/mockData';
import TradeActions from './TradeActions';
import styles from './TradingChart.module.css';

const INTERVALS = ['15د', '1س', '4س', '1ي', '1أ'];
const TICK_INTERVAL = 1500;

// ============ مولّد ID فريد 100% ============
let fallbackCounter = 0;
const makeUniqueId = (prefix = 'c') => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  fallbackCounter += 1;
  const rand = Math.random().toString(36).substring(2, 12);
  return `${prefix}-${fallbackCounter}-${Date.now()}-${rand}`;
};

// ============ تهيئة الشموع بـ IDs فريدة ============
const initCandles = initialCandles.map((c) => ({
  ...c,
  _id: makeUniqueId('init'),
}));

export default function TradingChart() {
  const [interval, setInterval] = useState('1س');
  const [chartType, setChartType] = useState('candles');
  const [candles, setCandles] = useState(initCandles);
  const [livePrice, setLivePrice] = useState(activePair.price);
  const [priceChange, setPriceChange] = useState(activePair.change);
  const [pulse, setPulse] = useState(false);
  const [mounted, setMounted] = useState(false);
  const tickRef = useRef(null);
  const pulseRef = useRef(null);

  // ============ تأخير البدء لتجنب Hydration ============
  useEffect(() => {
    setMounted(true);
  }, []);

  // ============ التحديث المباشر ============
  useEffect(() => {
    if (!mounted) return;

    tickRef.current = window.setInterval(() => {
      setCandles((prev) => {
        if (!prev || prev.length === 0) return prev;

        const last = prev[prev.length - 1];
        const volatility = 0.0015;
        const delta = last.c * (Math.random() - 0.5) * volatility * 2;
        const newClose = Math.max(
          last.c * 0.99,
          Math.min(last.c * 1.01, last.c + delta)
        );

        const updatedLast = {
          ...last,
          c: newClose,
          h: Math.max(last.h, newClose),
          l: Math.min(last.l, newClose),
          v: last.v + Math.random() * 2,
        };

        const shouldAddNew = Math.random() > 0.75;

        if (shouldAddNew) {
          const open = updatedLast.c;
          const close = open + open * (Math.random() - 0.5) * volatility * 2;
          const high = Math.max(open, close) + open * Math.random() * 0.0005;
          const low = Math.min(open, close) - open * Math.random() * 0.0005;

          const newCandle = {
            _id: makeUniqueId('c'),
            o: open,
            c: close,
            h: high,
            l: low,
            v: 40 + Math.random() * 60,
          };

          // ✅ استبدال الشموع القديمة بالشكل الصحيح دون تكرار
          return [...prev.slice(1, -1), updatedLast, newCandle];
        }

        return [...prev.slice(0, -1), updatedLast];
      });

      setLivePrice((p) => p + p * (Math.random() - 0.5) * 0.001);

      setPulse(true);
      if (pulseRef.current) clearTimeout(pulseRef.current);
      pulseRef.current = window.setTimeout(() => setPulse(false), 300);
    }, TICK_INTERVAL);

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      if (pulseRef.current) window.clearTimeout(pulseRef.current);
    };
  }, [mounted]);

  // ============ حساب التغيير ============
  useEffect(() => {
    if (candles.length >= 2) {
      const first = candles[0].c;
      const last = candles[candles.length - 1].c;
      setPriceChange(((last - first) / first) * 100);
    }
  }, [candles]);

  // ============ أبعاد الرسم ============
  const W = 700, H = 260, padB = 40, padT = 10;

  const { min, max } = useMemo(() => {
    const lows = candles.map((c) => c.l);
    const highs = candles.map((c) => c.h);
    return { min: Math.min(...lows), max: Math.max(...highs) };
  }, [candles]);

  const range = max - min || 1;
  const cw = W / candles.length;
  const yScale = (v) => H - padB - ((v - min) / range) * (H - padB - padT);
  const maxVol = Math.max(...candles.map((c) => c.v), 1);
  const isUp = priceChange >= 0;

  // قبل التركيب
  if (!mounted) {
    return (
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div className={styles.pair}>
            <button className={styles.star}><Star size={14} /></button>
            <div>
              <div className={styles.pairName}>BTC/USDT <ChevronDown size={12} /></div>
              <div className={styles.pairMeta}>مؤشر أسعار العقود الآجلة المرتفع</div>
            </div>
          </div>
        </div>
        <div className={styles.chartBox} />
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      {/* HEAD */}
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
          <div className={`${styles.price} mono ${pulse ? styles.priceFlash : ''}`}>
            {livePrice.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className={`${styles.change} mono ${isUp ? 'text-green' : 'text-red'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
          </div>
        </div>

        <div className={styles.liveIndicator}>
          <Radio size={12} className={styles.liveIcon} />
          <span>مباشر</span>
          <span className={styles.liveDot} />
        </div>
      </div>

      {/* TOOLBAR */}
      <div className={styles.toolbar}>
        <div className={styles.intervals}>
          {INTERVALS.map((i) => (
            <button
              key={i}
              className={`${styles.intervalBtn} ${interval === i ? styles.active : ''}`}
              onClick={() => setInterval(i)}
            >{i}</button>
          ))}
        </div>
        <div className={styles.rightTools}>
          <button
            className={`${styles.tool} ${chartType === 'candles' ? styles.active : ''}`}
            onClick={() => setChartType('candles')}
          >شموع</button>
          <button
            className={`${styles.tool} ${chartType === 'line' ? styles.active : ''}`}
            onClick={() => setChartType('line')}
          >خط</button>
        </div>
      </div>

      {/* CHART */}
      <div className={styles.chartBox}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} preserveAspectRatio="none">
          {/* Grid */}
          {[0.2, 0.4, 0.6, 0.8].map((p) => (
            <line
              key={`grid-${p}`}
              x1="0" y1={H * p} x2={W} y2={H * p}
              stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="2 4"
            />
          ))}

          {/* CANDLES */}
          {chartType === 'candles' && candles.map((c, i) => {
            const x = i * cw + cw / 2;
            const green = c.c >= c.o;
            const color = green ? 'var(--green)' : 'var(--red)';
            const yO = yScale(c.o);
            const yC = yScale(c.c);
            const bodyH = Math.max(2, Math.abs(yC - yO));
            const bodyY = Math.min(yO, yC);
            const bw = cw * 0.55;
            const isLast = i === candles.length - 1;

            return (
              <g key={c._id} className={isLast ? styles.lastCandle : ''}>
                <line
                  x1={x} y1={yScale(c.h)}
                  x2={x} y2={yScale(c.l)}
                  stroke={color} strokeWidth="1"
                />
                <rect
                  x={x - bw / 2}
                  y={bodyY}
                  width={bw}
                  height={bodyH}
                  fill={color}
                  rx="1"
                  className={isLast ? styles.glowCandle : ''}
                />
                <rect
                  x={x - bw / 2}
                  y={H - 8 - (c.v / maxVol) * 24}
                  width={bw}
                  height={(c.v / maxVol) * 24}
                  fill={color} opacity="0.4" rx="1"
                />
              </g>
            );
          })}

          {/* LINE */}
          {chartType === 'line' && (
            <>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--green)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                fill="url(#lineGrad)"
                points={`0,${H - padB} ${candles.map((c, i) =>
                  `${i * cw + cw / 2},${yScale(c.c)}`
                ).join(' ')} ${W},${H - padB}`}
              />
              <polyline
                fill="none"
                stroke="var(--green)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={candles.map((c, i) =>
                  `${i * cw + cw / 2},${yScale(c.c)}`
                ).join(' ')}
              />
              <circle
                cx={(candles.length - 1) * cw + cw / 2}
                cy={yScale(candles[candles.length - 1].c)}
                r="4"
                fill="var(--green)"
                className={styles.pulseCircle}
              />
              <circle
                cx={(candles.length - 1) * cw + cw / 2}
                cy={yScale(candles[candles.length - 1].c)}
                r="4"
                fill="none"
                stroke="var(--green)"
                strokeWidth="2"
                className={styles.pulseRing}
              />
            </>
          )}
        </svg>
      </div>

      {/* STATS */}
      <div className={styles.statsRow}>
        <span>أعلى: <b className="mono">{max.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></span>
        <span>أدنى: <b className="mono">{min.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></span>
        <span>حجم 24س: <b className="mono">{activePair.volume}</b></span>
        <span className={styles.liveStats}>
          <span className={styles.liveDot} />
          {livePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
        </span>
      </div>

      {/* TRADE ACTIONS */}
      <TradeActions />
    </div>
  );
}