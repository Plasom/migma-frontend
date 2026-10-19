/**
 * เส้นทางของแอป · หน้า portfolio ในต้นแบบเป็นไฟล์ (landing-preview.html · work.html · case.html)
 * โค้ดหลังบ้านยังจำหน้าตัวอย่างด้วยชื่อไฟล์เดิม ("ชื่อหน้า") แล้วแปลงเป็น route ตรงนี้ที่เดียว
 */
/** ตัวอย่างในหลังบ้าน (ข้อมูลในเครื่อง) */
export const PREVIEW_BASE = '/site';
/** เว็บพอร์ตที่เผยแพร่แล้ว (ข้อมูลจากหลังบ้าน) */
export const publicBase = (slug: string) => '/u/' + encodeURIComponent(slug);

/* หน้าพอร์ตมี 2 ชุดที่หน้าตาเหมือนกัน: /site (ตัวอย่าง) และ /u/<slug> (สาธารณะ) · ตัววาดหน้าตั้งชุดที่ใช้ตอนเปิด */
let siteBase = PREVIEW_BASE;
export function setSiteBase(base: string): void { siteBase = base; }

export const ROUTES = {
  editor: '/editor',
  account: '/account',
  get site() { return siteBase; },
  get work() { return siteBase + '/work'; },
  get case() { return siteBase + '/case'; },
};

const PAGE_TO_ROUTE: Record<string, string> = {
  'landing-preview.html': PREVIEW_BASE,
  'work.html': PREVIEW_BASE + '/work',
  'case.html': PREVIEW_BASE + '/case',
  'account.html': ROUTES.account,
  'editor.html': ROUTES.editor,
};
const ROUTE_TO_PAGE: Record<string, string> = Object.fromEntries(Object.entries(PAGE_TO_ROUTE).map(([p, r]) => [r, p]));

/** "case.html?p=bank#x" → "/site/case?p=bank#x" · อย่างอื่น (ลิงก์นอก · #) คืนเดิม */
export function pageToRoute(u: string): string {
  const m = /^([a-z-]+\.html)(.*)$/.exec(u);
  return m && PAGE_TO_ROUTE[m[1]] ? PAGE_TO_ROUTE[m[1]] + m[2] : u;
}

/** "/site/case?p=bank" หรือ URL เต็ม → "case.html?p=bank" · ไม่ใช่หน้าในแอป = คืนเดิม */
export function routeToPage(href: string): string {
  let path = href;
  try {
    const u = new URL(href, typeof location !== 'undefined' ? location.href : 'http://x/');
    if (typeof location === 'undefined' || u.origin === location.origin) path = u.pathname + u.search + u.hash;
  } catch {}
  const m = /^(\/[a-z/-]*?)\/?([?#].*)?$/.exec(path);
  return m && ROUTE_TO_PAGE[m[1]] ? ROUTE_TO_PAGE[m[1]] + (m[2] || '') : href;
}
