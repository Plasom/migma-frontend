/* หน้า portfolio (หน้าแรก · ผลงานทั้งหมด · case study) ใช้ CSS ชุดเดียวกัน · CSS เฉพาะหน้าจำกัดด้วย .pg-<หน้า> */
import '@/styles/tokens-core.css';
import '@/styles/theme.css';
import '@/styles/motion.css';
import '@/styles/site/base.css';
import '@/styles/site/home.css';
import '@/styles/site/work.css';
import '@/styles/site/case.css';
import '@/styles/site/template.css';
import '@/styles/site/edit.css';
import type { Viewport } from 'next';
import type { ReactNode } from 'react';
import { HeadScript } from '@/components/HeadScript';
import { IconFont } from '@/components/IconFont';
import { SITE_HEAD } from '@/lib/head-scripts';
import { fontHtmlProps } from '../fonts';

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" {...fontHtmlProps} suppressHydrationWarning>
      <head>
        <HeadScript code={SITE_HEAD} />
        <IconFont />
      </head>
      <body id="top">{children}</body>
    </html>
  );
}
