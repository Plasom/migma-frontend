import '@/styles/tokens-core.css';
import '@/styles/theme.css';
import '@/styles/admin.css';
import type { Viewport } from 'next';
import type { ReactNode } from 'react';
import { HeadScript } from '@/components/HeadScript';
import { ACCOUNT_HEAD } from '@/lib/head-scripts';
import { fontHtmlProps } from '../fonts';

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" {...fontHtmlProps} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <HeadScript code={ACCOUNT_HEAD} />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body>{children}</body>
    </html>
  );
}
