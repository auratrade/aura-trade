'use client';
import { useState, useEffect } from 'react';
import {
  Gift, Target, Clock, TrendingUp, Award, Sparkles,
  RefreshCw, Wallet, CheckCircle2, Lock, AlertCircle,
  Timer, Play
} from 'lucide-react';
import { useMissions } from '@/context/MissionsContext';
import TaskModal from './TaskModal';
import styles from './DailyMissions.module.css';

export default function DailyMissions() {
  const {
    mission,
    depositBalance,
    completed,
    totalRewards,
    percent,
    rewardPerMission,
    loading,
    canComplete,
    isExpired,
    refresh,
  } = useMissions();

  const [activeMission, setActiveMission] = useState(null);
  const [now, setNow] = useState(Date.now());

  // ⚠️ تحديث المؤقت كل ثانية
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  // ============ تحويل الوقت ============
  const formatTime = (d) =>
    new Date(d).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('ar-EG', {
      day: 'numeric',
      month: 'short',
    });

  // ============ الوقت المتبقي ============
  const getTimeLeft = () => {
    if (!mission) return { hours: 0, minutes: 0, seconds: 0, expired: true };
    const diff = new Date(mission.endsAt).getTime() - now;
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { hours, minutes, seconds, expired: false };
  };

  // ============ Loading ============
  if (loading) {
    return (
      <div className={styles.loading}>
        <RefreshCw size={20} className={styles.spin} />
        <span>جاري تحميل المهمة...</span>
      </div>
    );
  }

  // ============ لا توجد مهمة نشطة ============
  if (!mission) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIconWrap}>
          <Target size={32} />
        </div>
        <p className={styles.emptyTitle}>لا توجد مهمة نشطة</p>
        <span className={styles.emptyText}>
          عُد لاحقاً — يتم إضافة المهام بشكل دوري
        </span>
        <button className={styles.refreshBtn} onClick={refresh}>
          <RefreshCw size={12} />
          تحديث
        </button>
      </div>
    );
  }

  // ============ المهمة منتهية ============
  if (isExpired) {
    return (
      <div className={styles.expired}>
        <div className={styles.expiredIcon}>
          <Timer size={32} />
        </div>
        <p className={styles.expiredTitle}>انتهت المهمة</p>
        <span className={styles.expiredText}>
          انتهى الوقت المخصص لهذه المهمة. عُد لاحقاً لمهام جديدة.
        </span>
        <button className={styles.refreshBtn} onClick={refresh}>
          <RefreshCw size={12} />
          تحديث
        </button>
      </div>
    );
  }

  const timeLeft = getTimeLeft();

  return (
    <>
      {/* ============ Summary Bar ============ */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <div className={`${styles.summaryIcon} ${styles.gold}`}>
            <Gift size={18} />
          </div>
          <div>
            <div className={styles.summaryLabel}>إجمالي المكافآت</div>
            <div className={`${styles.summaryValue} mono text-green`}>
              +${totalRewards.toFixed(2)}
            </div>
          </div>
        </div>

        <div className={styles.summaryItem}>
          <div className={`${styles.summaryIcon} ${styles.cyan}`}>
            <Sparkles size={18} />
          </div>
          <div>
            <div className={styles.summaryLabel}>مكافأة المهمة</div>
            <div className={`${styles.summaryValue} mono text-gold`}>
              ${rewardPerMission.toFixed(2)}
            </div>
          </div>
        </div>

        <div className={styles.summaryItem}>
          <div className={styles.summaryIcon}>
            <Wallet size={18} />
          </div>
          <div>
            <div className={styles.summaryLabel}>رصيد الإيداع ({percent}%)</div>
            <div className={`${styles.summaryValue} mono`}>
              ${depositBalance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* ============ Warning: No Deposit ============ */}
      {depositBalance <= 0 && (
        <div className={styles.warningBox}>
          <Lock size={14} />
          <span>
            يجب أن <b>تُودع</b> مبلغاً أولاً لتتمكن من كسب مكافآت المهام.
          </span>
        </div>
      )}

      {/* ============ Mission Card ============ */}
      <div className={`${styles.missionCard} ${completed ? styles.missionCompleted : ''}`}>
        {/* Live indicator */}
        <div className={styles.liveBadge}>
          <span className={styles.liveDot} />
          <span>مباشر</span>
        </div>

        {/* Header */}
        <div className={styles.missionHead}>
          <div className={styles.missionIconWrap}>
            {completed ? (
              <CheckCircle2 size={24} />
            ) : (
              <TrendingUp size={24} />
            )}
          </div>
          <div className={styles.missionInfo}>
            <div className={styles.missionTitle}>
              {mission.title}
            </div>
            <div className={styles.missionMeta}>
              <span className={styles.rewardTag}>
                <Gift size={11} />
                +${rewardPerMission.toFixed(2)} USDT
              </span>
            </div>
          </div>
        </div>

        {/* Time Info */}
        <div className={styles.timeGrid}>
          <div className={styles.timeBlock}>
            <div className={styles.timeIcon}>
              <Play size={12} />
            </div>
            <div>
              <div className={styles.timeLabel}>بدأت</div>
              <div className={styles.timeValue}>
                {formatTime(mission.startedAt)}
              </div>
              <div className={styles.timeDate}>
                {formatDate(mission.startedAt)}
              </div>
            </div>
          </div>

          <div className={styles.timeArrow}>←</div>

          <div className={styles.timeBlock}>
            <div className={styles.timeIcon} style={{ color: 'var(--red)' }}>
              <Timer size={12} />
            </div>
            <div>
              <div className={styles.timeLabel}>تنتهي</div>
              <div className={styles.timeValue}>
                {formatTime(mission.endsAt)}
              </div>
              <div className={styles.timeDate}>
                {formatDate(mission.endsAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className={styles.countdown}>
          <div className={styles.countdownLabel}>
            <Clock size={12} />
            الوقت المتبقي
          </div>
          <div className={styles.countdownTimer}>
            <div className={styles.timeUnit}>
              <span className={`${styles.timeNum} mono`}>
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className={styles.timeLbl}>ساعة</span>
            </div>
            <span className={styles.timeSep}>:</span>
            <div className={styles.timeUnit}>
              <span className={`${styles.timeNum} mono`}>
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className={styles.timeLbl}>دقيقة</span>
            </div>
            <span className={styles.timeSep}>:</span>
            <div className={styles.timeUnit}>
              <span className={`${styles.timeNum} mono`}>
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className={styles.timeLbl}>ثانية</span>
            </div>
          </div>
        </div>

        {/* Progress Bar (based on time) */}
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${Math.max(
                0,
                Math.min(
                  100,
                  ((now - new Date(mission.startedAt).getTime()) /
                    (new Date(mission.endsAt).getTime() -
                      new Date(mission.startedAt).getTime())) *
                    100
                )
              )}%`,
            }}
          />
        </div>

        {/* Action */}
        <div className={styles.missionAction}>
          {completed ? (
            <div className={styles.completedBox}>
              <CheckCircle2 size={18} />
              <span>أكملت هذه المهمة بنجاح</span>
            </div>
          ) : !canComplete ? (
            <div className={styles.lockedBox}>
              <Lock size={14} />
              <span>يجب إيداع مبلغ أولاً</span>
            </div>
          ) : (
            <button
              className={styles.startBtn}
              onClick={() => setActiveMission(mission)}
            >
              <TrendingUp size={16} />
              استطلاع المهمة
              <Award size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ============ Modal ============ */}
      {activeMission && (
        <TaskModal
          mission={activeMission}
          onClose={() => {
            setActiveMission(null);
            refresh();
          }}
        />
      )}
    </>
  );
}