import React, { useEffect, useRef, useState } from 'react';
import { useGoogleOAuth } from '@react-oauth/google';

import styles from './GoogleSignInButton.module.css';

type GoogleSignInButtonProps = {
  disabled?: boolean;
  onCredential: (credential: string) => Promise<void>;
  onError?: () => void;
};

type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential?: string }) => void;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type?: string;
          theme?: string;
          size?: string;
          text?: string;
          width?: string;
        },
      ) => void;
    };
  };
};

let googleIdentityInitialized = false;

function getGoogleIdentity(): GoogleIdentity | null {
  const google = (window as Window & { google?: GoogleIdentity }).google;
  return google ?? null;
}

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
    const google = getGoogleIdentity();
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!scriptLoadedSuccessfully || !element || !google || !clientId || disabled) {
      element?.replaceChildren();
      return;
    }

    if (!googleIdentityInitialized) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (!response.credential) {
            onErrorRef.current?.();
            return;
          }

          void onCredentialRef.current(response.credential);
        },
      });
      googleIdentityInitialized = true;
    }

    element.replaceChildren();
    google.accounts.id.renderButton(element, {
      type: 'standard',
      theme: 'outline',
      size: buttonWidth < 360 ? 'medium' : 'large',
      text: 'continue_with',
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
