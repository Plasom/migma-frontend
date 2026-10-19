# Migma

ตัวสร้างพอร์ตโฟลิโอ เขียนด้วย Next.js (App Router) + TypeScript · ข้อมูลและการเข้าสู่ระบบอยู่ที่หลังบ้าน [migma-backend](../migma-backend) (Go)

```bash
npm install
npm run dev          # http://localhost:3000 → /editor (ต้องรันหลังบ้านที่ :8080 ด้วย)
npm run build && npm start
npm run lint && npm run typecheck
npm run test:e2e     # Playwright (ต้อง build ก่อน · หลังบ้านต้องเปิด DEV_LOGIN=true)
```

## เส้นทาง

| เส้นทาง | หน้า | ไฟล์ต้นแบบเดิม |
|---|---|---|
| `/editor` (`/` พามาที่นี่) | หลังบ้าน | `editor.html` |
| `/site` | ตัวอย่างพอร์ตจากข้อมูลในเครื่อง (`?edit=1` = ตัวอย่างในหลังบ้าน) | `landing-preview.html` |
| `/site/work` | ผลงานทั้งหมด | `work.html` |
| `/site/case` | case study | `case.html` |
| `/account` (`?embed=1` = ฝังในหลังบ้าน) | บัญชี · เข้าสู่ระบบ | `account.html` |
| `/u/<slug>` `/u/<slug>/work` `/u/<slug>/case` | เว็บพอร์ตที่เผยแพร่แล้ว (สาธารณะ · ข้อมูลจากหลังบ้าน) | |

ลิงก์ `*.html` เดิมยังใช้ได้ (redirect ใน `next.config.ts`) · สวิตช์ `?reset=new` (ล้างพอร์ตในหลังบ้านและในเครื่อง) `?reset=blank` ใช้ได้เหมือนเดิม

## หลังบ้านและการเข้าสู่ระบบ

- Next ส่ง `/api/v1/*` และ `/auth/*` ต่อไปที่หลังบ้าน (`next.config.ts` rewrites · `API_ORIGIN` ค่าเริ่มต้น `http://localhost:8080`) เบราว์เซอร์จึงเห็นเป็น origin เดียว
- เข้าสู่ระบบด้วย Google ที่หลังบ้าน (`/auth/google/login`) · ได้ cookie `pf_session` · Redirect URI ที่ต้องลงทะเบียนกับ Google: `<origin ของหน้าบ้าน>/auth/google/callback`
- `/editor` ต้องมี cookie session (`src/proxy.ts`) ไม่มี = ไป `/account?callbackUrl=...` · session หมดอายุ = API ตอบ 401 แล้วพาไปหน้าบัญชี
- e2e เข้าสู่ระบบด้วย `POST /auth/dev/login` ของหลังบ้าน (`e2e/helpers.ts`) · ไม่มีเบราว์เซอร์ของ Playwright ใช้ Chrome ในเครื่องได้: `PW_CHROMIUM="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:e2e`
- เครดิต AI แพ็กเกจ และใบเสร็จในหน้าบัญชียังเป็นแบบจำลองใน localStorage (`pf-acct-demo`) · หลังบ้านยังไม่มีระบบนี้

## โครงสร้าง

```
src/
  proxy.ts             กัน /editor ให้ต้องมี cookie session
  app/                 เส้นทาง · แต่ละกลุ่ม (site) (editor) (account) มี root layout และ CSS ของตัวเอง
  components/          ชิ้นที่ใช้ร่วมกัน (HeadScript, IconFont)
  styles/              design system: tokens-core · theme · motion + CSS ของแต่ละหน้า (scope ด้วย .pg-*)
  lib/
    api.ts             เรียกหลังบ้าน (fetch · /api/v1/me · เข้า/ออกจากระบบ)
    published.ts       อ่านเว็บที่เผยแพร่ตาม slug (ฝั่ง server · ใช้ใน /u/[slug])
    portfolio/         type ของข้อมูลพอร์ต · พอร์ตเปล่า · ข้อความตัวอย่างของผู้ช่วย AI จำลอง · normalize/derive · เลือกภาษา
    storage/           ที่เก็บพอร์ต (หน่วยความจำ + หลังบ้าน + cache ใน localStorage) · อัปโหลดไฟล์ (media.ts)
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

หน้าเว็บ render โครงเป็น JSX บน server แล้วตัว engine (client) เติมข้อมูลตอนเปิด (`/u/<slug>` = ฉบับเผยแพร่จากหลังบ้าน · `/site` = cache ในเครื่อง)
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
