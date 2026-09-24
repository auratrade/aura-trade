'use client';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useAdmin } from '@/context/AdminContext';
import styles from './layout.module.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { admin } = useAdmin();

  // صفحة تسجيل دخول الأدمن — بدون Sidebar
if (pathname === '/bilsr/alissrow') {
  return <>{children}</>;
}

  return (
    <div className={styles.wrap} dir="rtl">
      <AdminSidebar />
      <div className={styles.main}>
        <AdminHeader />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}