import { Button, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import type { EventDetails } from './types';

import styles from './OrganizerCard.module.css';

interface OrganizerCardProps {
  event: EventDetails;
}

export default function OrganizerCard({ event }: OrganizerCardProps) {
  const { organizer } = event;

  return (
    <aside className={styles.card}>
      <div className={styles.profile}>
        <img src={organizer.avatarUrl} alt={organizer.name} className={styles.avatar} />
        <div className={styles.info}>
          <Typography.Text strong className={styles.name}>
            {organizer.name}
          </Typography.Text>
          <Typography.Text type="secondary" className={styles.role}>
            {organizer.role}
          </Typography.Text>
        </div>
      </div>

      <Button block className={styles.followBtn}>
        Follow
      </Button>

      <button type="button" className={styles.contactLink}>
        Contact Organizer
        <ArrowRightOutlined />
      </button>
    </aside>
  );
}
