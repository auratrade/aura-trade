'use client';
import { useState } from 'react';
import {
  CheckCircle2, Gift, LineChart, Shield, Wallet,
  Clock, TrendingUp, Award, Sparkles, RefreshCw, Lock
} from 'lucide-react';
import { useMissions } from '@/context/MissionsContext';
import TaskModal from './TaskModal';
import styles from './DailyMissions.module.css';

const ICONS = { chart: LineChart, shield: Shield, wallet: Wallet };

export default function DailyMissions() {
  const {
    missions,
    completedIds,
    totalRewards,
    rewardPerMission,
    depositBalance,
    percent,
    isCompleted,
    allCompleted,
    loading,
    refresh,
  } = useMissions();

  const [activeMission, setActiveMission] = useState(null);

  const completedCount = completedIds.length;
  const totalCount = missions.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // ============ Loading ============
  if (loading) {
    return (
      <div className={styles.loading}>
        <RefreshCw size={20} className={styles.spin} />
        <span>جاري تحميل المهام...</span>
      </div>
    );
  }

  // ============ Empty ============
  if (missions.length === 0) {
    return (
      <div className={styles.empty}>
        <Award size={32} />
        <p>لا توجد مهام حالياً</p>
        <span>عُد لاحقاً لمهام جديدة</span>
      </div>
    );
  }

  return (
    <>
      {/* Summary bar */}
      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <div className={styles.summaryIcon}>
            <Award size={18} />
          </div>
          <div>
            <div className={styles.summaryLabel}>المهام المكتملة</div>
            <div className={`${styles.summaryValue} mono`}>
              {completedCount} / {totalCount}
            </div>
          </div>
        </div>

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
            <div className={styles.summaryLabel}>مكافأة كل مهمة</div>
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
            <div className={styles.summaryLabel}>
              رصيد الإيداع ({percent}%)
            </div>
            <div className={`${styles.summaryValue} mono`}>
              ${depositBalance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Warning if no deposit */}
      {depositBalance <= 0 && (
        <div className={styles.warningBox}>
          <Lock size={14} />
          <span>
            ⚠️ يجب أن تُودع مبلغاً أولاً قبل إكمال المهام
          </span>
        </div>
      )}

      {/* Progress */}
      <div className={styles.progress}>
        <div className={styles.progressHead}>
          <span>تقدمك اليومي</span>
          <b className="mono">{progressPct.toFixed(0)}%</b>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Missions list */}
      <div className={styles.list}>
        {missions.map((m) => {
          const Icon = ICONS[m.icon] || Gift;
          const done = isCompleted(m.id);
          const canStart = !done && depositBalance > 0;

          return (
            <div
              key={m.id}
              className={`${styles.item} ${done ? styles.done : ''}`}
            >
              <div className={`${styles.iconWrap} ${done ? styles.iconDone : ''}`}>
                {done ? <CheckCircle2 size={18} /> : <Icon size={18} />}
              </div>

              <div className={styles.content}>
                <div className={styles.titleRow}>
                  <span className={styles.title}>{m.title}</span>
                  <span className={styles.symbol}>{m.symbol}</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.reward}>
                    <Gift size={11} /> +${rewardPerMission.toFixed(2)}
                  </span>
                  <span className={styles.metaDot}>•</span>
                  <span className={styles.meta}>
                    <Clock size={11} /> {m.timeEstimate}
                  </span>
                  <span className={styles.metaDot}>•</span>
                  <span className={styles.meta}>{m.difficulty}</span>
                </div>
              </div>

              <div className={styles.action}>
                {done ? (
                  <span className={styles.statusDone}>
                    <CheckCircle2 size={12} /> مكتملة
                  </span>
                ) : !canStart ? (
                  <span className={styles.statusLocked}>
                    <Lock size={12} /> يحتاج إيداع
                  </span>
                ) : (
                  <button
                    className={styles.startBtn}
                    onClick={() => setActiveMission(m)}
                  >
                    <TrendingUp size={14} />
                    استطلاع المهمة
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* All completed */}
      {allCompleted && missions.length > 0 && (
        <div className={styles.allDone}>
          <Award size={20} />
          <div>
            <b>🎉 أكملت جميع المهام اليوم!</b>
            <span>عُد غداً لمهام جديدة ومكافآت إضافية</span>
          </div>
        </div>
      )}

      {/* Modal */}
      {activeMission && (
        <TaskModal
          mission={activeMission}
          onClose={() => {
            setActiveMission(null);
            refresh(); // ✅ تحديث بعد الإغلاق
          }}
        />
      )}
    </>
  );
}