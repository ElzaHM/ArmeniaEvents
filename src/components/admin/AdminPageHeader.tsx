import {ADMIN_PROFILE} from "./mockData";
import styles from "./AdminPageHeader.module.css";

interface AdminPageHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function AdminPageHeader({
  title,
  subtitle = "Here is what is happening with your events today.",
}: AdminPageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.greeting}>
        {title ? (
          title
        ) : (
          <>
            Welcome back, <span className={styles.goldText}>{ADMIN_PROFILE.name}!</span> 👋
          </>
        )}
      </h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
