'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Target, RefreshCw, Plus, Pencil, Trash2, Eye, EyeOff,
  CheckCircle2, XCircle
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useConfirm } from '@/context/ConfirmContext';
import MissionModal from '@/components/admin/MissionModal';
import styles from './missions.module.css';

export default function AdminMissionsPage() {
  const toast = useToast();
  const { confirm } = useConfirm();

  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit'

  const loadMissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/missions');
      if (res.ok) {
        const data = await res.json();
        setMissions(data.missions || []);
      }
    } catch (e) {
      console.error(e);
      toast.error('فشل تحميل المهام');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  // ============ حذف ============
  const handleDelete = async (mission) => {
    const ok = await confirm({
      title: 'حذف المهمة',
      message: `هل أنت متأكد من حذف "${mission.title}"؟ سيتم إزالتها فوراً من كل المستخدمين.`,
      confirmText: 'حذف',
      type: 'danger',
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/missions/${mission.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('تم حذف المهمة');
      loadMissions();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ============ تبديل الحالة ============
  const toggleActive = async (mission) => {
    try {
      const res = await fetch(`/api/admin/missions/${mission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !mission.isActive }),
      });
      if (!res.ok) throw new Error('فشل التحديث');
      
      toast.success(
        mission.isActive ? 'تم إخفاء المهمة' : 'تم تفعيل المهمة'
      );
      loadMissions();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>
            <Target size={24} /> إدارة المهام
          </h1>
          <p className={styles.pageSubtitle}>
            {missions.length} مهمة
          </p>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.addBtn}
            onClick={() => {
              setSelected(null);
              setModalMode('create');
            }}
          >
            <Plus size={14} /> مهمة جديدة
          </button>
          <button
            className={styles.refreshBtn}
            onClick={loadMissions}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? styles.spin : ''} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        {loading ? (
          <div className={styles.loading}>
            <RefreshCw size={20} className={styles.spin} />
            جاري التحميل...
          </div>
        ) : missions.length === 0 ? (
          <div className={styles.empty}>
            <Target size={32} />
            <p>لا توجد مهام بعد</p>
            <span>اضغط "مهمة جديدة" للبدء</span>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>الرمز</th>
                <th>العنوان</th>
                <th>السعر</th>
                <th>الصعوبة</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((m) => (
                <tr key={m.id}>
                  <td>
                    <span className={styles.symbol}>{m.symbol}</span>
                  </td>
                  <td>
                    <div className={styles.title}>{m.title}</div>
                    <div className={styles.name}>{m.name}</div>
                  </td>
                  <td>
                    <span className="mono">${m.price.toFixed(2)}</span>
                  </td>
                  <td>
                    <span className={styles.difficulty}>{m.difficulty}</span>
                  </td>
                  <td>
                    <button
                      className={`${styles.statusBtn} ${
                        m.isActive ? styles.active : styles.inactive
                      }`}
                      onClick={() => toggleActive(m)}
                      title={m.isActive ? 'إخفاء' : 'إظهار'}
                    >
                      {m.isActive ? (
                        <><Eye size={12} /> نشطة</>
                      ) : (
                        <><EyeOff size={12} /> مخفية</>
                      )}
                    </button>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => {
                          setSelected(m);
                          setModalMode('edit');
                        }}
                        title="تعديل"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.danger}`}
                        onClick={() => handleDelete(m)}
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

      {/* Modal */}
      {modalMode && (
        <MissionModal
          mission={selected}
          mode={modalMode}
          onClose={() => {
            setSelected(null);
            setModalMode(null);
          }}
          onRefresh={loadMissions}
        />
      )}
    </div>
  );
}