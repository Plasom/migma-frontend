import type { Lang, Portfolio } from '@/lib/portfolio/types';

/** สิ่งที่ตัววาดหน้า (template) ต้องรู้ */
export interface TemplateEnv {
  /** ข้อมูลที่ผ่าน normalize + เลือกภาษาแล้ว */
  data: Portfolio;
  lang: Lang;
  /** อยู่ใน iframe ตัวอย่างของหลังบ้าน */
  embedded: boolean;
}

/** รูปแบบผลงานที่กริด/รายการผลงานใช้ */
export interface WorkItem {
  id?: string;
  /** ลำดับในข้อมูล (ใช้อ้างตำแหน่งตอนแก้ในตัวอย่าง) */
  pi: number;
  own: boolean;
  t: string;
  c: string;
  y: number | string;
  st: string;
  pin: 0 | 1;
  tags: string[];
  cover: string | null;
  href: string;
  ds: string;
  role: string;
  time: string;
  parts: number;
}

/** ตัวช่วยที่ template เปิดให้สคริปต์อื่นของหน้าใช้ (เดิม window.PF) */
export interface SiteRuntime {
  data: Portfolio;
  edit: boolean;
  esc: (t: unknown) => string;
  has: (v: unknown) => boolean;
  /** แอตทริบิวต์ข้อความที่แก้ได้ในตัวอย่าง */
  pe: (path: string, multi?: boolean) => string;
  /** แอตทริบิวต์ค่าที่เลือกจากตัวเลือก */
  pk: (kind: string, base: string) => string;
  /** ปุ่ม “+ เพิ่ม” ท้ายรายการ */
  pa: (path: string, label: string, kind?: string) => string;
  caseHref: (w: { title?: string; cat?: string; year?: number | string; tags?: string[]; caseIds?: string[]; id?: string }) => string;
  works: WorkItem[];
  setMode: (v: 'light' | 'dark', quiet?: boolean) => void;
}
