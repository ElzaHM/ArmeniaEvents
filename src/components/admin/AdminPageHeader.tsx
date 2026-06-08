import {useAuth} from "../../hooks/useAuth";
import {DEFAULT_ADMIN_DISPLAY, getAdminDisplayName} from "./adminDefaults";
import styles from "./AdminPageHeader.module.css";

interface AdminPageHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function AdminPageHeader({
  title,
  subtitle = "Here is what is happening with your events today.",
}: AdminPageHeaderProps) {
  const {session} = useAuth();
  const greetingName = getAdminDisplayName(session?.user.fullName ?? DEFAULT_ADMIN_DISPLAY.name);

  return (
    <div className={styles.pageHeader}>
      <h1 className={`${styles.greeting} ${title ? styles.pageTitle : ""}`}>
        {title ? (
          title
        ) : (
          <>
            Welcome back, <span className={styles.goldText}>{greetingName}!</span> 👋
          </>
        )}
      </h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
