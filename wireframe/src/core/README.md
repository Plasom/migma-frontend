# Core — ส่วนกลางที่ใช้ทุกโปรเจกต์

Core คือโครงและพฤติกรรมที่**ไม่ขึ้นกับแบรนด์**: ระยะ, ขนาด, state, a11y, กติกา และ component ทุกตัว
แบรนด์ (สีหลัก, เทา, ฟอนต์, เงา, mesh, โลโก้) อยู่ใน `../themes/<ชื่อ>/theme.css`

```
หน้าเว็บ / แอป
  ├─ core/tokens-core.css        ← โหลดก่อน
  └─ themes/<ชื่อ>/theme.css     ← โหลดทีหลัง (ทับค่า)
```

## Token 3 tiers
| Tier | ตัวอย่าง | อยู่ที่ | กฎ |
|---|---|---|---|
| 1 · Primitive | `--gray-100`, `--indigo-500` | ธีม | ค่าดิบ ใช้ภายในไฟล์ธีมเท่านั้น |
| 2 · Semantic | `--surface`, `--muted`, `--primary`, `--text-2` | ธีมกำหนดค่า (light + dark) · core มี default ให้สถานะ/overlay | ตั้งชื่อตามหน้าที่ ไม่ใช่ตามสี |
| 3 · Component | `--btn-ghost-hover`, `--tag-bg`, `--input-ring` | core | **อ้างอิง semantic เท่านั้น** ห้าม hex / primitive · สร้างเฉพาะเมื่อ component ต้องมีค่าของตัวเอง |

ถ้า component ต้องการสีที่ยังไม่มีชื่อ semantic → เพิ่มชื่อ semantic ใหม่ใน**ทุกธีม** (และ `_template`) ก่อน ไม่ใส่ hex ใน core

## Semantic ที่ธีมต้องมี (สัญญาระหว่าง core กับธีม)
พื้น: `--background` `--surface` `--raised` `--sidebar` · ช่องเทา: `--muted` `--muted-hover` `--selected` `--selected-hover`
เส้น: `--border` `--border-control` `--border-strong` · ตัวอักษร: `--ink` `--text-2` `--text-3` `--text-disabled`
หมึก (พื้นทึบเข้ม): `--ink-hover` `--ink-pressed` `--on-ink`
แบรนด์: `--primary` `--primary-hover` `--primary-foreground` `--primary-tint` `--primary-tint-foreground` `--primary-tint-solid` (tint แบบทึบ ใช้กับของที่ซ้อนกัน เช่น avatar) `--link` `--ring` `--link-on-inverse` (ลิงก์/ปุ่มบนพื้นสีหมึก เช่น toast)
อื่นๆ: `--font-sans` `--elevation-border` `--avatar-alt`
ไม่บังคับ (core มี default): `--elevation-1..4` `--elevation-thumb` `--scrim` `--scrim-media` `--radius-*` สีสถานะ · เฉพาะบางธีม: `--mesh-*` `--logo-*`

## ไฟล์
- `tokens-core.css` — token tier 2 (default) + tier 3 ทั้งหมด, typography scale, spacing, motion
- `motion.css` + `motion.js` — ลูกเล่นการเคลื่อนไหวของหน้า portfolio (spec: `patterns/motion.md`)
- `typography.md` · `spacing-radius-layout.md` · `motion-iconography.md` — foundations ที่ใช้ร่วมกัน
- `components/` — สเปกแต่ละ component (button, input, card, chip) · ค่าสีที่เห็นในตารางเป็นค่าของธีม portfolio ใช้อ้างอิง ชื่อ token คือสิ่งที่ใช้จริง

## เริ่มโปรเจกต์ใหม่
1. คัดลอก `themes/_template/` เป็น `themes/<ชื่อโปรเจกต์>/`
2. แก้ primitive + semantic: สีหลักก่อน (`--primary*`, `--link`, `--ring`) → เทา (ถ้าต้องการโทนอื่น) → ฟอนต์ → มุม/เงา
3. **ตรวจ contrast ใหม่ทั้งสองโหมด** (ตัวอักษร 4.5:1, ขอบ/ไอคอน 3:1) โดยเฉพาะ `--primary` กับ `--primary-foreground`, `--link` บน `--surface`, `--text-2` บน `--muted`
4. ถ้าสีหลักเป็นเขียว/แดง/ส้ม ให้ขยับสีสถานะในธีมหนี (ไม่ให้ปุ่มหลักดูเหมือน error)
5. บันทึกเหตุผลลง `decisions-log.md` (ระบุชื่อธีม)
6. หน้า preview: เปลี่ยน `<link>` ธีมเป็นของโปรเจกต์ใหม่ แล้วเปิดดูทั้งสองโหมด

## ย้ายอะไรขึ้นมาไว้ใน core
ออกแบบจากโปรเจกต์จริงก่อน · เมื่อโปรเจกต์ที่สองต้องใช้ของเดิมซ้ำ ค่อยย้ายส่วนนั้นขึ้นมาเป็น core (เคสที่ยังไม่มีงานจริง เก็บเป็นความรู้ใน `04-best-practices/`)
