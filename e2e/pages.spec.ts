import { expect, test } from '@playwright/test';

/* ทุกหน้าเปิดได้ ไม่มี error และหน้าเก่า *.html พาไปเส้นทางใหม่ */
const PAGES = [
  ['/site?example=1', '.hero-id', 'Phunyisa · UX/UI designer'],
  ['/site/work?example=1', '.pg-work', 'ผลงานทั้งหมด · phunyisa'],
  ['/site/case?example=1', '.pg-case', 'Banking app redesign · Case study · phunyisa'],
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
  await page.goto('/?dev=1');
  await expect(page).toHaveURL(/\/editor\?dev=1$/);
  for (const [from, to] of [['/landing-preview.html', '/site'], ['/work.html', '/site/work'], ['/case.html', '/site/case'], ['/account.html', '/account']]) {
    await page.goto(from);
    await expect(page).toHaveURL(new RegExp(to + '$'));
  }
});

test('หน้าเว็บสลับเป็นภาษาอังกฤษได้', async ({ page }) => {
  await page.goto('/site?example=1&lang=en');
  await expect(page.locator('.hero-id')).toContainText('Phunyisa');
});
