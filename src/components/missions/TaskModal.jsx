'use client';
import { useState, useEffect } from 'react';
import {
  X, TrendingUp, Check, Loader2, Info, ShoppingCart,
  TrendingDown, Gift, Wallet, ArrowRight
} from 'lucide-react';
import { useMissions } from '@/context/MissionsContext';
import styles from './TaskModal.module.css';

function Sparkline({ data, up }) {
  const W = 200, H = 50;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * H}`)
    .join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.spark} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={up ? 'var(--green)' : 'var(--red)'}
        strokeWidth="2"
      />
    </svg>
  );
}

export default function TaskModal({ mission, onClose }) {
  const { completeMission, rewardPerMission, depositBalance, percent } = useMissions();
  const [step, setStep] = useState('view'); // view | processing | success
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!mission) return null;

  const totalCost = (mission.price * quantity).toFixed(2);

  const handleBuy = () => {
    setStep('processing');
    setTimeout(() => {
      completeMission(mission.id);
      setStep('success');
    }, 1800);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={`${styles.stockIcon} ${mission.up ? styles.up : styles.down}`}>
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 className={styles.title}>{mission.title}</h3>
              <div className={styles.subtitle}>
                {mission.symbol} • {mission.name}
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="إغلاق">
            <X size={18} />
          </button>
        </div>

        {/* ========== STEP: VIEW ========== */}
        {step === 'view' && (
          <>
            <p className={styles.desc}>{mission.description}</p>

            {/* Stock info card */}
            <div className={styles.stockCard}>
              <div className={styles.stockTop}>
                <div>
                  <div className={styles.stockSymbol}>{mission.symbol}</div>
                  <div className={styles.stockName}>{mission.name}</div>
                </div>
                <div className={styles.sparkWrap}>
                  <Sparkline data={mission.sparkline} up={mission.up} />
                </div>
              </div>
              <div className={styles.stockBottom}>
                <div>
                  <span className={styles.priceLabel}>السعر الحالي</span>
                  <div className={`${styles.price} mono`}>${mission.price.toFixed(2)}</div>
                </div>
                <div className={`${styles.change} ${mission.up ? 'text-green' : 'text-red'}`}>
                  {mission.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {mission.up ? '+' : ''}{mission.change}%
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className={styles.field}>
              <label>عدد الأسهم</label>
              <div className={styles.qtyRow}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className={styles.qtyBtn}
                >−</button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`${styles.qtyInput} mono`}
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className={styles.qtyBtn}
                >+</button>
              </div>
            </div>

            {/* Summary */}
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>إجمالي التكلفة</span>
                <b className="mono">${totalCost}</b>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.rewardLabel}>
                  <Gift size={12} /> مكافأة المهمة
                </span>
                <b className="mono text-green">+${rewardPerMission.toFixed(2)}</b>
              </div>
            </div>

            {/* Reward info */}
            <div className={styles.rewardInfo}>
              <Info size={14} />
              <div>
                <b>{percent}% من رصيد الإيداع</b>
                <span>
                  رصيد إيداعك: <b className="mono">${depositBalance.toFixed(2)}</b> →
                  مكافأة كل مهمة = <b className="mono text-green">${rewardPerMission.toFixed(2)}</b>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={onClose}>
                إلغاء
              </button>
              <button className={styles.buyBtn} onClick={handleBuy}>
                <ShoppingCart size={16} />
                شراء الآن وتنفيذ المهمة
              </button>
            </div>
          </>
        )}

        {/* ========== STEP: PROCESSING ========== */}
        {step === 'processing' && (
          <div className={styles.processing}>
            <div className={styles.spinnerWrap}>
              <Loader2 size={40} className={styles.spin} />
            </div>
            <h4 className={styles.processingTitle}>جاري تنفيذ الأمر...</h4>
            <p className={styles.processingDesc}>
              يتم شراء {quantity} سهم من {mission.symbol} بسعر السوق
            </p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} />
            </div>
          </div>
        )}

        {/* ========== STEP: SUCCESS ========== */}
        {step === 'success' && (
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <Check size={32} />
            </div>
            <h4 className={styles.successTitle}>تمت المهمة بنجاح!</h4>
            <p className={styles.successDesc}>
              تم شراء {quantity} سهم من {mission.symbol} بنجاح
            </p>

            <div className={styles.rewardBox}>
              <Gift size={20} className="text-gold" />
              <div>
                <span>المكافأة المُضافة</span>
                <b className="mono text-green">+${rewardPerMission.toFixed(2)}</b>
              </div>
            </div>

            <button className={styles.doneBtn} onClick={onClose}>
              رائع، إغلاق
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}