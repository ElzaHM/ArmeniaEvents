import React from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

import styles from './GoogleSignInButton.module.css';

type GoogleSignInButtonProps = {
  disabled?: boolean;
  onCredential: (credential: string) => Promise<void>;
  onError?: () => void;
};

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  disabled = false,
  onCredential,
  onError,
}) => {
  const handleSuccess = (response: CredentialResponse) => {
    if (!response.credential) {
      onError?.();
      return;
    }

    void onCredential(response.credential);
  };

  return (
    <div className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={onError}
        text="continue_with"
        locale="en"
        shape="rectangular"
        theme="outline"
        size="large"
        width="100%"
      />
    </div>
  );
};
