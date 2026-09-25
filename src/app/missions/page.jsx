'use client';

import { Target } from 'lucide-react';

import DailyMissions from '@/components/missions/DailyMissions';
import MissionHistory from '@/components/missions/MissionHistory';

import SectionTitle from '@/components/common/SectionTitle';

export default function MissionsPage() {
  return (
    <div
      className="container"
      style={{ padding: 20 }}
    >
      <SectionTitle
        icon={Target}
        title="المهام اليومية"
        subtitle="أكمل المهام واحصل على مكافآت فورية"
      />

      {/* المهمة الحالية */}
      <DailyMissions />

      {/* سجل المهام */}
      <MissionHistory />
    </div>
  );
}