import { Settings } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';

export default function SettingsPage() {
  return (
    <div className="container" style={{ padding: 20 }}>
      <SectionTitle icon={Settings} title="الإعدادات" subtitle="تخصيص تفضيلات المنصة" />
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: 20,
        color: 'var(--text-secondary)'
      }}>
        <p>إعدادات الحساب والإشعارات وتفضيلات العرض ستظهر هنا.</p>
      </div>
    </div>
  );
}