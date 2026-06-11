import { useNavigate } from 'react-router-dom';
import { Button, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import type { EventDetails } from './types';

import styles from './TicketPanel.module.css';

interface TicketPanelProps {
  event: EventDetails;
}

export default function TicketPanel({ event }: TicketPanelProps) {
  const navigate = useNavigate();

  if (event.isFree) {
    return (
      <aside className={`${styles.panel} detailsGlassCard`}>
        <article className={styles.freeCard}>
          <Typography.Text className={styles.freeLabel}>FREE EVENT</Typography.Text>
          <Typography.Text className={styles.freeDescription}>
            No ticket purchase required
          </Typography.Text>
        </article>
      </aside>
    );
  }

  if (event.ticketUrl) {
    return (
      <aside className={`${styles.panel} detailsGlassCard`}>
        <Typography.Title level={5} className={styles.title}>
          Tickets
        </Typography.Title>

        <div className={styles.tickets}>
          <article className={styles.ticketCard}>
            <div className={styles.ticketInfo}>
              <Typography.Text strong className={styles.ticketName}>
                General Admission
              </Typography.Text>
              <Typography.Text type="secondary" className={styles.ticketDescription}>
                Get your ticket for {event.title}
              </Typography.Text>
            </div>
            <div className={styles.ticketActions}>
              <Typography.Text className={`${styles.ticketPrice} ${styles.priceFree}`}>
                {event.price}
              </Typography.Text>
              <Button
                type="primary"
                size="small"
                className={styles.getTicketBtn}
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Ticket
              </Button>
            </div>
          </article>
        </div>

        <Button
          type="link"
          className={styles.viewAll}
          href={event.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          icon={<ArrowRightOutlined />}
        >
          View All Tickets
        </Button>
      </aside>
    );
  }

  return (
    <aside className={`${styles.panel} detailsGlassCard`}>
      <Typography.Title level={5} className={styles.title}>
        Tickets
      </Typography.Title>

      <div className={styles.tickets}>
        <article className={styles.ticketCard}>
          <div className={styles.ticketInfo}>
            <Typography.Text strong className={styles.ticketName}>
              General Admission
            </Typography.Text>
            <Typography.Text type="secondary" className={styles.ticketDescription}>
              Get your ticket for {event.title}
            </Typography.Text>
          </div>
          <div className={styles.ticketActions}>
            <Typography.Text className={`${styles.ticketPrice} ${styles.pricePaid}`}>
              {event.price}
            </Typography.Text>
            <Button
              type="primary"
              size="small"
              className={styles.getTicketBtn}
              onClick={() => navigate(`/events/${event.id}/checkout`)}
            >
              Get Ticket
            </Button>
          </div>
        </article>
      </div>
    </aside>
  );
}
