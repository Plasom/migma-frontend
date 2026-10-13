# Typography — v1.1 (ฟอนต์ล็อกแล้ว, ขนาดปรับลง 2026-10-10)

## ฟอนต์
- **อังกฤษและตัวเลข:** Google Sans (Google Fonts, OFL)
- **ไทย:** Noto Sans Thai (Google Fonts, OFL)
- **CSS:** `font-family: 'Google Sans', 'Noto Sans Thai', sans-serif;`
  เบราว์เซอร์จะใช้ Google Sans กับตัวอังกฤษ และสลับไป Noto Sans Thai เมื่อเจอตัวไทยเอง
- **Figma:** ทำ text style 2 ชุด (EN = Google Sans, TH = Noto Sans Thai) ขนาดเดียวกัน
- **น้ำหนัก:** 400 Regular · 500 Medium · 600 SemiBold

## Type scale v1.1 (2026-10-10 — ลดขนาดลงทั้งชุดให้ดูเรียบขึ้น, หัวข้อเปลี่ยนจาก 600 เป็น 500)
| Token | Desktop (px) | Mobile (px) | Line-height | Weight | Letter-spacing | ใช้กับ |
|---|---|---|---|---|---|---|
| display-xl | 56 | 34 | 1.25 (มือถือ 1.3) | 500 | -0.02em | hero ประโยคใหญ่ (Sand Studio) · ไทยต้อง ≥ 1.25 |
| display-lg | 44 | 32 | 1.2 | 500 | -0.02em | หัวข้อใหญ่ / hero เดิม |
| display-md | 36 | 28 | 1.2 | 500 | -0.02em | hero รอง |
| headline-lg | 26 | 22 | 1.35 | 500 | -0.01em | หัว section |
| headline-md | 22 | 20 | 1.35 | 500 | -0.01em | ชื่อ case study |
| headline-sm | 20 | 18 | 1.4 | 500 | 0 | หัวข้อย่อย |
| title-lg | 17 | 16 | 1.45 | 500 | 0 | หัวการ์ดใหญ่ |
| title-md | 15 | 15 | 1.5 | 500 | 0 | หัวการ์ด, ชื่อเมนู |
| body-lg | 16 | 15 | 1.7 | 400 | 0 | ข้อความนำ |
| body-md | 15 | 15 | 1.7 | 400 | 0 | เนื้อความหลัก |
| body-sm | 13 | 13 | 1.6 | 400 | 0 | meta, คำอธิบาย |
| label-lg | 13 | 13 | 1.4 | 500 | 0.01em | ปุ่ม |
| label-md | 11 | 11 | 1.4 | 500 | 0.02em | chip, tag |
| label-sm | 11 | 11 | 1.4 | 400 | 0.02em | timestamp |

> v1 เดิม (ใหญ่กว่า: display 56, headline 32, body 16, หัวข้อ 600) ถูกแทนที่แล้ว

## กติกา
- เนื้อความไทย line-height ≥ 1.6 (สระบน/ล่างไม่ชนกัน)
- หัวข้อขนาดใหญ่ใส่ letter-spacing ติดลบเล็กน้อย เฉพาะภาษาอังกฤษจะเห็นผลชัด ไทยแทบไม่เปลี่ยน
- ห้ามใช้ letter-spacing บวกมากกับภาษาไทย (สระลอยจะแยกจากพยัญชนะ)
- ความกว้างบรรทัดเนื้อความไม่เกิน ~70 ตัวอักษร (ประมาณ 640–680px)
- ภาษาไทยไม่มีการเว้นวรรคระหว่างคำ ในหัวข้อใหญ่ให้ห่อคำที่ห้ามตัดด้วย `<span style="white-space:nowrap">` เช่น "ปัญหาซับซ้อน" กันคำขาดกลางบรรทัด
