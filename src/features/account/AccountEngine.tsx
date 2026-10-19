'use client';

import { useEffect } from 'react';
import { fetchMe, goSignIn, signOut } from '@/lib/api';
import { startUiTranslation } from '@/lib/i18n/ui';
import { mountAccount } from './engine';

let booting = false; // React Strict Mode เรียก effect ซ้ำตอน dev · ผูกหน้าครั้งเดียว

/** ถามหลังบ้านว่าใครเข้าสู่ระบบอยู่ แล้วผูกหน้าบัญชี และเริ่มแปลภาษาของหลังบ้าน */
export function AccountEngine() {
  useEffect(() => {
    if (booting) return;
    booting = true;
    fetchMe()
      .catch(() => null) // หลังบ้านติดต่อไม่ได้ = แสดงหน้าเข้าสู่ระบบ
      .then((user) => {
        mountAccount({ user, signIn: goSignIn, signOut });
        startUiTranslation();
      });
  }, []);
  return null;
}
