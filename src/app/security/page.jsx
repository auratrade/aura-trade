import { Shield } from 'lucide-react';
import SecurityPanel from '@/components/security/SecurityPanel';
import SectionTitle from '@/components/common/SectionTitle';

export default function SecurityPage() {
  return (
    <div className="container" style={{ padding: 20 }}>
      <SectionTitle icon={Shield} title="الأمان والحوكمة" subtitle="إدارة حماية الحساب والمعاملات" />
      <SecurityPanel />
    </div>
  );
}