import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Divider } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import styles from './SignUpForm.module.css';

export const SignUpForm: React.FC = () => {
  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Sign Up</h2>
      <p className={styles.subtitle}>Create your account to get started.</p>

      <Form layout="vertical" requiredMark={false}>
        <Form.Item label={<span className={styles.label}>Full Name</span>} name="fullName">
          <Input 
            prefix={<UserOutlined style={{ color: 'rgba(255,255,255,0.4)' }} />} 
            placeholder="Enter your full name" 
            className={styles.inputField}
          />
        </Form.Item>

        <Form.Item label={<span className={styles.label}>Email Address</span>} name="email">
          <Input 
            prefix={<MailOutlined style={{ color: 'rgba(255,255,255,0.4)' }} />} 
            placeholder="Enter your email" 
            className={styles.inputField}
          />
        </Form.Item>

        <Form.Item label={<span className={styles.label}>Password</span>} name="password" style={{ marginBottom: 8 }}>
          <Input.Password 
            prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.4)' }} />} 
            placeholder="Create a password" 
            className={styles.inputField}
          />
        </Form.Item>

        {/* Password Strength Indicator */}
        <div className={styles.strengthContainer}>
          <div className={styles.strengthLabel}>
            Password strength: <span className={styles.strengthText}>Medium</span>
          </div>
          <div className={styles.strengthBars}>
            <div className={`${styles.bar} ${styles.barActive}`} />
            <div className={`${styles.bar} ${styles.barActive}`} />
            <div className={styles.bar} />
            <div className={styles.bar} />
          </div>
        </div>

        <Form.Item label={<span className={styles.label} style={{ marginTop: 16 }}>Confirm Password</span>} name="confirmPassword">
          <Input.Password 
            prefix={<LockOutlined style={{ color: 'rgba(255,255,255,0.4)' }} />} 
            placeholder="Confirm your password" 
            className={styles.inputField}
          />
        </Form.Item>

        <Form.Item name="agree" valuePropName="checked">
          <Checkbox style={{ color: 'rgba(255,255,255,0.7)' }}>
            I agree to the <a href="#" className={styles.termsLink}>Terms & Privacy Policy</a>
          </Checkbox>
        </Form.Item>

        <Button type="primary" className={styles.submitBtn}>Create Account</Button>

        <Divider className={styles.divider}>or continue with</Divider>

        <Button className={styles.socialBtn} icon={<GoogleOutlined />}>Continue with Google</Button>
        <Button className={styles.socialBtn} icon={<FacebookOutlined />}>Continue with Facebook</Button>

        <div className={styles.signInText}>
          Already have an account? <Link to="/signin" className={styles.signInLink}>Sign In</Link>
        </div>
      </Form>
    </div>
  );
};