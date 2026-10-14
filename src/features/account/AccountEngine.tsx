'use client';

import { useEffect } from 'react';
import { startUiTranslation } from '@/lib/i18n/ui';
import { mountAccount } from './engine';

/** ผูกหน้าบัญชี แล้วเริ่มแปลภาษาของหลังบ้าน (ลำดับเดียวกับต้นแบบ: สคริปต์หน้าก่อน · แปลตอน DOMContentLoaded) */
export function AccountEngine() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.pfBooted) return; // React Strict Mode เรียก effect ซ้ำตอน dev
    root.dataset.pfBooted = '1';
    mountAccount();
    startUiTranslation();
  }, []);
  return null;
}
