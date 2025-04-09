'use client';

import { ErrorBoundary } from 'react-error-boundary';

export default function ErrorBoundaryWrapper({ children }) {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Please try refreshing the page.</div>}
      onError={(error, errorInfo) => {
        // You can log the error to an error reporting service here
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
} 