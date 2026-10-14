import { expect, test } from '@playwright/test';
import { encode } from 'next-auth/jwt';

/* เข้าสู่ระบบจริง (Auth.js) · รันเมื่อ server เปิดด้วย AUTH_SECRET และ AUTH_GOOGLE_ID/SECRET (ค่าทดสอบก็ได้)
   AUTH_SECRET=x AUTH_GOOGLE_ID=x AUTH_GOOGLE_SECRET=x AUTH_TRUST_HOST=true npm run test:e2e -- auth */
const SECRET = process.env.AUTH_SECRET;
test.skip(!SECRET || !process.env.AUTH_GOOGLE_ID, 'ยังไม่ได้ตั้งค่า OAuth');

test('ยังไม่เข้าสู่ระบบ: /editor พาไปหน้าบัญชี มีแค่ปุ่ม Google และกดแล้วไปหน้า Google', async ({ page }) => {
  await page.goto('/editor?dev=1');
  await expect(page).toHaveURL(/\/account\?callbackUrl=%2Feditor%3Fdev%3D1$/);
  await expect(page.locator('#lgG')).toBeVisible();
  await expect(page.locator('#lgF')).toBeHidden();
  await expect(page.locator('#lgProto')).toBeHidden();
  const [req] = await Promise.all([
    page.waitForRequest((r) => r.url().startsWith('https://accounts.google.com/')),
    page.locator('#lgG').click(),
  ]);
  const u = new URL(req.url());
  expect(u.searchParams.get('redirect_uri')).toMatch(/\/api\/auth\/callback\/google$/);
});

test('เข้าสู่ระบบแล้ว: เปิด /editor ได้ และหน้าบัญชีใช้ชื่อจาก session', async ({ page, context, baseURL }) => {
  const name = 'authjs.session-token';
  const value = await encode({ token: { name: 'Test User', email: 'test@example.com', sub: '1' }, secret: SECRET!, salt: name });
  await context.addCookies([{ name, value, url: baseURL! }]);
  await page.goto('/editor');
  await expect(page).toHaveURL(/\/editor$/);
  await page.goto('/account?alone=1#settings');
  await expect(page.locator('#app')).toBeVisible();
  await expect(page.locator('#acMain')).toContainText('Test User');
});
