# Input (Text field) — v1 (2026-10-10)

สไตล์ **Soft fill** — ไม่มีเส้นขอบ พื้นเทาอ่อน ตอน focus พื้นเป็นสีการ์ด + วงแหวน 2px (แบบ Linear / Vercel)
ที่มา: เทียบ 12 สไตล์ (M3 outlined/filled, shadcn, Apple, Instagram, Google Search + 6 แบบไม่มีเส้น) แล้วเลือก Soft fill

## Anatomy
label (เหนือช่องเสมอ) → ช่อง (ไอคอนนำ · ข้อความ · ไอคอน/ปุ่มท้าย) → helper / error text

## Sizes
| Size | สูง | padding ซ้ายขวา | รัศมี | ตัวอักษร | ไอคอน | ใช้กับ |
|---|---|---|---|---|---|---|
| sm | 36 | 12 | 10 | 14 | 18 | filter, ค้นหาในแถบเครื่องมือ |
| md | 40 | 14 | 12 | 15 | 20 | **ค่าเริ่มต้น** (ฟอร์มทั่วไป, sidebar) |
| lg | 44 | 16 | 12 | 15 | 20 | ฟอร์มหน้าเนื้อหา (contact) |
- Label 13/500 ห่างช่อง 6 · helper 12/400 ห่างช่อง 6 · ระหว่างฟิลด์ 16 (compact 12)

## States
| State | Light | Dark |
|---|---|---|
| Default | bg ECEEF2 · text 23262E · placeholder 636875 | bg 2B2E37 · text ECEDF1 · placeholder A3A8B5 |
| Hover | bg E4E7EC | bg 33363F |
| Focus | bg FFFFFF (สีการ์ด) + ring 2px 4C45D2 | bg 1F2128 + ring 2px A29BFF |
| Error | bg FAECED + เส้นใน 1px D23F4F · ข้อความ error D23F4F + ไอคอน `error` | bg rgba(242,115,128,.14) + เส้นใน F27380 |
| Success | ไอคอน `check_circle` 13897A ท้ายช่อง + ข้อความ 13897A | 3CC4AF |
| Disabled | bg F2F3F6 · text A3A8B5 · cursor not-allowed | bg 1B1D23 · text 6E7382 |
| Read-only | ไม่มีพื้น + เส้นใน 1px E4E7EC · มักมีปุ่มคัดลอกท้าย | เส้น rgba(255,255,255,.06) |
- transition: background 160ms ease-standard

## Types
| ประเภท | รายละเอียด |
|---|---|
| ไอคอนนำหน้า | ไอคอน 20 สี text-2 ห่างข้อความ 8 |
| Password | ปุ่มตา 28px ท้ายช่อง: `visibility` = ยังซ่อนอยู่ (กดเพื่อแสดง) → `visibility_off` = แสดงอยู่ · **สีเทา text-2 ทั้งสองสถานะ** (hover = ink) รูปไอคอนบอกสถานะพอแล้ว · สลับ type password/text · `aria-pressed` + `aria-label` "แสดงรหัสผ่าน"/"ซ่อนรหัสผ่าน" · กดแล้ว focus กลับที่ช่อง |
| Select | ไอคอน `expand_more` ท้ายช่อง · เปิดเป็น dropdown (elevation 3) |
| Prefix / suffix | ข้อความ text-2 13px เช่น `https://`, `บาท` |
| Search | ทรง pill · ไอคอน `search` นำ · แสดง shortcut ⌘K ท้าย |
| ปุ่มในช่อง | ทรง pill · ปุ่ม Filled sm (30) ชิดขวา margin -8 |
| Tags | ช่องสูงตามเนื้อหา · chip สีการ์ด มีปุ่ม `close` · พิมพ์ต่อท้ายได้ |
| Textarea | สูงขั้นต่ำ 96 · **ยืดตามข้อความอัตโนมัติ** (auto-grow) สูงสุด 480 แล้วเลื่อนในช่อง · **ลากมุมขวาล่างเพื่อขยายเองได้** (resize: vertical + ไอคอน grip) · ไม่หดเล็กกว่าที่ผู้ใช้ลากไว้ · ตัวนับตัวอักษรอยู่ขวาของ label |

## ปุ่มล้างข้อความ (Clear)
- แสดงเมื่อช่อง**มีข้อความ**เท่านั้น (ซ่อนเมื่อว่าง / disabled / read-only)
- ไอคอน `cancel` แบบทึบ 18px สี text-2 ในปุ่มกลม 24px ชิดขวา (พื้นที่กดขยายเป็น 44)
- กดแล้วล้างข้อความ + focus กลับที่ช่อง · `aria-label="ล้างข้อความ"`
- ช่องค้นหา: กด Esc ล้างได้ด้วย
- ใช้กับ: ค้นหา, ตัวกรอง, อีเมล, ชื่อ, ช่องที่มี error, **textarea** (วางมุมขวาบน ห่าง 8/14 · ช่องเผื่อ padding ขวา 44 · ล้างแล้วความสูงกลับเป็นค่าเริ่มต้น) · ไม่ใช้กับ password (ใช้ปุ่มตาแทน)
- ลำดับท้ายช่อง: ปุ่มล้าง → ไอคอนสถานะ (error/success)

## Accessibility
- ช่องไม่มีเส้นขอบ → **ต้องมี label เหนือช่องเสมอ** ห้ามใช้ placeholder แทน label
- Placeholder ใช้ text-2 (636875 บน ECEEF2 = 4.5:1)
- Error ต้องมีทั้งสี + ไอคอน + ข้อความ (ไม่สื่อด้วยสีอย่างเดียว) · ผูก `aria-describedby` กับ helper/error
- พื้นช่อง ECEEF2 ต้องวางบนพื้นขาวหรือ FAFBFC เท่านั้น (บน gray-50 F2F3F6 ใช้ fill เป็น E4E7EC)

## Copy
- Placeholder = ตัวอย่างข้อมูลจริง ("name@company.com") ไม่ใช่คำสั่ง ("กรุณากรอกอีเมล")
- Error = บอกว่าเกิดอะไร + ต้องทำอะไร ("กรอกอีเมลให้ครบ เช่น name@company.com")
