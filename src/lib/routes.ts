/**
 * เส้นทางของแอป · หน้า portfolio ในต้นแบบเป็นไฟล์ (landing-preview.html · work.html · case.html)
 * โค้ดหลังบ้านยังจำหน้าตัวอย่างด้วยชื่อไฟล์เดิม ("ชื่อหน้า") แล้วแปลงเป็น route ตรงนี้ที่เดียว
 */
export const ROUTES = {
  editor: '/editor',
  account: '/account',
  site: '/site',
  work: '/site/work',
  case: '/site/case',
} as const;

const PAGE_TO_ROUTE: Record<string, string> = {
  'landing-preview.html': ROUTES.site,
  'work.html': ROUTES.work,
  'case.html': ROUTES.case,
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
