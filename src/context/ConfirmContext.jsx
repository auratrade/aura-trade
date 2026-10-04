'use client';
import { createContext, useContext, useState, useRef } from 'react';
import { AlertTriangle, CheckCircle2, X, Info } from 'lucide-react';
import styles from './ConfirmContext.module.css';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);
  const resolverRef = useRef(null);

  const confirm = (options) => {
    return new Promise((resolve) => {
      // قبول string أو object
      const config =
        typeof options === 'string'
          ? { message: options }
          : options || {};

      setDialog({
        title: config.title || 'تأكيد العملية',
        message: config.message || 'هل أنت متأكد؟',
        confirmText: config.confirmText || 'تأكيد',
        cancelText: config.cancelText || 'إلغاء',
        type: config.type || 'warning', // warning | info | success | danger
        icon: config.icon,
      });
      resolverRef.current = resolve;
    });
  };

  const handleConfirm = () => {
    if (resolverRef.current) resolverRef.current(true);
    setDialog(null);
    resolverRef.current = null;
  };

  const handleCancel = () => {
    if (resolverRef.current) resolverRef.current(false);
    setDialog(null);
    resolverRef.current = null;
  };

  const ICONS = {
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle2,
    danger: AlertTriangle,
  };

  const Icon = dialog ? ICONS[dialog.type] || AlertTriangle : AlertTriangle;

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {dialog && (
        <div className={styles.overlay} onClick={handleCancel}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Icon */}
            <div className={`${styles.iconWrap} ${styles[dialog.type]}`}>
              {dialog.icon || <Icon size={32} />}
            </div>

            {/* Content */}
            <h3 className={styles.title}>{dialog.title}</h3>
            <p className={styles.message}>{dialog.message}</p>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                className={styles.cancelBtn}
                onClick={handleCancel}
              >
                {dialog.cancelText}
              </button>
              <button
                className={`${styles.confirmBtn} ${styles['btn_' + dialog.type]}`}
                onClick={handleConfirm}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
};