# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Migma คือตัวสร้างพอร์ตโฟลิโอ · Next.js 16 (App Router) + React 19 + TypeScript · หลังบ้าน (ข้อมูล · เข้าสู่ระบบ · ไฟล์) คือ repo `../migma-backend` (Go + Fiber)
คอมเมนต์ · README · ชื่อ test เขียนเป็นภาษาไทย ให้เขียนตามแบบเดิม

## คำสั่ง

```bash
npm run dev                      # http://localhost:3000 (/ → /editor)
npm run lint && npm run typecheck
npm run build                    # ต้อง build ก่อนรัน e2e (Playwright ใช้ `npm start` ที่พอร์ต 3100)
npm run test:e2e                 # ทั้งหมด
npm run test:e2e -- editor       # เฉพาะไฟล์ e2e/editor.spec.ts
npm run test:e2e -- -g "reset"   # เฉพาะ test ที่ชื่อตรง
```

- ไม่มี unit test มีแต่ e2e (`e2e/`) ซึ่งเป็นตัวกันพังหลักตอน refactor
- e2e ต้องมีหลังบ้านรันอยู่ที่ `API_ORIGIN` (ค่าเริ่มต้น :8080) และเปิด `DEV_LOGIN=true` · test เข้าสู่ระบบด้วย `POST /auth/dev/login` (`e2e/helpers.ts`) อีเมลแยกต่อ test
- `API_ORIGIN` ถูกฝังใน rewrites ตอน build: เปลี่ยนพอร์ตหลังบ้านต้อง build ใหม่ เช่น `API_ORIGIN=http://localhost:8081 npm run build`
- `PW_CHROMIUM=<path>` ใช้ Chrome ที่ติดตั้งเองแทนของ Playwright (เครื่องนี้ไม่ได้โหลดเบราว์เซอร์ของ Playwright ไว้: `PW_CHROMIUM="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`) · Playwright ใช้ server เดิมถ้ารันอยู่แล้ว (`reuseExistingServer`) ระวังได้ build เก่า
- Chrome บน macOS: ปุ่ม End ไม่ขยับ caret ในช่อง `plaintext-only` ใน iframe ให้ใช้ `ControlOrMeta+ArrowRight`

## ภาพรวมสถาปัตยกรรม

### ที่มา: ย้ายมาจากต้นแบบ HTML แบบ 1:1
แอปแปลงมาจาก wireframe HTML (`wireframe/` — ในเครื่องอาจว่าง) โดยตั้งใจให้พฤติกรรมเหมือนเดิมทุกจุด จึงเป็นลูกผสม:
- **Shell JSX** (`features/*/…Shell.tsx`) render โครง DOM บน server
- **Engine** (client) ผูกตอน `useEffect` แล้วเติมข้อมูล/จัดการ DOM ตรงๆ แบบ imperative (สตริง HTML · `querySelector`) ไม่ใช่ React state
- ไฟล์ที่มี `// @ts-nocheck` (editor/account engine · site `template` `works-browser` `case-study` · `ui-dictionary`) คือโค้ดต้นแบบที่ยังไม่ใส่ type · ถูกยกเว้นกฎ `ban-ts-comment` ใน `eslint.config.mjs` (ถ้าเพิ่ม/เอาออกต้องแก้รายการนั้นด้วย)
- ทิศทางที่ตั้งไว้: ทยอยแยก engine เป็นคอมโพเนนต์ React ที่มี type ทีละส่วน โดยใช้ e2e คุม · id/class ใน DOM ที่ engine และ e2e อ้างถึง (`#edIf`, `#edAcctIf`, `.dg`, `data-pf` ฯลฯ) ห้ามเปลี่ยนโดยไม่ตรวจทั้งสองฝั่ง
- engine กัน React Strict Mode เรียกซ้ำด้วย `document.documentElement.dataset.pfBooted`

### สามกลุ่ม route แยก root layout
`src/app/(site)` `(editor)` `(account)` แต่ละกลุ่มมี `<html>` · CSS · head script ของตัวเอง (ไม่มี root layout ร่วม)
- `/editor` หลังบ้าน (engine ใหญ่สุด `features/editor/engine.ts`)
- `/site` `/site/work` `/site/case` ตัวอย่างพอร์ต (ข้อมูลในเครื่อง) · `/u/[slug]` (+ `/work` `/case`) เว็บสาธารณะที่ server ดึงฉบับเผยแพร่จากหลังบ้าน (`lib/published.ts`) · ทั้งสองชุดใช้ shell เดียวกัน ต่างกันที่ prop `base` และ `setSiteBase` (`ROUTES.site/work/case` เป็น getter)
- `features/site/boot.ts` คือลำดับเปิดหน้า (เลือกข้อมูล → ภาษา → `renderTemplate` → controllers) ลำดับมีผล
- `/account` (`?embed=1` = ฝังเป็น iframe ในหลังบ้าน)
- `src/lib/head-scripts.ts`: สคริปต์ inline ก่อนวาดหน้า (ธีม กันจอวาบ) ต้องเขียนเป็น ES5 ล้วนเพราะไม่ผ่าน bundler
- CSS ของแต่ละหน้า scope ด้วย `.pg-*` · design tokens ใน `styles/tokens-core.css` + `theme.css`

### หลังบ้าน ↔ ตัวอย่าง (iframe)
หลังบ้านแสดง `/site?edit=1` ใน iframe ต้นทางเดียวกัน
- ตอนโหลด หน้าตัวอย่างอ่านร่างจาก `parent.pfPreviewHandoff()` (ไม่อ่าน localStorage) · ข้อความไปมาเป็น `postMessage` ชนิด `pf:*` — สัญญาทั้งหมดอยู่ที่ `src/lib/preview/protocol.ts`
- `?still=1` = โหลดซ้ำแบบไม่มีลูกเล่นเข้าหน้า

### ข้อมูล
- ข้อมูลพอร์ต 3 ฉบับ `pf-draft` `pf-saved` `pf-published` อยู่ที่หลังบ้าน (`/api/v1/me/portfolio`) · `lib/storage/portfolio-store.ts` ให้ editor อ่าน/เขียนแบบ sync ในหน่วยความจำ แล้วทยอย PUT (debounce · `If-Match: rev`) · เขียน `pf-published` = สั่ง `POST /publish` (server คัดลอกฉบับบันทึก) · 409 = โหลดฉบับล่าสุดแล้วเรียก `onConflict` · localStorage เป็นแค่ cache
- ผู้ช่วย AI ส่วนใหญ่ยังเป็นแบบจำลอง (`genProfileText` `genWorks` `genProcess` ฯลฯ) ยกเว้นอ่าน Resume PDF (`readResume` → `genResume` · ล้มเหลว = `aiFail`) และปุ่ม ✦ ข้างช่อง (`writeText` → `aiCall` · ล้มเหลว = ป๊อปอัปขึ้น step `err`) ที่เรียกหลังบ้านจริงผ่าน `lib/ai.ts` · ล้มเหลวทุกแบบคืนเครดิตแล้วให้ลองใหม่หรือกรอกเอง · e2e `e2e/ai.spec.ts` ต้องรันกับหลังบ้านที่ไม่ได้ตั้ง `OPENROUTER_API_KEY`
- Postgres jsonb เรียง key ใหม่: เทียบข้อมูลด้วย `canon()` ใน store ไม่ใช่เทียบสตริงตรงๆ
- ไฟล์ (ภาพ · PDF · วิดีโอ) อัปโหลดผ่าน `lib/storage/media.ts` (`upTo()` ใน editor engine) แล้วเก็บแค่ URL · ห้ามใส่ data URL ลงข้อมูลพอร์ต · ภาพจาก URL ที่จะวาดลง canvas ต้องตั้ง `crossOrigin='anonymous'`
- ผู้ใช้ใหม่ = หลังบ้านยังไม่มี draft/saved → พอร์ตเปล่า (`blankPortfolio()`) แล้วถามคำถามแรกเข้า · `lib/portfolio/sample.ts` เป็นแค่ข้อความแบบร่างของผู้ช่วย AI จำลอง ไม่ใช่พอร์ตเริ่มต้น
- ชื่อคีย์ localStorage ทั้งหมดรวมที่ `KEYS` ใน `lib/storage/local.ts` · ใช้ wrapper `local` (ไม่โยน error)
- type ของพอร์ตอยู่ `lib/portfolio/types.ts` · ทุกครั้งที่โหลดต้องผ่าน `normalize()` (`model.ts`) · ข้อมูลสองภาษาเลือกด้วย `dataForLang` (`localize.ts`)

### ภาษา
- หลังบ้าน/บัญชี: TH/EN ตามคีย์ `pf-ui` · หน้าเว็บ: ภาษาตามข้อมูล/ผู้ชม (`pf-lang`, `?lang=en`)
- การแปลทำโดยแปล DOM หลัง render (`lib/i18n/dom-translator.ts` + ตารางใน `ui-dictionary.ts`) ไม่ใช่ i18n แบบ key — ข้อความใหม่ใน UI ต้องเพิ่มคำแปลในตาราง

### เส้นทางและ query สวิตช์
- โค้ดหลังบ้านยังอ้างหน้าด้วยชื่อไฟล์เดิม (`case.html?p=…`) แปลงเป็น route ที่ `lib/routes.ts` (`pageToRoute`/`routeToPage`) ที่เดียว · redirect ลิงก์ `.html` เก่าอยู่ใน `next.config.ts`
- สวิตช์ debug: `?reset=new` (ล้างพอร์ตในหลังบ้านและในเครื่องแล้วโหลดใหม่) `?reset=blank` (ทุกช่องว่าง)

### เข้าสู่ระบบ
- `next.config.ts` rewrites `/api/v1/*` และ `/auth/*` ไปหลังบ้าน (origin เดียวกัน · cookie `pf_session` · ไม่ต้องตั้ง CORS) · Google OAuth ทำที่หลังบ้าน (`/auth/google/login?callbackUrl=`)
- `src/proxy.ts` (Next 16 ใช้ชื่อ proxy แทน middleware) กัน `/editor` ด้วยการดูว่ามี cookie `pf_session` · ถูกต้องไหมหลังบ้านตัดสิน (401 → `goAccount()` ใน `lib/api.ts`)
- หน้าบัญชีรู้ว่าใครเข้าสู่ระบบจาก `GET /api/v1/me` (`AccountEngine.tsx`) · เครดิต แพ็กเกจ ราคา ใบเสร็จมาจากหลังบ้าน (`lib/billing.ts`) · `pf-acct-demo` เป็นแค่ cache ที่ editor อ่านยอด/slug (ตัวจริงที่หลังบ้าน · `credSync()` ซิงก์หลังงาน AI) · จ่ายเงินพาไป Stripe Checkout แล้วกลับ `/account?alone=1&paid=1&session_id=…` · หน้าแอดมิน `/admin` (`features/admin`) ใช้ได้เฉพาะอีเมลใน `ADMIN_EMAILS` ของหลังบ้าน · e2e `billing.spec.ts` ต้องรันหลังบ้านด้วย `ADMIN_EMAILS=admin@example.com` + `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` (ค่าปลอมได้) และตั้ง `E2E_STRIPE_WEBHOOK_SECRET` ให้ตรง
