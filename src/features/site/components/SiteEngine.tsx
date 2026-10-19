'use client';

import { useEffect } from 'react';
import { bootSite, type PublicSite } from '../boot';
import type { SitePage } from './SiteChrome';

/** วาดเนื้อหาของหน้าหลังโครงหน้าขึ้นแล้ว (ทำครั้งเดียวต่อการเปิดหน้า) · pub = เว็บสาธารณะ (ข้อมูลจากหลังบ้าน) */
export function SiteEngine({ page, pub }: { page: SitePage; pub?: PublicSite }) {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.pfBooted) return; // React Strict Mode เรียก effect ซ้ำตอน dev
    root.dataset.pfBooted = '1';
    try {
      bootSite(page, pub);
    } finally {
      root.classList.remove('pf-boot');
    }
  }, [page, pub]);
  return null;
}
