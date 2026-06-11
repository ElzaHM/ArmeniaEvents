import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';

import { authService } from '../../services/auth.service';
import styles from '../sign-in/SignInForm.module.css';

type ForgotPasswordValues = {
  email: string;
};

export const ForgotPasswordForm: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (values: ForgotPasswordValues) => {
    setLoading(true);
    try {
      await authService.forgotPassword(values.email);
      setSubmitted(true);
      messageApi.success('Check your email for reset instructions.');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Could not send reset email. Please try again.';
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      {contextHolder}
      <h2 className={styles.title}>Forgot Password</h2>
      <p className={styles.subtitle}>
        Enter your email and we will send you a link to create a new password.
      </p>

      {submitted ? (
        <p className={styles.subtitle}>
          If an account exists for that email, you will receive reset instructions shortly.
        </p>
      ) : (
        <Form layout="vertical" requiredMark={false} onFinish={handleSubmit}>
          <Form.Item
            label={<span className={styles.label}>Email Address</span>}
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Invalid email address' },
            ]}
          >
            <Input
              prefix={<MailOutlined className={styles.inputIcon} />}
              placeholder="Enter your email"
              className={styles.inputField}
              autoComplete="email"
              name="email"
            />
          </Form.Item>

          <Button type="primary" className={styles.submitBtn} htmlType="submit" loading={loading}>
            Send Reset Link
          </Button>
        </Form>
      )}

      <div className={styles.signUpText}>
        Remember your password? <Link to="/signin" className={styles.signUpLink}>Sign In</Link>
      </div>
    </div>
  );
};
