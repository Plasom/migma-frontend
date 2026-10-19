/**
 * ที่เก็บข้อมูลพอร์ต (ร่าง · ฉบับบันทึก · ฉบับเผยแพร่) · ที่เก็บจริงคือหลังบ้าน (migma-backend: /api/v1/me/portfolio)
 * - หน่วยความจำ: editor อ่าน/เขียนแบบ sync ตรงนี้ · ตัวอย่างในหลังบ้านอ่านผ่าน preview handoff
 * - หลังบ้าน: write = ทยอยส่ง PUT (debounce) พร้อม If-Match: rev · เผยแพร่ = POST /publish (server คัดลอกฉบับบันทึกเอง)
 * - localStorage: cache ให้เปิดหน้าแล้วเห็นทันทีก่อนโหลดจากหลังบ้านเสร็จ และให้ /site (ตัวอย่างนอกหลังบ้าน) อ่านได้
 *
 * API เดิมที่ editor ใช้: read · write · hydrate · resetAll (+ onConflict · clearLocal)
 */
import { ApiError, api, goAccount } from '@/lib/api';
import { KEYS, PORTFOLIO_KEYS, local, type PortfolioKey } from './local';

type Version = 'draft' | 'saved' | 'published';
type Writable = 'pf-draft' | 'pf-saved';
interface Remote { data: unknown; rev: number; updatedAt: string }
type All = Record<Version, Remote | null>;

const URL_ALL = '/api/v1/me/portfolio';
const VERSION: Record<PortfolioKey, Version> = { 'pf-draft': 'draft', 'pf-saved': 'saved', 'pf-published': 'published' };
const WRITABLE: Writable[] = ['pf-draft', 'pf-saved'];
const DEBOUNCE = 700;
const RETRY = 5000;

let mem: Partial<Record<PortfolioKey, string>> = {};
const rev: Record<Writable, number> = { 'pf-draft': 0, 'pf-saved': 0 };
const pending: Partial<Record<Writable, string>> = {};
let publishWanted = false;
let timer: ReturnType<typeof setTimeout> | null = null;
let chain: Promise<void> = Promise.resolve();
let busy = false;
let lsFull = false;
let started = false;
let conflictFn: (() => void) | null = null;
let markReady: () => void = () => {};
/** โหลดจากหลังบ้านเสร็จ (รู้ rev แล้ว) · ส่ง PUT ได้หลังจากนี้เท่านั้น */
const ready = new Promise<void>((r) => { markReady = r; });

/** โหลด cache ใน localStorage ขึ้นหน่วยความจำ (เรียกครั้งแรกที่ใช้) */
function init() {
  if (started || typeof window === 'undefined') return;
  started = true;
  PORTFOLIO_KEYS.forEach((k) => { const v = local.get(k); if (v) mem[k] = v; });
  try { indexedDB.deleteDatabase('pf-store'); } catch {} // ที่เก็บเดิมก่อนมีหลังบ้าน
  addEventListener('pagehide', flushOnLeave);
  addEventListener('beforeunload', (e) => { if (hasUnsaved()) e.preventDefault(); });
}

function cache(k: PortfolioKey, json: string | null) {
  if (json == null) { local.remove(k); return; }
  if (!local.set(k, json)) { local.remove(k); lsFull = true; }
}

/** เทียบเนื้อข้อมูลโดยไม่สนลำดับ key (Postgres jsonb เรียง key ใหม่) */
function canon(json: string | null | undefined): string {
  if (!json) return '';
  const sort = (v: unknown): unknown =>
    Array.isArray(v) ? v.map(sort)
      : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sort((v as Record<string, unknown>)[k])]))
        : v;
  try { return JSON.stringify(sort(JSON.parse(json))); } catch { return json; }
}

function hasUnsaved() {
  return busy || publishWanted || WRITABLE.some((k) => pending[k] != null);
}

/** ดึงทุกฉบับจากหลังบ้าน · keep = คีย์ที่ไม่เอาค่าจากหลังบ้านมาทับ · คืน true เมื่อเนื้อข้อมูลเปลี่ยน */
async function pull(keep: (k: PortfolioKey) => boolean): Promise<boolean> {
  const all = await api<All>(URL_ALL);
  let changed = false;
  PORTFOLIO_KEYS.forEach((k) => {
    const r = all[VERSION[k]];
    if (k !== 'pf-published') rev[k as Writable] = r ? r.rev : 0;
    if (keep(k)) return;
    const s = r ? JSON.stringify(r.data) : null;
    if (canon(s) !== canon(mem[k])) changed = true;
    if (s == null) delete mem[k]; else mem[k] = s;
    cache(k, s);
  });
  return changed;
}

function schedule(delay = DEBOUNCE) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => { timer = null; void flush(); }, delay);
}

/** ส่งของที่ค้างทั้งหมดตามลำดับ (ร่าง · ฉบับบันทึก · แล้วค่อยเผยแพร่) */
function flush(): Promise<void> {
  chain = chain.then(send, send);
  return chain;
}

async function send() {
  await ready;
  busy = true;
  try {
    for (const k of WRITABLE) {
      const body = pending[k];
      if (body == null) continue;
      delete pending[k];
      try {
        const r = await api<{ rev: number }>(URL_ALL + '/' + VERSION[k], {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'If-Match': String(rev[k]) }, body,
        });
        rev[k] = r.rev;
      } catch (e) {
        if (pending[k] == null) pending[k] = body;
        return fail(e);
      }
    }
    if (publishWanted) {
      publishWanted = false;
      try {
        await api(URL_ALL + '/publish', { method: 'POST' });
      } catch (e) {
        publishWanted = true;
        return fail(e);
      }
    }
  } finally {
    busy = false;
  }
}

async function fail(e: unknown) {
  if (e instanceof ApiError && e.status === 401) { goAccount(); return; }
  if (e instanceof ApiError && e.status === 409) {
    /* มีการแก้จากแท็บหรือเครื่องอื่น: ใช้ฉบับล่าสุดจากหลังบ้าน แล้วให้ editor วาดใหม่ */
    WRITABLE.forEach((k) => { delete pending[k]; });
    publishWanted = false;
    try { await pull(() => false); } catch {}
    try { conflictFn?.(); } catch {}
    return;
  }
  schedule(RETRY); // เน็ตหลุด / หลังบ้านล่ม: ลองใหม่
}

/** ปิดหน้า: ส่งของที่ค้างแบบ keepalive (เบราว์เซอร์จำกัดราว 64 KB ต่อคำขอ) */
function flushOnLeave() {
  WRITABLE.forEach((k) => {
    const body = pending[k];
    if (body == null || body.length > 60_000) return;
    try {
      fetch(URL_ALL + '/' + VERSION[k], {
        method: 'PUT', keepalive: true, credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'If-Match': String(rev[k]) }, body,
      });
    } catch {}
  });
}

export const portfolioStore = {
  /** ข้อความ JSON ของฉบับนั้น (null = ยังไม่มี) */
  read(k: PortfolioKey): string | null {
    init();
    return mem[k] || null;
  },
  /** เขียนฉบับ: หน่วยความจำทันที แล้วทยอยส่งขึ้นหลังบ้าน · pf-published = สั่งเผยแพร่ฉบับบันทึก */
  write(k: PortfolioKey, json: string): boolean {
    init();
    mem[k] = json;
    cache(k, json);
    local.set(KEYS.ts, String(Date.now()));
    if (k === 'pf-published') {
      publishWanted = true;
      schedule(0);
    } else {
      pending[k] = json;
      schedule();
    }
    return true;
  },
  /** localStorage เคยเต็มในรอบนี้ (หน้า /site นอกหลังบ้านอาจเห็นข้อมูลเก่า) */
  get localStorageFull() { return lsFull; },
  /**
   * โหลดจากหลังบ้าน · เนื้อข้อมูลต่างจาก cache = ใช้ของหลังบ้านแล้วเรียก onNewer ให้ editor วาดใหม่
   * `skipNewer` = ไม่เอาของหลังบ้านมาทับ (เช่น เพิ่งล้างด้วย ?reset=blank แล้วจะส่งค่าว่างขึ้นไป)
   */
  hydrate(onNewer: () => void, skipNewer = false): void {
    init();
    const attempt = () => {
      pull((k) => skipNewer || (k !== 'pf-published' && pending[k as Writable] != null))
        .then((changed) => {
          markReady();
          if (changed) try { onNewer(); } catch {}
        })
        .catch((e) => {
          if (e instanceof ApiError && e.status === 401) { goAccount(); return; }
          setTimeout(attempt, RETRY);
        });
    };
    attempt();
  },
  /** โหลดจากหลังบ้านครั้งแรกเสร็จ (รู้แล้วว่าผู้ใช้มีฉบับไหนบ้าง) */
  whenReady(): Promise<void> { return ready; },
  /** หลังบ้านมีฉบับใหม่กว่าตอนบันทึก (ชนกัน) → โหลดฉบับล่าสุดแล้ว เรียก fn ให้ editor วาดใหม่ */
  onConflict(fn: () => void): void { conflictFn = fn; },
  /** ล้างพอร์ตที่ cache ในเครื่อง (ตอนออกจากระบบ · กันคนถัดไปเห็นข้อมูล) */
  clearLocal(): void {
    mem = {};
    [...PORTFOLIO_KEYS, KEYS.ts].forEach((k) => local.remove(k));
  },
  /** ล้างพอร์ตทั้งหมด (หลังบ้าน + เครื่องนี้) แล้วเรียก done (dev: ?reset=new) */
  resetAll(done: () => void): void {
    WRITABLE.forEach((k) => { delete pending[k]; });
    publishWanted = false;
    mem = {};
    local.clear('pf-');
    api(URL_ALL, { method: 'DELETE' }).catch(() => {}).finally(done);
  },
};
