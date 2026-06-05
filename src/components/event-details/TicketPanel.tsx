import { Button, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import type { EventDetails } from './types';

import styles from './TicketPanel.module.css';

interface TicketPanelProps {
  event: EventDetails;
}

export default function TicketPanel({ event }: TicketPanelProps) {
  if (!event.ticketUrl) {
    return null;
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
