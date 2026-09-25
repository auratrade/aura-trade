'use client';
import { useState, useMemo } from 'react';
import {
  Copy, Check, Wallet, Shield, ArrowDownToLine,
  ArrowUpFromLine, AlertTriangle, Upload, Info, Loader2,
  Sparkles, ChevronDown
} from 'lucide-react';
import { binanceWallet } from '@/data/mockData';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import styles from './DepositWithdraw.module.css';

// QR Code Generator (SVG بسيط)
// QR Code Generator (SVG via API)
function QRCodeSVG({ value, size = 200 }) {
  const encoded = encodeURIComponent(value);
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=ffffff&color=000000&margin=10`;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: size,
        aspectRatio: '1 / 1',
        background: '#fff',
        borderRadius: 12,
        padding: 8,
        display: 'grid',
        placeItems: 'center',
        margin: '0 auto',
      }}
    >
      <img
        src={url}
        alt="QR Code"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
        loading="lazy"
      />
    </div>
  );
}
export default function DepositWithdraw({ initialTab = 'deposit' }) {
  const toast = useToast();
  const { user, refreshBalance } = useAuth();

  const [tab, setTab] = useState(initialTab);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ✅ الشبكة الافتراضية = BEP20
  const [networkKey, setNetworkKey] = useState(binanceWallet.defaultNetwork);

  // ============ إيجاد الشبكة الحالية ============
  const currentNetwork = useMemo(
    () =>
      binanceWallet.networks.find((n) => n.key === networkKey) ||
      binanceWallet.networks[0],
    [networkKey]
  );

  // ============ Deposit State ============
  const [depAmount, setDepAmount] = useState('');
  const [depTxid, setDepTxid] = useState('');
  const [depProof, setDepProof] = useState(null);

  // ============ Withdraw State ============
  const [wdAmount, setWdAmount] = useState('');
  const [wdAddress, setWdAddress] = useState('');
  const [wdPin, setWdPin] = useState('');

  // ============ نسخ العنوان ============
  const copyAddress = () => {
    navigator.clipboard?.writeText(currentNetwork.address);
    setCopied(true);
    toast.success('تم نسخ العنوان');
    setTimeout(() => setCopied(false), 1500);
  };

  // ============ إرسال طلب الإيداع ============
  const handleDepositSubmit = async (e) => {
    e.preventDefault();

    if (!depAmount || parseFloat(depAmount) < binanceWallet.minDeposit) {
      toast.error(`الحد الأدنى للإيداع ${binanceWallet.minDeposit} USDT`);
      return;
    }

    if (!depTxid || depTxid.trim().length < 10) {
      toast.error('الرجاء إدخال هاش المعاملة (TXID) صحيح');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/user/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(depAmount),
          network: `${currentNetwork.name} (${currentNetwork.key})`,
          txid: depTxid.trim(),
          proof: depProof ? depProof.name : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'فشل إرسال الطلب');
      }

      toast.success('✅ تم إرسال طلب الإيداع! سيتم مراجعته خلال 5-30 دقيقة');
      setDepAmount('');
      setDepTxid('');
      setDepProof(null);
    } catch (err) {
      console.error('Deposit error:', err);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ============ إرسال طلب السحب ============
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();

    if (!wdAmount || parseFloat(wdAmount) < binanceWallet.minWithdraw) {
      toast.error(`الحد الأدنى للسحب ${binanceWallet.minWithdraw} USDT`);
      return;
    }
    if (!wdAddress || wdAddress.trim().length < 20) {
      toast.error('الرجاء إدخال عنوان محفظة صحيح');
      return;
    }
    if (wdPin.length !== 4) {
      toast.error('رمز PIN يجب أن يكون 4 أرقام');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/user/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(wdAmount),
          network: `${currentNetwork.name} (${currentNetwork.key})`,
          address: wdAddress.trim(),
          pin: wdPin,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'فشل إرسال الطلب');

      toast.success('✅ تم استلام طلب السحب! سيُعالج خلال 24 ساعة');
      setWdAmount('');
      setWdAddress('');
      setWdPin('');

      if (refreshBalance) await refreshBalance();
    } catch (err) {
      console.error('Withdraw error:', err);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.wrap}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'deposit' ? styles.activeTab : ''}`}
          onClick={() => setTab('deposit')}
          type="button"
        >
          <ArrowDownToLine size={14} /> إيداع
        </button>
        <button
          className={`${styles.tab} ${tab === 'withdraw' ? styles.activeTab : ''}`}
          onClick={() => setTab('withdraw')}
          type="button"
        >
          <ArrowUpFromLine size={14} /> سحب
        </button>
      </div>

      {/* ================= DEPOSIT ================= */}
      {tab === 'deposit' && (
        <>
          {/* تحذير */}
          <div className={styles.notice}>
            <AlertTriangle size={16} />
            <div>
              <b>تنبيه مهم:</b> {binanceWallet.warning}
            </div>
          </div>

          {/* ============ اختيار الشبكة ============ */}
          <div className={styles.networkSection}>
            <div className={styles.networkLabel}>
              <Sparkles size={14} />
              <span>اختر الشبكة</span>
            </div>

            <div className={styles.networkGrid}>
              {binanceWallet.networks.map((net) => (
                <button
                  key={net.key}
                  type="button"
                  className={`${styles.networkCard} ${
                    networkKey === net.key ? styles.networkActive : ''
                  }`}
                  onClick={() => setNetworkKey(net.key)}
                  style={
                    networkKey === net.key
                      ? { borderColor: net.color }
                      : {}
                  }
                >
                  <div className={styles.networkHead}>
                    <span className={styles.networkIcon}>{net.icon}</span>
                    {net.recommended && (
                      <span className={styles.recommendedBadge}>مميزة</span>
                    )}
                  </div>
                  <div
                    className={styles.networkName}
                    style={
                      networkKey === net.key ? { color: net.color } : {}
                    }
                  >
                    {net.key}
                  </div>
                  <div className={styles.networkNameEn}>{net.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ============ معلومات الشبكة المختارة ============ */}
          <div
            className={styles.selectedNetwork}
            style={{ borderColor: currentNetwork.color + '55' }}
          >
            <div className={styles.selectedHead}>
              <div
                className={styles.selectedIcon}
                style={{
                  background: currentNetwork.color + '22',
                  color: currentNetwork.color,
                }}
              >
                {currentNetwork.icon}
              </div>
              <div>
                <div
                  className={styles.selectedName}
                  style={{ color: currentNetwork.color }}
                >
                  {currentNetwork.name}
                </div>
                <div className={styles.selectedNameAr}>
                  {currentNetwork.nameAr}
                </div>
              </div>
            </div>

            {currentNetwork.warning && (
              <div
                className={styles.networkWarning}
                style={{
                  background: currentNetwork.color + '15',
                  borderColor: currentNetwork.color + '44',
                  color: currentNetwork.color,
                }}
              >
                <Info size={12} />
                {currentNetwork.warning}
              </div>
            )}
          </div>

          <div className={styles.grid}>
            {/* LEFT: Form */}
            <form className={styles.form} onSubmit={handleDepositSubmit}>
              {/* العنوان */}
              <label className={styles.field}>
                <span>عنوان المحفظة ({currentNetwork.key})</span>
                <div className={styles.copyWrap}>
                  <input
                    value={currentNetwork.address}
                    readOnly
                    className={`${styles.input} mono`}
                    style={{ fontSize: 11 }}
                  />
                  <button
                    type="button"
                    onClick={copyAddress}
                    className={styles.copyBtn}
                  >
                    {copied ? (
                      <Check size={14} className="text-green" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
                <small className={styles.hint}>
                  أرسل المبلغ إلى هذا العنوان <b>على شبكة {currentNetwork.key}</b> قبل تعبئة النموذج
                </small>
              </label>


                    <div className={styles.notice} style={{ background: 'rgba(245, 176, 65, 0.1)', borderColor: 'rgba(245, 176, 65, 0.3)' }}>
  <AlertTriangle size={16} />
  <div>
    <b>ملاحظة:</b> يمكنك سحب أرباحك فقط (من المهام، الإحالات، الرواتب). رأس المال المُودع لا يمكن سحبه.
  </div>
</div>
              {/* المبلغ */}
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

              {/* TXID */}
              <label className={styles.field}>
                <span>هاش المعاملة (TXID)</span>
                <input
                  type="text"
                  placeholder="0xabc123def456..."
                  value={depTxid}
                  onChange={(e) => setDepTxid(e.target.value)}
                  className={`${styles.input} mono`}
                  required
                />
                <small className={styles.hint}>
                  تجده في سجل المعاملات في محفظتك بعد التحويل
                </small>
              </label>

              {/* إثبات */}
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

              {/* Submit */}
              <button
                type="submit"
                className={styles.submit}
                disabled={submitting}
                style={{
                  background: `linear-gradient(135deg, ${currentNetwork.color}, ${currentNetwork.color}cc)`,
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className={styles.spin} /> جاري الإرسال...
                  </>
                ) : (
                  `تأكيد إرسال طلب الإيداع (${currentNetwork.key})`
                )}
              </button>
            </form>

            {/* RIGHT: QR Code */}
            <div className={styles.qrBox}>
              <div className={styles.qrHeader}>
                <Shield size={16} />
                <span>امسح الرمز للتحويل</span>
              </div>

              <div className={styles.qr}>
                <QRCodeSVG value={currentNetwork.address} size={220} />
              </div>

              <div
                className={styles.qrNetwork}
                style={{
                  background: currentNetwork.color + '15',
                  borderColor: currentNetwork.color + '44',
                }}
              >
                <span>الشبكة</span>
                <b style={{ color: currentNetwork.color }}>
                  {currentNetwork.name} ({currentNetwork.key})
                </b>
              </div>

              <div className={styles.qrNote}>
                <Shield size={12} />
                تأكد من مطابقة الشبكة قبل الإرسال
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className={styles.steps}>
            <h4 className={styles.stepsTitle}>
              خطوات الإيداع على شبكة {currentNetwork.key}
            </h4>
            <ol className={styles.stepsList}>
              <li>
                <span>1</span> افتح محفظتك أو منصتك (Binance، Trust Wallet، إلخ)
              </li>
              <li>
                <span>2</span> اختر <b>إرسال</b> ثم <b>USDT</b>
              </li>
              <li>
                <span>3</span> اختر الشبكة{' '}
                <b style={{ color: currentNetwork.color }}>
                  {currentNetwork.name} ({currentNetwork.key})
                </b>
              </li>
              <li>
                <span>4</span> الصق العنوان أعلاه وأدخل المبلغ
              </li>
              <li>
                <span>5</span> أكّد التحويل وانسخ <b>TXID</b>
              </li>
              <li>
                <span>6</span> ارجع لهذه الصفحة واملأ النموذج
              </li>
            </ol>
          </div>
        </>
      )}

      {/* ================= WITHDRAW ================= */}
      {tab === 'withdraw' && (
        <>
        <div className={styles.balanceBox}>
  <div className={styles.balanceItem}>
    <span>الرصيد القابل للسحب</span>
    <b className="mono text-green">
      ${user?.withdrawableBalance?.toFixed(2) || '0.00'} USDT
    </b>
  </div>
  <div className={styles.balanceItem}>
    <span>قيد السحب</span>
    <b className="mono">
      ${user?.lockedBalance?.toFixed(2) || '0.00'} USDT
    </b>
  </div>
  <div className={styles.balanceItem}>
    <span>رسوم السحب</span>
    <b className="mono">{binanceWallet.withdrawFee} USDT</b>
  </div>
</div>
          {/* اختيار الشبكة للسحب */}
          <div className={styles.networkSection}>
            <div className={styles.networkLabel}>
              <Sparkles size={14} />
              <span>اختر شبكة السحب</span>
            </div>

            <div className={styles.networkGrid}>
              {binanceWallet.networks.map((net) => (
                <button
                  key={net.key}
                  type="button"
                  className={`${styles.networkCard} ${
                    networkKey === net.key ? styles.networkActive : ''
                  }`}
                  onClick={() => setNetworkKey(net.key)}
                  style={
                    networkKey === net.key
                      ? { borderColor: net.color }
                      : {}
                  }
                >
                  <div className={styles.networkHead}>
                    <span className={styles.networkIcon}>{net.icon}</span>
                    {net.recommended && (
                      <span className={styles.recommendedBadge}>مميزة</span>
                    )}
                  </div>
                  <div
                    className={styles.networkName}
                    style={
                      networkKey === net.key ? { color: net.color } : {}
                    }
                  >
                    {net.key}
                  </div>
                  <div className={styles.networkNameEn}>{net.name}</div>
                </button>
              ))}
            </div>
          </div>

          <form className={styles.form} onSubmit={handleWithdrawSubmit}>
            <label className={styles.field}>
              <span>عنوان محفظتك الشخصية على شبكة {currentNetwork.key}</span>
              <input
                type="text"
                placeholder={
                  currentNetwork.key === 'TRC20'
                    ? 'T...'
                    : currentNetwork.key === 'TON'
                    ? 'UQ...'
                    : '0x...'
                }
                value={wdAddress}
                onChange={(e) => setWdAddress(e.target.value)}
                className={`${styles.input} mono`}
                required
              />
              <small className={styles.hint}>
                ⚠️ تأكد أن العنوان يدعم شبكة {currentNetwork.key}
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

            {wdAmount && (
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>المبلغ المطلوب</span>
                  <b className="mono">
                    {parseFloat(wdAmount || 0).toFixed(2)} USDT
                  </b>
                </div>
                <div className={styles.summaryRow}>
                  <span>رسوم الشبكة</span>
                  <b className="mono text-red">
                    - {binanceWallet.withdrawFee} USDT
                  </b>
                </div>
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>ستستلم</span>
                  <b className="mono text-green">
                    {(
                      parseFloat(wdAmount || 0) - binanceWallet.withdrawFee
                    ).toFixed(2)}{' '}
                    USDT
                  </b>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={styles.submit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className={styles.spin} /> جاري الإرسال...
                </>
              ) : (
                `طلب السحب على شبكة ${currentNetwork.key}`
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}