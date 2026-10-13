#!/usr/bin/env python3
"""รวม CSS และ JS ที่ลิงก์ด้วย <link rel="stylesheet" href="../..."> และ <script src="../..."> (ไฟล์ในเครื่อง) เข้าไปในหน้า HTML
ใช้เมื่อต้องส่งหน้า preview ให้คนอื่นดู หรือเปิดไฟล์เดี่ยวๆ นอกโฟลเดอร์นี้
    python3 scripts/bundle_preview.py preview/cards.html  [ไฟล์ปลายทาง]
ค่าเริ่มต้นของปลายทาง: preview/dist/<ชื่อเดิม>
ลิงก์ที่ขึ้นต้นด้วย http(s) (เช่น Google Fonts) ไม่ถูกแตะ"""
import os, re, sys

def bundle(src, dst=None):
    base = os.path.dirname(os.path.abspath(src))
    html = open(src, encoding="utf-8").read()
    def inline(m):
        href = m.group(1)
        if re.match(r"https?:|//", href):
            return m.group(0)
        path = os.path.normpath(os.path.join(base, href))
        css = open(path, encoding="utf-8").read()
        return f"<style>/* inlined: {href} */\n{css}\n</style>"
    out = re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>', inline, html)
    def inline_js(m):
        src = m.group(1)
        if re.match(r"https?:|//", src):
            return m.group(0)
        js = open(os.path.normpath(os.path.join(base, src)), encoding="utf-8").read()
        js = re.sub(r"</(script)", r"<\\/\1", js, flags=re.I)  # กันปิดแท็กก่อนเวลา
        return f"<script>/* inlined: {src} */\n{js}\n</script>"
    out = re.sub(r'<script\s+src="([^"]+)"\s*></script>', inline_js, out)
    if dst is None:
        dst = os.path.join(base, "dist", os.path.basename(src))
    os.makedirs(os.path.dirname(os.path.abspath(dst)), exist_ok=True)
    open(dst, "w", encoding="utf-8").write(out)
    return dst

def bundle_app(editor, pages, dst=None):
    """หลังบ้านไฟล์เดียว: ฝังหน้าเว็บทุกหน้า (bundle แล้ว) เป็น window.PF_PAGES · ตัวอย่างใช้ srcdoc จึงเปิดไฟล์เดียวก็ดูได้ครบ"""
    import json, tempfile
    base = os.path.dirname(os.path.abspath(editor))
    P = {}
    for pg in pages:
        tmp = tempfile.mktemp(suffix=".html")
        bundle(os.path.join(base, pg), tmp)
        P[pg] = open(tmp, encoding="utf-8").read(); os.remove(tmp)
    out = bundle(editor, dst)
    html = open(out, encoding="utf-8").read()
    data = json.dumps(P, ensure_ascii=False).replace("</", "<\\/")
    html = html.replace("</head>", "<script>window.PF_PAGES=" + data + ";</script>\n</head>", 1)
    html = re.sub(r'(<iframe id="edIf"[^>]*?)\ssrc="[^"]*"', r'\1 src="about:blank"', html, count=1)
    open(out, "w", encoding="utf-8").write(html)
    return out

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    if sys.argv[1] == "--app":   # python3 scripts/bundle_preview.py --app preview/editor.html landing-preview.html case.html work.html
        print(bundle_app(sys.argv[2], sys.argv[3:]))
    else:
        print(bundle(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None))
