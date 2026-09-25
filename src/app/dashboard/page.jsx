import {
  LineChart
} from 'lucide-react';
import UserSummary from '@/components/dashboard/UserSummary';
import MarketTicker from '@/components/dashboard/MarketTicker';
import TradingChart from '@/components/dashboard/TradingChart';
import OrderBook from '@/components/dashboard/OrderBook';
import MarketCards from '@/components/dashboard/MarketCards';
import SectionTitle from '@/components/common/SectionTitle';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  return (
    <div className={`${styles.page} container`}>
      {/* بطاقة المستخدم */}
      <UserSummary />

      {/* شريط الأسعار */}
      <MarketTicker />

      {/* منطقة التداول */}
      <SectionTitle
        icon={LineChart}
        title="منطقة التداول"
        subtitle="BTC/USDT • رسم بياني مباشر"
      />

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
    </div>
  );
}