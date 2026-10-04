'use client';
import { Shield, Key, Lock, Fingerprint, ChevronLeft } from 'lucide-react';
import { securityStatus } from '@/data/mockData';
import styles from './SecurityPanel.module.css';

const ICONS = { '2fa': Key, pin: Lock, session: Fingerprint };

export default function SecurityPanel() {
  return (
    <div className={styles.grid}>
      {securityStatus.map((s) => {
        const Icon = ICONS[s.key] || Shield;
        return (
          <div key={s.key} className={styles.card}>
            <div className={styles.head}>
              <div className={styles.iconWrap}><Icon size={18} /></div>
              <div className={`${styles.status} ${s.enabled ? styles.on : ''}`}>
                {s.enabled ? 'مُفعّل' : 'معطّل'}
              </div>
            </div>
            <div className={styles.title}>{s.title}</div>
            <div className={styles.desc}>{s.desc}</div>
            <button className={styles.action}>
              {s.action} <ChevronLeft size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}