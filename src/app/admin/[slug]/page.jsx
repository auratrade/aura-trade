'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Users, ArrowDownToLine, ArrowUpFromLine, DollarSign,
  TrendingUp, Clock, UserPlus, RefreshCw, Crown,
  Wallet, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import styles from './slug.module.css';

export default function AdminDashboardBySlug() {
  const params = useParams();
  const slug = params.slug;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      } else if (res.status === 401) {
        window.location.href = '/bilsr/alissrow';
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <RefreshCw size={24} className={styles.spin} />
        <span>جاري التحميل...</span>
      </div>
    );
  }

  if (!data) return null;

  const { stats, recentUsers } = data;

  const STATS = [
    { label: 'إجمالي المستخدمين', value: stats.totalUsers, icon: Users, color: '#22d3ee', href: '/admin/users' },
    { label: 'إجمالي الأرصدة', value: `$${stats.totalBalance.toFixed(2)}`, icon: Wallet, color: '#16c784' },
    { label: 'إجمالي الإيداعات', value: stats.totalDeposits, icon: ArrowDownToLine, color: '#f5b041' },
    { label: 'إجمالي السحوبات', value: stats.totalWithdrawals, icon: ArrowUpFromLine, color: '#ea3943' },
    { label: 'إيداعات معلّقة', value: stats.pendingDeposits, icon: Clock, color: '#ff8c42', alert: stats.pendingDeposits > 0, href: '/admin/deposits' },
    { label: 'سحوبات معلّقة', value: stats.pendingWithdrawals, icon: AlertTriangle, color: '#ff8c42', alert: stats.pendingWithdrawals > 0, href: '/admin/withdrawals' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>نظرة عامة</h1>
          <p className={styles.pageSubtitle}>
            🔐 جلسة آمنة • <span className="mono">{slug.slice(0, 12)}...</span>
          </p>
        </div>
        <button className={styles.refreshBtn} onClick={loadStats}>
          <RefreshCw size={14} /> تحديث
        </button>
      </div>

      <div className={styles.statsGrid}>
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          const content = (
            <>
              <div className={styles.statIcon} style={{ background: stat.color + '22', color: stat.color }}>
                <Icon size={20} />
              </div>
              <div className={styles.statInfo}>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statValue}>{stat.value}</div>
              </div>
              {stat.alert && <span className={styles.alertDot} />}
            </>
          );

          return stat.href ? (
            <Link key={i} href={stat.href} className={styles.statCard}>{content}</Link>
          ) : (
            <div key={i} className={styles.statCard}>{content}</div>
          );
        })}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>
            <UserPlus size={16} /> أحدث المستخدمين
          </h2>
          <Link href="/admin/users" className={styles.viewAll}>عرض الكل</Link>
        </div>
        <div className={styles.usersList}>
          {recentUsers.map((user) => (
            <div key={user.id} className={styles.userRow}>
              <div className={styles.userAvatar}>
                {user.username?.slice(0, 2).toUpperCase()}
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user.username}</div>
                <div className={styles.userEmail}>{user.email}</div>
              </div>
              <div className={styles.userLevel}>
                <Crown size={12} /> مستوى {user.accountLevel}
              </div>
              <div className={styles.userDate}>
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}