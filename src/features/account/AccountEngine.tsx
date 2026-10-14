'use client';

import { useEffect } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { startUiTranslation } from '@/lib/i18n/ui';
import { mountAccount } from './engine';

/** สถานะเข้าสู่ระบบจริงจาก server · null = ยังไม่ได้ตั้งค่า OAuth หน้าบัญชีใช้แบบจำลองเดิม */
export type AccountAuth = {
  providers: string[];
  user: { email: string; name: string; image: string } | null;
};

/** ผูกหน้าบัญชี แล้วเริ่มแปลภาษาของหลังบ้าน (ลำดับเดียวกับต้นแบบ: สคริปต์หน้าก่อน · แปลตอน DOMContentLoaded) */
export function AccountEngine({ auth }: { auth: AccountAuth | null }) {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.pfBooted) return; // React Strict Mode เรียก effect ซ้ำตอน dev
    root.dataset.pfBooted = '1';
    mountAccount(auth && { ...auth, signIn, signOut });
    startUiTranslation();
  }, [auth]);
  return null;
}
