import { expect, test } from '@playwright/test';
import { devLogin, emailFor } from './helpers';

/* เข้าสู่ระบบผ่านหลังบ้าน (migma-backend) */

test('ยังไม่เข้าสู่ระบบ: /editor พาไปหน้าบัญชี มีแค่ปุ่ม Google และกดแล้วไปที่หลังบ้าน', async ({ page }) => {
  await page.goto('/editor?x=1');
  await expect(page).toHaveURL(/\/account\?callbackUrl=%2Feditor%3Fx%3D1$/);
  await expect(page.locator('#lgG')).toBeVisible();
  await expect(page.locator('#lgF')).toHaveCount(0);
  const [req] = await Promise.all([
    page.waitForRequest((r) => r.url().includes('/auth/google/login')),
    page.locator('#lgG').click(),
  ]);
  expect(new URL(req.url()).searchParams.get('callbackUrl')).toBe('/editor?x=1');
});

test('เข้าสู่ระบบแล้ว: เปิด /editor ได้ และหน้าบัญชีใช้ชื่อกับอีเมลจากหลังบ้าน', async ({ page }, info) => {
  const email = emailFor(info);
  await devLogin(page, email, 'Test User');
  await page.goto('/editor');
  await expect(page).toHaveURL(/\/editor$/);
  await page.goto('/account?alone=1#settings');
  await expect(page.locator('#app')).toBeVisible();
  await expect(page.locator('#acMain')).toContainText('Test User');
  await expect(page.locator('#stE')).toHaveValue(email);
});

test('ออกจากระบบ: session ใช้ไม่ได้อีก', async ({ page }, info) => {
  await devLogin(page, emailFor(info));
  await page.goto('/account?alone=1#overview');
  await expect(page.locator('#app')).toBeVisible();
  await page.locator('#acOut').click();
  await expect(page.locator('#lg')).toBeVisible();
  expect((await page.request.get('/api/v1/me')).status()).toBe(401);
});
