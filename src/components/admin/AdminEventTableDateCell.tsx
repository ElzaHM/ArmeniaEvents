import { parseEventDate } from '../events/eventDateUtils';
import { formatAdminEventDate } from './mapApiEventToAdminEvent';

import styles from './AdminEventTableDateCell.module.css';

type AdminEventTableDateCellProps = {
  value?: string | null;
};

export default function AdminEventTableDateCell({ value }: AdminEventTableDateCellProps) {
  const date = parseEventDate(value);
  const dateLine = formatAdminEventDate(value);

  if (!date || !dateLine) {
    return null;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return (
    <div className={styles.cell}>
      <span className={styles.dateLine}>{dateLine}</span>
      <span className={styles.timeLine}>
        {hours}:{minutes}
      </span>
    </div>
  );
}
