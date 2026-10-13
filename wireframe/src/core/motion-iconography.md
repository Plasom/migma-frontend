# Motion · Iconography — v1 (ล็อกแล้ว 2026-10-10)

## 1. Motion — แบบ Smooth (อิง M3 standard easing)
"เร็วตอนเริ่ม นุ่มตอนจบ"

### Duration
| Token | ms | ใช้กับ |
|---|---|---|
| `duration-instant` | 100 | เปลี่ยนสีตอน hover, กดปุ่ม |
| `duration-fast` | 160 | chip, switch, checkbox, tooltip |
| `duration-base` | 240 | การ์ดลอยตอน hover, dropdown, toast |
| `duration-slow` | 360 | modal, sheet, sidebar เปิดปิด |
| `duration-page` | 480 | เปลี่ยนหน้า, hero เปิดตัว |

### Easing
| Token | ค่า | ใช้กับ |
|---|---|---|
| `ease-standard` | cubic-bezier(.2, 0, 0, 1) | ค่าเริ่มต้นของทุกอย่าง |
| `ease-enter` | cubic-bezier(0, 0, 0, 1) | ของที่โผล่เข้ามา (dropdown, modal, toast) |
| `ease-exit` | cubic-bezier(.3, 0, 1, 1) | ของที่หายออกไป |
| `ease-emphasized` | cubic-bezier(.05, .7, .1, 1) | ชิ้นใหญ่ที่อยากเน้น (hero, เปลี่ยนหน้า) |

### กติกา
- ตอนหายออก ใช้เวลาประมาณ 70% ของตอนเข้า (เช่น modal เข้า 360 ออก 240)
- ขยับด้วย `transform` และ `opacity` เท่านั้น (ลื่นและไม่กินเครื่อง)
- ระยะขยับเล็กๆ: การ์ด hover ยกขึ้น 3px, dropdown เลื่อนเข้า 8px, modal ขยายจาก 0.97 → 1
- ไม่มี animation เด้ง (overshoot) ใน UI ทั่วไป
- `prefers-reduced-motion`: ตัดการเลื่อนและขยายออก เหลือแค่ fade 100ms
- ลูกเล่นระดับหน้า (hero, เลื่อนถึง, เปลี่ยนหน้า, ภาพลอยตามเมาส์, ระลอก) แยกอยู่ที่ `patterns/motion.md` · ขอลดการเคลื่อนไหว = ไม่เล่นเลย ไม่ใช่แค่ย่อเวลา

## 2. Iconography — Material Symbols Rounded
- โหลด: `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200`
- ใน Figma: ปลั๊กอิน/ไลบรารี Material Symbols (Rounded)

| ค่า | กำหนด |
|---|---|
| ความหนา (wght) | 400 ทั่วไป · 300 สำหรับไอคอน 32px ขึ้นไป |
| แบบทึบ (FILL) | 0 ทั่วไป · **1 เมื่อเลือกอยู่ / active** (เช่น เมนูที่เลือกใน sidebar) |
| GRAD | 0 (บนพื้นเข้ม/mesh ใช้ -25 ให้เส้นไม่ดูหนา) |
| optical size (opsz) | เท่ากับขนาดไอคอน |
| ขนาด | 16 (ในข้อความเล็ก/chip) · **20 (ค่าเริ่มต้นใน UI)** · 24 (nav, ปุ่มไอคอน) · 32/40 (ภาพประกอบเล็ก) |
| สี | ใช้สีเดียวกับตัวอักษรข้างๆ · indigo เฉพาะเมนูที่เลือกอยู่ |
| ระยะห่างไอคอนกับข้อความ | 8px (`space-2`) |
| ปุ่มไอคอนอย่างเดียว | ขนาด 36/40 แต่พื้นที่กดขั้นต่ำ 44×44 และต้องมี `aria-label` |

**ห้าม:** ผสมไอคอนหลายชุดในหน้าเดียว · ใช้ไอคอนสีสถานะโดยไม่มีข้อความประกอบ
