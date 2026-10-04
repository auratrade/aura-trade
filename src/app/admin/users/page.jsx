'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Users, Search, Filter, RefreshCw, Eye, Pencil, Trash2,
  ChevronLeft, ChevronRight, Crown, DollarSign, UserPlus,
  CheckCircle2, XCircle, Wallet, TrendingUp
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useConfirm } from '@/context/ConfirmContext';
import UserModal from '@/components/admin/UserModal';
import styles from './users.module.css';

const LEVELS = [
  { value: '', label: 'جميع المستويات' },
  { value: '0', label: 'مبتدئ' },
  { value: '1', label: 'مستوى 1' },
  { value: '2', label: 'مستوى 2' },
  { value: '3', label: 'مستوى 3' },
];

export default function AdminUsersPage() {
  const toast = useToast();
  const { confirm } = useConfirm();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view' | 'edit'

  // ============ جلب المستخدمين ============
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sort: 'createdAt',
        order: 'desc',
      });
      if (search) params.append('search', search);
      if (level) params.append('level', level);

      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setPagination(data.pagination);
      } else {
        toast.error('فشل تحميل المستخدمين');
      }
    } catch (e) {
      console.error(e);
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  }, [page, search, level, toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ============ البحث ============
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  // ============ الحذف ============
  const handleDelete = async (user) => {
    const ok = await confirm({
      title: 'حذف المستخدم',
      message: `هل أنت متأكد من حذف "${user.username}"؟ سيتم حذف جميع بياناته (المعاملات، الأرباح، إلخ). لا يمكن التراجع.`,
      confirmText: 'حذف نهائي',
      cancelText: 'إلغاء',
      type: 'danger',
    });

    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'فشل الحذف');

      toast.success('تم حذف المستخدم');
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ============ ألوان المستوى ============
  const getLevelColor = (l) => {
    const colors = {
      0: '#7d8aab',
      1: '#cd7f32',
      2: '#c0c0c0',
      3: '#f5b041',
    };
    return colors[l] || colors[0];
  };

  const getLevelName = (l) => {
    const names = { 0: 'مبتدئ', 1: 'مستوى 1', 2: 'مستوى 2', 3: 'مستوى 3' };
    return names[l] || 'مبتدئ';
  };

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>
            <Users size={24} /> إدارة المستخدمين
          </h1>
          <p className={styles.pageSubtitle}>
            {pagination?.total || 0} مستخدم في المنصة
          </p>
        </div>
        <button className={styles.refreshBtn} onClick={loadUsers} disabled={loading}>
          <RefreshCw size={14} className={loading ? styles.spin : ''} /> تحديث
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <form onSubmit={handleSearch} className={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="ابحث بالبريد، اسم المستخدم، أو الاسم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">بحث</button>
        </form>

        <select
          value={level}
          onChange={(e) => {
            setLevel(e.target.value);
            setPage(1);
          }}
          className={styles.levelFilter}
        >
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.loading}>
            <RefreshCw size={20} className={styles.spin} />
            <span>جاري التحميل...</span>
          </div>
        ) : users.length === 0 ? (
          <div className={styles.empty}>
            <UserPlus size={32} />
            <p>لا يوجد مستخدمون مطابقون</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>المستخدم</th>
                <th>البريد</th>
                <th>المستوى</th>
                <th>الرصيد</th>
                <th>الإيداع</th>
                <th>الحالة</th>
                <th>التسجيل</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>
                        {(user.username || '?').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className={styles.userName}>
                          {user.fullName || user.username}
                        </div>
                        <div className={styles.userHandle}>@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.email}>{user.email}</span>
                  </td>
                  <td>
                    <span
                      className={styles.levelBadge}
                      style={{
                        background: getLevelColor(user.accountLevel) + '22',
                        color: getLevelColor(user.accountLevel),
                      }}
                    >
                      <Crown size={10} />
                      {getLevelName(user.accountLevel)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.moneyCell}>
                      <DollarSign size={12} className="text-green" />
                      <span className="mono">
                        {user.availableBalance.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`mono ${styles.deposit}`}>
                      ${user.totalDeposited.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    {user.isVerified ? (
                      <span className={styles.verified}>
                        <CheckCircle2 size={11} /> موثق
                      </span>
                    ) : (
                      <span className={styles.unverified}>
                        <XCircle size={11} /> غير موثق
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={styles.date}>{formatDate(user.createdAt)}</span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => {
                          setSelectedUser(user);
                          setModalMode('view');
                        }}
                        title="عرض"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => {
                          setSelectedUser(user);
                          setModalMode('edit');
                        }}
                        title="تعديل"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.danger}`}
                        onClick={() => handleDelete(user)}
                        title="حذف"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronRight size={14} /> السابق
          </button>
          <span className={styles.pageInfo}>
            صفحة {page} من {pagination.totalPages}
          </span>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
          >
            التالي <ChevronLeft size={14} />
          </button>
        </div>
      )}

      {/* User Modal */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          mode={modalMode}
          onClose={() => {
            setSelectedUser(null);
            setModalMode(null);
          }}
          onRefresh={loadUsers}
        />
      )}
    </div>
  );
}