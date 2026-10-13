# โครงข้อมูล portfolio (template + หลังบ้าน) — v2 (2026-10-11)

หน้า portfolio ทั้ง 3 หน้า (หน้าแรก · ผลงานทั้งหมด · case) เป็น **template** ที่วาดเนื้อหาจากข้อมูลชุดเดียว ผู้ใช้แก้ข้อมูลชุดนี้ผ่านหลังบ้าน (decisions #98)
ไฟล์: `preview/data/portfolio.js` (ข้อมูล) · `preview/js/template.js` (ตัววาด) · ใช้ใน `landing-preview.html` `work.html` `case.html`

## ฉบับข้อมูล
| ฉบับ | เก็บที่ (prototype) | ใครเห็น |
|---|---|---|
| ร่าง | `localStorage['pf-draft']` | หลังบ้าน + ตัวอย่างในหลังบ้าน (`?edit=1`) · เก็บทุกการพิมพ์ |
| บันทึก | `localStorage['pf-saved']` | กด "บันทึก" ทีละฟอร์ม (v2) · ตัวที่ถูกเผยแพร่ |
| เผยแพร่ | `localStorage['pf-published']` | หน้าเว็บปกติ · เปลี่ยนเมื่อกด "เผยแพร่" |
| ตัวอย่าง | `PORTFOLIO_DEFAULT` ในไฟล์ | ตอนยังไม่มีฉบับไหนเลย |
| คลังทักษะ | `localStorage['pf-skill-bank']` | ทักษะที่ผู้ใช้พิมพ์เอง ขึ้นเป็นตัวเลือกครั้งหน้า |

ลำดับการอ่าน: หน้าเว็บ = เผยแพร่ → ตัวอย่าง · `?edit=1` = ร่าง → บันทึก → เผยแพร่ → ตัวอย่าง · ทุกชุดผ่าน `PF_NORMALIZE` (เติมค่าเริ่ม · ใส่ `id` แบบคงที่ `w1` `p1`… · แปลง `caseId` เก่าเป็น `caseIds`)
ตอนทำแอปจริง ร่าง/เผยแพร่ย้ายไปฐานข้อมูลของแต่ละบัญชี โครงข้อมูลเหมือนเดิม

## โครง
| ส่วน | ช่อง | หมายเหตุ |
|---|---|---|
| `site` | `name` · `logo` (url) · `logoOff` (v3.4) · `year` | ชื่อในแถบเมนู + footer · มีโลโก้ = แทนจุด 4 จุด · `logoOff:true` = ไม่แสดงโลโก้/จุด เหลือแค่ชื่อ |
| `theme` | `brand` (hex) | สีเดียว → template สร้าง ramp `--brand-*` ทั้งโหมดสว่าง/มืด · ค่าเริ่ม #4C45D2 |
| `profile` | `name` `fullName` `role` `avatar` · `headline[]` (1–2 วลี) · `lede` `ledeDraft` (v3: ป้ายร่างขึ้นเฉพาะตอน `sample`) · `skills[]` (4–6) · `location` · `status` (`open`·`freelance`·`closed`) · `resume` (url) | ประสบการณ์ N ปีคำนวณจาก `experience[].start` |
| `profile.skillSets[]` (v3.4) | `id` (`g1`…) `name` `items[]` | ทักษะแยกกลุ่ม เรียงได้ทั้งกลุ่มและชิป · `profile.skills` = ทุกกลุ่มต่อกันตามลำดับ (template ใช้ตัวนี้) · ข้อมูลเก่าที่ไม่มี `skillSets` → `PF_NORMALIZE` เดาหมวดให้ (UX/UI · Coding · เครื่องมือ · อื่นๆ) ผ่าน `PF_SKILL_CAT` |
| `works[]` | `id` `title` `cat` `year` `wip` `pinned` `tags[]` `cover` `caseIds[]` | `caseIds[0]` = เรื่องหลัก (บันทึกพร้อมผลงาน) · v2: หลาย case ต่อผลงาน · case แรก = ปลายทางของการ์ด · ว่าง = กดแล้วได้โครง case จากชื่อ/หมวด/ปี/แท็ก |
| `process[]` | `id` `title` `summary` `detail` `outputs[]` | ว่าง = ซ่อนส่วนวิธีทำงาน |
| `featuredCase` | id ของ case | case ที่โชว์บนหน้าแรก (ใช้ `teaser`) |
| `experience[]` | `id` `start` (ปี ค.ศ.) `period` `title` `org` `type` `points[]` `skills[]` `related` (caseId) | |
| `education[]` | `id` `period` `degree` `org` `honors` `faculty` `gpa` `highlights[]` `skills[]` `activities[]` | |
| `contact` | `heading` · `email` · `links[]` {`id` `label` `icon` `url`} | Resume ใช้ `profile.resume` |
| `cases{id}` | `title` `sum` `cat` `tags[]` `role` `scope[]` `time` `team` `real` · `teaser` {`problem` `solution` `result` `before` `after`} · `chapters[]` {`t`, `b[]` บล็อก} | บล็อก: p · tbd · quote · ba · image · video · steps · out · links · callout · stats · ai · prompt (`case-study.md`) |
| `sample` | true/false | true = ขึ้นป้าย "ข้อมูลตัวอย่าง" |
| `sections` | `works` `process` `case` `experience` (true/false) | v2 · false = หน้าเว็บซ่อนทั้งส่วน · หลังบ้านแสดงจาง (`pf-off`) |
| `order` | `works`: `manual`·`new`·`type` · `experience` / `education`: `auto`·`asc`·`manual` | การเรียงบนหน้าเว็บ · `auto` = ใหม่สุดก่อน · `asc` = เก่าสุดก่อน (ปีจาก `start` หรือเลข 4 หลักแรกใน `period`) · v3 เพิ่ม `education` และ `asc` |

## ช่องว่าง
- หน้าเว็บจริง: ช่องว่าง (`''` · `null` · `[]`) = **ซ่อน** ช่องหรือส่วนนั้น ไม่โชว์ป้ายรอข้อมูลให้คนดู
- หลังบ้าน (`?edit=1`) และข้อมูลตัวอย่าง: ช่องว่างขึ้นป้าย "รอข้อมูล" ตรงที่มันจะอยู่ ผู้ใช้รู้ว่าต้องกรอกอะไร
- ผลลัพธ์ case ที่ไม่มีตัวเลข: ขึ้น "รอตัวเลขจริง" เสมอ ห้ามเติมตัวเลขเอง

## หลังบ้าน ↔ ตัวอย่าง (postMessage)
| ทิศ | ข้อความ | ผล |
|---|---|---|
| ตัวอย่าง → หลังบ้าน | `pf:ready` {page} · `pf:select` {section} | กดส่วนในตัวอย่าง = เปิดแท็บฟอร์มของส่วนนั้น · ลิงก์ในตัวอย่างไม่พาออกจากหน้า |
| หลังบ้าน → ตัวอย่าง | `pf:reload` · `pf:focus` {section} · `pf:cur` {section} · `pf:hl` {sel} | โหลดใหม่ (จำตำแหน่งเลื่อน) · เลื่อนไปส่วนนั้น + กรอบกะพริบ · กรอบสีแบรนด์ค้างที่ส่วนที่กำลังแก้ · กรอบเส้นประรอบจุดที่ช่องที่โฟกัสไปโผล่ (v2) |
ชื่อส่วน (`data-pf`): `profile` · `works` · `process` · `case` · `experience` · `contact`

## ลิงก์หน้า case
- `case.html?p=<caseId>&w=<workId>` = case ของผลงาน · ผลงานมี > 1 case = ตัวสลับ case
- `case.html?t=&c=&y=&tags=` = ผลงานที่ไม่มี case (โครงรอข้อมูล)
- หน้า case จริง: ช่องหัว case ที่ว่าง (สรุป · ประเภท · บทบาท · ขอบเขต · ระยะเวลา · ทีม) = ซ่อน · `?edit=1` = ป้ายรอข้อมูล
- `profile.headline` ว่างทั้งคู่ (หน้าเว็บจริง) = ไม่มีหัวข้อใหญ่ · h1 ซ่อนเป็น "ชื่อ · ตำแหน่ง"


## v3.5 (decisions #106)
| ช่อง | รูป | หมายเหตุ |
|---|---|---|
| `experience[]`, `education[]` | `from {y,m}` · `to {y,m}\|null` · `now` | `period` และ `start` คำนวณจากช่องเหล่านี้ (`PF_DERIVE`) · ข้อมูลเก่าแปลงจาก `period` ให้เอง |
| `education[]` | `level` `major` `faculty` `org` `gpa` `honors` `files[] {name,src}` | `degree` = level + major (คำนวณ) |
| `profile.years` | `{mode:'auto'\|'manual', n, types[]}` | `PF_YEARS(d)` ใช้ทั้งหลังบ้านและหน้าเว็บ |
| `workCats[]` | ชื่อหมวด | หมวดของผลงาน (`works[].cat` เลือก 1) |
| `cases[].timeN` `timeU` | ตัวเลข + หน่วย | `time` คำนวณให้ |
| บล็อก `gallery` | `{items:[{src}], cols, cap}` | บล็อก `ba` มี `before/after` ของตัวเอง (ว่าง = ใช้จาก teaser) · `links` ไอคอนและชื่อเว็บคำนวณจาก url · ทุกบล็อกมี `hint` (คำใบ้จากโครงเรื่อง) |
| `site.name`, `site.logo` | — | ไม่ใช้แล้ว: แถบเมนูใช้ `profile.name` + จุด 4 จุด |
