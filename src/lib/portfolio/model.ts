/**
 * กติกาของข้อมูล portfolio: เติมค่าที่ขาด (normalize) · ค่าที่คำนวณจากช่องอื่น (derive) · ช่วงเวลา · ปีประสบการณ์ · กลุ่มทักษะ
 * ใช้ร่วมกันทั้งหลังบ้านและหน้าเว็บ (เดิม window.PF_* ใน data/portfolio.js)
 */
import type { CaseStudy, Education, Experience, Period, Portfolio, Profile, SectionKey, YearMonth } from './types';

/* ทักษะแยกกลุ่ม: เดาหมวดจากชื่อ (ใช้ตอนย้ายข้อมูลเก่า และตอน AI เติมทักษะ) */
export function skillCategory(s: string): string {
  const t = String(s).toLowerCase();
  if (/figma|figjam|framer|protopie|miro|notion|illustrator|photoshop|sketch|maze|adobe|after effects|canva|jira/.test(t)) return 'เครื่องมือ';
  if (/html|css|javascript|typescript|react|vue|swift|kotlin|python|git|tailwind|frontend|code|sql|flutter/.test(t)) return 'Coding';
  if (/ux|ui|design|prototyp|wirefram|usability|research|interview|interaction|information architecture|accessib|visual|motion|persona|journey|typograph|user|responsive|handoff/.test(t)) return 'UX/UI';
  return 'อื่นๆ';
}
export const SKILL_ORDER = ['UX/UI', 'Coding', 'เครื่องมือ', 'อื่นๆ'];

/* ช่วงเวลา (v3.5): from/to = { y, m } (เดือนไม่บังคับ) · now = ยังทำอยู่ → period เป็นข้อความที่คำนวณให้ */
export const MONTHS_TH = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

export function formatPeriod(x: Period): string {
  const M = MONTHS_TH, f = x.from || ({} as YearMonth), t = x.to || ({} as YearMonth);
  const one = (o: YearMonth) => (o.y ? (o.m ? M[o.m - 1] + ' ' : '') + o.y : '');
  if (!f.y) return '';
  if (x.now) return one(f) + ' – ปัจจุบัน';
  if (!t.y) return one(f);
  if (t.y === f.y && f.m && t.m) return f.m === t.m ? one(f) : M[f.m - 1] + ' – ' + M[t.m - 1] + ' ' + f.y;
  if (t.y === f.y && !f.m && !t.m) return String(f.y);
  return one(f) + ' – ' + one(t);
}

export function parsePeriod(input: unknown): { from: YearMonth; to: YearMonth | null; now: boolean } {
  const s = String(input || '');
  const ys = s.match(/\d{4}/g) || [], ms: [number, number][] = [];
  MONTHS_TH.forEach((n, i) => { const k = s.indexOf(n); if (k >= 0) ms.push([k, i + 1]); });
  ms.sort((a, b) => a[0] - b[0]);
  const now = /ปัจจุบัน|now|present/i.test(s), y1 = Number(ys[0]) || null;
  let y2 = Number(ys[1]) || null;
  if (!y2 && !now && ms.length > 1) y2 = y1;
  return { from: { y: y1, m: ms[0] ? ms[0][1] : null }, to: now || !y2 ? null : { y: y2, m: ms[1] ? ms[1][1] : null }, now };
}

export const EDU_LEVELS = ['ปริญญาเอก', 'ปริญญาโท', 'ปริญญาตรี', 'ปวส.', 'ปวช.', 'มัธยมปลาย', 'ประกาศนียบัตร / คอร์ส'];

export interface YearsResult { n: number | null; manual?: boolean; intern?: boolean; count?: number }

/* ปีประสบการณ์: ใส่เอง หรือคำนวณจากประวัติงานเท่านั้น (นับเฉพาะประเภทที่เลือก · ช่วงที่ซ้อนกันนับครั้งเดียว) */
export function experienceYears(d: Pick<Portfolio, 'profile' | 'experience'>): YearsResult {
  const Y = (d.profile && d.profile.years) || ({} as Partial<NonNullable<Profile['years']>>), X = d.experience || [];
  if (Y.mode === 'manual') return { n: +(Y.n ?? 0) || null, manual: true };
  const inc = Y.types, now = new Date(), nI = now.getFullYear() * 12 + now.getMonth();
  const iv = X.filter((x) => !inc || inc.indexOf(x.type || '') >= 0).map((x) => {
    const f = x.from || ({} as YearMonth), t = x.to || ({} as YearMonth);
    if (!f.y) return null;
    const a = f.y * 12 + ((f.m || 1) - 1), b = x.now ? nI : t.y ? t.y * 12 + ((t.m || 12) - 1) : a + (f.m ? 0 : 11);
    return b >= a ? [a, b + 1] : null;
  }).filter((r): r is number[] => !!r).sort((p, q) => p[0] - q[0]);
  let mo = 0, cur: number[] | null = null;
  iv.forEach((r) => { if (cur && r[0] <= cur[1]) cur[1] = Math.max(cur[1], r[1]); else { if (cur) mo += cur[1] - cur[0]; cur = r.slice(); } });
  if (cur) mo += (cur as number[])[1] - (cur as number[])[0];
  const intern = X.some((x) => x.type === 'ฝึกงาน' && (!inc || inc.indexOf('ฝึกงาน') >= 0));
  return { n: mo ? Math.max(1, Math.round(mo / 12)) : null, intern, count: iv.length };
}

const fixYM = (o: YearMonth | null | undefined) => { if (!o) return o; o.y = +(o.y ?? 0) || null; o.m = +(o.m ?? 0) || null; return o; };

/* ค่าที่คำนวณจากช่องอื่น (เรียกทุกครั้งที่ข้อมูลเปลี่ยน) */
export function derive<T extends Portfolio>(d: T): T {
  if (Array.isArray(d.featuredCases)) {
    d.featuredCases = d.featuredCases.filter((k) => d.cases && d.cases[k]).slice(0, 3);
    d.featuredCase = d.featuredCases[0] || null;
  }
  const P = d.profile;
  if (P && Array.isArray(P.skillSets)) P.skills = ([] as string[]).concat(...P.skillSets.map((g) => g.items || []));
  ([] as (Experience | Education)[]).concat(d.experience || [], d.education || []).forEach((x) => {
    if (!x.from) return;
    fixYM(x.from); fixYM(x.to); x.period = formatPeriod(x);
  });
  (d.experience || []).forEach((x) => { if (x.from) x.start = x.from.y || ''; });
  (d.education || []).forEach((e) => { if (e.level !== undefined || e.major !== undefined) e.degree = [e.level, e.major].filter(Boolean).join(' '); });
  Object.keys(d.cases || {}).forEach((k) => {
    ((d.cases[k] || {}).chapters || []).forEach((ch) => {
      (ch.b || []).forEach((b) => {
        if (b.type !== 'links') return;
        ((b.items || []) as string[][]).forEach((l) => {
          let u = String(l[3] || '').trim();
          if (u === '#') { l[3] = ''; return; }
          if (!u) return;
          if (!/^[a-z]+:/i.test(u) && /\./.test(u)) u = 'https://' + u;
          l[3] = u;
          const h = (u.match(/^https?:\/\/(?:www\.)?([^/]+)/i) || [])[1] || '';
          l[2] = /figma/.test(h) ? 'Figma' : /github/.test(h) ? 'GitHub' : /youtu/.test(h) ? 'YouTube' : /behance/.test(h) ? 'Behance' : /dribbble/.test(h) ? 'Dribbble' : h;
          l[0] = /figma/.test(h) ? 'draw' : /github|gitlab/.test(h) ? 'code' : /youtu|vimeo/.test(h) ? 'play_circle' : 'open_in_new';
        });
      });
    });
  });
  Object.keys(d.cases || {}).forEach((k) => {
    const c = d.cases[k];
    if (c && c.timeN !== undefined) c.time = c.timeN !== '' && c.timeN != null ? c.timeN + ' ' + (c.timeU || 'สัปดาห์') : '';
  });
  return d;
}

/* ทักษะบนหน้าแรก: 'flat' | 'group' | ไม่ตั้ง = อัตโนมัติ (แยกกลุ่มเมื่อทักษะเกิน 8 และมีมากกว่า 1 กลุ่ม) */
export function skillsView(P: Profile): 'flat' | 'group' {
  const g = (P.skillSets || []).filter((x) => x.items && x.items.length).length, n = (P.skills || []).length;
  const v = P.skillsView === 'flat' || P.skillsView === 'group' ? P.skillsView : n > 8 && g > 1 ? 'group' : 'flat';
  return v === 'group' && g < 2 ? 'flat' : v;
}

export const LAYOUT_KEYS: SectionKey[] = ['works', 'process', 'case', 'experience'];

/** เติมช่องที่ข้อมูลรุ่นเก่ายังไม่มี (id ของรายการ · caseIds · sections · order · layout) แล้ว derive */
export function normalize<T extends Portfolio>(d: T): T {
  /* id คงที่ (ไม่สุ่ม): normalize ข้อมูลชุดเดิมกี่ครั้งก็ได้ id เดิม ร่างกับฉบับบันทึกเทียบกันได้ */
  const used: Record<string, 1> = {};
  const all: ({ id?: string } | null | undefined)[] = ([] as ({ id?: string } | null | undefined)[]).concat(
    d.works || [], d.process || [], d.experience || [], d.education || [], (d.contact && d.contact.links) || [],
  );
  all.forEach((x) => { if (x && x.id) used[x.id] = 1; });
  ((d.profile && d.profile.skillSets) || []).forEach((g) => { if (g && g.id) used[g.id] = 1; });
  const id = (p: string) => { let n = 1; for (; used[p + n]; n++); used[p + n] = 1; return p + n; };
  d.sections = Object.assign({ works: true, process: true, case: true, experience: true }, d.sections || {});
  d.order = Object.assign({ works: 'manual', experience: 'auto', education: 'auto' }, d.order || {});
  /* v4: ลำดับส่วนบนหน้าแรก (ผู้ใช้ลากเรียงเอง) · ท้ายเว็บ · ขนาดประโยคแนะนำตัว */
  d.layout = (Array.isArray(d.layout) ? d.layout : []).filter((k, i, a) => LAYOUT_KEYS.indexOf(k) >= 0 && a.indexOf(k) === i);
  LAYOUT_KEYS.forEach((k) => { if (d.layout!.indexOf(k) < 0) d.layout!.push(k); });
  d.cases = d.cases || {};
  d.site = d.site || {};
  d.site.footer = Object.assign({ links: true, top: true }, d.site.footer || {});
  d.theme = d.theme || { brand: '#4C45D2' };
  d.contact = d.contact || { links: [] };
  (d.works || []).forEach((w) => {
    if (!w.id) w.id = id('w');
    if (!w.caseIds) w.caseIds = w.caseId ? [w.caseId] : [];
    delete w.caseId;
  });
  (['process', 'experience', 'education'] as const).forEach((k) => {
    ((d[k] || []) as { id?: string }[]).forEach((x) => { if (!x.id) x.id = id(k.charAt(0)); });
  });
  (d.contact.links || []).forEach((x) => { if (!x.id) x.id = id('l'); });
  const P = d.profile;
  if (P) {
    if (!Array.isArray(P.headline)) P.headline = P.headline ? [String(P.headline)] : [''];
    P.headline = P.headline.slice(0, 3);
    if (!P.headline.length) P.headline = [''];
    if (['h1', 'h2', 'h3'].indexOf(P.headlineSize as string) < 0) P.headlineSize = 'h1';
    /* ขนาดของแต่ละบรรทัด (h1 · h2 · h3) · ข้อมูลเก่าที่มีขนาดเดียวทั้งก้อน ใช้ค่านั้นกับทุกบรรทัด */
    const HS0 = Array.isArray(P.headlineSizes) ? P.headlineSizes : [];
    P.headlineSizes = P.headline.map((_, i) => (['h1', 'h2', 'h3'].indexOf(HS0[i]) >= 0 ? HS0[i] : P.headlineSize!));
    if (!Array.isArray(P.skillSets)) {
      const by: Record<string, string[]> = {};
      (P.skills || []).forEach((s) => { const c = skillCategory(s); (by[c] = by[c] || []).push(s); });
      P.skillSets = SKILL_ORDER.filter((c) => by[c]).map((c) => ({ name: c, items: by[c] }));
    }
    P.skillSets.forEach((g) => { if (!g.id) g.id = id('g'); g.items = g.items || []; g.name = g.name || ''; });
    P.years = Object.assign({ mode: 'auto' as const, n: '', types: ['งานประจำ', 'ฟรีแลนซ์', 'สัญญาจ้าง', 'ฝึกงาน'] }, P.years || {});
  }
  ([] as (Experience | Education)[]).concat(d.experience || [], d.education || []).forEach((x) => {
    if (!x.from) {
      const r = parsePeriod(x.period);
      if (!r.from.y && x.start) r.from.y = +x.start;
      x.from = r.from; x.to = r.to; x.now = r.now;
    }
  });
  (d.education || []).forEach((e) => {
    if (e.level === undefined) {
      const dg = String(e.degree || ''), L = EDU_LEVELS.filter((l) => dg.indexOf(l) === 0)[0];
      e.level = L || '';
      e.major = (L ? dg.slice(L.length) : dg).trim();
    }
    e.faculty = e.faculty || '';
    e.files = e.files || [];
  });
  Object.keys(d.cases).forEach((k) => {
    const c: CaseStudy = d.cases[k];
    if (!c || c.timeN !== undefined) return;
    const m = String(c.time || '').match(/^\s*(\d+)\s*(วัน|สัปดาห์|เดือน|ปี)\s*$/);
    if (m) { c.timeN = +m[1]; c.timeU = m[2]; } else if (!c.time) { c.timeN = ''; c.timeU = 'สัปดาห์'; }
  });
  if (!Array.isArray(d.featuredCases)) d.featuredCases = d.featuredCase ? [d.featuredCase] : [];
  if (!Array.isArray(d.workCats)) {
    const wc: string[] = [];
    (d.works || []).forEach((w) => { if (w.cat && wc.indexOf(w.cat) < 0) wc.push(w.cat); });
    d.workCats = wc;
  }
  derive(d);
  return d;
}

/** สำเนาลึกของข้อมูล (ข้อมูลเป็น JSON ล้วน) */
export const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
