'use client';
import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Loader2, Wallet, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import TradeResultModal from './TradeResultModal';
import styles from './TradeActions.module.css';

const TRADE_AMOUNT = 100; // قيمة الصفقة

export default function TradeActions() {
  const { user, refreshBalance } = useAuth();
  const toast = useToast();

  const [processing, setProcessing] = useState(null); // 'up' | 'down' | null
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // استرجاع من localStorage (لسجل الصفقات فقط)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aura-trades-history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.history)) setHistory(parsed.history);
      }
    } catch (e) {}
  }, []);

  // حفظ سجل الصفقات في localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      'aura-trades-history',
      JSON.stringify({ history })
    );
  }, [history]);

  const executeTrade = async (direction) => {
    if (processing) return;

    // التحقق من الرصيد
    if (!user || (user.availableBalance || 0) < TRADE_AMOUNT) {
      toast.error('رصيدك غير كافٍ، الحد الأدنى للصفقة 100$');
      return;
    }

    setProcessing(direction);

    try {
      // استدعاء API لتنفيذ الصفقة
      const res = await fetch('/api/user/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'فشل تنفيذ الصفقة');
      }

      const data = await res.json();
      const tradeResult = data.trade;

      // تحديث الرصيد من قاعدة البيانات
      await refreshBalance();

      // إضافة الصفقة إلى السجل
      const newResult = {
        direction,
        symbol: tradeResult.symbol,
        entryPrice: parseFloat(tradeResult.entryPrice),
        exitPrice: parseFloat(tradeResult.exitPrice),
        amount: tradeResult.amount,
        loss: parseFloat(tradeResult.loss),
        balanceAfter: parseFloat(tradeResult.balanceAfter),
        timestamp: Date.now(),
      };

      setHistory((prev) => [newResult, ...prev].slice(0, 5));
      setResult(newResult);
      toast.success(`تم تنفيذ صفقة ${direction === 'up' ? 'صعود' : 'هبوط'} بنجاح - خسارة $${tradeResult.loss}`);
    } catch (error) {
      toast.error(error.message || 'حدث خطأ أثناء تنفيذ الصفقة');
      console.error('Trade error:', error);
    } finally {
      setProcessing(null);
    }
  };

  const resetBalanceHistory = async () => {
    // فقط حذف السجل، الرصيد الفعلي لا يُحذف
    setHistory([]);
    localStorage.removeItem('aura-trades-history');
    toast.success('تم حذف سجل الصفقات بنجاح');
  };

  return (
    <>
      <div className={styles.wrap}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.balanceBox}>
            <Wallet size={14} className="text-gold" />
            <div>
              <div className={styles.balanceLabel}>رصيدك الحقيقي</div>
              <div className={`${styles.balanceValue} mono`}>
                ${(user?.availableBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <button className={styles.resetBtn} onClick={resetBalanceHistory} title="حذف السجل">
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
          قيمة الصفقة: <b className="mono">${TRADE_AMOUNT}</b> • {(user?.availableBalance || 0) >= TRADE_AMOUNT ? 'جاهز للتداول' : 'رصيد غير كافٍ'}
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