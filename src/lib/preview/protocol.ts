/**
 * หลังบ้าน ↔ ตัวอย่างหน้าเว็บ (iframe ต้นทางเดียวกัน)
 * spec: wireframe/src/core/patterns/data-model.md (หลังบ้าน ↔ ตัวอย่าง)
 */
import type { Lang, Portfolio } from '@/lib/portfolio/types';

/** ชื่อส่วนบนหน้า (`data-pf`) */
export type PreviewSection = 'profile' | 'works' | 'process' | 'case' | 'experience' | 'contact' | 'footer' | string;

/** ตัวอย่าง → หลังบ้าน */
export type PreviewToEditor =
  | { type: 'pf:ready'; page?: string }
  | { type: 'pf:select'; section: PreviewSection; item?: string; path?: string }
  | { type: 'pf:edit'; path: string; value: unknown; [k: string]: unknown }
  | { type: 'pf:editend'; path?: string; [k: string]: unknown }
  | { type: 'pf:add'; [k: string]: unknown }
  | { type: 'pf:goto'; [k: string]: unknown }
  | { type: 'pf:nav'; href: string }
  | { type: 'pf:order'; [k: string]: unknown }
  | { type: 'pf:newcat'; [k: string]: unknown }
  | { type: 'pf:mode'; [k: string]: unknown }
  | { type: 'pf:lang'; lang: Lang };

/** หลังบ้าน → ตัวอย่าง */
export type EditorToPreview =
  | { type: 'pf:reload' }
  | { type: 'pf:focus'; section: PreviewSection }
  | { type: 'pf:cur'; section: PreviewSection }
  | { type: 'pf:hl'; sel: string | null; quiet?: number }
  | { type: 'pf:theme'; theme: 'light' | 'dark' }
  | { type: 'pf:set'; [k: string]: unknown }
  | { type: 'pf:open'; [k: string]: unknown }
  | { type: 'pf:mode'; [k: string]: unknown };

/**
 * ข้อมูลที่หลังบ้านส่งให้หน้าตัวอย่างตอนโหลด (แทน window.PF_DATA / PF_LANG ที่ต้นแบบฉีดลง srcdoc · โหลดซ้ำแบบนิ่งใช้ ?still=1)
 * หน้าตัวอย่างอยู่ต้นทางเดียวกับหลังบ้าน จึงอ่านจาก `parent.pfPreviewHandoff()` ได้ตรงๆ ตอนเริ่ม
 */
export interface PreviewHandoff {
  /** ร่างล่าสุดในหน่วยความจำของหลังบ้าน */
  data: Portfolio;
  /** ภาษาที่หลังบ้านสั่งให้แสดง */
  lang: Lang;
  theme: 'light' | 'dark';
}

declare global {
  interface Window {
    /** หลังบ้านตั้งไว้ ให้หน้าตัวอย่างใน iframe เรียก */
    pfPreviewHandoff?: () => PreviewHandoff | null;
  }
}

/** หน้าตัวอย่าง: อ่าน handoff จากหลังบ้าน (ไม่ได้อยู่ใน iframe ของหลังบ้าน = null) */
export function readHandoff(): PreviewHandoff | null {
  try {
    if (window.parent === window) return null;
    const fn = window.parent.pfPreviewHandoff;
    return typeof fn === 'function' ? fn() : null;
  } catch {
    return null;
  }
}
