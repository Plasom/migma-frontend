'use client';

import { useEffect } from 'react';
import { bootSite } from '../boot';
import type { SitePage } from './SiteChrome';

/** วาดเนื้อหาของหน้าจากข้อมูลในเครื่อง หลังโครงหน้าขึ้นแล้ว (ทำครั้งเดียวต่อการเปิดหน้า) */
export function SiteEngine({ page }: { page: SitePage }) {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.pfBooted) return; // React Strict Mode เรียก effect ซ้ำตอน dev
    root.dataset.pfBooted = '1';
    try {
      bootSite(page);
    } finally {
      root.classList.remove('pf-boot');
    }
  }, [page]);
  return null;
}
