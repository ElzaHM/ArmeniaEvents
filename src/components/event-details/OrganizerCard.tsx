import { Button, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import type { EventDetails } from './types';

import styles from './OrganizerCard.module.css';

interface OrganizerCardProps {
  event: EventDetails;
}

const DEFAULT_ORGANIZER_AVATAR =
  'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=200&q=80';

export default function OrganizerCard({ event }: OrganizerCardProps) {
  const organizer = event.organizer ?? {
    name: 'Armenia Events',
    role: 'Event Organizer',
    avatarUrl: DEFAULT_ORGANIZER_AVATAR,
  };

  return (
    <aside className={`${styles.card} detailsGlassCard`}>
      <Typography.Title level={5} className={styles.title}>
        Organizer
      </Typography.Title>

      <div className={styles.profileRow}>
        <div className={styles.profile}>
          <img src={organizer.avatarUrl} alt={organizer.name} className={styles.avatar} />
          <div className={styles.info}>
            <Typography.Text strong className={styles.name}>
              {organizer.name}
            </Typography.Text>
            <Typography.Text className={styles.role}>
              {organizer.role}
            </Typography.Text>
          </div>
        </div>

        <Button className={styles.followBtn}>Follow</Button>
      </div>

      <button type="button" className={styles.contactLink}>
        Contact Organizer
        <ArrowRightOutlined />
      </button>
    </aside>
  );
}
