# Migma

ต้นแบบ (wireframe) ของ Migma ตัวสร้าง portfolio อยู่ในโฟลเดอร์ `wireframe/`

- `wireframe/editor.html` `landing-preview.html` `case.html` `work.html` `account.html` คือไฟล์ที่ build แล้ว เปิดในเบราว์เซอร์ได้เลย
- `wireframe/src/preview/` ซอร์สของแต่ละหน้า
- `wireframe/src/core/` design system กลาง (tokens, motion, เอกสาร component และ pattern)
- `wireframe/src/themes/portfolio/` ธีมของ portfolio (สี ตัวอักษร `theme.css`)
- `wireframe/skill/` ความรู้ด้านดีไซน์ที่ใช้คู่กับระบบ

แก้ซอร์สแล้ว build ใหม่ด้วย

```bash
sh wireframe/build.sh
```
