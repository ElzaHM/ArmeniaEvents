import { useEffect, useState } from 'react';
import { Typography } from 'antd';

import { parseEventDate } from '../events/eventDateUtils';

import styles from './CountdownCard.module.css';

export interface CountdownCardProps {
  startDate: string;
}

type CountdownState =
  | { status: 'tbd' }
  | { status: 'started' }
  | { status: 'active'; days: number; hours: number; minutes: number };

function getCountdownState(startDate: string): CountdownState {
  const start = parseEventDate(startDate);
  if (!start) {
    return { status: 'tbd' };
  }

  const now = new Date();
  const diffMs = start.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { status: 'started' };
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return { status: 'active', days, hours, minutes };
}

const METRICS: { key: 'days' | 'hours' | 'minutes'; label: string; pad?: boolean }[] = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours', pad: true },
  { key: 'minutes', label: 'Minutes', pad: true },
];

export default function CountdownCard({ startDate }: CountdownCardProps) {
  const [countdown, setCountdown] = useState(() => getCountdownState(startDate));

  useEffect(() => {
    setCountdown(getCountdownState(startDate));

    const intervalId = window.setInterval(() => {
      setCountdown(getCountdownState(startDate));
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [startDate]);

  return (
    <section className={`${styles.section} detailsGlassCard`}>
      <Typography.Title level={4} className={styles.title}>
        Countdown
      </Typography.Title>

      {countdown.status === 'tbd' && (
        <Typography.Text className={styles.message}>Date TBD</Typography.Text>
      )}

      {countdown.status === 'started' && (
        <Typography.Text className={styles.message}>Event started</Typography.Text>
      )}

      {countdown.status === 'active' && (
        <div className={styles.metrics}>
          {METRICS.map(({ key, label, pad = false }) => {
            const value = countdown[key];
            const displayValue = pad ? String(value).padStart(2, '0') : String(value);

            return (
              <div key={key} className={styles.metric}>
                <span className={styles.value}>{displayValue}</span>
                <span className={styles.label}>{label}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

