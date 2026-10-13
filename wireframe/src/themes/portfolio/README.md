# ธีม portfolio (Phunyisa)

ธีมแรกของระบบ ใช้กับเว็บ portfolio UX/UI
- `theme.css` — primitive + semantic ทั้งสองโหมด
- `colors.md` — พาเลตต์ เหตุผล และ contrast audit
- `branding-color-options.md`, `typography-options.md` — ประวัติตัวเลือกที่เคยเทียบ

สรุป: Cool neutral (ขาว/เทาโทนเย็น) · สีหลัก indigo `4C45D2` (มืด `5F57F0`, ลิงก์ `A29BFF`) · Mesh glow ได้ 1 จุดต่อหน้า · Google Sans + Noto Sans Thai · เงาอมคราม 60% · มุม Balanced + ปุ่ม pill · โลโก้ 3 จุด indigo + 1 จุด raspberry

## เปลี่ยนสีแบรนด์
สีแบรนด์ทั้งหมดอยู่ในบล็อก **"สีแบรนด์"** บนสุดของ `theme.css` (`--brand-*`) ที่เดียว — ปุ่ม ลิงก์ วงโฟกัส พื้นอ่อน เงา พื้นมืดหลัง dialog Mesh และจุดโลโก้ อ้างจากบล็อกนี้ทั้งหมด (decisions #93)
1. เปลี่ยน ramp `--brand-50 … 700` (โหมดสว่าง) และ `--brand-dark-*` (โหมดมืด)
2. เปลี่ยน `--brand-deep` (ใช้ย้อมเงา/Mesh) `--brand-night` `--brand-midnight` (พื้นมืดหลัง dialog) ให้เป็นโทนเข้มของสีใหม่
3. เปลี่ยน `--brand-accent` (จุดโลโก้ · ปลาย Mesh) และ `--brand-mesh-1…4` ถ้าใช้ Mesh เข้ม
4. เช็ก contrast ตามหัวบล็อก แล้วอัปเดต `colors.md`
Mesh soft คำนวณจาก `--brand-500` อัตโนมัติ ไม่ต้องแก้
