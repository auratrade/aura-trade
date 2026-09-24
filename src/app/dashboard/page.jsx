import {
  LineChart, Target, Wallet, Users, Shield
} from 'lucide-react';
import UserSummary from '@/components/dashboard/UserSummary';
import MarketTicker from '@/components/dashboard/MarketTicker';
import TradingChart from '@/components/dashboard/TradingChart';
import OrderBook from '@/components/dashboard/OrderBook';
import MarketCards from '@/components/dashboard/MarketCards';
import DailyMissions from '@/components/missions/DailyMissions';
import DepositWithdraw from '@/components/wallet/DepositWithdraw';
import TransactionsHistory from '@/components/wallet/TransactionsHistory';
import ReferralPanel from '@/components/referrals/ReferralPanel';
import TeamPerformance from '@/components/referrals/TeamPerformance';
import SecurityPanel from '@/components/security/SecurityPanel';
import SectionTitle from '@/components/common/SectionTitle';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  return (
    <div className={`${styles.page} container`}>
      <UserSummary />
      <MarketTicker />

      <SectionTitle icon={LineChart} title="منطقة التداول" subtitle="BTC/USDT • رسم بياني مباشر" />
      <div className={styles.tradingGrid}>
        <div className={styles.chartCol}>
          <TradingChart />
          <div className={styles.chartUnder}>
            <MarketCards />
          </div>
        </div>
        <div className={styles.orderCol}>
          <OrderBook />
        </div>
      </div>

      <SectionTitle icon={Target} title="المهام اليومية" subtitle="أكمل المهام واحصل على مكافآت" />
      <DailyMissions />

      <SectionTitle icon={Wallet} title="المحفظة — إيداع وسحب" subtitle="USDT • TRC20 / ERC20 / BEP20" />
      <DepositWithdraw />

      <SectionTitle icon={Wallet} title="سجل العمليات" subtitle="كل الإيداعات والسحوبات الخاصة بك" />
      <TransactionsHistory />

      {/* ⚠️ تأكد: ReferralPanel مرة واحدة فقط */}
      <SectionTitle icon={Users} title="برنامج الإحالة" subtitle="ادعُ أصدقاءك واربح عمولات" />
      <div className={styles.referralGrid}>
        <ReferralPanel />
        <TeamPerformance />
      </div>

      <SectionTitle icon={Shield} title="الأمان والحوكمة" subtitle="حماية متقدمة لحسابك وأموالك" />
      <SecurityPanel />
    </div>
  );
}