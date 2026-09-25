'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

const MissionsContext = createContext(null);

export function MissionsProvider({ children }) {
  const [mission, setMission] = useState(null);
  const [depositBalance, setDepositBalance] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [totalRewards, setTotalRewards] = useState(0);
  const [percent, setPercent] = useState(2);
  const [loading, setLoading] = useState(true);

  // سجل المهام
  const [missionHistory, setMissionHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // ==========================================
  // جلب المهمة الحالية
  // ==========================================

  const loadMission = useCallback(async () => {
    try {
      const res = await fetch('/api/user/missions');

      if (res.ok) {
        const data = await res.json();

        setMission(data.mission || null);
        setDepositBalance(data.depositBalance || 0);
        setCompleted(data.completed || false);
        setTotalRewards(data.totalRewards || 0);
        setPercent(data.percent || 2);
      }
    } catch (error) {
      console.error('Load mission error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // جلب سجل المهام
  // ==========================================

  const loadMissionHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);

      const res = await fetch('/api/user/missions/history');

      if (!res.ok) {
        return;
      }

      const data = await res.json();

      setMissionHistory(data.history || []);
    } catch (error) {
      console.error('Load mission history error:', error);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // ==========================================
  // التحميل الأولي
  // ==========================================

  useEffect(() => {
    loadMission();
    loadMissionHistory();
  }, [loadMission, loadMissionHistory]);

  // ==========================================
  // تحديث دوري
  // ==========================================

  useEffect(() => {
    const iv = setInterval(() => {
      loadMission();
      loadMissionHistory();
    }, 30000);

    return () => clearInterval(iv);
  }, [loadMission, loadMissionHistory]);

  // ==========================================
  // إكمال المهمة
  // ==========================================

  const completeMission = useCallback(
    async (missionId) => {
      const res = await fetch('/api/user/missions/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          missionId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'فشل إكمال المهمة'
        );
      }

      // تحديث الحالة الحالية
      setCompleted(true);

      setTotalRewards(
        (prev) => prev + data.reward
      );

      // تحديث سجل المهام مباشرة
      await loadMissionHistory();

      return data;
    },
    [loadMissionHistory]
  );

  // ==========================================
  // المكافأة
  // ==========================================

  const rewardPerMission =
    (depositBalance * percent) / 100;

  // ==========================================
  // هل يمكن إكمال المهمة؟
  // ==========================================

  const canComplete =
    mission &&
    !completed &&
    depositBalance > 0;

  // ==========================================
  // هل انتهت المهمة؟
  // ==========================================

  const isExpired = mission
    ? new Date() > new Date(mission.endsAt)
    : false;

  return (
    <MissionsContext.Provider
      value={{
        // المهمة الحالية
        mission,
        depositBalance,
        completed,
        totalRewards,
        percent,
        rewardPerMission,
        loading,
        canComplete,
        isExpired,

        // سجل المهام
        missionHistory,
        historyLoading,

        // Functions
        completeMission,
        refresh: loadMission,
        refreshHistory: loadMissionHistory,
      }}
    >
      {children}
    </MissionsContext.Provider>
  );
}

export const useMissions = () => {
  const ctx = useContext(MissionsContext);

  if (!ctx) {
    throw new Error(
      'useMissions must be used within MissionsProvider'
    );
  }

  return ctx;
};