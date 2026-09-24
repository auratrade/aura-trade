'use client';
import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Loader2, Wallet, RefreshCw
} from 'lucide-react';
import TradeResultModal from './TradeResultModal';
import styles from './TradeActions.module.css';

const TRADE_AMOUNT = 100; // قيمة الصفقة التجريبية

export default function TradeActions() {
  const [balance, setBalance] = useState(1000); // رصيد تجريبي
  const [processing, setProcessing] = useState(null); // 'up' | 'down' | null
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // استرجاع من localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aura-demo-trades');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.balance === 'number') setBalance(parsed.balance);
        if (Array.isArray(parsed.history)) setHistory(parsed.history);
      }
    } catch (e) {}
  }, []);

  // حفظ في localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      'aura-demo-trades',
      JSON.stringify({ balance, history })
    );
  }, [balance, history]);

  const executeTrade = (direction) => {
    if (processing) return;
    if (balance < TRADE_AMOUNT) {
      alert('رصيدك التجريبي غير كافٍ. أعد التعيين للمتابعة.');
      return;
    }

    setProcessing(direction);

    // محاكاة تنفيذ الصفقة
    setTimeout(() => {
      const entryPrice = 69149.29 + (Math.random() - 0.5) * 200;
      // ⚠️ الخسارة قسرية (للتجربة)
      const exitPrice = entryPrice * (direction === 'up' ? 0.985 : 0.985);
      const lossPct = 0.012 + Math.random() * 0.015; // 1.2% - 2.7%
      const loss = TRADE_AMOUNT * lossPct;
      const balanceAfter = Math.max(0, balance - loss);

      const newResult = {
        direction,
        symbol: 'BTC/USDT',
        entryPrice,
        exitPrice,
        amount: TRADE_AMOUNT,
        loss,
        balanceAfter,
        timestamp: Date.now(),
      };

      setBalance(balanceAfter);
      setHistory((prev) => [newResult, ...prev].slice(0, 5));
      setResult(newResult);
      setProcessing(null);
    }, 1800);
  };

  const resetBalance = async () => {
  const ok = await confirm({
    title: 'إعادة تعيين الرصيد',
    message: 'هل تريد إعادة تعيين الرصيد التجريبي إلى 1000$؟',
    confirmText: 'إعادة تعيين',
    type: 'warning',
  });
  if (!ok) return;

  setBalance(1000);
  setHistory([]);
  localStorage.removeItem('aura-demo-trades');
  toast.success('تم إعادة تعيين الرصيد بنجاح');
};

  return (
    <>
      <div className={styles.wrap}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.balanceBox}>
            <Wallet size={14} className="text-gold" />
            <div>
              <div className={styles.balanceLabel}>رصيد تجريبي</div>
              <div className={`${styles.balanceValue} mono`}>
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <button className={styles.resetBtn} onClick={resetBalance} title="إعادة تعيين">
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Trade Buttons */}
        <div className={styles.actions}>
          <button
            className={`${styles.tradeBtn} ${styles.upBtn}`}
            onClick={() => executeTrade('up')}
            disabled={!!processing}
          >
            {processing === 'up' ? (
              <><Loader2 size={18} className={styles.spin} /> جاري التنفيذ...</>
            ) : (
              <>
                <TrendingUp size={18} />
                <div className={styles.btnContent}>
                  <span className={styles.btnTitle}>صعود</span>
                  <span className={styles.btnSub}>شراء / Long</span>
                </div>
              </>
            )}
          </button>

          <button
            className={`${styles.tradeBtn} ${styles.downBtn}`}
            onClick={() => executeTrade('down')}
            disabled={!!processing}
          >
            {processing === 'down' ? (
              <><Loader2 size={18} className={styles.spin} /> جاري التنفيذ...</>
            ) : (
              <>
                <TrendingDown size={18} />
                <div className={styles.btnContent}>
                  <span className={styles.btnTitle}>هبوط</span>
                  <span className={styles.btnSub}>بيع / Short</span>
                </div>
              </>
            )}
          </button>
        </div>

        <div className={styles.tradeInfo}>
          قيمة الصفقة: <b className="mono">${TRADE_AMOUNT}</b> • تجريبي
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className={styles.history}>
            <div className={styles.historyTitle}>آخر الصفقات</div>
            <div className={styles.historyList}>
              {history.slice(0, 3).map((h, i) => (
                <div key={h.timestamp + i} className={styles.historyItem}>
                  <div className={`${styles.historyIcon} ${h.direction === 'up' ? styles.up : styles.down}`}>
                    {h.direction === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  </div>
                  <div className={styles.historyInfo}>
                    <span className={styles.historyDir}>
                      {h.direction === 'up' ? 'صعود' : 'هبوط'}
                    </span>
                    <span className={styles.historyTime}>
                      {new Date(h.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={`${styles.historyLoss} mono`}>
                    -${h.loss.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Result Modal */}
      {result && (
        <TradeResultModal
          result={result}
          onClose={() => setResult(null)}
        />
      )}
    </>
  );
}