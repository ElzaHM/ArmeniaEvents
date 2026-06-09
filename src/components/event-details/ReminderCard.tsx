import { Button, Typography } from 'antd';
import { BellOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { useFavoriteStatus, useToggleFavorite } from '../../hooks/queries/useFavorite';
import { useAuth } from '../../hooks/useAuth';

import styles from './ReminderCard.module.css';

interface ReminderCardProps {
  eventId: string;
}

export default function ReminderCard({ eventId }: ReminderCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: favoriteStatus } = useFavoriteStatus(eventId);
  const toggleFavorite = useToggleFavorite(eventId);
  const isSaved = favoriteStatus?.favorited ?? false;

  const handleSave = () => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    toggleFavorite.mutate();
  };

  return (
    <aside className={`${styles.card} detailsGlassCard`}>
      <div className={styles.iconWrap}>
        <BellOutlined className={styles.icon} />
      </div>
      <Typography.Title level={5} className={styles.title}>
        Don&apos;t Miss Out!
      </Typography.Title>
      <Typography.Paragraph className={styles.description}>
        Save this event to get reminders before it starts.
      </Typography.Paragraph>
      <Button
        type="primary"
        block
        size="large"
        icon={isSaved ? <HeartFilled /> : <HeartOutlined />}
        className={styles.saveBtn}
        onClick={handleSave}
        loading={toggleFavorite.isPending}
      >
        Save Event
      </Button>
    </aside>
  );
}
