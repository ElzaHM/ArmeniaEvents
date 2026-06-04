import { Alert, Spin } from 'antd';
import type { ReactNode } from 'react';

type QueryStateProps = {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  children: ReactNode;
  minHeight?: number;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Please try again later.';
}

export function QueryState({
  isLoading,
  isError,
  error,
  children,
  minHeight = 120,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24, minHeight }}>
        <Spin />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Something went wrong"
        description={getErrorMessage(error)}
      />
    );
  }

  return <>{children}</>;
}
