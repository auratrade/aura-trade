'use client';
import { useState, useEffect } from 'react';
import {
  Copy, Check, Users, Share2, Crown, Lock, Gift,
  Link2, DollarSign, RefreshCw, ExternalLink,
  ArrowRightLeft, TrendingUp, Award, UserCheck
} from 'lucide-react';
import {
  getLevelsWithStatus,
  getCurrentLevel,
  getNextLevel,
  getReferralsToNext,
} from '@/lib/levels';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useConfirm } from '@/context/ConfirmContext';
import styles from './ReferralPanel.module.css';

export default function ReferralPanel() {
  const toast = useToast();
  const { confirm } = useConfirm();
  const { user, refreshReferrals } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');
  const [transferring, setTransferring] = useState(false);

  // جلب الإحصائيات
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
      } else {
        toast.error('فشل تحميل الإحصائيات');
      }
    } catch (e) {
      console.error(e);
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text, type) => {
    navigator.clipboard?.writeText(text);
    setCopied(type);
    toast.success(type === 'code' ? 'تم نسخ الكود' : 'تم نسخ الرابط');
    setTimeout(() => setCopied(''), 1500);
  };

  const shareLink = async () => {
    const link = stats?.referralLink;
    if (!link) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AURA TRADE & INVEST',
          text: 'انضم إلى AURA TRADE & INVEST واحصل على مكافآت',
          url: link,
        });
      } catch (e) {
        // cancelled
      }
    } else {
      copyToClipboard(link, 'link');
    }
  };

  // ============ نقل الأرباح ============
  const transferEarnings = async () => {
    if (!stats?.referralEarnings || stats.referralEarnings <= 0) {
      toast.warning('لا توجد أرباح قابلة للنقل');
      return;
    }

    const ok = await confirm({
      title: 'نقل الأرباح',
      message: `سيتم نقل $${stats.referralEarnings.toFixed(2)} من أرباح الإحالات إلى رصيدك المتاح. هل تريد المتابعة؟`,
      confirmText: 'نقل',
      cancelText: 'إلغاء',
      type: 'success',
    });

    if (!ok) return;

    setTransferring(true);
    try {
      const res = await fetch('/api/referral/withdraw', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'فشل النقل');

      toast.success(`تم نقل $${data.transferred.toFixed(2)} إلى محفظتك`);

      // تحديث الإحصائيات والحالة
      await loadStats();
      await refreshReferrals();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setTransferring(false);
    }
  };

  // ============ Loading ============
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

  const referralCount = stats.referralCount || 0;
  const currentLevel = getCurrentLevel(referralCount);
  const nextLevel = getNextLevel(referralCount);
  const toNext = getReferralsToNext(referralCount);
  const levels = getLevelsWithStatus(referralCount);

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
              onClick={() => copyToClipboard(stats.referralCode, 'code')}
              title="نسخ الكود"
            >
              {copied === 'code' ? (
                <Check size={14} className="text-green" />
              ) : (
                <Copy size={14} />
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
          <Crown size={16} style={{ color: currentLevel.color }} />
          <div>
            <div
              className={styles.statValue}
              style={{ color: currentLevel.color }}
            >
              {currentLevel.name}
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

      {/* ============ LINK ============ */}
      <div className={styles.linkSection}>
        <div className={styles.linkHead}>
          <Link2 size={14} />
          <span>رابط الإحالة الفريد</span>
        </div>
        <div className={styles.linkRow}>
          <input
            value={stats.referralLink}
            readOnly
            className={`${styles.input} mono`}
          />
          <button
            className={styles.copyBtn}
            onClick={() => copyToClipboard(stats.referralLink, 'link')}
          >
            {copied === 'link' ? <Check size={14} /> : <Copy size={14} />}
            {copied === 'link' ? 'تم النسخ' : 'نسخ'}
          </button>
          <button className={styles.shareBtn} onClick={shareLink}>
            <Share2 size={14} /> مشاركة
          </button>
        </div>
        <div className={styles.linkHint}>
          <ExternalLink size={11} />
          شارك الرابط مع أصدقائك وسجّل أرباحاً من كل عملية يقومون بها
        </div>
      </div>

      {/* ============ نقل الأرباح ============ */}
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
          disabled={transferring || !stats.referralEarnings}
        >
          {transferring ? (
            <>
              <RefreshCw size={12} className={styles.spin} /> جاري النقل...
            </>
          ) : (
            <>
              <ArrowRightLeft size={12} /> نقل إلى المحفظة
            </>
          )}
        </button>
      </div>

      {/* ============ PROGRESS ============ */}
      {nextLevel && (
        <div className={styles.progressCard}>
          <div className={styles.progressHead}>
            <div className={styles.progressTitle}>
              <Crown size={14} className="text-gold" />
              <span>
                التقدم نحو{' '}
                <b style={{ color: nextLevel.color }}>{nextLevel.name}</b>
              </span>
            </div>
            <span className={styles.progressCount}>
              {referralCount} / {nextLevel.minReferrals}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${Math.min(
                  100,
                  (referralCount / nextLevel.minReferrals) * 100
                )}%`,
                background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})`,
              }}
            />
          </div>
          <div className={styles.progressFoot}>
            <span>
              باقي <b className="text-gold">{toNext}</b> إحالة للترقية
            </span>
            <span>
              عمولة جديدة:{' '}
              <b className="text-green">{nextLevel.commission}%</b>
            </span>
          </div>
        </div>
      )}

      {/* ============ LEVELS ============ */}
      <div className={styles.levelsList}>
        <div className={styles.levelsTitle}>مستويات الحساب</div>
        <div className={styles.levelsGrid}>
          {levels.map((level) => (
            <div
              key={level.key}
              className={`${styles.levelCard} ${
                level.unlocked ? styles.unlocked : styles.locked
              } ${level.isCurrent ? styles.current : ''}`}
              style={level.unlocked ? { borderColor: level.color + '55' } : {}}
            >
              <div className={styles.levelHead}>
                <div
                  className={styles.levelIcon}
                  style={
                    level.unlocked
                      ? { background: level.color + '22', color: level.color }
                      : {
                          background: 'var(--bg-card-2)',
                          color: 'var(--text-muted)',
                        }
                  }
                >
                  {level.unlocked ? <Crown size={16} /> : <Lock size={16} />}
                </div>
                {level.isCurrent && (
                  <span className={styles.currentBadge}>حالياً</span>
                )}
              </div>
              <div
                className={styles.levelName}
                style={level.unlocked ? { color: level.color } : {}}
              >
                {level.name}
              </div>
              <div className={styles.levelReq}>
                <Gift size={11} />
                {level.minReferrals} إحالة
              </div>
              <div className={styles.levelComm}>
                عمولة <b>{level.commission}%</b>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ REFRESH ============ */}
      <button
        className={styles.refreshBtn}
        onClick={loadStats}
        disabled={loading}
      >
        <RefreshCw size={12} className={loading ? styles.spin : ''} />
        تحديث الإحصائيات
      </button>
    </div>
  );
}