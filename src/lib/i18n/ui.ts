/**
 * ภาษาของหลังบ้านและหน้าบัญชี: ข้อความต้นฉบับในโค้ดเป็นไทย ตัวนี้แปลสิ่งที่แสดงบนจอเป็นอังกฤษเมื่อผู้ใช้เลือก English (ค่าเริ่มต้น)
 * เก็บที่ localStorage `pf-ui` = 'en' | 'th' · แปลเฉพาะข้อความที่ตรงตารางหรือกติกาทั้งก้อน เนื้อหาที่ผู้ใช้พิมพ์เองไม่ถูกแตะ
 * เพิ่มคำใหม่: ใส่ใน ./ui-dictionary.ts (UI_EN ตรงตัว หรือ RULES มีตัวเลข/ชื่อแทรก)
 */
import { createDomTranslator, type DomTranslator } from './dom-translator';
import { UI } from './ui-dictionary';
import { KEYS, local } from '@/lib/storage/local';
import type { Lang } from '@/lib/portfolio/types';

export const UI_EN = UI.EN;

/** ภาษาของหลังบ้านที่ผู้ใช้เลือกไว้ (ค่าเริ่ม: อังกฤษ) */
export function uiLang(): Lang {
  return local.get(KEYS.uiLang) === 'th' ? 'th' : 'en';
}

/** เปลี่ยนภาษาของหลังบ้าน แล้วโหลดหน้าใหม่ (ข้อความทุกจุดแปลจากต้นฉบับไทยอีกรอบ) */
export function setUiLang(l: Lang): void {
  local.set(KEYS.uiLang, l === 'th' ? 'th' : 'en');
  location.reload();
}

export function translateUi(t: string, deep?: boolean): string | null {
  return UI.TR(t, deep);
}

/* ?uimiss: ตั้ง localStorage `pf-ui-miss` = '1' แล้วข้อความไทยที่ยังไม่มีคำแปลจะถูกเก็บไว้ใน `pf-ui-missed` ใช้ตอนไล่ตรวจ */
function missRecorder(): ((t: string) => void) | undefined {
  if (local.get('pf-ui-miss') !== '1') return undefined;
  const seen: Record<string, 1> = {};
  return (t) => {
    if (seen[t]) return;
    seen[t] = 1;
    try {
      const o = JSON.parse(local.get('pf-ui-missed') || '{}') as Record<string, string>;
      o[t] = location.pathname.split('/').pop() || '';
      local.set('pf-ui-missed', JSON.stringify(o));
    } catch {}
  };
}

let translator: DomTranslator | null = null;
export function uiTranslator(): DomTranslator {
  return (translator ??= createDomTranslator({
    translate: translateUi,
    attrs: ['aria-label', 'title', 'placeholder', 'alt', 'data-tip', 'data-lab', 'data-empty'],
    skip: (el) => !el || !!el.closest('script,style,[contenteditable="true"],[data-uil],[data-ui-keep]'),
    normalize: (t) => t.replace(/\s+/g, ' ').trim(),
    apply: (v, _t, r) => (/^[,.:]/.test(r) ? '' : v.match(/^\s*/)![0]) + r + v.match(/\s*$/)![0],
    onMiss: missRecorder(),
  }));
}

/**
 * เริ่มแปลหน้า (เรียกครั้งเดียวตอนเปิดหน้า) · ภาษาไทย = ไม่ทำอะไร
 * แปลชื่อแท็บด้วย และคอยแปลซ้ำเมื่อชื่อแท็บเปลี่ยน
 */
export function startUiTranslation(): () => void {
  if (uiLang() !== 'en') return () => {};
  document.documentElement.lang = 'en';
  const stop = uiTranslator().start();
  const tt = translateUi(document.title);
  if (tt) document.title = tt;
  const te = document.querySelector('title');
  let mo: MutationObserver | null = null;
  if (te) {
    mo = new MutationObserver(() => { const r = translateUi(document.title); if (r && r !== document.title) document.title = r; });
    mo.observe(te, { childList: true, characterData: true, subtree: true });
  }
  return () => { stop(); mo?.disconnect(); };
}
