import { useState } from 'react';
import { Button, Typography } from 'antd';
import { BellOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';

import styles from './ReminderCard.module.css';

export default function ReminderCard() {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <aside className={styles.card}>
      <BellOutlined className={styles.icon} />
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
        onClick={() => setIsSaved((current) => !current)}
      >
        Save Event
      </Button>
    </aside>
  );
}
