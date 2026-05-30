import { ADMIN_PROFILE } from './mockData';

import styles from './AdminPageHeader.module.css';

interface AdminPageHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function AdminPageHeader({
  title,
  subtitle = 'Here is what is happening with your events today.',
}: AdminPageHeaderProps) {
  const greeting = title ?? `Welcome back, ${ADMIN_PROFILE.name}! 👋`;

  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.greeting}>{greeting}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
