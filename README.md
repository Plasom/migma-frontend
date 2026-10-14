# Migma

ตัวสร้างพอร์ตโฟลิโอ เขียนด้วย Next.js (App Router) + TypeScript

```bash
npm install
npm run dev          # http://localhost:3000 → /editor
npm run build && npm start
npm run lint && npm run typecheck
npm run test:e2e     # Playwright (ต้อง build ก่อน)
```

## เส้นทาง

| เส้นทาง | หน้า | ไฟล์ต้นแบบเดิม |
|---|---|---|
| `/editor` (`/` พามาที่นี่) | หลังบ้าน | `editor.html` |
| `/site` | หน้าแรกของพอร์ต (`?edit=1` = ตัวอย่างในหลังบ้าน) | `landing-preview.html` |
| `/site/work` | ผลงานทั้งหมด | `work.html` |
| `/site/case` | case study | `case.html` |
| `/account` (`?embed=1` = ฝังในหลังบ้าน) | บัญชี | `account.html` |

ลิงก์ `*.html` เดิมยังใช้ได้ (redirect ใน `next.config.ts`) · สวิตช์ `?dev=1` `?reset=new` `?reset=blank` `?example=1` `?lang=en` ใช้ได้เหมือนเดิม

## เข้าสู่ระบบ (OAuth 2.0 · Auth.js v5)

ตั้งค่าใน `.env.local` (คัดลอกจาก `.env.example`) · ไม่ตั้งเลย = ปิดระบบเข้าสู่ระบบจริง หน้าบัญชีใช้แบบจำลองเดิม และ `/editor` เปิดได้เลย

- ผู้ให้บริการ: Google (เปิดเมื่อใส่ client id/secret) · session เป็น JWT ในคุกกี้ ยังไม่มีฐานข้อมูล
- `/editor` ต้องเข้าสู่ระบบก่อน (`src/proxy.ts`) ยังไม่เข้า = ไป `/account?callbackUrl=...` แล้วกลับมาที่เดิม
- Redirect URI ที่ต้องลงทะเบียน: `<origin>/api/auth/callback/google`
- ทดสอบโหมดเข้าสู่ระบบ: `AUTH_SECRET=x AUTH_GOOGLE_ID=x AUTH_GOOGLE_SECRET=x AUTH_TRUST_HOST=true npm run test:e2e -- auth`

## โครงสร้าง

```
src/
  auth.ts              Auth.js (ผู้ให้บริการ · session)
  proxy.ts             กัน /editor ให้ต้องเข้าสู่ระบบ
  app/                 เส้นทาง · แต่ละกลุ่ม (site) (editor) (account) มี root layout และ CSS ของตัวเอง
  components/          ชิ้นที่ใช้ร่วมกัน (HeadScript, IconFont)
  styles/              design system: tokens-core · theme · motion + CSS ของแต่ละหน้า (scope ด้วย .pg-*)
  lib/
    portfolio/         type ของข้อมูลพอร์ต · ค่าเริ่มต้น · normalize/derive · เลือกภาษา
    storage/           localStorage (pf-*) และที่เก็บพอร์ต (หน่วยความจำ + IndexedDB + localStorage)
    i18n/              ตัวแปล DOM (ใช้ทั้งหน้าเว็บ EN และหลังบ้าน EN/TH ที่ pf-ui)
    preview/           สัญญาระหว่างหลังบ้านกับ iframe ตัวอย่าง (pfPreviewHandoff + postMessage)
    motion/ routes.ts head-scripts.ts
  features/
    site/              shell JSX ของ 3 หน้า + boot.ts + controllers/ (typed) + engine/ (template · works · case)
    editor/            EditorShell + engine.ts
    account/           AccountShell + engine.ts
e2e/                   Playwright
wireframe/             ต้นแบบ HTML เดิม (ใช้อ้างอิง)
```

หน้าเว็บ render โครงเป็น JSX บน server แล้วตัว engine (client) เติมข้อมูลจาก localStorage ตอนเปิด
หลังบ้านส่งข้อมูลให้ iframe ตัวอย่างผ่าน `window.pfPreviewHandoff` (same-origin) แทนการเขียน HTML ทั้งหน้าลง srcdoc

ไฟล์ engine ที่มี `// @ts-nocheck` (editor · account · template · works-browser · case-study · ui-dictionary) ย้ายมาจากต้นแบบแบบตรงตัวเพื่อให้พฤติกรรมเหมือนเดิมทุกจุด
ขั้นต่อไปคือทยอยแยกเป็นคอมโพเนนต์ React ที่มี type ทีละส่วน โดยใช้ e2e เป็นตัวกันพัง

## ต้นแบบ (wireframe)

ต้นแบบ (wireframe) ของ Migma ตัวสร้าง portfolio อยู่ในโฟลเดอร์ `wireframe/`

- `wireframe/editor.html` `landing-preview.html` `case.html` `work.html` `account.html` คือไฟล์ที่ build แล้ว เปิดในเบราว์เซอร์ได้เลย
- `wireframe/src/preview/` ซอร์สของแต่ละหน้า
- `wireframe/src/core/` design system กลาง (tokens, motion, เอกสาร component และ pattern)
- `wireframe/src/themes/portfolio/` ธีมของ portfolio (สี ตัวอักษร `theme.css`)
- `wireframe/skill/` ความรู้ด้านดีไซน์ที่ใช้คู่กับระบบ

แก้ซอร์สแล้ว build ใหม่ด้วย

```bash
sh wireframe/build.sh
```
