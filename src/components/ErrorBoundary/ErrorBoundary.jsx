"use client";
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import './ErrorBoundary.css';

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="error-container">
    <div className="error-content">
      <h2>Something went wrong</h2>
      <p>We apologize for the inconvenience. Please try again later.</p>
      <button onClick={resetErrorBoundary} className="retry-button">
        Try again
      </button>
      {process.env.NODE_ENV === 'development' && (
        <details className="error-details">
          <summary>Error details</summary>
          <pre>{error.message}</pre>
          <pre>{error.stack}</pre>
        </details>
      )}
    </div>
  </div>
);

const logError = (error, info) => {
  // In production, you would send this to your logging service
  console.error('Error caught by ErrorBoundary:', error);
  console.error('Component stack:', info.componentStack);
};

export const ErrorBoundary = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logError}
      onReset={() => {
        // Reset application state here if needed
        window.location.href = '/';
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary; 