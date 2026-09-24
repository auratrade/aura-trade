'use client';
import { Users } from 'lucide-react';
import ReferralPanel from '@/components/referrals/ReferralPanel';
import TeamPerformance from '@/components/referrals/TeamPerformance';
import ReferralsList from '@/components/referrals/ReferralsList';
import SectionTitle from '@/components/common/SectionTitle';
import styles from './referrals.module.css';

export default function ReferralsPage() {
  return (
    <div className={`${styles.page} container`}>
      <SectionTitle
        icon={Users}
        title="برنامج الإحالة"
        subtitle="ادعُ أصدقاءك واربح عمولة من كل عملية"
      />

      {/* Panel + Team */}
      <div className={styles.grid}>
        <ReferralPanel />
        <TeamPerformance />
      </div>

      {/* List */}
      <div className={styles.fullWidth}>
        <ReferralsList />
      </div>
    </div>
  );
}