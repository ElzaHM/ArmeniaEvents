import React from 'react';
import { Form, Input, Button, Divider, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';
import { GoogleSignInButton } from '../auth/GoogleSignInButton';
import styles from './SignInForm.module.css';

type SignInValues = {
  email: string;
  password: string;
};

export const SignInForm: React.FC = () => {
  const { login, establishSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = (location.state as { from?: string } | null)?.from || '/';
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const handleSubmit = async (values: SignInValues) => {
    setLoading(true);
    try {
      await login({
        email: values.email,
        password: values.password,
      });
      messageApi.success('Sign in successful');
      navigate(redirectTo);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Sign in failed. Please try again.';
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential: string) => {
    setGoogleLoading(true);
    try {
      const session = await authService.loginWithGoogle(credential);
      establishSession(session);
      messageApi.success('Sign in successful');
      navigate(redirectTo);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Google sign in failed. Please try again.';
      messageApi.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };
  const handleGoogleError = React.useCallback(() => {
    messageApi.error('Google sign in failed. Please try again.');
  }, [messageApi]);

  return (
    <div className={styles.formContainer}>
      {contextHolder}
      <h2 className={styles.title}>Sign In</h2>
      <p className={styles.subtitle}>Welcome back! Please sign in to your account.</p>

      <Form layout="vertical" requiredMark={false} autoComplete="on" onFinish={handleSubmit}>
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

        <Form.Item
          label={<span className={styles.label}>Password</span>}
          name="password"
          rules={[{ required: true, message: 'Password is required' }]}
        >
          <Input.Password
            prefix={<LockOutlined className={styles.inputIcon} />}
            placeholder="Enter your password"
            className={styles.inputField}
            autoComplete="current-password"
            name="password"
          />
        </Form.Item>

        <div className={styles.formRow}>
          <Link to="/forgot-password" className={styles.forgotPassword}>Forgot Password?</Link>
        </div>

        <Button type="primary" className={styles.submitBtn} htmlType="submit" loading={loading}>
          Sign In
        </Button>

        <Divider className={styles.divider}>or continue with</Divider>

        <GoogleSignInButton
          disabled={googleLoading}
          onCredential={handleGoogleCredential}
          onError={handleGoogleError}
        />

        <div className={styles.signUpText}>
          Don't have an account? <Link to="/signup" className={styles.signUpLink}>Sign Up</Link>
        </div>
      </Form>
    </div>
  );
};