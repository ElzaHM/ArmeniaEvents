import { Button, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import type { EventDetails } from './types';

import styles from './TicketPanel.module.css';

interface TicketPanelProps {
  event: EventDetails;
}

export default function TicketPanel({ event }: TicketPanelProps) {
  return (
    <aside className={`${styles.panel} detailsGlassCard`}>
      <Typography.Title level={5} className={styles.title}>
        Tickets
      </Typography.Title>

      <div className={styles.tickets}>
        {event.tickets.map((ticket) => (
          <article key={ticket.id} className={styles.ticketCard}>
            <div className={styles.ticketInfo}>
              <Typography.Text strong className={styles.ticketName}>
                {ticket.name}
              </Typography.Text>
              <Typography.Text type="secondary" className={styles.ticketDescription}>
                {ticket.description}
              </Typography.Text>
            </div>
            <div className={styles.ticketActions}>
              <Typography.Text
                className={`${styles.ticketPrice} ${ticket.isFree ? styles.priceFree : styles.pricePaid}`}
              >
                {ticket.price}
              </Typography.Text>
              <Button type="primary" size="small" className={styles.getTicketBtn}>
                Get Ticket
              </Button>
            </div>
          </article>
        ))}
      </div>

      <button type="button" className={styles.viewAll}>
        View All Tickets
        <ArrowRightOutlined />
      </button>
    </aside>
  );
}
