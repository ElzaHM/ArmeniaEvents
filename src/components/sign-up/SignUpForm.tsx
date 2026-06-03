import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import styles from './SignUpForm.module.css';

type SignUpValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
};

export const SignUpForm: React.FC = () => {
  const { register } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: SignUpValues) => {
    setLoading(true);
    try {
      await register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      messageApi.success('Account created successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed. Please try again.';
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      {contextHolder}
      <h2 className={styles.title}>Sign Up</h2>
      <p className={styles.subtitle}>Create your account to get started.</p>

      <Form layout="vertical" requiredMark={false} onFinish={handleSubmit}>
        <Form.Item
          label={<span className={styles.label}>Full Name</span>}
          name="fullName"
          rules={[{ required: true, message: 'Full name is required' }]}
        >
          <Input 
            prefix={<UserOutlined className={styles.inputIcon} />} 
            placeholder="Enter your full name" 
            className={styles.inputField}
          />
        </Form.Item>

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
          style={{ marginBottom: 8 }}
          rules={[
            { required: true, message: 'Password is required' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined className={styles.inputIcon} />} 
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

        <Form.Item
          label={<span className={styles.label} style={{ marginTop: 16 }}>Confirm Password</span>}
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
            placeholder="Confirm your password" 
            className={styles.inputField}
          />
        </Form.Item>

        <Form.Item
          name="agree"
          valuePropName="checked"
          rules={[
            {
              validator(_, value) {
                return value ? Promise.resolve() : Promise.reject(new Error('Please accept terms'));
              },
            },
          ]}
        >
          <Checkbox>
            I agree to the <a href="#" className={styles.termsLink}>Terms & Privacy Policy</a>
          </Checkbox>
        </Form.Item>

        <Button type="primary" className={styles.submitBtn} htmlType="submit" loading={loading}>
          Create Account
        </Button>

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