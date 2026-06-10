import React, { useEffect, useRef, useState } from 'react';
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState(280);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) {
      return;
    }

    const updateWidth = () => {
      const nextWidth = Math.floor(element.getBoundingClientRect().width);
      if (nextWidth > 0) {
        setButtonWidth(Math.min(Math.max(nextWidth, 160), 400));
      }
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleSuccess = (response: CredentialResponse) => {
    if (!response.credential) {
      onError?.();
      return;
    }

    void onCredential(response.credential);
  };

  const buttonSize = buttonWidth < 360 ? 'medium' : 'large';

  return (
    <div ref={wrapperRef} className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={onError}
        text="continue_with"
        shape="rectangular"
        theme="outline"
        size={buttonSize}
        width={buttonWidth}
      />
    </div>
  );
};
