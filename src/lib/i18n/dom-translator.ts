/**
 * แปลข้อความไทยบนหน้าเป็นอังกฤษ "ทั้งก้อน" ตามตาราง: ข้อความระบบเขียนเป็นไทยในโค้ด แล้วตัวนี้แปลสิ่งที่อยู่บนจอ
 * (ทั้งตอนเริ่ม และทุกครั้งที่ DOM เปลี่ยนผ่าน MutationObserver) · เนื้อหาที่ผู้ใช้พิมพ์เองไม่ถูกแตะ (ดู `skip`)
 * ใช้ร่วมกันทั้งหน้าเว็บ (site) และหลังบ้าน/บัญชี (ui)
 */
export type Translate = (text: string, deep?: boolean) => string | null;

export interface DomTranslatorOptions {
  translate: Translate;
  /** แอตทริบิวต์ที่แปลด้วย */
  attrs: string[];
  /** element ที่ห้ามแปล (เนื้อหาที่ผู้ใช้พิมพ์) */
  skip: (el: Element | null) => boolean;
  /** ป้ายของระบบที่อยู่ในบริเวณ `skip` แต่ยังต้องแปล */
  own?: (el: Element | null) => boolean;
  /** แปลงข้อความก่อนเทียบตาราง (ค่าเริ่ม: trim) */
  normalize?: (text: string) => string;
  /** ประกอบผลลัพธ์กลับเข้า text node (ค่าเริ่ม: แทนที่ส่วนที่ตรง) */
  apply?: (original: string, key: string, result: string) => string;
  /** เรียกเมื่อไม่พบคำแปล (โหมดไล่ตรวจ) */
  onMiss?: (text: string) => void;
  /** แก้ข้อความก่อนแปลเป็นกรณีพิเศษ เช่น "1 ปี" */
  special?: (node: Text, key: string) => string | null;
}

const TH = /[฀-๿]/;

export interface DomTranslator {
  /** แปลทั้ง subtree ครั้งเดียว */
  walk(root: Node): void;
  /** แปลทั้งหน้า แล้วคอยแปลส่วนที่เพิ่ม/เปลี่ยนต่อไป · คืนฟังก์ชันหยุด */
  start(root?: Element): () => void;
}

export function createDomTranslator(o: DomTranslatorOptions): DomTranslator {
  const norm = o.normalize || ((t: string) => t.trim());
  const own = o.own || (() => false);
  const sel = o.attrs.map((a) => `[${a}]`).join(',');
  const blocked = (el: Element | null) => o.skip(el) && !own(el);

  const txt = (n: Text) => {
    const v = n.nodeValue;
    if (!v || !TH.test(v) || blocked(n.parentElement)) return;
    const t = norm(v);
    let r = o.translate(t);
    const sp = o.special && o.special(n, t);
    if (sp) r = sp;
    if (!r) { o.onMiss?.(t); return; }
    if (r !== t) n.nodeValue = o.apply ? o.apply(v, t, r) : v.replace(t, r);
  };
  const att = (el: Element) => {
    for (const a of o.attrs) {
      const v = el.getAttribute(a);
      if (v && TH.test(v)) {
        const r = o.translate(norm(v));
        if (!r) o.onMiss?.('@' + v);
        else if (r !== v) el.setAttribute(a, r);
      }
    }
  };
  const walk = (root: Node) => {
    if (root.nodeType === 3) { txt(root as Text); return; }
    if (root.nodeType !== 1 || blocked(root as Element)) return;
    const el = root as Element;
    att(el);
    el.querySelectorAll(sel).forEach((x) => { if (!blocked(x)) att(x); });
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let n: Node | null;
    while ((n = w.nextNode())) txt(n as Text);
  };
  const start = (root: Element = document.documentElement) => {
    walk(root);
    const mo = new MutationObserver((ms) => {
      ms.forEach((m) => {
        if (m.type === 'characterData') txt(m.target as Text);
        else if (m.type === 'attributes') { if (!o.skip(m.target as Element)) att(m.target as Element); }
        else m.addedNodes.forEach(walk);
      });
    });
    mo.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: o.attrs });
    return () => mo.disconnect();
  };
  return { walk, start };
}
