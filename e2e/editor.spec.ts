import { expect, test, type Page } from '@playwright/test';
import { devLogin, emailFor, mySlug } from './helpers';

const preview = (p: Page) => p.frameLocator('#edIf:not(.bk), #edIf2:not(.bk)');

/** ผู้ใช้ใหม่เปิดตัวแก้ → ตอบคำถามแรกเข้า */
async function signInAndOnboard(page: Page) {
  await page.goto('/editor');
  for (const v of ['job', 'design', 'none']) await page.locator(`.dg input[value="${v}"]`).first().check({ force: true });
  // กดถัดไปจนกล่องตั้งค่าเริ่มต้นปิด
  for (let i = 0; i < 6; i++) {
    const ok = page.locator('.dg [data-ok]').filter({ visible: true }).first();
    if (!(await ok.count())) break;
    await ok.click();
    await page.waitForTimeout(400);
  }
}

/* แต่ละ test = บัญชีใหม่ในหลังบ้าน · ?reset=new ล้างพอร์ตในหลังบ้านและในเครื่องก่อนเริ่ม */
test.beforeEach(async ({ page }, info) => {
  await devLogin(page, emailFor(info));
  await page.goto('/editor?reset=new');
  await page.waitForURL(/\/editor$/);
});

test('สมัคร → ตั้งค่า → แก้ชื่อ ตัวอย่างเปลี่ยนตาม → เผยแพร่ → หน้าเว็บแสดงข้อมูลใหม่', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await signInAndOnboard(page);

  await page.locator('[data-k="profile.name"]').first().fill('Ming Test');
  await page.locator('[data-k="profile.role"]').first().fill('UX designer');
  await expect(preview(page).locator('.hero-id')).toContainText('Ming Test');

  await page.locator('#edPub').click();
  const go = page.locator('.dg [data-ok]').filter({ visible: true }).first();
  await go.click();
  await expect(page.locator('.dg').filter({ visible: true })).toContainText('Published');

  /* หลังบ้านได้ฉบับเผยแพร่แล้ว → เว็บสาธารณะ /u/<slug> แสดงข้อมูลใหม่ */
  const slug = await mySlug(page);
  await expect.poll(async () => (await page.request.get('/api/v1/sites/' + slug)).status()).toBe(200);
  const site = await context.newPage();
  await site.goto('/u/' + slug);
  await expect(site.locator('.hero-id')).toContainText('Ming Test');
  await expect(site).toHaveTitle('Ming Test · UX designer');
  expect(errors).toEqual([]);
});

test('แก้ข้อความบนตัวอย่างโดยตรง ฟอร์มเปลี่ยนตาม', async ({ page }) => {
  await signInAndOnboard(page);
  await page.locator('[data-k="profile.name"]').first().fill('Ming Test');
  const hero = preview(page).locator('.hero-id b').first();
  await expect(hero).toHaveText('Ming Test');
  await hero.click();
  // ไปท้ายข้อความ: Chrome บน macOS ไม่ขยับ caret ด้วย End ในช่อง plaintext-only ใน iframe · ⌘→ / Ctrl+→ ใช้ได้ทุกระบบ
  await page.keyboard.press('ControlOrMeta+ArrowRight');
  await page.keyboard.type(' X');
  await expect(page.locator('[data-k="profile.name"]').first()).toHaveValue('Ming Test X');
});

test('หลังบ้านภาษาไทย (pf-ui=th)', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('pf-ui', 'th'));
  await signInAndOnboard(page);
  await expect(page.locator('nav').first()).toContainText('โปรไฟล์');
  await expect(page.locator('html')).toHaveAttribute('lang', 'th');
});

test('?reset=new ล้างข้อมูลแล้วกลับหน้า editor', async ({ page }) => {
  await signInAndOnboard(page);
  await page.goto('/editor?reset=new');
  await page.waitForURL(/\/editor$/);
  const keys = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('pf-draft') || k === 'pf-saved'));
  expect(keys).toEqual([]);
  const all = await (await page.request.get('/api/v1/me/portfolio')).json();
  expect(all).toEqual({ draft: null, saved: null, published: null });
});
