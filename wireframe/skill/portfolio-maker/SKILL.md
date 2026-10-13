---
name: "portfolio-maker"
description: "Use when working on the owner's portfolio maker Migma (สร้าง Portfolio: editor, account pages, landing, case study and works pages) in ~/Desktop/migma, including fixes from screenshots, user-journey findings, new blocks, copy changes, bilingual content and responsive checks."
---

# Portfolio Maker (Migma)

โหลด `design-taste-refs` ก่อนเสมอ ระบบนี้ใช้ core + ธีม `themes/portfolio/` ของ design system
อ่าน `references/design-knowledge.md` ก่อนออกแบบหรือแก้พฤติกรรม เพราะรวมการตัดสินใจที่เจ้าของเคาะแล้วและบทเรียนจากผู้ใช้จริง · pattern ที่ใช้ได้ทุกโปรเจกต์อยู่ในสกิล `design-system-studio`

## ไฟล์หลัก (`~/Desktop/migma/`)
| ไฟล์ | หน้าที่ |
|---|---|
| `src/preview/editor.html` | หลังบ้าน (แอปไฟล์เดียว) แท็บ โปรไฟล์ / ผลงาน / วิธีทำงาน / ประวัติ / ติดต่อ / ท้ายเว็บ / หน้าตา + แผง Case study + ช่องตัวอย่าง + คำถามแรกเข้า ทัวร์ แถบขั้นตอน ตรวจก่อนเผยแพร่ |
| `src/preview/account.html` | เข้าสู่ระบบ ภาพรวม สถิติ เครดิต AI การใช้ AI แพ็กเกจและใบเสร็จ ตั้งค่า (ฝังในหลังบ้านเป็น iframe) |
| `src/preview/landing-preview.html`, `work.html`, `case.html` | หน้าเว็บจริง |
| `src/preview/js/template.js` | วาดหน้าเว็บจากข้อมูล ป้ายช่องว่างตอน `?edit=1` ปุ่มภาษา ส่งข้อความหาหลังบ้าน |
| `src/preview/data/portfolio.js` | ข้อมูลตัวอย่าง `PF_NORMALIZE` `PF_DERIVE` `PF_LOC` `PF_SETLANG` พจนานุกรม `PF_EN` |
| `build.sh` | รวมไฟล์เป็น `migma/{editor,landing-preview,case,work,account}.html` **แก้ที่ `src` เท่านั้น ไฟล์รวมเป็นผลลัพธ์** |
| `CHANGES-*.md` | บันทึกทุกรอบ ท้ายไฟล์มีรายการจุดที่ยังเป็นของจำลองและต้องต่อระบบจริง |

Design system อยู่ที่ `~/Desktop/Design System/06-my-design-system/` (อ่านอย่างเดียวถ้าเซสชันเปิดที่โฟลเดอร์ migma)

## โมเดลที่ต้องเข้าใจก่อนแก้
- ข้อมูล 3 ชั้นใน localStorage: `pf-draft` → `pf-saved` → `pf-published` · บัญชีอยู่ที่ `pf-acct-demo`
- หน้าเว็บจริงซ่อนช่องที่ว่าง หลังบ้าน (`?edit=1`) แสดงป้ายเส้นประ
- ช่องตัวอย่างใช้ iframe สองอันสลับกัน ในเทสต์เลือกด้วย `.ed-frame iframe:not(.bk)` · หน้าบัญชีคือ `#edAcctIf`
- ตัวแปรหลักของหลังบ้านอยู่ใน closure เทสต์ต้องอ่านผ่าน DOM และ localStorage ไม่ใช่ตัวแปร `D`
- คำตอบคำถามแรกเข้าอยู่ที่ `D.setup` {goal, field, have, fieldText, fullCase, skipContact} ใช้เลือกชุดตั้งต้น `FP` (ตามสายงาน) และกติกาตามเป้าหมาย (`simple()`, `STU()`, `chOrd()`)
- ภาษา: `site.i18n` สองภาษา · `site.base` ภาษาแรกที่กรอกก่อน (ชุดหลัก) · ช่อง `_en` คือภาษาที่สองเสมอ · `site.only='en'` เว็บอังกฤษภาษาเดียว · ใช้ `BASE()` `ALT()` `CL()` ห้ามเช็ก `LG==='en'` ตรงๆ
- โหมด dev: `?dev=1` (เก็บ `pf-dev`) โชว์รหัสเข้าสู่ระบบ ปุ่มข้าม และสถิติจำลอง · `?reset=new` ล้างข้อมูลทั้งหมด
- ลบ ลาก ปักหมุด มีผลทันทีและย้อนได้ด้วย `snap()` + `undo()`

## ขั้นตอนทุกรอบ
1. แก้ `src/preview/*` ด้วยสคริปต์ Python ที่ assert ว่าข้อความเดิมเจอครั้งเดียวก่อนแทนที่ (เขียนสคริปต์ลงไฟล์ ใช้ heredoc แบบ `<<'EOF'`)
2. ตรวจ syntax ทุก `<script>` ด้วย `node --check` แล้วรัน `sh build.sh`
3. ทดสอบจริงในเบราว์เซอร์ (headless Chrome ผ่าน CDP ที่ `localhost:4174`): ฆ่า Chrome ตัวเก่าก่อนทุกรอบ รอโหลดอย่างน้อย 5–6 วินาทีหลัง reload และยิง `focusout` เองเพราะ headless ไม่ยิงให้
4. เปลี่ยนหน้าตาหรือเพิ่มของใหม่: วัดที่ 320 / 375 / 768 / 1024 / 1280 ทั้งสถานะปกติและสถานะมีงานยังไม่บันทึก แล้วเปิดดูภาพจริงอย่างน้อยหนึ่งภาพ
5. เพิ่มบันทึกใน `CHANGES-*.md` และอัปเดต `references/design-knowledge.md` ถ้าเจ้าของเคาะเรื่องใหม่
6. ตอบเจ้าของภาษาไทย: นำด้วยผล บอกที่มาของดีไซน์แต่ละจุด บอกตรงๆ ว่าตรวจอะไรแล้วและยังไม่ได้ตรวจอะไร ไม่บอกเวลา

## เมื่อเจ้าของส่ง screenshot หรือผลลองใช้มา
- บั๊ก: หาต้นเหตุ แก้ แล้วเขียนเทสต์กันไว้
- คำถามเชิงออกแบบ (ควร…ไหม): ให้ความเห็นตรงๆ พร้อมเหตุผลและที่มา แล้วลงมือทำทางที่แนะนำ
- ไม่มั่นใจหรือมีสองทางที่ต่างกันจริง: เสนอ 2 ทางสั้นๆ ทำทางที่แนะนำไปก่อนถ้าย้อนได้
- คำในระบบเขียนตาม `writing-thai-ui.md`: กริยานำ ไม่มีเครื่องหมายตกใจ ไม่มีคำโฆษณา บอกผลที่เกิดกับคนใช้
