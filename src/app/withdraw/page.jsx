import { ArrowUpFromLine } from 'lucide-react';
import DepositWithdraw from '@/components/wallet/DepositWithdraw';
import SectionTitle from '@/components/common/SectionTitle';

export default function WithdrawPage() {
  return (
    <div className="container" style={{ padding: 20 }}>
      <SectionTitle icon={ArrowUpFromLine} title="السحب" subtitle="اسحب أرباحك في أي وقت" />
      <DepositWithdraw initialTab="withdraw" />
    </div>
  );
}