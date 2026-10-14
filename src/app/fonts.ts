import { Google_Sans, Noto_Sans_Thai } from 'next/font/google';
import type { CSSProperties } from 'react';

/* ฟอนต์หลักโหลดผ่าน next/font (โฮสต์เอง ไม่บล็อกการวาด) · ไอคอน Material Symbols ยังโหลดจาก Google Fonts (ดู <IconFont />) */
const googleSans = Google_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-google-sans', adjustFontFallback: false });
const notoThai = Noto_Sans_Thai({ subsets: ['thai'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-noto-thai' });

/** ใส่ที่ <html>: ประกาศตัวแปรฟอนต์ + ตั้ง --font-sans ของ design system ให้ใช้ฟอนต์ชุดนี้ */
export const fontHtmlProps = {
  className: `${googleSans.variable} ${notoThai.variable}`,
  style: { '--font-sans': 'var(--font-google-sans), var(--font-noto-thai), sans-serif' } as CSSProperties,
};
