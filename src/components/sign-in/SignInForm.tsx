import React from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './SignInForm.module.css';

type SignInValues = {
  email: string;
  password: string;
  remember?: boolean;
};

export const SignInForm: React.FC = () => {
  const { login } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: SignInValues) => {
    setLoading(true);
    try {
      await login({
        email: values.email,
        password: values.password,
      });
      messageApi.success('Sign in successful');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Sign in failed. Please try again.';
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
        </div>

        <Button type="primary" className={styles.submitBtn} htmlType="submit" loading={loading}>
          Sign In
        </Button>

        <Divider className={styles.divider}>or continue with</Divider>

        <Button className={styles.socialBtn} icon={<GoogleOutlined />}>Continue with Google</Button>
        <Button className={styles.socialBtn} icon={<FacebookOutlined />}>Continue with Facebook</Button>

        <div className={styles.signUpText}>
          Don't have an account? <Link to="/signup" className={styles.signUpLink}>Sign Up</Link>
        </div>
      </Form>
    </div>
  );
};