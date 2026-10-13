# Tabs · Segmented control — v1 (2026-10-10)

**Tabs แบบ Apple** (ตัวหนังสือ + เส้นใต้บางสีหมึก) · **Segmented แบบ Apple ทรง pill** (รางเทา ช่องเท่ากัน ช่องที่เลือกพื้นลอยมีเงา)
ตัวอย่าง: `preview/components.html` § Tabs · Segmented · token: `core/tokens-core.css` § Tabs

## ใช้ตัวไหน
| ตัว | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|
| Tabs | สลับ**เนื้อหาคนละส่วน**ในหน้าเดียว | case study: ภาพรวม / Research / Design / ผลลัพธ์ |
| Segmented | สลับ**มุมมองของข้อมูลเดิม** 2–4 ตัวเลือก | กริด / รายการ · รายเดือน / รายปี · สว่าง / มืด / ตามเครื่อง |
| Filter chip (chip.md) | **กรอง**รายการ เลือกได้หลายอัน | Mobile, Web, Design system |
| Navigation | ไป**หน้าอื่น** | แถบบน (navigation.md) |
ห้ามใช้ tabs เป็นเมนูไปหน้าอื่น และห้ามใช้ segmented เกิน 4 ช่อง (ใช้ select แทน)

## Tabs
- สูง 40 · ห่างกัน 24 · ตัวอักษร 15/400 text-2 · ที่เลือก ink 500
- เส้นใต้ 2px สีหมึก ห่างจากล่าง 4 · กว้างเท่าข้อความ · **เลื่อนตาม** 240ms ease-standard (reduced-motion = ย้ายทันที)
- ไม่มีเส้นยาวใต้แถว tabs (เนื้อหาต่อจากแถวด้วยระยะ 16)
- กันตัวหนังสือขยับตอนเปลี่ยนน้ำหนัก: จองความกว้างด้วย `::after { content: attr(data-label); font-weight: 500 }`
- มือถือ / แท็บล้น: เลื่อนแนวนอนได้ (`overflow-x:auto`, ซ่อน scrollbar) · เลื่อนแท็บที่เลือกเข้ามาในจอเสมอ
- ไอคอนนำหน้าได้ (18) แต่ต้องใช้ทุกแท็บหรือไม่ใช้เลย · ตัวเลขต่อท้ายได้ เช่น "ความคิดเห็น 12" (text-2, tabular-nums)

| State | ค่า |
|---|---|
| default | text-2 |
| hover | ink |
| focus-visible | ring 2px `--focus-ring` offset 2 มุม 6 |
| active | ink ทันที |
| selected | ink 500 + เส้นใต้ |
| disabled | text-disabled · `aria-disabled` · ข้ามตอนกดลูกศร |
| loading | เนื้อหาใน panel เป็น skeleton · แท็บไม่เปลี่ยน |
| error | ข้อความใน panel "โหลดส่วนนี้ไม่ได้ ลองอีกครั้ง" + ปุ่ม · แท็บไม่เปลี่ยน |
| success | เงียบ |

## Segmented (pill)
- รางพื้น `--muted` มนสุด · padding 3 · สูง 34 · **ทุกช่องกว้างเท่ากัน** (อย่างน้อย 88) · ไม่มีเส้นคั่น
- ช่องที่เลือก: พื้น `--seg-thumb` (light: surface ขาว / dark: selected-hover) + เงา `--elevation-thumb` (ธีม portfolio: อมคราม 10% + เส้น .5px 8%) · มนสุด · **เลื่อนตาม** 240ms
- ตัวอักษร 13/400 text-2 · ที่เลือก ink 500 (ต่างทั้งพื้น สี และน้ำหนัก — พื้นขาวบนรางเทาอย่างเดียว contrast ไม่พอ)
- ไอคอนนำหน้าได้ (18) · มีแต่ไอคอนได้เมื่อความหมายชัด (กริด/รายการ) + `aria-label`
- มือถือ: กว้างเต็มแถวได้

| State | ค่า |
|---|---|
| default | text-2 |
| hover | ink (ช่องที่ยังไม่เลือก) |
| focus-visible | ring 2px รอบช่อง offset -2 |
| active | ช่องที่กดพื้น selected 50% ชั่วขณะ |
| selected | พื้นลอย + ink 500 |
| disabled | ทั้งราง 45% หรือช่องเดียว text-disabled |
| loading / error / success | ไม่มีในตัวเอง — การสลับมุมมองเกิดทันที (ข้อมูลเดิม) |

## Accessibility
- Tabs: `role="tablist"` / `tab` (`aria-selected`, `aria-controls`) / `tabpanel` (`aria-labelledby`) · ลูกศรซ้ายขวา + Home/End · Tab ออกไป panel
- Segmented: `role="radiogroup"` + `role="radio"` (`aria-checked`) หรือ `<input type="radio">` จริง · ลูกศรเลื่อน
- เปลี่ยนทันทีเมื่อกดลูกศร (automatic activation) เพราะเนื้อหาโหลดเร็ว · ถ้า panel ต้องโหลดนาน ใช้ manual (Enter ถึงเปลี่ยน)
