import styles from './SectionTitle.module.css';

export default function SectionTitle({ icon: Icon, title, subtitle, action }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        {Icon && <span className={styles.icon}><Icon size={16} /></span>}
        <div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.sub}>{subtitle}</p>}
        </div>
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}