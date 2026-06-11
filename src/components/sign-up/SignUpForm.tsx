import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';
import { GoogleSignInButton } from '../auth/GoogleSignInButton';
import styles from './SignUpForm.module.css';

type SignUpValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
};

/** Set to true to restore the Google sign-up button on this page. */
const SHOW_GOOGLE_SIGN_IN = false;

type PasswordStrength = {
  level: 'weak' | 'medium' | 'strong' | null;
  label: string;
  activeBars: number;
};

const strengthTextClass = {
  weak: styles.strengthTextWeak,
  medium: styles.strengthTextMedium,
  strong: styles.strengthTextStrong,
} as const;

const strengthBarClass = {
  weak: styles.barWeak,
  medium: styles.barMedium,
  strong: styles.barStrong,
} as const;

function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { level: null, label: '', activeBars: 0 };
  }

  if (password.length < 6) {
    return { level: 'weak', label: 'Թույլ', activeBars: 1 };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const charTypes = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;

  if (password.length < 8 || charTypes <= 1) {
    return { level: 'weak', label: 'Թույլ', activeBars: 1 };
  }

  if (password.length < 10 || charTypes <= 2) {
    return { level: 'medium', label: 'Միջին', activeBars: 2 };
  }

  if (password.length >= 10 && charTypes >= 3) {
    return { level: 'strong', label: 'Ուժեղ', activeBars: 4 };
  }

  return { level: 'medium', label: 'Միջին', activeBars: 2 };
}

export const SignUpForm: React.FC = () => {
  const { register, establishSession } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [passwordValue, setPasswordValue] = React.useState('');
  const [form] = Form.useForm<SignUpValues>();
  const strength = evaluatePasswordStrength(passwordValue);

  const handleSubmit = async (values: SignUpValues) => {
    setLoading(true);
    try {
      await register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      messageApi.success('Sign up successful');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed. Please try again.';
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Google sign in failed. Please try again.';
      messageApi.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      {contextHolder}
      <h2 className={styles.title}>Sign Up</h2>
      <p className={styles.subtitle}>Create your account to get started.</p>

      <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit}>
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
          rules={[
            { required: true, message: 'Password is required' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className={styles.inputIcon} />}
            placeholder="Create a password"
            className={styles.inputField}
            onChange={(event) => setPasswordValue(event.target.value)}
          />
        </Form.Item>

        {passwordValue && (
          <div className={styles.strengthContainer}>
            <div className={styles.strengthLabel}>
              Password strength:{' '}
              <span
                className={`${styles.strengthText} ${
                  strength.level ? strengthTextClass[strength.level] : ''
                }`}
              >
                {strength.label}
              </span>
            </div>
            <div className={styles.strengthBars}>
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`${styles.bar} ${
                    index < strength.activeBars && strength.level
                      ? `${styles.barActive} ${strengthBarClass[strength.level]}`
                      : ''
                  }`}
                />
              ))}
            </div>
          </div>
        )}

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
            placeholder="Confirm your password" 
            className={styles.inputField}
          />
        </Form.Item>

        <Form.Item
          name="agree"
          className="agreeItem"
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
            I agree to the{' '}
            <Link to="/privacy-policy" className={styles.termsLink}>
              Terms & Privacy Policy
            </Link>
          </Checkbox>
        </Form.Item>

        <Button type="primary" className={styles.submitBtn} htmlType="submit" loading={loading}>
          Create Account
        </Button>

        {SHOW_GOOGLE_SIGN_IN ? (
          <>
            <Divider className={styles.divider}>or continue with</Divider>

            <GoogleSignInButton
              disabled={googleLoading}
              onCredential={handleGoogleCredential}
              onError={() => messageApi.error('Google sign in failed. Please try again.')}
            />
          </>
        ) : null}

        <div className={styles.signInText}>
          Already have an account? <Link to="/signin" className={styles.signInLink}>Sign In</Link>
        </div>
      </Form>
    </div>
  );
};