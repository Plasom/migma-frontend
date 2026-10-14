/**
 * ที่เก็บข้อมูลพอร์ต (ร่าง · ฉบับบันทึก · ฉบับเผยแพร่) เก็บ 3 ที่
 * - หน่วยความจำ: ตัวอย่างในหลังบ้านอ่านจากตรงนี้ (ผ่าน preview handoff) ไม่ต้องรอเขียนลงเครื่อง
 * - IndexedDB `pf-store` / `kv`: ที่เก็บหลักในเครื่อง ไม่ติดเพดาน 5 MB ของ localStorage จึงใส่ภาพได้เยอะ
 * - localStorage: เก็บด้วยเท่าที่ใส่ได้ ให้หน้าเว็บ (/site) อ่านได้ · เต็มก็ไม่เป็นไร ข้อมูลยังอยู่ใน IndexedDB
 *
 * ตอนต่อ backend จริง: แทนไฟล์นี้ไฟล์เดียว (API เดิม: read · write · hydrate · resetAll)
 */
import { KEYS, PORTFOLIO_KEYS, local, type PortfolioKey } from './local';

const DB = 'pf-store';
const OS = 'kv';

let mem: Partial<Record<PortfolioKey, string>> = {};
let idb: IDBDatabase | null = null;
let queue: [string, string | null][] = [];
let lsFull = false;
let started = false;

function idbSet(k: string, v: string | null) {
  if (!idb) { queue.push([k, v]); return; }
  try {
    const st = idb.transaction(OS, 'readwrite').objectStore(OS);
    if (v == null) st.delete(k); else st.put(v, k);
  } catch {}
}

/** โหลดชุดที่อยู่ใน localStorage ขึ้นหน่วยความจำ (เรียกครั้งแรกที่ใช้) */
function init() {
  if (started || typeof window === 'undefined') return;
  started = true;
  PORTFOLIO_KEYS.forEach((k) => { const v = local.get(k); if (v) mem[k] = v; });
}

export const portfolioStore = {
  /** ข้อความ JSON ของฉบับนั้น (null = ยังไม่มี) */
  read(k: PortfolioKey): string | null {
    init();
    return mem[k] || null;
  },
  /** เขียนฉบับ: หน่วยความจำ + localStorage (ถ้าใส่ได้) + IndexedDB · คืน false เมื่อเก็บไม่ได้เลย */
  write(k: PortfolioKey, json: string): boolean {
    init();
    mem[k] = json;
    const ok = local.set(k, json);
    if (!ok) { local.remove(k); lsFull = true; }
    const ts = String(Date.now());
    if (ok) local.set(KEYS.ts, ts);
    idbSet(k, json);
    idbSet(KEYS.ts, ts);
    return ok || typeof indexedDB !== 'undefined';
  },
  /** localStorage เคยเต็มในรอบนี้ (หน้าเว็บแยกอาจเห็นข้อมูลเก่า) */
  get localStorageFull() { return lsFull; },
  /**
   * เปิด IndexedDB · ถ้าข้อมูลในนั้นใหม่กว่าใน localStorage (เช่น รอบก่อน localStorage เต็ม) ใช้ชุดนั้นแล้วเรียก onNewer
   * `skipNewer` = ไม่เอาชุดใน IndexedDB มาทับ (เช่น เพิ่งล้างด้วย ?reset=blank)
   */
  hydrate(onNewer: () => void, skipNewer = false): void {
    init();
    if (typeof indexedDB === 'undefined') return;
    try {
      const rq = indexedDB.open(DB, 1);
      rq.onupgradeneeded = () => { rq.result.createObjectStore(OS); };
      rq.onsuccess = () => {
        idb = rq.result;
        const q = queue;
        queue = [];
        const tx = idb.transaction(OS, 'readonly').objectStore(OS);
        const got: Record<string, string | undefined> = {};
        const ks: string[] = [...PORTFOLIO_KEYS, KEYS.ts];
        let n = 0;
        ks.forEach((k) => {
          const g = tx.get(k);
          g.onsuccess = () => {
            got[k] = g.result as string | undefined;
            if (++n !== ks.length) return;
            /* IndexedDB คือที่เก็บหลัก: มีข้อมูลและไม่เก่ากว่า localStorage = ใช้ชุดนั้น · เหมือนกันอยู่แล้วก็ไม่ต้องวาดใหม่ */
            const newer = !!got[KEYS.draft] && +(got[KEYS.ts] || 0) >= (+(local.get(KEYS.ts) || 0) || 0)
              && PORTFOLIO_KEYS.some((k2) => (got[k2] || null) !== (mem[k2] || null));
            if (newer && !q.length && !skipNewer) {
              mem = {};
              PORTFOLIO_KEYS.forEach((k2) => { if (got[k2]) mem[k2] = got[k2]; });
              try { onNewer(); } catch {}
            }
            q.forEach(([qk, qv]) => idbSet(qk, qv));
            if (!got[KEYS.ts] && !q.length) PORTFOLIO_KEYS.forEach((k2) => { if (mem[k2]) idbSet(k2, mem[k2]!); });
          };
        });
      };
    } catch {}
  },
  /** ล้างทุกอย่างของแอป (localStorage `pf-*` + IndexedDB) แล้วเรียก done (dev: ?reset=new) */
  resetAll(done: () => void): void {
    local.clear('pf-');
    let fired = false;
    const fin = () => { if (!fired) { fired = true; done(); } };
    try {
      const dq = indexedDB.deleteDatabase(DB);
      dq.onsuccess = dq.onerror = dq.onblocked = fin;
      setTimeout(fin, 1500);
    } catch { fin(); }
  },
};
