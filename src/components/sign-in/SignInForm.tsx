import React from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';
import { GoogleSignInButton } from '../auth/GoogleSignInButton';
import styles from './SignInForm.module.css';

type SignInValues = {
  email: string;
  password: string;
  remember?: boolean;
};

/** Set to true to restore the Google sign-in button on this page. */
const SHOW_GOOGLE_SIGN_IN = false;

type PendingNotice = {
  type: 'success' | 'error';
  content: string;
};

export const SignInForm: React.FC = () => {
  const { login, establishSession } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [pendingNotice, setPendingNotice] = React.useState<PendingNotice | null>(null);

  React.useEffect(() => {
    if (!pendingNotice) {
      return;
    }

    if (pendingNotice.type === 'success') {
      messageApi.success(pendingNotice.content);
    } else {
      messageApi.error(pendingNotice.content);
    }

    setPendingNotice(null);
  }, [pendingNotice, messageApi]);

  const handleSubmit = async (values: SignInValues) => {
    setLoading(true);
    try {
      await login({
        email: values.email,
        password: values.password,
      });
      setPendingNotice({ type: 'success', content: 'Sign in successful' });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Sign in failed. Please try again.';
      setPendingNotice({ type: 'error', content: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential: string) => {
    setGoogleLoading(true);
    try {
      const session = await authService.loginWithGoogle(credential);
      establishSession(session);
      setPendingNotice({ type: 'success', content: 'Sign in successful' });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Google sign in failed. Please try again.';
      setPendingNotice({ type: 'error', content: errorMessage });
    } finally {
      setGoogleLoading(false);
    }
  };
  const handleGoogleError = React.useCallback(() => {
    setPendingNotice({ type: 'error', content: 'Google sign in failed. Please try again.' });
  }, []);

  return (
    <div className={styles.formContainer}>
      {contextHolder}
      <h2 className={styles.title}>Sign In</h2>
      <p className={styles.subtitle}>Welcome back! Please sign in to your account.</p>

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
          />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Link to="/forgot-password" className={styles.forgotPassword}>Forgot Password?</Link>
        </div>

        <Button type="primary" className={styles.submitBtn} htmlType="submit" loading={loading}>
          Sign In
        </Button>

        <Divider className={styles.divider}>or continue with</Divider>

        {SHOW_GOOGLE_SIGN_IN ? (
          <GoogleSignInButton
          disabled={googleLoading}
          onCredential={handleGoogleCredential}
          onError={handleGoogleError}
        />
        ) : null}

        <div className={styles.signUpText}>
          Don't have an account? <Link to="/signup" className={styles.signUpLink}>Sign Up</Link>
        </div>
      </Form>
    </div>
  );
};