import { useState } from 'react';
import { Button, Input, Typography, message } from 'antd';

import { useSubscribeNewsletter } from '../../hooks/queries/useNewsletter';

import styles from './FooterContent.module.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Email is required';
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return 'Invalid email address';
  }
  return null;
}

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const subscribeMutation = useSubscribeNewsletter();

  const handleSubscribe = async () => {
    const validationError = validateEmail(email);
    if (validationError) {
      setEmailError(validationError);
      return;
    }

    setEmailError(null);

    try {
      await subscribeMutation.mutateAsync(email.trim().toLowerCase());
      messageApi.success('Thanks for subscribing!');
      setEmail('');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Subscription failed. Please try again.';

      if (errorMessage === "You're already subscribed.") {
        messageApi.info(errorMessage);
        return;
      }

      messageApi.error(errorMessage);
    }
  };

  return (
    <>
      {contextHolder}
      <div className={styles.newsletterForm}>
        <Input
          placeholder="Your email address"
          type="email"
          size="large"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (emailError) {
              setEmailError(null);
            }
          }}
          onPressEnter={() => {
            void handleSubscribe();
          }}
          status={emailError ? 'error' : undefined}
          disabled={subscribeMutation.isPending}
        />

        {emailError ? (
          <Typography.Text type="danger">{emailError}</Typography.Text>
        ) : null}

        <Button
          type="primary"
          size="large"
          className="homeActionBtn"
          onClick={() => {
            void handleSubscribe();
          }}
          loading={subscribeMutation.isPending}
          disabled={subscribeMutation.isPending}
        >
          Subscribe
        </Button>
      </div>
    </>
  );
}
