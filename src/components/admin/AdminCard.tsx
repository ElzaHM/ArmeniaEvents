import type { ReactNode } from 'react';

import styles from './AdminCard.module.css';

interface AdminCardProps {
  title?: string;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function AdminCard({
  title,
  extra,
  children,
  className = '',
}: AdminCardProps) {
  return (
    <section className={`${styles.card} ${className}`}>
      {title && (
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {extra && <div className={styles.extra}>{extra}</div>}
        </div>
      )}
      <div className={title ? styles.body : styles.bodyNoHeader}>{children}</div>
    </section>
  );
}
