'use client';

import { useEffect } from 'react';
import { startUiTranslation } from '@/lib/i18n/ui';
import { RESETTING, mountEditor } from './engine';

/** ผูกตัวแก้ แล้วเริ่มแปลภาษาของหลังบ้าน (ลำดับเดียวกับต้นแบบ: สคริปต์หน้าก่อน · แปลตอน DOMContentLoaded) */
export function EditorEngine() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.pfBooted) return; // React Strict Mode เรียก effect ซ้ำตอน dev
    root.dataset.pfBooted = '1';
    try {
      mountEditor();
    } catch (e) {
      if (e instanceof Error && e.message === RESETTING) return; // ?reset=new: กำลังล้างข้อมูลแล้วโหลดหน้าใหม่
      throw e;
    }
    startUiTranslation();
  }, []);
  return null;
}
