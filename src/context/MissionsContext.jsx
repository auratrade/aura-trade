'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { missions as initialMissions, depositBalance, MISSION_REWARD_PERCENT } from '@/data/mockData';

const MissionsContext = createContext(null);

export function MissionsProvider({ children }) {
  const [completedIds, setCompletedIds] = useState([]);
  const [totalRewards, setTotalRewards] = useState(0);

  // استرجاع المهام المكتملة من localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('aura-missions');
      if (saved) {
        const parsed = JSON.parse(saved);
        setCompletedIds(parsed.completedIds || []);
        setTotalRewards(parsed.totalRewards || 0);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // حفظ عند التغيير
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(
      'aura-missions',
      JSON.stringify({ completedIds, totalRewards })
    );
  }, [completedIds, totalRewards]);

  const rewardPerMission = (depositBalance * MISSION_REWARD_PERCENT) / 100;

  const completeMission = (id) => {
    if (completedIds.includes(id)) return false;
    setCompletedIds((prev) => [...prev, id]);
    setTotalRewards((prev) => prev + rewardPerMission);
    return true;
  };

  const resetMissions = () => {
    setCompletedIds([]);
    setTotalRewards(0);
  };

  const value = {
    missions: initialMissions,
    completedIds,
    totalRewards,
    rewardPerMission,
    depositBalance,
    percent: MISSION_REWARD_PERCENT,
    completeMission,
    resetMissions,
    isCompleted: (id) => completedIds.includes(id),
    availableMissions: initialMissions.filter((m) => !completedIds.includes(m.id)),
    allCompleted: completedIds.length === initialMissions.length,
  };

  return (
    <MissionsContext.Provider value={value}>
      {children}
    </MissionsContext.Provider>
  );
}

export const useMissions = () => {
  const ctx = useContext(MissionsContext);
  if (!ctx) throw new Error('useMissions must be used within MissionsProvider');
  return ctx;
};