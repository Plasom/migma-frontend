import { createHmac } from 'node:crypto';
import { expect, test, type Page } from '@playwright/test';
import { devLogin, emailFor } from './helpers';

/* เครดิต AI · แพ็กเกจ · แอดมิน · Stripe
   ต้องรันหลังบ้านด้วย ADMIN_EMAILS=admin@example.com และ STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET ที่ขึ้นต้น sk_ / whsec_
   (ใช้ค่าปลอมได้ — test ไม่ได้ติดต่อ Stripe จริงนอกจากกรณีที่ตั้งใจให้ล้มเหลว) · ตั้ง E2E_STRIPE_WEBHOOK_SECRET ให้ตรงกับหลังบ้านเพื่อรัน test webhook */

const ADMIN = 'admin@example.com';
const hookSecret = process.env.E2E_STRIPE_WEBHOOK_SECRET;

async function adminLogin(page: Page) {
  await devLogin(page, ADMIN, 'Boss');
  const me = await (await page.request.get('/api/v1/me')).json();
  expect(me.isAdmin, 'backend must run with ADMIN_EMAILS=admin@example.com').toBe(true);
}

const BASE = `http://localhost:${process.env.PORT || 3100}`; // browser.newContext({ baseURL: BASE }) ไม่รับ baseURL จาก config
const unique = () => `e2e ${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

test('ราคาและแพ็กเกจเปิดดูได้โดยไม่ต้องเข้าสู่ระบบ', async ({ request }) => {
  const r = await request.get('/api/v1/pricing');
  expect(r.status()).toBe(200);
  const p = await r.json();
  expect(p.packages.length).toBeGreaterThan(0);
  expect(p.packages.every((x: { active: boolean }) => x.active)).toBe(true);
  expect(p.costs.map((c: { kind: string }) => c.kind)).toEqual(expect.arrayContaining(['polish', 'resume', 'tr', 'case', 'steps']));
});

test('API แอดมิน: ไม่เข้าสู่ระบบ = 401 · ผู้ใช้ทั่วไป = 403', async ({ page, request }, info) => {
  expect((await request.get('/api/v1/admin/packages')).status()).toBe(401);
  await devLogin(page, emailFor(info));
  for (const [method, path] of [['get', '/api/v1/admin/packages'], ['get', '/api/v1/admin/orders'], ['get', '/api/v1/admin/users']] as const) {
    expect((await page.request[method](path)).status(), path).toBe(403);
  }
  expect((await page.request.post('/api/v1/admin/packages', { data: { name: 'x', credits: 1, priceSatang: 5000 } })).status()).toBe(403);
  expect((await page.request.put('/api/v1/admin/costs/polish', { data: { credits: 0 } })).status()).toBe(403);
  const me = await (await page.request.get('/api/v1/me')).json();
  expect(me.isAdmin).toBe(false);
  expect(me.credits).toBe(20);
});

test('หน้า /admin: ผู้ใช้ทั่วไปเห็นว่าไม่มีสิทธิ์', async ({ page }, info) => {
  await devLogin(page, emailFor(info));
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'ไม่มีสิทธิ์เข้าหน้านี้' })).toBeVisible();
  await expect(page.getByRole('tab')).toHaveCount(0);
});

test('หน้า /admin: สร้าง แก้ ปิดขาย ลบแพ็กเกจ และลูกค้าเห็นตามที่ตั้ง', async ({ page, browser }) => {
  await adminLogin(page);
  await page.goto('/admin');
  const name = unique();
  const form = page.getByRole('form', { name: 'เพิ่มแพ็กเกจ' });

  // กรอกผิด: แจ้งเตือน ไม่สร้าง
  await form.getByLabel('ชื่อแพ็กเกจ').fill(name);
  await form.getByLabel('เครดิตที่ได้').fill('50');
  await form.getByLabel('ราคา (บาท)').fill('5');
  await form.getByRole('button', { name: 'เพิ่มแพ็กเกจ' }).click();
  await expect(page.getByRole('status')).toContainText('ราคาต้องอยู่ระหว่าง 10');
  await expect(page.getByRole('cell', { name })).toHaveCount(0);

  // สร้างจริง
  await form.getByLabel('ราคา (บาท)').fill('59.50');
  await form.getByRole('button', { name: 'เพิ่มแพ็กเกจ' }).click();
  const row = page.getByRole('row').filter({ hasText: name });
  await expect(row).toContainText('฿59.50');
  await expect(row).toContainText('เปิดขาย');

  // ลูกค้าเห็นแพ็กนี้ในหน้า pricing และหน้าเครดิต
  const buyer = await browser.newContext({ baseURL: BASE });
  const bp = await buyer.newPage();
  await bp.addInitScript(() => localStorage.setItem('pf-ui', 'th'));
  await devLogin(bp, `e2e-buyer-${Date.now()}@example.com`);
  const pricing = await (await bp.request.get('/api/v1/pricing')).json();
  expect(pricing.packages.some((p: { name: string }) => p.name === name)).toBe(true);
  await bp.goto('/account?alone=1#credits');
  await expect(bp.locator('.pk-l')).toContainText(`${50} เครดิต`);
  await expect(bp.locator('.pk-l')).toContainText('฿59.50');

  // แก้เครดิต
  await row.getByRole('button', { name: 'แก้', exact: true }).click();
  await page.getByRole('form', { name: 'แก้แพ็กเกจ' }).getByLabel('เครดิตที่ได้').fill('80');
  await page.getByRole('form', { name: 'แก้แพ็กเกจ' }).getByRole('button', { name: 'บันทึก' }).click();
  await expect(row).toContainText('80');

  // หยุดขาย → ลูกค้าไม่เห็น
  await row.getByRole('button', { name: 'หยุดขาย' }).click();
  await expect(row).toContainText('หยุดขาย');
  const after = await (await bp.request.get('/api/v1/pricing')).json();
  expect(after.packages.some((p: { name: string }) => p.name === name)).toBe(false);
  await buyer.close();

  // ลบ
  page.once('dialog', (d) => d.accept());
  await row.getByRole('button', { name: 'ลบ' }).click();
  await expect(page.getByRole('cell', { name })).toHaveCount(0);
});

test('หน้า /admin: ตั้งราคาเครดิตของงาน AI แล้วมีผลกับการหักเครดิตจริง', async ({ page, browser }) => {
  await adminLogin(page);
  await page.goto('/admin');
  await page.getByRole('tab', { name: 'ราคา AI' }).click();
  const input = page.getByLabel('เครดิต steps');
  const original = await input.inputValue();
  try {
    await input.fill('-3');
    await page.getByRole('row').filter({ has: page.getByLabel('เครดิต steps') }).getByRole('button', { name: 'บันทึก' }).click();
    await expect(page.getByRole('status')).toContainText('0 ถึง 10,000');
    await input.fill('7');
    await page.getByRole('row').filter({ has: page.getByLabel('เครดิต steps') }).getByRole('button', { name: 'บันทึก' }).click();
    await expect(page.getByRole('status')).toContainText('บันทึกราคา');

    const ctx = await browser.newContext({ baseURL: BASE });
    const u = await ctx.newPage();
    await devLogin(u, `e2e-spend-${Date.now()}@example.com`);
    const r = await u.request.post('/api/v1/me/credits/spend', { data: { kind: 'steps', note: 'e2e' } });
    expect(await r.json()).toEqual({ charged: 7, balance: 13 });
    await ctx.close();
  } finally {
    await page.request.put('/api/v1/admin/costs/steps', { data: { credits: Number(original) } });
  }
});

test('หน้า /admin: ปรับเครดิตผู้ใช้ด้วยมือ ลงประวัติของลูกค้า', async ({ page, browser }) => {
  await adminLogin(page);
  const ctx = await browser.newContext({ baseURL: BASE });
  const u = await ctx.newPage();
  const email = `e2e-grant-${Date.now()}@example.com`;
  await devLogin(u, email);

  await page.goto('/admin');
  await page.getByRole('tab', { name: 'ผู้ใช้' }).click();
  await page.getByLabel('ค้นหา').fill(email);
  await page.getByRole('button', { name: 'ค้นหา' }).click();
  await page.getByLabel(`ปรับเครดิต ${email}`).fill('30');
  await page.getByRole('button', { name: 'ปรับ', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('เหตุผล');
  await page.getByLabel(`เหตุผล ${email}`).fill('ชดเชยทดสอบ');
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'ปรับ', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('เหลือ 50 เครดิต');

  const c = await (await u.request.get('/api/v1/me/credits')).json();
  expect(c.balance).toBe(50);
  expect(c.ledger[0]).toMatchObject({ kind: 'adjust', delta: 30 });
  expect(c.ledger[0].note).toContain('ชดเชยทดสอบ');
  await ctx.close();
});

test('เครดิต: หักเมื่อใช้ เหลือไม่พอ = 402 ยอดไม่ติดลบ', async ({ page }, info) => {
  await devLogin(page, `e2e-${Date.now()}-${info.workerIndex}@example.com`);
  const spend = (kind: string, units = 1) => page.request.post('/api/v1/me/credits/spend', { data: { kind, units, note: 'e2e' } });
  expect(await (await spend('resume')).json()).toEqual({ charged: 10, balance: 10 });
  expect(await (await spend('resume')).json()).toEqual({ charged: 10, balance: 0 });
  const no = await spend('polish');
  expect(no.status()).toBe(402);
  expect((await spend('nope')).status()).toBe(400);
  const c = await (await page.request.get('/api/v1/me/credits')).json();
  expect(c.balance).toBe(0);
  expect(c.monthUsage).toEqual({ resume: 20 });
  expect(c.ledger.filter((l: { kind: string }) => l.kind === 'spend')).toHaveLength(2);
});

test('หน้าเครดิต: แสดงแพ็กเกจจากหลังบ้าน · ยอด · ประวัติ และกดจ่ายเงินแล้วแจ้งเมื่อเริ่มไม่ได้', async ({ page }, info) => {
  await page.addInitScript(() => localStorage.setItem('pf-ui', 'th'));
  await devLogin(page, `e2e-${Date.now()}-${info.workerIndex}@example.com`);
  await page.request.post('/api/v1/me/credits/spend', { data: { kind: 'tr', units: 2, note: 'แปลทดสอบ' } });
  await page.goto('/account?alone=1#credits');
  await expect(page.locator('.pk-l li')).not.toHaveCount(0);
  await expect(page.locator('#balN')).toHaveText('16');
  await expect(page.locator('.tb2').first()).toContainText('เครดิตต้อนรับ');

  // Stripe key ของ e2e เป็นค่าปลอม → สร้างหน้าจ่ายเงินไม่ได้ → ต้องแจ้งผู้ใช้ ไม่ค้างปุ่ม
  const res = page.waitForResponse('**/api/v1/me/checkout');
  await page.locator('#buy').click();
  expect((await res).status()).toBe(502);
  await expect(page.locator('#edToast')).toContainText('เริ่มจ่ายเงินไม่ได้');
  await expect(page.locator('#buy')).toBeEnabled();

  await page.goto('/account?alone=1#usage');
  await expect(page.locator('.tb2')).toContainText('แปลไทยเป็นอังกฤษ');
  await expect(page.locator('.tb2')).toContainText('−4');
});

test('Checkout: แพ็กที่ไม่มี/ผิดรูปแบบ ถูกปฏิเสธ และต้องเข้าสู่ระบบ', async ({ page, request }, info) => {
  expect((await request.post('/api/v1/me/checkout', { data: { packageId: '00000000-0000-0000-0000-000000000000' } })).status()).toBe(401);
  await devLogin(page, emailFor(info));
  const post = (data: unknown) => page.request.post('/api/v1/me/checkout', { data });
  expect((await post({ packageId: '00000000-0000-0000-0000-000000000000' })).status()).toBe(404);
  expect((await post({ packageId: 'abc' })).status()).toBe(400);
  expect((await page.request.post('/api/v1/me/checkout/confirm', { data: { sessionId: 'cs_test_nope' } })).status()).toBe(404);
});

test.describe('webhook ของ Stripe', () => {
  test.skip(!hookSecret, 'ตั้ง E2E_STRIPE_WEBHOOK_SECRET ให้ตรงกับ STRIPE_WEBHOOK_SECRET ของหลังบ้านเพื่อรัน');

  const sign = (payload: string, secret: string, t = Math.floor(Date.now() / 1000)) =>
    `t=${t},v1=${createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex')}`;
  const event = JSON.stringify({ id: 'evt_e2e', type: 'checkout.session.completed', data: { object: { id: 'cs_test_e2e', client_reference_id: '00000000-0000-0000-0000-000000000000', amount_total: 1000, currency: 'thb', payment_status: 'paid' } } });

  test('ต้องมีลายเซ็นที่ถูกต้องจึงรับ (ผ่าน rewrite ของ Next โดยเนื้อหาไม่เพี้ยน)', async ({ request }) => {
    const post = (sig?: string) => request.post('/api/v1/stripe/webhook', { data: event, headers: { 'Content-Type': 'application/json', ...(sig ? { 'Stripe-Signature': sig } : {}) } });
    expect((await post()).status()).toBe(400);
    expect((await post(sign(event, 'whsec_wrong'))).status()).toBe(400);
    expect((await post(sign(event, hookSecret!, Math.floor(Date.now() / 1000) - 3600))).status()).toBe(400);
    // ลายเซ็นถูก แต่ไม่มีคำสั่งซื้อนี้ → รับทราบ (200) ไม่ให้เครดิตใคร
    expect((await post(sign(event, hookSecret!))).status()).toBe(200);
  });
});
