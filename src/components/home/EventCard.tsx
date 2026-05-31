import { Typography } from 'antd';
import { 
  EnvironmentOutlined, 
  CalendarOutlined, 
  HeartOutlined 
} from '@ant-design/icons';
import type { EventItem } from './types';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: EventItem;
}

export default function EventCard({ event }: EventCardProps) {
  // Ստուգում ենք՝ արդյոք միջոցառումն անվճար է
  const isFree = event.price === 'Free' || event.price === 0;

  return (
    <article className={styles.card}>
      {/* Նկարի բաժինը */}
      <div className={styles.imageWrapper}>
        <img 
          src={event.imageUrl} 
          alt={event.name} 
          className={styles.image} 
        />
        
        {/* Ամսաթվի նշանը (Date Badge) */}
        <div className={styles.dateBadge}>
          <span className={styles.month}>MAY</span> {/* Կարող ես դինամիկ դարձնել */}
          <span className={styles.day}>24</span>
        </div>

        {/* Հավանելու կոճակը */}
        <button className={styles.wishlistBtn}>
          <HeartOutlined />
        </button>
      </div>

      {/* Տեքստային բաժինը */}
      <div className={styles.content}>
        <Typography.Title level={5} className={styles.title}>
          {event.name}
        </Typography.Title>
        
        <p className={styles.category}>{event.category}</p>

        <div className={styles.infoRow}>
          <EnvironmentOutlined className={styles.icon} />
          <span className={styles.infoText}>{event.location}</span>
        </div>

        <div className={styles.infoRow}>
          <CalendarOutlined className={styles.icon} />
          <span className={styles.infoText}>{event.date} • {event.time}</span>
        </div>

        {/* Գինը */}
        <div className={`${styles.price} ${isFree ? styles.freePrice : ''}`}>
          {isFree ? 'Free' : `$${event.price}`}
        </div>
      </div>
    </article>
  );
}









// import { useMemo, useState } from 'react';
// import { Button, Card, Typography } from 'antd';
// import {
//   ClockCircleOutlined,
//   EnvironmentOutlined,
//   HeartOutlined,
//   HeartFilled,
// } from '@ant-design/icons';

// import type { EventItem } from './types';

// import styles from './EventCard.module.css';

// interface EventCardProps {
//   event: EventItem;
// }

// function formatDateBadge(dateString: string) {
//   const date = new Date(dateString);
//   const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
//   const day = date.getDate();

//   return { month, day };
// }

// function formatEventDateTime(dateString: string, time: string) {
//   const date = new Date(dateString);
//   const formattedDate = date.toLocaleDateString('en-US', {
//     month: 'short',
//     day: 'numeric',
//   });

//   return `${formattedDate} • ${time}`;
// }

// export default function EventCard({ event }: EventCardProps) {
//   const [isFavorite, setIsFavorite] = useState(false);
//   const { month, day } = useMemo(() => formatDateBadge(event.date), [event.date]);

//   return (
//     <Card
//       className={styles.card}
//       cover={
//         <div className={styles.coverWrap}>
//           <img src={event.imageUrl} alt={event.title} className={styles.cover} loading="lazy" />
//           <div className={styles.dateBadge}>
//             <span className={styles.dateMonth}>{month}</span>
//             <span className={styles.dateDay}>{day}</span>
//           </div>
//           <Button
//             type="text"
//             aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
//             icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
//             className={styles.favoriteBtn}
//             onClick={() => setIsFavorite((current) => !current)}
//           />
//         </div>
//       }
//       styles={{ body: { padding: 16 } }}
//     >
//       <Typography.Title level={5} className={styles.title}>
//         {event.title}
//       </Typography.Title>
//       <Typography.Text type="secondary" className={styles.category}>
//         {event.category}
//       </Typography.Text>
//       <div className={styles.meta}>
//         <span className={styles.metaItem}>
//           <EnvironmentOutlined />
//           {event.location}
//         </span>
//         <span className={styles.metaItem}>
//           <ClockCircleOutlined />
//           {formatEventDateTime(event.date, event.time)}
//         </span>
//       </div>
//       <Typography.Text
//         className={`${styles.price} ${event.isFree ? styles.priceFree : styles.pricePaid}`}
//       >
//         {event.price}
//       </Typography.Text>
//     </Card>
//   );
// }
