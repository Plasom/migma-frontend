import { expect, test, type Page } from '@playwright/test';
import { devLogin, emailFor } from './helpers';

/* AI อ่าน Resume: หลังบ้านเรียก OpenRouter · e2e ไม่ใช้ key จริง
   - AI ใช้ไม่ได้: ใช้หลังบ้านจริงที่ไม่ได้ตั้ง OPENROUTER_API_KEY (ตอบ 503)
   - AI อ่านสำเร็จ: ดักคำขอที่เบราว์เซอร์ แล้วตอบผลตัวอย่างแทนหลังบ้าน */

const pdf = { name: 'resume.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.7\n1 0 obj<<>>endobj\n%%EOF\n') };

async function onboard(page: Page) {
  await page.goto('/editor');
  for (const v of ['job', 'design', 'none']) await page.locator(`.dg input[value="${v}"]`).first().check({ force: true });
  for (let i = 0; i < 6; i++) {
    const ok = page.locator('.dg [data-ok]').filter({ visible: true }).first();
    if (!(await ok.count())) break;
    await ok.click();
    await page.waitForTimeout(400);
  }
  await page.keyboard.press('Escape'); // ปิดทัวร์แนะนำ (ถ้ามี)
}

async function chooseResume(page: Page) {
  await page.evaluate(() => document.getElementById('edNavAI')!.click());
  const chooser = page.waitForEvent('filechooser');
  await page.locator('.hub-o[data-src="resume"]').click();
  await (await chooser).setFiles(pdf);
}

const coins = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem('pf-acct-demo') || '{}').coins as number);

test.beforeEach(async ({ page }, info) => {
  await devLogin(page, emailFor(info));
  await page.goto('/editor?reset=new');
  await page.waitForURL(/\/editor$/);
  await page.evaluate(() => localStorage.setItem('pf-ui', 'th'));
});

test('AI ใช้ไม่ได้: แจ้งเหตุผล คืนเครดิต และไม่แตะข้อมูลเดิม', async ({ page }) => {
  await onboard(page);
  const before = await coins(page);
  const res = page.waitForResponse('**/api/v1/me/ai/resume');
  await chooseResume(page);
  expect((await res).status(), 'backend must run without OPENROUTER_API_KEY').toBe(503);
  const alert = page.locator('.ai-fail[role="alert"]');
  await expect(alert).toBeVisible();
  await expect(alert).toContainText('ใช้ AI อ่านไฟล์ไม่ได้');
  await expect(alert).toContainText('ไม่เสียเครดิต');
  expect(await coins(page)).toBe(before);
  // ปุ่มรองให้กรอกเอง → ปิดกล่อง
  await page.locator('.bg-f [data-x]').click();
  await expect(alert).toHaveCount(0);
});

test('AI อ่านสำเร็จ: ติ๊กแล้วใส่ชื่อ ทักษะ ประวัติงาน ลงฟอร์ม', async ({ page }) => {
  await page.route('**/api/v1/me/ai/resume', (r) => r.fulfill({
    contentType: 'application/json',
    body: JSON.stringify({ model: 'google/gemini-3.5-flash-lite', resume: {
      name: 'มิ้ง', fullName: 'มิ้ง ใจดี', role: 'UX Designer', location: 'เชียงใหม่', email: 'ming@example.com', phone: '',
      headline: ['ออกแบบแอป', 'ให้ใช้ง่าย'], lede: 'UX designer 4 ปี ถนัดงานวิจัยผู้ใช้', skills: ['Figma', 'User research'],
      experience: [{ title: 'UX Designer', org: 'ACME', type: 'งานประจำ', fromYear: 2022, fromMonth: 3, toYear: null, toMonth: null, now: true, points: ['ออกแบบแอปธนาคาร'] }],
      education: [{ level: 'ปริญญาตรี', major: 'วิทยาการคอมพิวเตอร์', faculty: '', org: 'มหาวิทยาลัยเชียงใหม่', gpa: '', honors: '', fromYear: 2016, toYear: 2020 }],
      // ได้แค่ชื่อผู้ใช้: แพลตฟอร์มที่รู้จัก = ประกอบเป็นลิงก์ · ไม่รู้ว่าที่ไหน = ไม่ใส่
      links: [{ label: 'LinkedIn', url: 'linkedin.com/in/ming' }, { label: 'github', url: 'Homiez09' }, { label: 'Portfolio', url: 'myname' }],
    } }),
  }));
  await onboard(page);
  await chooseResume(page);
  await expect(page.locator('.pk')).toHaveCount(7);
  await expect(page.locator('#pkB')).toContainText('มิ้ง · UX Designer');
  await expect(page.locator('.dg-d')).not.toContainText('ข้อความตัวอย่าง');
  await page.locator('#pkGo').click();
  await expect(page.locator('[data-k="profile.name"]')).toHaveValue('มิ้ง');
  await expect(page.locator('[data-k="profile.role"]')).toHaveValue('UX Designer');
  // ร่างถูกเขียนลงเครื่องแบบหน่วงเวลา (debounce) จึงรอจนมีงานที่ใส่
  const draft = () => page.evaluate(() => JSON.parse(localStorage.getItem('pf-draft') || '{}'));
  await expect.poll(async () => ((await draft()).experience || []).length).toBeGreaterThan(0);
  const d = await draft();
  expect(d.experience.some((j: { org: string; now: boolean }) => j.org === 'ACME' && j.now)).toBe(true);
  expect(d.education.some((j: { org: string }) => j.org === 'มหาวิทยาลัยเชียงใหม่')).toBe(true);
  expect(d.contact.email).toBe('ming@example.com');
  const links = d.contact.links as { label: string; url: string }[];
  expect(links.some((l) => l.label === 'LinkedIn')).toBe(true);
  expect(links.some((l) => l.label === 'GitHub' && l.url === 'github.com/Homiez09')).toBe(true);
  expect(links.some((l) => l.url === 'myname')).toBe(false);
});

/* ปุ่ม ✦ ข้างช่อง: เขียน/เกลาข้อความผ่านหลังบ้าน (POST /api/v1/me/ai/write) */
test('✦ ข้างช่อง AI ใช้ไม่ได้: แจ้งในป๊อปอัป คืนเครดิต และให้เขียนเอง', async ({ page }) => {
  await onboard(page);
  const before = await coins(page);
  await page.locator('.ai-in[data-kind="lede"]').click();
  const res = page.waitForResponse('**/api/v1/me/ai/write');
  await page.locator('.aipop .fc[data-aireq]').first().click();
  expect((await res).status(), 'backend must run without OPENROUTER_API_KEY').toBe(503);
  await expect(page.locator('.aipop .ai-fail[role="alert"]')).toBeVisible();
  expect(await coins(page)).toBe(before);
  await page.locator('.aipop [data-aipx]').last().click();
  await expect(page.locator('.aipop')).toHaveCount(0);
});

test('✦ ข้างช่อง AI ตอบสำเร็จ: ส่งข้อความเดิม คำขอ และบริบท แล้วใส่แบบที่เลือกลงช่อง', async ({ page }) => {
  const sent: Record<string, unknown>[] = [];
  await page.route('**/api/v1/me/ai/write', (r) => {
    sent.push(r.request().postDataJSON());
    return r.fulfill({ contentType: 'application/json', body: JSON.stringify({ model: 'm', options: [['ทำแอปให้ใช้ง่าย'], ['ออกแบบจากผู้ใช้จริง'], ['งานจริง ผลจริง']] }) });
  });
  await onboard(page);
  await page.locator('[data-k="profile.role"]').fill('UX Designer');
  await page.locator('.ai-in[data-kind="lede"]').click();
  await page.locator('.aipop .fc[data-aireq]').first().click();
  await expect(page.locator('.aipop [data-aipick]')).toHaveCount(3);
  // ขอแบบอื่น: ส่งแบบที่เสนอไปแล้วให้ AI หลบ
  await page.locator('.aipop .fc[data-aireq="ขอแบบอื่น"]').click();
  await expect(page.locator('.aipop [data-aipick]')).toHaveCount(3);
  expect(sent[0]).toMatchObject({ kind: 'lede', lang: 'th', avoid: [] });
  expect(String(sent[0].context)).toContain('ตำแหน่ง: UX Designer');
  expect(sent[1].avoid).toEqual(['ทำแอปให้ใช้ง่าย', 'ออกแบบจากผู้ใช้จริง', 'งานจริง ผลจริง']);
  await page.locator('.aipop [data-aipick="1"]').click();
  await expect(page.locator('[data-k="profile.lede"]')).toHaveValue('ออกแบบจากผู้ใช้จริง');
});

test('AI สกัดผลงานจากไฟล์: แสดง dialog คำนวณเครดิต และสกัดหลายโปรเจกต์พร้อมรูปภาพ', async ({ page }) => {
  await page.route('**/api/v1/me/ai/works', (r) => {
    return r.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        works: [
          {
            title: 'KANOK Tailor Management',
            sum: 'ระบบจัดการร้านตัดสูทและวัดตัวออนไลน์',
            cat: 'Web app',
            year: 2024,
            tags: ['React', 'Figma', 'UX/UI'],
            role: 'Lead UX/UI Designer',
            team: '3 คน',
            scope: ['UX Research', 'Design System'],
            problem: 'ลูกค้าวัดตัวผิดบ่อย',
            solution: 'ทำ 3D visual guide',
            result: 'ลดข้อผิดพลาดลง 45%',
            cover: 'https://storage.migma.site/cover1.jpg',
            images: ['https://storage.migma.site/cover1.jpg', 'https://storage.migma.site/shot1.jpg'],
            chapters: [
              { title: 'Research & Problem', text: 'สัมภาษณ์ช่างตัดเสื้อ 5 คน', items: ['วัดตัวผิดพลาดบ่อย', 'แบบฟอร์มกระดาษหาย'] }
            ]
          },
          {
            title: 'Event Booking System',
            sum: 'แพลตฟอร์มจองบัตรคอนเสิร์ตและอีเวนต์',
            cat: 'Mobile app',
            year: 2023,
            tags: ['Mobile', 'Flutter'],
            role: 'UI Designer',
            team: '5 คน',
            scope: ['UI Design'],
            problem: 'คิวล่มตอนเปิดขายบัตร',
            solution: 'ระบบ Waiting Room',
            result: 'รองรับผู้ใช้พร้อมกัน 50,000 คน',
            cover: 'https://storage.migma.site/cover2.jpg',
            images: ['https://storage.migma.site/cover2.jpg'],
            chapters: [
              { title: 'Overview', text: 'ระบบจองตั๋วแบบเรียลไทม์', items: [] }
            ]
          }
        ]
      })
    });
  });

  await onboard(page);
  // ไปแท็บผลงาน
  await page.locator('[data-tab="works"]').click();
  // กดปุ่ม "เพิ่มจากไฟล์"
  const chooser = page.waitForEvent('filechooser');
  await page.locator('[data-doc="works"]').click();
  await (await chooser).setFiles(pdf);

  // ตรวจสอบ confirmation modal ปรากฏขึ้นพร้อมคำนวณเครดิต
  await expect(page.locator('.wk-cf-box')).toBeVisible();
  await expect(page.locator('#dgT')).toContainText('ให้ AI สกัดผลงานจากไฟล์');
  await expect(page.locator('#wkCrCost')).toContainText('เครดิต');

  // ปรับ stepper
  await page.locator('#wkStInc').click();
  // กดเริ่มสร้าง
  await page.locator('#wkGo').click();

  // ตรวจสอบ pickDlg แสดงรายการ 2 ชิ้นพร้อม cover image
  await expect(page.locator('.pk')).toHaveCount(2);
  await expect(page.locator('#pkB')).toContainText('KANOK Tailor Management');
  await expect(page.locator('#pkB')).toContainText('Event Booking System');
  await expect(page.locator('.pk-cover img')).toHaveCount(2);

  // กดใส่ส่วนที่เลือก
  await page.locator('#pkGo').click();

  // ตรวจสอบว่ามีงานถูกเพิ่มเข้ามา 2 ชิ้นใน draft
  const draft = () => page.evaluate(() => JSON.parse(localStorage.getItem('pf-draft') || '{}'));
  await expect.poll(async () => ((await draft()).works || []).length).toBe(2);
  const d = await draft();
  expect(d.works[0].title).toBe('KANOK Tailor Management');
  expect(d.works[0].cover).toBe('https://storage.migma.site/cover1.jpg');
  expect(d.works[1].title).toBe('Event Booking System');
});
