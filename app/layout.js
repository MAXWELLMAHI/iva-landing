import { ThemeProvider } from '../src/context/ThemeToggle/ThemeToggle';
import { ErrorBoundary } from 'react-error-boundary';
import PreloadImages from './preload-images';
import '../styles/globals.css';

export const metadata = {
  title: 'IVA Donation Platform',
  description: 'Make your contribution to transform lives through our secure donation platform',
  keywords: 'donation, charity, transform, impact, giving',
  // Security headers
  robots: 'index, follow',
  'Content-Security-Policy': {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",
    'style-src': "'self' 'unsafe-inline'",
    'img-src': "'self' data: blob:",
    'font-src': "'self'",
    'connect-src': "'self' https://api.example.com"
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light dark',
  themeColor: '#ffffff'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </head>
      <body>
        <ErrorBoundary
          fallback={<div>Something went wrong. Please try refreshing the page.</div>}
          onError={(error, errorInfo) => {
            // You can log the error to an error reporting service here
            console.error('Error caught by ErrorBoundary:', error, errorInfo);
          }}
        >
          <ThemeProvider>
            <PreloadImages />
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
} 