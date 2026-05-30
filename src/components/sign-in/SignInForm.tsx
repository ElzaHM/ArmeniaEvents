import React from 'react';
import { Form, Input, Button, Checkbox, Divider } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, AppleOutlined, FacebookOutlined } from '@ant-design/icons';
import styles from './SignInForm.module.css';

export const SignInForm: React.FC = () => {
  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Sign In</h2>
      <p className={styles.subtitle}>Welcome back! Please sign in to your account.</p>

      <Form layout="vertical" requiredMark={false}>
        <Form.Item label={<span className={styles.label}>Email Address</span>} name="email">
          <Input
            prefix={<MailOutlined className={styles.inputIcon} />}
            placeholder="Enter your email"
            className={styles.inputField}
          />
        </Form.Item>

        <Form.Item label={<span className={styles.label}>Password</span>} name="password">
          <Input.Password
            prefix={<LockOutlined className={styles.inputIcon} />}
            placeholder="Enter your password"
            className={styles.inputField}
          />
        </Form.Item>

        <div className={styles.formRow}>
          <Checkbox>Remember me</Checkbox>
          <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
        </div>

        <Button type="primary" className={styles.submitBtn}>Sign In</Button>

        <Divider className={styles.divider}>or continue with</Divider>

        <Button className={styles.socialBtn} icon={<GoogleOutlined />}>Continue with Google</Button>
        <Button className={styles.socialBtn} icon={<AppleOutlined />}>Continue with Apple</Button>
        <Button className={styles.socialBtn} icon={<FacebookOutlined />}>Continue with Facebook</Button>

        <div className={styles.signUpText}>
          Don&apos;t have an account? <a href="#" className={styles.signUpLink}>Sign Up</a>
        </div>
      </Form>
    </div>
  );
};
