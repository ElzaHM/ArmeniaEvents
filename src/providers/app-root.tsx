import { Outlet } from 'react-router-dom';

import { AuthProvider } from './auth-provider';
import { ThemeProvider } from './theme-provider';

export function AppRoot() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </AuthProvider>
  );
}
