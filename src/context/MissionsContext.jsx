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

  // ============ جلب المهمة الحالية ============
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
    } catch (e) {
      console.error('Load mission error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============ تحميل أولي ============
  useEffect(() => {
    loadMission();
  }, [loadMission]);

  // ============ تحديث دوري كل 30 ثانية ============
  useEffect(() => {
    const iv = setInterval(loadMission, 30000);
    return () => clearInterval(iv);
  }, [loadMission]);

  // ============ إكمال المهمة ============
  const completeMission = useCallback(async (missionId) => {
    const res = await fetch('/api/user/missions/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missionId }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'فشل إكمال المهمة');
    }

    // ✅ تحديث الحالة
    setCompleted(true);
    setTotalRewards((prev) => prev + data.reward);

    return data;
  }, []);

  // ============ المكافأة لكل مهمة ============
  const rewardPerMission = (depositBalance * percent) / 100;

  // ============ هل يمكن إكمال المهمة؟ ============
  const canComplete = mission && !completed && depositBalance > 0;

  // ============ هل انتهت المهمة؟ ============
  const isExpired = mission ? new Date() > new Date(mission.endsAt) : false;

  return (
    <MissionsContext.Provider
      value={{
        mission,
        depositBalance,
        completed,
        totalRewards,
        percent,
        rewardPerMission,
        loading,
        canComplete,
        isExpired,
        completeMission,
        refresh: loadMission,
      }}
    >
      {children}
    </MissionsContext.Provider>
  );
}

export const useMissions = () => {
  const ctx = useContext(MissionsContext);
  if (!ctx) throw new Error('useMissions must be used within MissionsProvider');
  return ctx;
};