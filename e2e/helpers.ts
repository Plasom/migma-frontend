import { expect, type Page, type TestInfo } from '@playwright/test';

/* e2e ต้องมีหลังบ้าน (migma-backend) รันอยู่ที่ API_ORIGIN (ค่าเริ่มต้น :8080) และเปิด DEV_LOGIN=true */

/** อีเมลแยกต่อ test (ข้อมูลในหลังบ้านไม่ปนกัน) */
export const emailFor = (info: TestInfo) => `e2e-${info.testId}@example.com`;

/** เข้าสู่ระบบโดยไม่ผ่าน Google (POST /auth/dev/login) · cookie session ใช้ร่วมกับหน้าใน context นี้ */
export async function devLogin(page: Page, email: string, name = 'Ming') {
  const r = await page.request.post('/auth/dev/login', { data: { email, name } });
  expect(r.status(), 'backend must run with DEV_LOGIN=true').toBe(204);
}

/** slug ของบัญชีที่เข้าสู่ระบบอยู่ */
export async function mySlug(page: Page): Promise<string> {
  const r = await page.request.get('/api/v1/me');
  expect(r.ok()).toBe(true);
  return (await r.json()).slug;
}
