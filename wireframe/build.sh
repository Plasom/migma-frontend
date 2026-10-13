#!/bin/sh
# สร้างไฟล์ที่เปิดได้เลย (editor.html · landing-preview.html · case.html · work.html) จากซอร์สใน src/
# ใช้:  sh build.sh
cd "$(dirname "$0")/src" || exit 1
python3 scripts/bundle_preview.py --app preview/editor.html landing-preview.html case.html work.html account.html || exit 1
for p in landing-preview case work account; do python3 scripts/bundle_preview.py "preview/$p.html" >/dev/null || exit 1; done
cp preview/dist/editor.html preview/dist/landing-preview.html preview/dist/case.html preview/dist/work.html preview/dist/account.html ../
echo "build เสร็จแล้ว: editor.html landing-preview.html case.html work.html account.html"
