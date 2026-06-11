import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Typography, message } from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  EnvironmentOutlined,
  LeftOutlined,
  TagOutlined,
} from '@ant-design/icons';

import FooterContent from '../../components/home/FooterContent';
import { formatFullDate } from '../../components/events/eventDateUtils';
import '../../components/home/home.css';
import { QueryState } from '../../hooks/queries/query-state';
import { useEvent } from '../../hooks/queries/useEvent';
import { useReserveTicket } from '../../hooks/queries/useTickets';
import { useAuth } from '../../hooks/useAuth';

import styles from './EventCheckoutPage.module.css';

const { Title, Paragraph, Text } = Typography;

export default function EventCheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { data: event, isLoading, isError, error } = useEvent(id);
  const reserveTicket = useReserveTicket();

  const checkoutPath = id ? `/events/${id}/checkout` : location.pathname;

  const handleBuyTicket = () => {
    if (!id) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/signin', {
        state: {
          from: checkoutPath,
        },
      });
      return;
    }

    reserveTicket.mutate({ eventId: id });
  };

  const handleCopyTicketCode = async (ticketCode: string) => {
    try {
      await navigator.clipboard.writeText(ticketCode);
      message.success('Ticket code copied');
    } catch {
      message.error('Unable to copy ticket code');
    }
  };

  const venueName = event?.venue?.name || event?.location;
  const reservation = reserveTicket.data;

  return (
    <div className={`${styles.pageWrapper} event-checkout-page`}>
      <div className="mainContent">
        <QueryState isLoading={isLoading} isError={isError} error={error} minHeight={240}>
          {event && (
            <>
              <Link to={`/events/${event.id}`} className={styles.backLink}>
                <LeftOutlined />
                Back to Event
              </Link>

              <Paragraph className={styles.heroSubtitle}>
                Review your event details and complete your ticket reservation.
              </Paragraph>

              <div className={styles.cardsStack}>
                <div className={styles.glassCard}>
                  <div className={styles.eventSummary}>
                    <div className={styles.eventImageWrap}>
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className={styles.eventImage}
                      />
                    </div>
                    <div className={styles.eventInfo}>
                      <Title level={3} className={styles.eventTitle}>
                        {event.title}
                      </Title>
                      <div className={styles.metaList}>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>
                            <CalendarOutlined /> Date &amp; Time
                          </span>
                          <span className={styles.metaValue}>
                            {formatFullDate(event.date, event.time)}
                          </span>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>
                            <EnvironmentOutlined /> Venue
                          </span>
                          <span className={styles.metaValue}>{venueName}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <span className={styles.metaLabel}>
                            <TagOutlined /> Price
                          </span>
                          <span className={`${styles.metaValue} ${styles.priceValue}`}>
                            {event.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.glassCard}>
                    {reservation ? (
                      <div className={styles.successBlock}>
                        <Text className={styles.successTitle}>
                          <CheckCircleOutlined /> Ticket reserved
                        </Text>
                        <Text className={styles.successLabel}>Your ticket code:</Text>
                        <div className={styles.ticketCodeRow}>
                          <Text className={styles.ticketCode}>{reservation.ticketCode}</Text>
                          <button
                            type="button"
                            className={styles.copyBtn}
                            onClick={() => handleCopyTicketCode(reservation.ticketCode)}
                            aria-label="Copy ticket code"
                          >
                            <CopyOutlined />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {reserveTicket.isError ? (
                          <Alert
                            type="error"
                            showIcon
                            message="Reservation failed"
                            description={
                              reserveTicket.error instanceof Error
                                ? reserveTicket.error.message
                                : 'Please try again.'
                            }
                            style={{ marginBottom: 16 }}
                          />
                        ) : null}

                        <Button
                          type="primary"
                          size="large"
                          block
                          className={styles.buyBtn}
                          loading={reserveTicket.isPending}
                          onClick={handleBuyTicket}
                        >
                          Buy Ticket
                        </Button>
                      </>
                    )}
                </div>
              </div>
            </>
          )}
        </QueryState>
      </div>
      <div className={styles.footer}>
        <FooterContent />
      </div>
    </div>
  );
}
