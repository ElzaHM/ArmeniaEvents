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
            prefix={<MailOutlined style={{ color: 'rgba(255,255,255,0.4)' }} />} 
            placeholder="Enter your email" 
            className={styles.inputField}
          />
        </Form.Item>

        <Form.Item label={<span className={styles.label}>Password</span>} name="password">
          <Input.Password 
            prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.4)' }} />} 
            placeholder="Enter your password" 
            className={styles.inputField}
          />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <Checkbox style={{ color: 'rgba(255,255,255,0.7)' }}>Remember me</Checkbox>
          <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
        </div>

        <Button type="primary" className={styles.submitBtn}>Sign In</Button>

        <Divider className={styles.divider}>or continue with</Divider>

        <Button className={styles.socialBtn} icon={<GoogleOutlined />}>Continue with Google</Button>
        <Button className={styles.socialBtn} icon={<AppleOutlined />}>Continue with Apple</Button>
        <Button className={styles.socialBtn} icon={<FacebookOutlined />}>Continue with Facebook</Button>

        <div className={styles.signUpText}>
          Don't have an account? <a href="#" className={styles.signUpLink}>Sign Up</a>
        </div>
      </Form>
    </div>
  );
};