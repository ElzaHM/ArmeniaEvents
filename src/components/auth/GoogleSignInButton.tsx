import React, { useEffect, useRef, useState } from 'react';
import { useGoogleOAuth } from '@react-oauth/google';

import {
  ensureGoogleIdentityInitialized,
  getGoogleIdentity,
  setGoogleIdentityHandlers,
} from './googleIdentitySingleton';
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
  const { scriptLoadedSuccessfully } = useGoogleOAuth();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  const onErrorRef = useRef(onError);
  const [buttonWidth, setButtonWidth] = useState(280);

  onCredentialRef.current = onCredential;
  onErrorRef.current = onError;

  useEffect(() => {
    setGoogleIdentityHandlers({
      onCredential: (credential) => {
        void onCredentialRef.current(credential);
      },
      onError: () => {
        onErrorRef.current?.();
      },
    });

    return () => {
      setGoogleIdentityHandlers(null);
    };
  }, []);

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

  useEffect(() => {
    const element = wrapperRef.current;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!scriptLoadedSuccessfully || !element || !clientId || disabled) {
      element?.replaceChildren();
      return;
    }

    if (!ensureGoogleIdentityInitialized(clientId)) {
      return;
    }

    const google = getGoogleIdentity();
    if (!google) {
      return;
    }

    element.setAttribute('data-use_fedcm_for_button', 'true');
    element.replaceChildren();
    google.accounts.id.renderButton(element, {
      type: 'standard',
      theme: 'outline',
      size: buttonWidth < 360 ? 'medium' : 'large',
      text: 'continue_with',
      shape: 'rectangular',
      width: String(buttonWidth),
    });
  }, [scriptLoadedSuccessfully, buttonWidth, disabled]);

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}
      aria-disabled={disabled}
    />
  );
};
