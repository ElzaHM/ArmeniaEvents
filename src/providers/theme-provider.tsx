import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { App, ConfigProvider, theme } from 'antd';

import { ThemeContext, type ThemeMode } from './theme-context';

const STORAGE_KEY = 'armenia-events-theme';

const PRIMARY_GOLD = '#D48806';

function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  // Default to light when no preference is saved.
  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = useCallback(() => {
    setMode((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleTheme,
    }),
    [mode, toggleTheme],
  );

  const antTheme = useMemo(
    () => ({
      algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: PRIMARY_GOLD,
        borderRadius: 8,
        fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
      },
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={antTheme}>
        <App>{children}</App>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
