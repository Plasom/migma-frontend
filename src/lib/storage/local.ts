/**
 * localStorage แบบไม่พัง: โหมดส่วนตัว / ถูกบล็อก / เต็ม = คืน null หรือ false แทนการโยน error
 * ชื่อคีย์ทั้งหมดของแอปรวมไว้ที่ `KEYS` ที่เดียว
 */
export const KEYS = {
  /** ฉบับข้อมูล portfolio */
  draft: 'pf-draft',
  saved: 'pf-saved',
  published: 'pf-published',
  /** เวลาที่เขียนข้อมูล portfolio ล่าสุด (ใช้เทียบกับ IndexedDB) */
  ts: 'pf-ts',
  /** โหมดสว่าง/มืด ('light' | 'dark') ใช้ร่วมกันทุกหน้า */
  theme: 'theme',
  /** ภาษาของหลังบ้าน/บัญชี */
  uiLang: 'pf-ui',
  /** ภาษาที่ผู้ชมเลือกบนหน้าเว็บ (เว็บสองภาษา) */
  siteLang: 'pf-lang',
  /** ภาษาที่กำลังกรอกในหลังบ้าน */
  editLang: 'pf-edlang',
  onboarding: 'pf-onb',
  fontSize: 'pf-fs',
  demoAccount: 'pf-acct-demo',
  dev: 'pf-dev',
  importLater: 'pf-imp-later',
  skillBank: 'pf-skill-bank',
  workView: 'wk-view',
} as const;

export const PORTFOLIO_KEYS = [KEYS.draft, KEYS.saved, KEYS.published] as const;
export type PortfolioKey = (typeof PORTFOLIO_KEYS)[number];

export const local = {
  get(k: string): string | null {
    try { return localStorage.getItem(k); } catch { return null; }
  },
  /** คืน false เมื่อเขียนไม่ได้ (เต็ม / ถูกบล็อก) */
  set(k: string, v: string): boolean {
    try { localStorage.setItem(k, v); return true; } catch { return false; }
  },
  remove(k: string): void {
    try { localStorage.removeItem(k); } catch {}
  },
  /** ล้างทุกคีย์ที่ขึ้นต้นด้วย prefix */
  clear(prefix: string): void {
    try { Object.keys(localStorage).forEach((k) => { if (k.startsWith(prefix)) localStorage.removeItem(k); }); } catch {}
  },
};
