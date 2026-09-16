import { Users } from 'lucide-react';
import ReferralPanel from '@/components/referrals/ReferralPanel';
import TeamPerformance from '@/components/referrals/TeamPerformance';
import SectionTitle from '@/components/common/SectionTitle';
import styles from './referrals.module.css';

export default function ReferralsPage() {
  return (
    <div className="container" style={{ padding: 20 }}>
      <SectionTitle icon={Users} title="برنامج الإحالة" subtitle="ادعُ أصدقاءك واربح عمولة من كل صفقة" />
      <div className={styles.grid}>
        <ReferralPanel />
        <TeamPerformance />
      </div>
    </div>
  );
}