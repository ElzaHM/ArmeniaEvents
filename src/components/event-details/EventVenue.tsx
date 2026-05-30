import { Button, Typography } from 'antd';
import {
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';

import type { EventDetails } from './types';

import styles from './EventVenue.module.css';

interface EventVenueProps {
  event: EventDetails;
}

export default function EventVenue({ event }: EventVenueProps) {
  const { venue } = event;

  const contacts = [
    { icon: GlobalOutlined, label: venue.website, href: `https://${venue.website}` },
    { icon: PhoneOutlined, label: venue.phone, href: `tel:${venue.phone}` },
    { icon: MailOutlined, label: venue.email, href: `mailto:${venue.email}` },
  ];

  return (
    <section className={styles.section}>
      <Typography.Title level={4} className={styles.title}>
        Venue
      </Typography.Title>

      <div className={styles.header}>
        <Typography.Title level={5} className={styles.venueName}>
          {venue.name}
        </Typography.Title>
        <Typography.Text className={styles.address}>
          <EnvironmentOutlined />
          {venue.address}
        </Typography.Text>
      </div>

      <div className={styles.imageWrap}>
        <img src={venue.imageUrl} alt={venue.name} className={styles.image} loading="lazy" />
        <Button className={styles.mapBtn}>View on Map</Button>
      </div>

      <ul className={styles.contacts}>
        {contacts.map((contact) => {
          const Icon = contact.icon;

          return (
            <li key={contact.label}>
              <a href={contact.href} className={styles.contactLink}>
                <Icon />
                {contact.label}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
