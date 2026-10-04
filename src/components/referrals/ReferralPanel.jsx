'use client';
import { useState, useEffect } from 'react';
import {
  Copy, Check, Users, Crown, Lock, Gift,
  DollarSign, RefreshCw, Share2, Award, TrendingUp
} from 'lucide-react';
import {
  getTiersWithStatus,
  getTierFromReferrals,
  getNextTier,
  getReferralsToNext,
  canWithdrawSalary,
  referralsToUnlockSalary,
} from '@/lib/referral-tiers';
import { useToast } from '@/context/ToastContext';
import { useConfirm } from '@/context/ConfirmContext';
import styles from './ReferralPanel.module.css';

export default function ReferralPanel() {
  const toast = useToast();
  const { confirm } = useConfirm();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [transferring, setTransferring] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const res = await fetch('/api/referral/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const copyCode = () => {
    if (!stats?.referralCode) return;
    navigator.clipboard?.writeText(stats.referralCode);
    setCopied(true);
    toast.success('تم نسخ كود الإحالة');
    setTimeout(() => setCopied(false), 1500);
  };

  const shareCode = async () => {
    const code = stats?.referralCode;
    if (!code) return;
    const text = `انضم إلى AURA TRADE & INVEST واستخدم كود الإحالة: ${code}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'AURA TRADE & INVEST', text });
      } catch {}
    } else {
      navigator.clipboard?.writeText(text);
      toast.success('تم نسخ كود الإحالة');
    }
  };

  const transferEarnings = async () => {
    if (!stats?.referralEarnings || stats.referralEarnings <= 0) {
      toast.warning('لا توجد أرباح قابلة للنقل');
      return;
    }

    const ok = await confirm({
      title: 'نقل الأرباح',
      message: `سيتم نقل $${stats.referralEarnings.toFixed(2)} إلى رصيدك المتاح.`,
      confirmText: 'نقل',
      type: 'success',
    });
    if (!ok) return;

    setTransferring(true);
    try {
      const res = await fetch('/api/referral/withdraw', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(`تم نقل $${data.transferred.toFixed(2)}`);
      await loadStats();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTransferring(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className={styles.wrap}>
        <div className={styles.loading}>
          <RefreshCw size={20} className={styles.spin} />
          <span>جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

  // ✅ استخدام النظام الجديد
  const referralCount = stats.totalReferrals || 0;
  const currentTier = getTierFromReferrals(referralCount);
  const nextTier = getNextTier(referralCount);
  const toNext = getReferralsToNext(referralCount);
  const tiers = getTiersWithStatus(referralCount);
  const canWithdraw = canWithdrawSalary(referralCount, currentTier);
  const unlockNeeded = referralsToUnlockSalary(referralCount);

  return (
    <div className={styles.wrap}>
      {/* ============ TOP STATS ============ */}
      <div className={styles.top}>
        <div className={styles.codeBox}>
          <div className={styles.label}>كود الإحالة</div>
          <div className={styles.codeRow}>
            <div className={styles.code}>{stats.referralCode}</div>
            <button
              className={styles.copyMini}
              onClick={copyCode}
              type="button"
            >
              {copied ? (
                <Check key="check" size={14} className="text-green" />
              ) : (
                <Copy key="copy" size={14} />
              )}
            </button>
          </div>
        </div>

        <div className={styles.stat}>
          <Users size={16} className="text-cyan" />
          <div>
            <div className={styles.statValue}>{referralCount}</div>
            <div className={styles.statLabel}>إجمالي الإحالات</div>
          </div>
        </div>

        <div className={styles.stat}>
          <Crown size={16} style={{ color: currentTier.color }} />
          <div>
            <div
              className={styles.statValue}
              style={{ color: currentTier.color }}
            >
              {currentTier.name}
            </div>
            <div className={styles.statLabel}>مستواك الحالي</div>
          </div>
        </div>

        <div className={styles.stat}>
          <DollarSign size={16} className="text-green" />
          <div>
            <div className={styles.statValue}>
              ${stats.referralEarnings?.toFixed(2) || '0.00'}
            </div>
            <div className={styles.statLabel}>أرباح الإحالات</div>
          </div>
        </div>
      </div>

      {/* ============ SHARE ============ */}
      <div className={styles.shareSection}>
        <div className={styles.shareHead}>
          <Gift size={16} />
          <span>شارك كود الإحالة مع أصدقائك</span>
        </div>
        <div className={styles.shareBox}>
          <div className={styles.shareCodeWrap}>
            <span className={styles.shareCode}>{stats.referralCode}</span>
          </div>
          <div className={styles.shareActions}>
            <button
              className={styles.shareCopyBtn}
              onClick={copyCode}
              type="button"
            >
              {copied ? (
                <><Check key="c1" size={14} /> تم النسخ</>
              ) : (
                <><Copy key="c2" size={14} /> نسخ الكود</>
              )}
            </button>
            <button
              className={styles.shareBtn}
              onClick={shareCode}
              type="button"
            >
              <Share2 size={14} /> مشاركة
            </button>
          </div>
        </div>
      </div>

      {/* ============ BONUSES ============ */}
      {stats.totalBonusEarned > 0 && (
        <div className={styles.earningsBox}>
          <div className={styles.earningsHead}>
            <div className={styles.earningsIcon}>
              <Award size={18} />
            </div>
            <div className={styles.earningsInfo}>
              <span>إجمالي المكافآت المكتسبة</span>
              <b className="mono">
                ${stats.totalBonusEarned?.toFixed(2) || '0.00'}
              </b>
            </div>
          </div>
        </div>
      )}

      {/* ============ SALARY ============ */}
      {currentTier.weeklySalary > 0 && (
        <div
          className={styles.earningsBox}
          style={{
            background: canWithdraw
              ? 'linear-gradient(135deg, var(--green-soft), transparent)'
              : 'linear-gradient(135deg, var(--gold-soft), transparent)',
            borderColor: canWithdraw
              ? 'rgba(22, 199, 132, 0.3)'
              : 'rgba(245, 176, 65, 0.3)',
          }}
        >
          <div className={styles.earningsHead}>
            <div
              className={styles.earningsIcon}
              style={{
                background: canWithdraw
                  ? 'var(--green-soft)'
                  : 'var(--gold-soft)',
                color: canWithdraw ? 'var(--green)' : 'var(--gold)',
              }}
            >
              {canWithdraw ? <TrendingUp size={18} /> : <Lock size={18} />}
            </div>
            <div className={styles.earningsInfo}>
              <span>الراتب الأسبوعي</span>
              <b className="mono">
                ${currentTier.weeklySalary} USDT
              </b>
              <small
                style={{
                  fontSize: 10,
                  color: canWithdraw ? 'var(--green)' : 'var(--gold)',
                  display: 'block',
                  marginTop: 4,
                }}
              >
                {canWithdraw
                  ? '✅ قابل للسحب'
                  : `🔒 يحتاج ${unlockNeeded} إحالة إضافية`}
              </small>
            </div>
          </div>
        </div>
      )}

      {/* ============ EARNINGS TRANSFER ============ */}
      {stats.referralEarnings > 0 && (
        <div className={styles.earningsBox}>
          <div className={styles.earningsHead}>
            <div className={styles.earningsIcon}>
              <DollarSign size={18} />
            </div>
            <div className={styles.earningsInfo}>
              <span>أرباح الإحالات القابلة للنقل</span>
              <b className="mono">
                ${stats.referralEarnings?.toFixed(2) || '0.00'}
              </b>
            </div>
          </div>
          <button
            className={styles.transferBtn}
            onClick={transferEarnings}
            disabled={transferring}
            type="button"
          >
            {transferring ? (
              <span key="tr" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <RefreshCw size={12} className={styles.spin} />
                جاري النقل...
              </span>
            ) : (
              <span key="idle" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                نقل إلى المحفظة
              </span>
            )}
          </button>
        </div>
      )}

      {/* ============ PROGRESS ============ */}
      {nextTier && (
        <div className={styles.progressCard}>
          <div className={styles.progressHead}>
            <div className={styles.progressTitle}>
              <Crown size={14} className="text-gold" />
              <span>
                التقدم نحو{' '}
                <b style={{ color: nextTier.color }}>{nextTier.name}</b>
              </span>
            </div>
            <span className={styles.progressCount}>
              {referralCount} / {nextTier.minReferrals}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${Math.min(
                  100,
                  (referralCount / nextTier.minReferrals) * 100
                )}%`,
                background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})`,
              }}
            />
          </div>
          <div className={styles.progressFoot}>
            <span>
              باقي <b className="text-gold">{toNext}</b> إحالة
            </span>
            <span>
              مكافأة:{' '}
              <b className="text-green">
                ${nextTier.bonus.toLocaleString()}
              </b>
            </span>
          </div>
        </div>
      )}

      {/* ============ TIERS ============ */}
      <div className={styles.levelsList}>
        <div className={styles.levelsTitle}>مستويات الإحالة</div>
        <div className={styles.levelsGrid}>
          {tiers.map((tier, idx) => (
            <div
              key={`${tier.key}-${idx}`}
              className={`${styles.levelCard} ${
                tier.unlocked ? styles.unlocked : styles.locked
              } ${tier.isCurrent ? styles.current : ''}`}
              style={tier.unlocked ? { borderColor: tier.color + '55' } : {}}
            >
              <div className={styles.levelHead}>
                <div
                  className={styles.levelIcon}
                  style={
                    tier.unlocked
                      ? { background: tier.color + '22', color: tier.color }
                      : {
                          background: 'var(--bg-card-2)',
                          color: 'var(--text-muted)',
                        }
                  }
                >
                  {tier.unlocked ? (
                    <Crown key="c" size={16} />
                  ) : (
                    <Lock key="l" size={16} />
                  )}
                </div>
                {tier.isCurrent && (
                  <span className={styles.currentBadge}>حالياً</span>
                )}
              </div>
              <div
                className={styles.levelName}
                style={tier.unlocked ? { color: tier.color } : {}}
              >
                {tier.name}
              </div>
              <div className={styles.levelReq}>
                <Gift size={11} />
                {tier.minReferrals} إحالة
              </div>
              <div className={styles.levelComm}>
                مكافأة <b>${tier.bonus.toLocaleString()}</b>
              </div>
              {tier.weeklySalary > 0 && (
                <div className={styles.levelComm}>
                  راتب <b>${tier.weeklySalary.toLocaleString()}</b>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============ REFRESH ============ */}
      <button
        className={styles.refreshBtn}
        onClick={loadStats}
        disabled={loading}
        type="button"
      >
        <RefreshCw
          key={loading ? 'spin' : 'idle'}
          size={12}
          className={loading ? styles.spin : ''}
        />
        تحديث الإحصائيات
      </button>
    </div>
  );
}