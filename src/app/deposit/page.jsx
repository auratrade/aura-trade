import { ArrowDownToLine } from 'lucide-react';
import DepositWithdraw from '@/components/wallet/DepositWithdraw';
import SectionTitle from '@/components/common/SectionTitle';

export default function DepositPage() {
  return (
    <div className="container" style={{ padding: 20 }}>
      <SectionTitle icon={ArrowDownToLine} title="الإيداع" subtitle="أودع الأموال عبر الشبكات المدعومة" />
      <DepositWithdraw initialTab="deposit" />
    </div>
  );
}