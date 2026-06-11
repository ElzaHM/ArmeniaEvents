type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential?: string }) => void;
        use_fedcm_for_prompt?: boolean;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type?: string;
          theme?: string;
          size?: string;
          text?: string;
          width?: string;
          shape?: string;
        },
      ) => void;
    };
  };
};

type GoogleHandlers = {
  onCredential: (credential: string) => void;
  onError?: () => void;
};

let googleIdentityInitialized = false;
let activeHandlers: GoogleHandlers | null = null;

export function getGoogleIdentity(): GoogleIdentity | null {
  const google = (window as Window & { google?: GoogleIdentity }).google;
  return google ?? null;
}

export function setGoogleIdentityHandlers(handlers: GoogleHandlers | null): void {
  activeHandlers = handlers;
}

export function ensureGoogleIdentityInitialized(clientId: string): boolean {
  const google = getGoogleIdentity();
  if (!google || googleIdentityInitialized) {
    return Boolean(google && googleIdentityInitialized);
  }

  google.accounts.id.initialize({
    client_id: clientId,
    use_fedcm_for_prompt: true,
    callback: (response) => {
      queueMicrotask(() => {
        if (!response.credential) {
          activeHandlers?.onError?.();
          return;
        }

        activeHandlers?.onCredential(response.credential);
      });
    },
  });

  googleIdentityInitialized = true;
  return true;
}
