# Colors — v1 (ล็อกแล้ว 2026-10-10)

> ที่มาของการตัดสินใจทั้งหมดอยู่ใน `branding-color-options.md` (รอบที่ 1–12)
> ค่าเดียวกันในรูป CSS อยู่ใน `theme.css` (ธีมนี้) · สีสถานะอยู่ใน `../../core/tokens-core.css`

## แนวคิด
ขาวและเทาโทนเย็นเป็นพื้นทั้งเว็บ ใช้สีน้ำเงินคราม (indigo) แค่สีเดียวกับ UI และให้ Mesh glow เป็นจุดที่มีสีสัน
ส่วนสี Google มีแค่ใน 4 จุดของโลโก้เท่านั้น

## 1. Neutral — Cool neutral + ฟ้านิดๆ
| Token | Hex | ใช้กับ |
|---|---|---|
| `white` | FFFFFF | การ์ด, panel |
| `gray-25` | FAFBFC | พื้นเนื้อหา |
| `gray-50` | F2F3F6 | sidebar, พื้นรอบการ์ด |
| `gray-100` | ECEEF2 | hover, ช่องค้นหา, chip |
| `gray-150` | E4E7EC | เส้นขอบการ์ด, divider |
| `gray-200` | DADEE5 | เมนูที่เลือกอยู่, เส้นขอบ sidebar |
| `gray-300` | D0D5DD | เส้นขอบปุ่ม / input |
| `ink` | 23262E | ตัวอักษรหลัก |
| `text-2` | 636875 | ตัวอักษรรอง, placeholder (เดิม 676C7A ปรับให้ผ่าน contrast บนพื้นอ่อนทุกสี) |
| `text-3` / `border-strong` | 8A90A0 | เส้นขอบช่องกรอก (3.2:1), ไอคอนตกแต่ง, ข้อความ disabled — ห้ามใช้กับตัวอักษรที่ต้องอ่าน |

## 2. Accent — Indigo (สีเดียว) · ปรับ 2026-10-10: 363199 → 4C45D2
เดิม 363199 เข้มจนดูเป็นกรมท่า ปุ่มบนพื้นขาวดูหนัก จึงสว่างขึ้นเป็น 4C45D2 (363199 ยังใช้ในสูตร Mesh)

| Step | Hex | ใช้กับ |
|---|---|---|
| 50 | F4F4FC | พื้นอ่อนมาก |
| 100 | EAE9FA | chip / tint bg |
| 200 | D2D0F4 | focus ring |
| 300 | AEABEB | disabled |
| 400 | 827DE0 | — |
| **500** | **4C45D2** | ปุ่มหลัก, ลิงก์, ไอคอนของเมนูที่เลือกอยู่, จุดโลโก้ |
| 600 | 3E39AC | hover ของปุ่ม, ตัวอักษรบน tint |
| 700 | 342F8F | pressed |
| dark mode | 5F57F0 (ปุ่ม) · A29BFF (ลิงก์) | ดูหัวข้อ Dark mode |

Contrast: ขาวบน 4C45D2 = 6.8:1 · ลิงก์ 4C45D2 บน F2F3F6 = 6.1:1 · 3E39AC บน EAE9FA = 7.4:1 (ผ่าน WCAG AA)

## 3. Gradient — Mesh glow
สีในชุด: indigo 363199 · violet 6030CF · orchid AF45C4 · purple bridge 8439C6 · deep indigo 4A31B8 · raspberry E44464

| แบบ | ใช้กับ | สูตร |
|---|---|---|
| Mesh A (เข้ม) | การ์ดผลงานเด่น, hero | `radial-gradient(at 0% 0%, #363199 0, transparent 60%), radial-gradient(at 100% 100%, #E44464 0, transparent 60%), radial-gradient(at 90% 10%, #AF45C4 0, transparent 50%), #6030CF` |
| Mesh B (เข้ม, หมุนมุม) | การ์ดเข้มใบที่สอง | `radial-gradient(at 10% 100%, #363199 0, transparent 60%), radial-gradient(at 100% 0%, #E44464 0, transparent 55%), radial-gradient(at 40% 30%, #8439C6 0, transparent 55%), #4A31B8` |
| Mesh soft (Indigo mist) | การ์ดทั่วไป, ปกการ์ด, quote | `radial-gradient(at 20% 0%, #E6E5FB 0, transparent 65%), radial-gradient(at 100% 100%, #EEF1FD 0, transparent 60%), #F7F7FD` (เปลี่ยน 2026-10-10: แบบเดิมผสมชมพูแล้วดูขุ่น) |

**กติกา**
- **Mesh แบบเข้มได้ 1 จุดต่อหน้า** (การ์ดผลงานเด่น) + เกรน 9% · hero ใช้ตัวอักษรบนพื้นปกติ ไม่ใช่ mesh (ปรับตาม Hallmark audit 2026-10-10: gradient ม่วงชมพูหลายจุด = จุดสังเกตงาน AI)
- ส่วนท้ายหน้า (CTA) ใช้การ์ดขาว + ปุ่ม indigo
- ตัวอักษรบน Mesh เข้มเป็นขาว วางฝั่งซ้ายล่าง (ฝั่ง indigo)
- ถ้ามีภาพหน้าจอผลงานวางบนการ์ด ใช้ Mesh soft หรือการ์ดขาว เพื่อไม่ให้รก
- ปุ่มบนพื้น Mesh ใช้ปุ่มขาว ตัวอักษร indigo
- ปุ่มและลิงก์ทั่วไปห้ามใช้ gradient

## 4. Logo ✅ (2026-10-10)
4 จุด: indigo 4C45D2 × 3 + raspberry E44464 × 1 (จุดสุดท้าย) — ชมพูเป็นจุดจำของแบรนด์
(เดิมใช้ 4 จุดสี Google ถูกแทนที่แล้ว)

## 5. Status ✅ (2026-10-10, โทน Brand mesh)
| Role | Solid (ไอคอน, เส้น, จุด) | Strong (ปุ่ม, ตัวอักษร) | Tint bg | Tint text |
|---|---|---|---|---|
| success | 13897A | 128576 | E7F3F2 | 0E6358 |
| warning | D9782A | B26222 | FBF2EA | 9C561E |
| danger | D23F4F (Crimson) | D23F4F | FAECED | 972D39 |
| info | 4C45D2 | 4C45D2 | EAE9FA | 3E39AC |

- ตัวอักษรขาวบนปุ่ม และตัวอักษรสีสถานะบนพื้นขาว ใช้ค่า **Strong** เสมอ
- ค่า Solid ใช้กับไอคอน เส้นขอบ จุดสถานะ (ผ่าน 3:1)
- danger ใช้ Crimson D23F4F แยกจากราสเบอร์รี่ E44464 ของแบรนด์ เพื่อไม่ให้สีตกแต่งดูเหมือน error (ขาวบน D23F4F = 4.6:1 ผ่านโดยไม่ต้องมีเฉด Strong)

## 6. Dark mode ✅ (2026-10-10) — พื้น Graphite + ปุ่ม Vivid indigo
แยกชั้นด้วยความสว่าง: ยิ่งลอยสูง ยิ่งสว่าง (เงาบนพื้นมืดแทบมองไม่เห็น)

| Token | Light | Dark | ใช้กับ |
|---|---|---|---|
| background (page) | FAFBFC | 16181D | พื้นหน้า |
| sidebar | F2F3F6 | 1B1D23 | sidebar |
| surface (card) | FFFFFF | 1F2128 | การ์ด, panel |
| raised | FFFFFF | 272A32 | dropdown, modal, toast |
| muted / hover | ECEEF2 | 2B2E37 | hover, chip |
| selected | DADEE5 | 33363F | เมนูที่เลือกอยู่ |
| border | E4E7EC | 2C2F38 (หรือ rgba(255,255,255,.06) บนการ์ด) | เส้นขอบ |
| border-strong (input) | 8A90A0 | 6B7080 | เส้นขอบช่องกรอก (3.3:1) |
| ink | 23262E | ECEDF1 | ตัวอักษรหลัก |
| text-2 | 636875 | A3A8B5 | ตัวอักษรรอง (5.1:1 บน selected) |
| text-3 | 8A90A0 | 6E7382 | ตกแต่ง / disabled |
| primary (ปุ่ม) | 4C45D2 | **5F57F0** + ตัวอักษรขาว (5.1:1) | ปุ่มหลัก |
| primary hover | 3E39AC | 554DE8 | |
| link / icon active | 4C45D2 | **A29BFF** (7.3:1) | ลิงก์, ไอคอนเมนูที่เลือก, eyebrow |
| primary tint | EAE9FA / 3E39AC | rgba(95,87,240,.24) / C3BEFF | chip, badge |
| focus ring | D2D0F4 | rgba(162,155,255,.45) | |
| success | 13897A | 3CC4AF บน rgba(60,196,175,.14) | |
| warning | D9782A | F0A35E บน rgba(240,163,94,.14) | |
| danger | D23F4F | F27380 บน rgba(242,115,128,.14) | ปุ่ม danger ใช้ตัวอักษรเข้ม 16181D |
| logo dots | 4C45D2 ×3 + E44464 | A29BFF ×3 + F0708A | |
| scrim | rgba(30,26,80,.36) | rgba(5,6,12,.6) | |

**Mesh ในโหมดมืด**
- mesh-a / mesh-b: ใช้ค่าเดิม
- mesh-soft (Indigo mist): `radial-gradient(at 20% 0%, rgba(54,49,153,.55) 0, transparent 65%), radial-gradient(at 100% 100%, rgba(95,87,240,.20) 0, transparent 60%), #272A32`

**Elevation ในโหมดมืด:** เงาสีดำ + เส้นขอบขาวโปร่ง rgba(255,255,255,.06–.08)
- e1 `0 1px 2px rgba(0,0,0,.3)` · e2 `0 10px 24px -6px rgba(0,0,0,.45)` · e3 `0 14px 36px -8px rgba(0,0,0,.55)` · e4 `0 28px 72px -12px rgba(0,0,0,.7)`

ทุกคู่ผ่าน WCAG AA (ตรวจ 2026-10-10)

## 7. Contrast audit (2026-10-10, WCAG 2.1 AA)
ตรวจ 30 คู่ ผ่าน 22 ไม่ผ่าน 8 → แก้แล้วทั้งหมด
| จุด | ก่อน | หลัง |
|---|---|---|
| ปุ่ม success | ขาว/13897A 4.3 | ขาว/128576 4.52 |
| ปุ่ม warning | ขาว/D9782A 3.15 | ขาว/B26222 4.50 |
| ปุ่ม danger | ขาว/E44464 3.96 | เปลี่ยนเป็น Crimson D23F4F 4.60 |
| ตัวอักษร danger บนขาว | E44464 3.96 | D23F4F 4.60 |
| text-2 บน mesh-soft มุมชมพู | 676C7A/FCE6EA 4.41 | 636875 4.68 |
| placeholder | 8A90A0 3.19 | ใช้ text-2 636875 5.57 |
| เส้นขอบช่องกรอก | D0D5DD 1.47 | 8A90A0 3.19 |
| ตัวอักษรขาวบน mesh มุมราสเบอร์รี่ | 3.96 | กติกา: วางตัวอักษรฝั่ง indigo/violet (7.4+) |
