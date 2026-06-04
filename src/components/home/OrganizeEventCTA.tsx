import { Button, Typography } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import styles from './OrganizeEventCTA.module.css';

export default function OrganizeEventCTA() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const handleAddYourEvent = () => {
    if (loading) {
      return;
    }

    navigate(isAuthenticated ? '/events/new' : '/signin');
  };

  return (
    <section className={styles.section}>
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

          <Button
            type="primary"
            size="large"
            className={`homeActionBtn ${styles.button}`}
            onClick={handleAddYourEvent}
            disabled={loading}
          >
            Add Your Event
          </Button>

          <div className={styles.dots}></div>
        </div>
      </div>
    </section>
  );
}

