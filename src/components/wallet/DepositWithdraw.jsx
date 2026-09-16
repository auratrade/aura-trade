'use client';
import { useState } from 'react';
import {
  Copy, Check, Wallet, QrCode, Shield, ArrowDownToLine,
  ArrowUpFromLine, AlertTriangle, Upload, Info, Loader2
} from 'lucide-react';
import { binanceWallet, userBalance } from '@/data/mockData';
import styles from './DepositWithdraw.module.css';

const NETWORKS = ['USDT - TRC20', 'USDT - ERC20', 'USDT - BEP20'];

export default function DepositWithdraw({ initialTab = 'deposit' }) {
  const [tab, setTab] = useState(initialTab);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Deposit state
  const [depAmount, setDepAmount] = useState('');
  const [depTxid, setDepTxid] = useState('');
  const [depNetwork, setDepNetwork] = useState(NETWORKS[0]);
  const [depProof, setDepProof] = useState(null);

  // Withdraw state
  const [wdAmount, setWdAmount] = useState('');
  const [wdAddress, setWdAddress] = useState('');
  const [wdNetwork, setWdNetwork] = useState(NETWORKS[0]);
  const [wdPin, setWdPin] = useState('');

  const copyAddress = () => {
    navigator.clipboard?.writeText(binanceWallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDepAmount('');
      setDepTxid('');
      setDepProof(null);
    }, 2500);
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setWdAmount('');
      setWdAddress('');
      setWdPin('');
    }, 2500);
  };

  return (
    <div className={styles.wrap}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'deposit' ? styles.activeTab : ''}`}
          onClick={() => setTab('deposit')}
        >
          <ArrowDownToLine size={14} /> إيداع
        </button>
        <button
          className={`${styles.tab} ${tab === 'withdraw' ? styles.activeTab : ''}`}
          onClick={() => setTab('withdraw')}
        >
          <ArrowUpFromLine size={14} /> سحب
        </button>
      </div>

      {/* ================= DEPOSIT ================= */}
      {tab === 'deposit' && (
        <>
          <div className={styles.notice}>
            <AlertTriangle size={16} />
            <div>
              <b>تنبيه مهم:</b> {binanceWallet.warning}
            </div>
          </div>

          <div className={styles.grid}>
            {/* LEFT: Address + Form */}
            <form className={styles.form} onSubmit={handleDepositSubmit}>
              <label className={styles.field}>
                <span>شبكة الإيداع</span>
                <select
                  value={depNetwork}
                  onChange={(e) => setDepNetwork(e.target.value)}
                  className={styles.select}
                >
                  {NETWORKS.map(n => <option key={n}>{n}</option>)}
                </select>
              </label>

              <label className={styles.field}>
                <span>عنوان محفظة Binance (المنصة)</span>
                <div className={styles.copyWrap}>
                  <input
                    value={binanceWallet.address}
                    readOnly
                    className={`${styles.input} mono`}
                  />
                  <button
                    type="button"
                    onClick={copyAddress}
                    className={styles.copyBtn}
                  >
                    {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                  </button>
                </div>
                <small className={styles.hint}>
                  أرسل المبلغ إلى هذا العنوان <b>قبل</b> تعبئة النموذج
                </small>
              </label>

              <label className={styles.field}>
                <span>المبلغ المُحوَّل (USDT)</span>
                <input
                  type="number"
                  min={binanceWallet.minDeposit}
                  step="0.01"
                  placeholder={`الحد الأدنى ${binanceWallet.minDeposit} USDT`}
                  value={depAmount}
                  onChange={(e) => setDepAmount(e.target.value)}
                  className={`${styles.input} mono`}
                  required
                />
              </label>

              <label className={styles.field}>
                <span>هاش المعاملة (TXID) من Binance</span>
                <input
                  type="text"
                  placeholder="مثال: 0xabc123def456..."
                  value={depTxid}
                  onChange={(e) => setDepTxid(e.target.value)}
                  className={`${styles.input} mono`}
                  required
                />
                <small className={styles.hint}>
                  تجده في سجل معاملات Binance بعد التحويل
                </small>
              </label>

              <label className={styles.field}>
                <span>إثبات التحويل (صورة) — اختياري</span>
                <div className={styles.fileWrap}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setDepProof(e.target.files[0])}
                    id="proof-upload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="proof-upload" className={styles.fileBtn}>
                    <Upload size={14} />
                    {depProof ? depProof.name : 'اختر صورة الإيصال'}
                  </label>
                </div>
              </label>

              <button
                type="submit"
                className={styles.submit}
                disabled={submitted}
              >
                {submitted ? (
                  <><Loader2 size={16} className={styles.spin} /> جاري إرسال الطلب...</>
                ) : (
                  'تأكيد إرسال طلب الإيداع'
                )}
              </button>

              {submitted && (
                <div className={styles.successMsg}>
                  <Check size={14} />
                  تم إرسال طلبك بنجاح! سيتم التحقق منه خلال 5-30 دقيقة.
                </div>
              )}
            </form>

            {/* RIGHT: QR + Info */}
            <div className={styles.qrBox}>
              <div className={styles.qrHeader}>
                <QrCode size={16} />
                <span>امسح الرمز للتحويل</span>
              </div>
              <div className={styles.qr}>
                <svg viewBox="0 0 100 100">
                  {Array.from({ length: 100 }).map((_, i) => {
                    const x = (i % 10) * 10;
                    const y = Math.floor(i / 10) * 10;
                    const filled = (i * 7) % 3 === 0;
                    return filled ? (
                      <rect key={i} x={x} y={y} width="10" height="10" fill="#0a0f1c" />
                    ) : null;
                  })}
                </svg>
              </div>
              <div className={styles.qrNetwork}>
                <span>الشبكة</span>
                <b>{binanceWallet.network}</b>
              </div>
              <div className={styles.qrNote}>
                <Shield size={12} />
                تأكد من مطابقة الشبكة قبل الإرسال
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className={styles.steps}>
            <h4 className={styles.stepsTitle}>خطوات الإيداع</h4>
            <ol className={styles.stepsList}>
              <li><span>1</span> افتح تطبيق Binance واذهب إلى <b>المحفظة → سحب</b></li>
              <li><span>2</span> اختر <b>USDT</b> ثم الشبكة <b>TRC20</b></li>
              <li><span>3</span> الصق عنوان المنصة أعلاه وأدخل المبلغ</li>
              <li><span>4</span> أكّد التحويل وانسخ <b>TXID</b></li>
              <li><span>5</span> ارجع لهذه الصفحة واملأ النموذج واضغط <b>تأكيد</b></li>
              <li><span>6</span> انتظر مراجعة الإدارة (5-30 دقيقة)</li>
            </ol>
          </div>
        </>
      )}

      {/* ================= WITHDRAW ================= */}
      {tab === 'withdraw' && (
        <>
          <div className={styles.balanceBox}>
            <div className={styles.balanceItem}>
              <span>الرصيد المتاح</span>
              <b className="mono text-green">{userBalance.available.toLocaleString()} USDT</b>
            </div>
            <div className={styles.balanceItem}>
              <span>قيد السحب</span>
              <b className="mono">{userBalance.pendingWithdraw.toLocaleString()} USDT</b>
            </div>
            <div className={styles.balanceItem}>
              <span>رسوم السحب</span>
              <b className="mono">{binanceWallet.withdrawFee} USDT</b>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleWithdrawSubmit}>
            <label className={styles.field}>
              <span>شبكة السحب</span>
              <select
                value={wdNetwork}
                onChange={(e) => setWdNetwork(e.target.value)}
                className={styles.select}
              >
                {NETWORKS.map(n => <option key={n}>{n}</option>)}
              </select>
            </label>

            <label className={styles.field}>
              <span>عنوان محفظتك الشخصية</span>
              <input
                type="text"
                placeholder="الصق عنوان محفظتك (TRC20)"
                value={wdAddress}
                onChange={(e) => setWdAddress(e.target.value)}
                className={`${styles.input} mono`}
                required
              />
              <small className={styles.hint}>
                ⚠️ تأكد من صحة العنوان — لا يمكن التراجع بعد الإرسال
              </small>
            </label>

            <label className={styles.field}>
              <span>المبلغ (USDT)</span>
              <input
                type="number"
                min={binanceWallet.minWithdraw}
                step="0.01"
                placeholder={`الحد الأدنى ${binanceWallet.minWithdraw} USDT`}
                value={wdAmount}
                onChange={(e) => setWdAmount(e.target.value)}
                className={`${styles.input} mono`}
                required
              />
              <small className={styles.hint}>
                سيُخصم {binanceWallet.withdrawFee} USDT رسوم شبكة
              </small>
            </label>

            <label className={styles.field}>
              <span>رمز المعاملة PIN</span>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                value={wdPin}
                onChange={(e) => setWdPin(e.target.value.replace(/\D/g, ''))}
                className={`${styles.input} mono`}
                required
              />
            </label>

            {/* Summary */}
            {wdAmount && (
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>المبلغ المطلوب</span>
                  <b className="mono">{parseFloat(wdAmount || 0).toFixed(2)} USDT</b>
                </div>
                <div className={styles.summaryRow}>
                  <span>رسوم الشبكة</span>
                  <b className="mono text-red">- {binanceWallet.withdrawFee} USDT</b>
                </div>
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>ستستلم</span>
                  <b className="mono text-green">
                    {(parseFloat(wdAmount || 0) - binanceWallet.withdrawFee).toFixed(2)} USDT
                  </b>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={styles.submit}
              disabled={submitted}
            >
              {submitted ? (
                <><Loader2 size={16} className={styles.spin} /> جاري إرسال الطلب...</>
              ) : (
                'طلب السحب'
              )}
            </button>

            {submitted && (
              <div className={styles.successMsg}>
                <Check size={14} />
                تم استلام طلب السحب! سيُعالج خلال 24 ساعة.
              </div>
            )}

            <div className={styles.infoBox}>
              <Info size={14} />
              <div>
                تُعالج طلبات السحب يدوياً من محفظة المنصة على Binance خلال <b>1-24 ساعة</b>.
                تأكد من صحة العنوان لتفادي فقدان الأموال.
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}