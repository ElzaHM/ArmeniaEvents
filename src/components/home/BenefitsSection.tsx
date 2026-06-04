import { Col, Row, Typography, message } from 'antd';
import {
  BellOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { QueryState } from '../../hooks/queries/query-state';
import { useAuth } from '../../hooks/useAuth';
import { useBenefits } from '../../hooks/queries/useEvents';

import styles from './BenefitsSection.module.css';

const benefitIcons = {
  environment: EnvironmentOutlined,
  heart: HeartOutlined,
  bell: BellOutlined,
  share: ShareAltOutlined,
} as const;

const LOCAL_EVENTS_TITLE = 'Local Events';
const SHARE_EASILY_TITLE = 'Share Easily';
const SAVE_FAVORITES_TITLE = 'Save Favorites';
const SMART_NOTIFICATIONS_TITLE = 'Smart Notifications';

export default function BenefitsSection() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { data: benefits, isLoading, isError, error } = useBenefits();
  const [messageApi, contextHolder] = message.useMessage();

  const handleShareEasily = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      messageApi.success('Link copied to clipboard');
    } catch {
      messageApi.error('Unable to copy link');
    }
  };

  const handleSmartNotifications = () => {
    if (authLoading) {
      return;
    }

    navigate(isAuthenticated ? '/notifications' : '/signin');
  };

  const handleSaveFavorites = () => {
    if (authLoading) {
      return;
    }

    navigate(isAuthenticated ? '/favorites' : '/signin');
  };

  const handleLocalEvents = () => {
    navigate('/events');
  };

  return (
    <QueryState isLoading={isLoading} isError={isError} error={error}>
      {contextHolder}
      {benefits && (
        <section className={styles.section}>
          <div className="homeSection">
            <Row gutter={[32, 32]}>
              {benefits.map((benefit) => {
                const Icon = benefitIcons[benefit.icon];
                const isLocalEvents = benefit.title === LOCAL_EVENTS_TITLE;
                const isShareEasily = benefit.title === SHARE_EASILY_TITLE;
                const isSaveFavorites = benefit.title === SAVE_FAVORITES_TITLE;
                const isSmartNotifications = benefit.title === SMART_NOTIFICATIONS_TITLE;
                const isClickable =
                  isLocalEvents || isShareEasily || isSaveFavorites || isSmartNotifications;

                return (
                  <Col key={benefit.id} xs={24} sm={12} lg={6}>
                    <article
                      className={isClickable ? `${styles.item} ${styles.itemClickable}` : styles.item}
                      onClick={
                        isLocalEvents
                          ? handleLocalEvents
                          : isShareEasily
                            ? () => {
                                void handleShareEasily();
                              }
                            : isSaveFavorites
                              ? handleSaveFavorites
                              : isSmartNotifications
                                ? handleSmartNotifications
                                : undefined
                      }
                    >
                      <Icon className={styles.icon} />
                      <Typography.Title level={5} className={styles.title}>
                        {benefit.title}
                      </Typography.Title>
                      <Typography.Paragraph className={styles.description}>
                        {benefit.description}
                      </Typography.Paragraph>
                    </article>
                  </Col>
                );
              })}
            </Row>
          </div>
        </section>
      )}
    </QueryState>
  );
}