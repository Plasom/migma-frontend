import { expect, test } from '@playwright/test';

/* ทุกหน้าเปิดได้ ไม่มี error และหน้าเก่า *.html พาไปเส้นทางใหม่ · ยังไม่มีข้อมูล = พอร์ตเปล่า (ไม่มีข้อมูลตัวอย่าง) */
const PAGES = [
  ['/site', '.pg-home', 'Portfolio preview'],
  ['/site/work', '.pg-work', 'ผลงานทั้งหมด'],
  ['/site/case', '.pg-case', 'Case study'],
  ['/account', '#lgG', /Migma/],
] as const;

for (const [url, sel, title] of PAGES) {
  test(`เปิด ${url}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(url);
    await expect(page.locator(sel).first()).toBeVisible();
    await expect(page).toHaveTitle(title);
    expect(errors).toEqual([]);
  });
}

test('/ และไฟล์ .html เดิมพาไปเส้นทางใหม่', async ({ page }) => {
  await page.goto('/?x=1');
  await expect(page).toHaveURL(/\/(editor\?x=1|account\?callbackUrl=%2Feditor%3Fx%3D1)$/);
  for (const [from, to] of [['/landing-preview.html', '/site'], ['/work.html', '/site/work'], ['/case.html', '/site/case'], ['/account.html', '/account']]) {
    await page.goto(from);
    await expect(page).toHaveURL(new RegExp(to + '$'));
  }
});

test('เว็บพอร์ตที่ไม่มีอยู่ = 404', async ({ page }) => {
  const r = await page.goto('/u/no-such-user-e2e');
  expect(r?.status()).toBe(404);
});

test('หน้าเว็บสองภาษาเปิดเป็นภาษาอังกฤษได้', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('pf-published', JSON.stringify({
      version: 1, site: { name: '', i18n: true, lang: 'en', base: 'th' }, theme: { brand: '#4C45D2' },
      profile: { name: 'Ming', name_en: 'Ming', role: '', headline: ['', ''], skills: [], skillSets: [] },
      works: [], process: [], experience: [], education: [], contact: { heading: '', email: '', links: [] }, cases: {},
    }));
  });
  await page.goto('/site');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.hero-id')).toContainText('Ming');
});
