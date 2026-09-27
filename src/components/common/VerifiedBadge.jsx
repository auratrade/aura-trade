// src/components/common/VerifiedBadge.jsx
import { CheckCircle2 } from 'lucide-react';

export default function VerifiedBadge({ isVerified, size = 16 }) {
  // ⛔ إذا لم يكن الحساب موثقاً (false أو undefined)، لا تعرض أي شيء مطلقاً
  if (isVerified !== true) return null;

  return (
    <span 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#10b981',
        marginRight: '4px',
        marginLeft: '4px'
      }} 
      title="حساب موثق"
    >
      <CheckCircle2 size={size} style={{ color: '#10b981', fill: 'rgba(16, 185, 129, 0.2)' }} />
    </span>
  );
}