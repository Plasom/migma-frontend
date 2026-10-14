/**
 * เปิดหน้า portfolio: เลือกข้อมูล → เลือกภาษา → วาดหน้า → ผูกสคริปต์ของหน้า → ลูกเล่นการเคลื่อนไหว
 * ลำดับเดียวกับสคริปต์ท้ายหน้าของต้นแบบ (ลำดับมีผล เช่น ปุ่มสลับธีมของ template ต้องผูกก่อน)
 */
import { siteTranslator } from '@/lib/i18n/site';
import { startMotion } from '@/lib/motion/motion';
import { PORTFOLIO_DEFAULT } from '@/lib/portfolio/defaults';
import { dataForLang, resolveSiteLang } from '@/lib/portfolio/localize';
import { clone, normalize } from '@/lib/portfolio/model';
import type { Portfolio } from '@/lib/portfolio/types';
import { readHandoff } from '@/lib/preview/protocol';
import { KEYS, local } from '@/lib/storage/local';
import type { SitePage } from './components/SiteChrome';
import { beforeAfter } from './controllers/before-after';
import { contactFooter } from './controllers/contact-footer';
import { experienceToggle } from './controllers/experience-toggle';
import { navScroll } from './controllers/nav-scroll';
import { navSheet } from './controllers/nav-sheet';
import { processTimeline } from './controllers/process-timeline';
import { textareaAutosize } from './controllers/textarea-autosize';
import { themeToggle } from './controllers/theme-toggle';
import { caseStudy } from './engine/case-study';
import { renderTemplate } from './engine/template';
import { worksBrowser } from './engine/works-browser';

/**
 * เลือกชุดข้อมูล: หลังบ้าน (?edit=1) = ร่างที่กำลังแก้ · หน้าเว็บปกติ = ฉบับเผยแพร่ล่าสุด · ไม่มี = ตัวอย่าง
 * อยู่ในตัวอย่างของหลังบ้าน = ใช้ร่างในหน่วยความจำของหลังบ้านตรงๆ (ไม่อ่าน localStorage ซึ่งเต็มได้เมื่อมีภาพเยอะ)
 */
function pickData(edit: boolean, handoff: ReturnType<typeof readHandoff>): Portfolio {
  /* ?example=1 = ดูเว็บตัวอย่าง (ปุ่ม "ดูตัวอย่าง" ในหลังบ้าน) */
  if (/[?&]example=1/.test(location.search)) return normalize(clone(PORTFOLIO_DEFAULT));
  if (handoff) {
    try { return normalize(clone(handoff.data)); } catch {}
  }
  const keys = edit ? [KEYS.draft, KEYS.saved, KEYS.published] : [KEYS.published];
  for (const k of keys) {
    const s = local.get(k);
    if (s) try { return normalize(JSON.parse(s) as Portfolio); } catch {}
  }
  return normalize(clone(PORTFOLIO_DEFAULT));
}

export function bootSite(page: SitePage): void {
  const edit = /[?&]edit=1/.test(location.search);
  const handoff = edit ? readHandoff() : null;
  const d0 = pickData(edit, handoff);
  if (handoff) document.documentElement.setAttribute('data-theme', handoff.theme);
  const lang = resolveSiteLang(d0, handoff?.lang, local.get(KEYS.siteLang));
  document.documentElement.lang = lang;
  const data = dataForLang(d0, lang);
  if (lang === 'en') siteTranslator().start();

  const PF = renderTemplate({ data, lang, embedded: !!handoff });
  themeToggle();
  textareaAutosize();
  navSheet({ home: page === 'home' });
  if (page !== 'case') worksBrowser(PF);
  if (page !== 'work') { processTimeline(); beforeAfter(); }
  if (page === 'case') caseStudy(data, PF);
  contactFooter();
  if (page === 'home') experienceToggle();
  navScroll();
  startMotion();
}
