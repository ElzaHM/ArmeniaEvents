import { Button, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

import styles from './OrganizeEventCTA.module.css';

export default function OrganizeEventCTA() {
  return (
    <section className={styles.section}>
      <div className={`homeSection ${styles.banner}`}>
        <div className={styles.iconWrap}>
          <CalendarOutlined className={styles.icon} />
        </div>
        <div className={styles.content}>
          <Typography.Title level={4} className={styles.title}>
            Organizing an event?
          </Typography.Title>
          <Typography.Paragraph className={styles.description}>
            Add your event and reach thousands of people across Armenia.
          </Typography.Paragraph>
        </div>
        <Button type="primary" size="large" className={styles.button}>
          Add Your Event
        </Button>
      </div>
    </section>
  );
}
