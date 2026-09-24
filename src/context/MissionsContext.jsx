'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const MissionsContext = createContext(null);

export function MissionsProvider({ children }) {
  const [missions, setMissions] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [depositBalance, setDepositBalance] = useState(0);
  const [percent, setPercent] = useState(2);
  const [loading, setLoading] = useState(true);

  // ============ جلب من API ============
  const loadMissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/missions');
      if (res.ok) {
        const data = await res.json();
        setMissions(data.missions || []);
        setCompletedIds(data.completedIds || []);
        setTotalRewards(data.totalRewards || 0);
        setDepositBalance(data.depositBalance || 0);
        setPercent(data.percent || 2);
      }
    } catch (e) {
      console.error('Load missions error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  // ============ إكمال مهمة ============
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

  // ✅ تحديث فوري
  setCompletedIds((prev) => [...prev, missionId]);
  setTotalRewards((prev) => prev + data.reward);

  return data;
}, []);

  // ============ helpers ============
  const isCompleted = useCallback(
    (id) => completedIds.includes(id),
    [completedIds]
  );

  const rewardPerMission = (depositBalance * percent) / 100;

  const availableMissions = missions.filter((m) => !isCompleted(m.id));

  const allCompleted =
    missions.length > 0 && completedIds.length >= missions.length;

  return (
    <MissionsContext.Provider
      value={{
        missions,
        completedIds,
        totalRewards,
        depositBalance,
        percent,
        rewardPerMission,
        loading,
        completeMission,
        isCompleted,
        availableMissions,
        allCompleted,
        refresh: loadMissions,
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