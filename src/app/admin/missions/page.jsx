'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Target, RefreshCw, Plus, Trash2, Clock,
  CheckCircle2, StopCircle, Play
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
  const [showCreate, setShowCreate] = useState(false);
  const [now, setNow] = useState(Date.now());

  // ⚠️ تحديث كل ثانية لحساب الوقت
  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

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

  // ============ إنهاء مهمة ============
  const handleEnd = async (mission) => {
    const ok = await confirm({
      title: 'إنهاء المهمة',
      message: `هل أنت متأكد من إنهاء "${mission.title}"؟ لن يتمكن المستخدمون من إكمالها بعد الآن.`,
      confirmText: 'إنهاء',
      type: 'warning',
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/missions/${mission.id}`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('تم إنهاء المهمة');
      loadMissions();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ============ حذف مهمة ============
  const handleDelete = async (mission) => {
    const ok = await confirm({
      title: 'حذف المهمة',
      message: `هل أنت متأكد من حذف "${mission.title}"؟ سيتم حذف كل بيانات الإكمال.`,
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

  // ============ حساب الوقت المتبقي ============
  const getTimeLeft = (endsAt) => {
    const diff = new Date(endsAt).getTime() - now;
    if (diff <= 0) return 'انتهت';
    const min = Math.floor(diff / 60000);
    const sec = Math.floor((diff % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const formatTime = (d) =>
    new Date(d).toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('ar-EG', {
      day: 'numeric',
      month: 'short',
    });

  const activeMission = missions.find((m) => m.status === 'active');

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>
            <Target size={24} /> إدارة المهام
          </h1>
          <p className={styles.pageSubtitle}>
            {missions.length} مهمة • {activeMission ? '1 نشطة' : 'لا توجد مهمة نشطة'}
          </p>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.addBtn}
            onClick={() => setShowCreate(true)}
            disabled={!!activeMission}
            title={activeMission ? 'أوقف المهمة الحالية أولاً' : 'إضافة مهمة'}
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

      {/* Active Mission Banner */}
      {activeMission && (
        <div className={styles.activeBanner}>
          <div className={styles.activeBannerLeft}>
            <div className={styles.pulseDot} />
            <div>
              <div className={styles.activeBannerTitle}>
                مهمة نشطة: {activeMission.title}
              </div>
              <div className={styles.activeBannerMeta}>
                بدأت: {formatTime(activeMission.startedAt)} •
                تنتهي: {formatTime(activeMission.endsAt)}
              </div>
            </div>
          </div>
          <div className={styles.activeBannerRight}>
            <div className={styles.timer}>
              <Clock size={14} />
              <span className={`${styles.timerValue} mono`}>
                {getTimeLeft(activeMission.endsAt)}
              </span>
            </div>
            <button
              className={styles.endBtn}
              onClick={() => handleEnd(activeMission)}
            >
              <StopCircle size={14} />
              إنهاء الآن
            </button>
          </div>
        </div>
      )}

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
                <th>المهمة</th>
                <th>وقت البدء</th>
                <th>وقت الانتهاء</th>
                <th>المدة</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {missions.map((m) => {
                const isActive = m.status === 'active';
                const isAutoEnded = m.endedBy === 'auto';

                return (
                  <tr key={m.id} className={isActive ? styles.activeRow : ''}>
                    <td>
                      <div className={styles.titleCell}>
                        {isActive && <span className={styles.liveDot} />}
                        <span className={styles.title}>{m.title}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.timeCell}>
                        <span className={styles.time}>{formatTime(m.startedAt)}</span>
                        <span className={styles.date}>{formatDate(m.startedAt)}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.timeCell}>
                        <span className={styles.time}>{formatTime(m.endsAt)}</span>
                        <span className={styles.date}>{formatDate(m.endsAt)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.duration}>60 دقيقة</span>
                    </td>
                    <td>
                      {isActive ? (
                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                          <Clock size={11} />
                          نشطة • {getTimeLeft(m.endsAt)}
                        </span>
                      ) : isAutoEnded ? (
                        <span className={`${styles.statusBadge} ${styles.statusAuto}`}>
                          <CheckCircle2 size={11} />
                          انتهت تلقائياً
                        </span>
                      ) : (
                        <span className={`${styles.statusBadge} ${styles.statusEnded}`}>
                          <StopCircle size={11} />
                          أنهيت يدوياً
                        </span>
                      )}
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        {isActive && (
                          <button
                            className={`${styles.actionBtn} ${styles.endAction}`}
                            onClick={() => handleEnd(m)}
                            title="إنهاء المهمة"
                          >
                            <StopCircle size={14} />
                          </button>
                        )}
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <MissionModal
          onClose={() => setShowCreate(false)}
          onRefresh={loadMissions}
        />
      )}
    </div>
  );
}