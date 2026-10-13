# Button — v1 (2026-10-10)

สไตล์อิง **Material 3** (ทรง pill, ชั้นสีโปร่งแสงตอน hover) ใช้สีและฟอนต์ของระบบเรา
ที่มา: เทียบ 6 สไตล์ (M3, shadcn, Apple, Spotify, Instagram, Fastwork) แล้วเลือก M3

## Variants
| Variant | Light | Dark | ใช้กับ |
|---|---|---|---|
| **Filled** | bg 4C45D2 · text FFF | bg 5F57F0 · text FFF | action หลัก 1 ปุ่มต่อพื้นที่ |
| **Tonal** | bg EAE9FA · text 3E39AC | bg rgba(95,87,240,.24) · text C3BEFF | action รองที่ยังอยากให้เด่น |
| **Outlined** | border D0D5DD · text 23262E · bg FFF | border 3A3D47 · text ECEDF1 | action รอง (เส้นเทาอ่อน = แบบ A) |
| **Text** | text 4C45D2 | text A29BFF | action ที่สำคัญน้อย, ยกเลิก |
| **Ghost** | text 23262E (รอง 636875) · ไม่มีพื้น · hover bg ECEEF2 · pressed DADEE5 · selected DADEE5 | text ECEDF1 (รอง A3A8B5) · hover 2B2E37 · pressed/selected 33363F | แถบเครื่องมือ, ปุ่มไอคอน, เมนู, ปุ่มสลับมุมมอง, "ข้าม" |
| **Icon** | ทรงกลมขนาดเท่าความสูงปุ่ม · มีครบ 5 แบบ: Filled, Tonal, Outlined, Ghost (ค่าเริ่มต้นในแถบเครื่องมือ), Danger ghost · ในตารางขนาดเดียวกันต้องใช้ variant เดียวกัน | | ต้องมี aria-label |

**Ghost ต่างจาก Text:** Text = ตัวอักษร indigo ใช้เหมือนลิงก์ ("ยกเลิก", "See all") · Ghost = ตัวอักษรสีปกติ hover เป็นพื้นเทา ใช้กับเครื่องมือ
**Ghost selected (toggle):** พื้น DADEE5 (dark 33363F) + ไอคอนแบบทึบ (FILL 1) · hover D0D5DD (dark 3A3D47) · pressed C6CBD4 (dark 42464F)

### Danger
| Variant | Light | Dark | ใช้กับ |
|---|---|---|---|
| Filled danger | bg D23F4F · text FFF | bg F27380 · text 16181D | **เฉพาะ** ปุ่มยืนยันขั้นสุดท้ายใน dialog |
| Tonal danger | bg FAECED · text 972D39 | bg rgba(242,115,128,.14) · text F27380 | การ์ดแจ้งเตือน |
| Outlined danger | border EBA9B0 (แดงอ่อน) → hover border D23F4F · text D23F4F | border rgba(242,115,128,.5) → hover F27380 · text F27380 | หน้าตั้งค่า (โซนอันตราย) |
| Text danger | text D23F4F | text F27380 | ปุ่มลบในรายการ/แถว |
| Ghost danger | text D23F4F · hover FAECED · pressed F4D6D9 | text F27380 · hover rgba(242,115,128,.14) · pressed .22 | ปุ่มลบในแถบเครื่องมือ/เมนู |

### On dark surface (hero, การ์ด Mesh, ภาพ)
| Variant | ค่า | แทน |
|---|---|---|
| White filled | bg FFF · text 4C45D2 | Filled |
| Glass | bg rgba(255,255,255,.16) · border rgba(255,255,255,.22) · backdrop-filter blur(12px) · text FFF · hover .24 | Tonal |
| Outline white | border rgba(255,255,255,.55) · text FFF | Outlined |
| Text white | text FFF | Text |
| Ghost white | text FFF · hover rgba(255,255,255,.12) · pressed/selected .20 · selected+hover .28 · selected+pressed .34 | Ghost (ปุ่มไอคอนบนภาพ/hero เช่น แชร์ บันทึก ขยาย) |
- วางปุ่มฝั่ง indigo ของ Mesh เสมอ · บนภาพต้องมีชั้นไล่เงาเข้มรองใต้ตัวอักษร

> ไม่มีปุ่มสี success / warning — สีสถานะใช้กับข้อความและกล่องแจ้งเตือนเท่านั้น

## Sizes
| Size | ความสูง | padding ซ้ายขวา | ตัวอักษร | ไอคอน | gap | ใช้กับ |
|---|---|---|---|---|---|---|
| sm | 32 | 16 (Text/Ghost 10) | 13/500 | 16 | 6 | ตาราง, filter, toolbar |
| md | 36 | 20 (Text 12 · Ghost 14) | 14/500 | 18 | 6 | **ค่าเริ่มต้นส่วนเครื่องมือ** (ฟอร์ม, sidebar, dialog) |
| lg | 40 | 24 (Text 12 · Ghost 16) | 14/500 | 18 | 8 | **ค่าเริ่มต้นส่วนเนื้อหา** (การ์ด, section) |
| xl | 48 | 28 (Text 16 · Ghost 20) | 16/500 | 20 | 8 | CTA หลักใน hero ที่เดียว |
- รัศมี: full (pill) ทุกขนาด · ปุ่มไอคอน = วงกลมขนาดเท่าความสูง
- พื้นที่กดขั้นต่ำ 44×44 (sm/md ขยายพื้นที่กดด้วย pseudo-element โดยหน้าตาไม่เปลี่ยน)

## States
| State | การแสดงผล |
|---|---|
| Hover | ชั้นสี currentColor 8% ทับ (`::after`) · duration-instant 100ms |
| Pressed | ชั้นสี 14% |
| Focus-visible | วงแหวน 2px ห่าง 2px: `0 0 0 2px <page-bg>, 0 0 0 4px <สีของปุ่ม>` |
| Disabled | bg ECEEF2 · text A3A8B5 · cursor not-allowed (dark: bg 2B2E37 · text 6E7382) · ใช้ให้น้อย ถ้าทำได้ให้ปุ่มกดได้แล้วบอกเหตุผล |
| Loading | วงหมุน 14px แทนไอคอน · ข้อความเป็น "กำลัง…" · ปุ่มกว้างเท่าเดิม · กดซ้ำไม่ได้ |

## กติกาการวาง
- Filled ได้ 1 ปุ่มต่อพื้นที่ (section / dialog / การ์ด)
- กลุ่มปุ่ม: ระยะห่าง 8 (sm/md) หรือ 12 (lg/xl)
- Dialog: ปุ่มชิดขวา · ยกเลิก (Text) อยู่ซ้าย · ปุ่มหลักหรือปุ่มอันตรายอยู่ขวาสุด
- ข้อความบนปุ่ม: กริยาขึ้นก่อน สั้น 1–3 คำ เช่น "ส่งข้อความ", "ลบโปรเจกต์" ไม่ใช้ "ตกลง" / "Submit"
- ไอคอนนำหน้า (leading) เป็นค่าเริ่มต้น · ลูกศรไปต่อ (arrow_forward) วางท้าย

## เคสเพิ่มเติม
| เคส | กติกา |
|---|---|
| Full width | บนมือถือ (< 600) ปุ่มหลักใน dialog / ฟอร์ม / bottom sheet ยืดเต็มความกว้าง และเรียงแนวตั้ง ปุ่มหลักอยู่บนสุด |
| ปุ่มมีเมนู (dropdown) | ข้อความ + ไอคอน `expand_more` ท้ายปุ่ม (ใช้ Outlined หรือ Ghost) |
| ลิงก์ไปภายนอก | ไอคอน `arrow_outward` ท้ายข้อความ |
| ปุ่มคัดลอก | กดแล้วไอคอนเปลี่ยนเป็น `check` + ข้อความ "คัดลอกแล้ว" 1.5 วินาที แล้วกลับเป็นเดิม |
| Toggle | ใช้ Ghost selected (พื้น selected + ไอคอนทึบ) และ `aria-pressed` |

ทำเป็น component แยกภายหลัง: Button group / Segmented control, FAB (ยังไม่จำเป็นกับ portfolio)

## Preview
`preview/components.html` — ทุก variant, ขนาด, สถานะ, danger, on-dark, สลับ light/dark
