/**
 * เปิดหน้า portfolio: เลือกข้อมูล → เลือกภาษา → วาดหน้า → ผูกสคริปต์ของหน้า → ลูกเล่นการเคลื่อนไหว
 * ลำดับเดียวกับสคริปต์ท้ายหน้าของต้นแบบ (ลำดับมีผล เช่น ปุ่มสลับธีมของ template ต้องผูกก่อน)
 */
import { trackSiteView } from '@/lib/api';
import { siteTranslator } from '@/lib/i18n/site';
import { startMotion } from '@/lib/motion/motion';
import { blankPortfolio } from '@/lib/portfolio/defaults';
import { dataForLang, resolveSiteLang } from '@/lib/portfolio/localize';
import { clone, normalize } from '@/lib/portfolio/model';
import type { Portfolio } from '@/lib/portfolio/types';
import { readHandoff } from '@/lib/preview/protocol';
import { setSiteBase } from '@/lib/routes';
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
 * เลือกชุดข้อมูล: เว็บสาธารณะ (/u/<slug>) = ฉบับเผยแพร่จากหลังบ้าน · หลังบ้าน (?edit=1) = ร่างที่กำลังแก้
 * ตัวอย่างนอกหลังบ้าน (/site) = cache ในเครื่อง · ไม่มีเลย = พอร์ตเปล่า
 * อยู่ในตัวอย่างของหลังบ้าน = ใช้ร่างในหน่วยความจำของหลังบ้านตรงๆ (ไม่อ่าน localStorage)
 */
function pickData(edit: boolean, handoff: ReturnType<typeof readHandoff>, published?: Portfolio): Portfolio {
  if (published) {
    try { return normalize(clone(published)); } catch {}
  }
  if (handoff) {
    try { return normalize(clone(handoff.data)); } catch {}
  }
  const keys = edit ? [KEYS.draft, KEYS.saved, KEYS.published] : [KEYS.published];
  for (const k of keys) {
    const s = local.get(k);
    if (s) try { return normalize(JSON.parse(s) as Portfolio); } catch {}
  }
  return normalize(blankPortfolio());
}

/** เว็บสาธารณะ: base = /u/<slug> (ลิงก์ระหว่างหน้า) · data = ฉบับเผยแพร่ */
export interface PublicSite { base: string; data: Portfolio }

export function bootSite(page: SitePage, pub?: PublicSite): void {
  if (pub) setSiteBase(pub.base);
  const edit = !pub && /[?&]edit=1/.test(location.search);
  const handoff = edit ? readHandoff() : null;
  const d0 = pickData(edit, handoff, pub?.data);
  if (handoff) document.documentElement.setAttribute('data-theme', handoff.theme);
  const lang = resolveSiteLang(d0, handoff?.lang, local.get(KEYS.siteLang));
  document.documentElement.lang = lang;
  const data = dataForLang(d0, lang);
  if (lang === 'en') siteTranslator().start();

  if (pub) {
    const slug = pub.base.replace(/^\/u\//, '').split('/')[0];
    if (slug && !edit) {
      if (typeof window !== 'undefined') {
        (window as unknown as { __migma_slug?: string }).__migma_slug = slug;
      }
      try {
        const params = new URLSearchParams(location.search);
        const to = params.get('to') || undefined;
        const device = window.innerWidth <= 640 ? 'mobile' : window.innerWidth <= 1024 ? 'tablet' : 'desktop';
        const relPath = location.pathname.startsWith(pub.base)
          ? location.pathname.slice(pub.base.length) || '/'
          : location.pathname;
        trackSiteView(slug, {
          path: relPath,
          referrer: document.referrer || '',
          device,
          to,
        });
      } catch {}
    }
  }

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
