import { Button, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import styles from './OrganizeEventCTA.module.css';


export default function OrganizeEventCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.overlay}></div>

      <div className="homeSection">
        <div className={styles.banner}>
          <div className={styles.leftSide}>
            <div className={styles.iconContainer}>
              <CalendarOutlined className={styles.icon} />
            </div>
            <div className={styles.textContainer}>
              <Typography.Title level={3} className={styles.title}>
                Organizing an event?
              </Typography.Title>
              <Typography.Paragraph className={styles.description}>
                Add your event and reach thousands of people across Armenia.
              </Typography.Paragraph>
            </div>
          </div>

          <Button type="primary" size="large" className={styles.button}>
            Add Your Event
          </Button>

          <div className={styles.dots}></div>
        </div>
      </div>
    </section>
  );
}

