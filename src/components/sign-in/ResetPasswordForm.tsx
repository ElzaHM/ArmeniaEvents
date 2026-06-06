import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';

import { authService } from '../../services/auth.service';
import styles from './SignInForm.module.css';

type ResetPasswordValues = {
  password: string;
  confirmPassword: string;
};

function getRecoveryTokenFromUrl(): string | null {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const searchParams = new URLSearchParams(window.location.search);
  const type = hashParams.get('type') ?? searchParams.get('type');

  if (type && type !== 'recovery') {
    return null;
  }

  return hashParams.get('access_token') ?? searchParams.get('access_token');
}

export const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const accessToken = React.useMemo(() => getRecoveryTokenFromUrl(), []);

  const handleSubmit = async (values: ResetPasswordValues) => {
    if (!accessToken) {
      messageApi.error('Invalid or expired reset link. Please request a new one.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        accessToken,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      messageApi.success('Password updated successfully. You can sign in now.');
      navigate('/signin', { replace: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Could not reset password. Please try again.';
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!accessToken) {
    return (
      <div className={styles.formContainer}>
        {contextHolder}
        <h2 className={styles.title}>Reset Password</h2>
        <p className={styles.subtitle}>
          This reset link is invalid or has expired. Request a new password reset email.
        </p>
        <Link to="/forgot-password" className={styles.signUpLink}>
          Request new reset link
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      {contextHolder}
      <h2 className={styles.title}>Reset Password</h2>
      <p className={styles.subtitle}>Choose a new password for your account.</p>

      <Form layout="vertical" requiredMark={false} onFinish={handleSubmit}>
        <Form.Item
          label={<span className={styles.label}>New Password</span>}
          name="password"
          rules={[
            { required: true, message: 'Password is required' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className={styles.inputIcon} />}
            placeholder="Enter new password"
            className={styles.inputField}
          />
        </Form.Item>

        <Form.Item
          label={<span className={styles.label}>Confirm Password</span>}
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className={styles.inputIcon} />}
            placeholder="Confirm new password"
            className={styles.inputField}
          />
        </Form.Item>

        <Button type="primary" className={styles.submitBtn} htmlType="submit" loading={loading}>
          Update Password
        </Button>
      </Form>
    </div>
  );
};
