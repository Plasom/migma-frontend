/**
 * สองภาษา (ไทย · อังกฤษ)
 * - คำแปลของแต่ละช่องเก็บคู่กับช่องเดิม ต่อท้ายชื่อด้วย _en เช่น title + title_en (ย้าย/เรียงรายการแล้วคำแปลตามไปด้วย)
 * - ช่องที่ยังไม่แปล = ใช้ภาษาไทยแทน (หน้าเว็บไม่มีช่องโหว่)
 * - รายการข้อความ (ข้อย่อย · บรรทัดหัวเรื่อง) จับคู่ตามลำดับ ข้อไหนยังไม่แปลใช้ข้อไทยข้อนั้น
 */
import { derive } from './model';
import type { Lang, Portfolio } from './types';

const nonEmpty = (v: unknown) => v != null && String(v).trim() !== '';

function mix(en: unknown, th: unknown): unknown {
  if (Array.isArray(en)) {
    if (!Array.isArray(th)) return en.filter(nonEmpty).length ? en : th;
    const n = th.length || en.length, r: unknown[] = [];
    for (let i = 0; i < n; i++) {
      const e = en[i], t = th[i];
      r.push(Array.isArray(e) || Array.isArray(t) ? mix(e || [], t || []) : nonEmpty(e) ? e : t);
    }
    return r.filter((x) => x !== undefined);
  }
  return nonEmpty(en) ? en : th;
}

/** ทับช่อง `x` ด้วย `x_en` ทุกระดับ (ช่อง _en หายไปจากผลลัพธ์) */
export function localize<T>(x: T): T {
  if (Array.isArray(x)) return x.map(localize) as T;
  if (x && typeof x === 'object') {
    const src = x as Record<string, unknown>, r: Record<string, unknown> = {};
    for (const k in src) if (!/_en$/.test(k)) r[k] = localize(src[k]);
    for (const k in src) if (/_en$/.test(k)) { const b = k.slice(0, -3); r[b] = mix(src[k], r[b]); }
    return r as T;
  }
  return x;
}

/**
 * ภาษาที่ใช้แสดง: หลังบ้านกำหนดให้ (`forced`) · หน้าเว็บจริง = ที่ผู้ชมเลือกไว้ (`stored`) ไม่งั้นใช้ภาษาเริ่มต้นของเว็บ
 * เว็บที่ไม่ได้เปิดสองภาษา = ไทย · เว็บอังกฤษภาษาเดียว = หัวข้อของเว็บเป็นอังกฤษ เนื้อหาใช้ชุดหลัก
 */
export function resolveSiteLang(d: Portfolio, forced: string | null | undefined, stored: string | null | undefined): Lang {
  const on = !!(d.site && d.site.i18n);
  let L = forced;
  if (!on && d.site && d.site.only === 'en') L = 'en';
  if (L !== 'en' && L !== 'th') {
    L = null;
    if (on) { L = stored; if (L !== 'en' && L !== 'th') L = d.site.lang === 'en' ? 'en' : 'th'; }
  }
  return L === 'en' ? 'en' : 'th';
}

/**
 * ข้อมูลสำหรับภาษาที่ดู: ชุดหลักเป็นภาษาแรกที่เจ้าของเลือก (site.base) · ดูอีกภาษา = เอาช่องคำแปลมาทับ
 */
export function dataForLang(d: Portfolio, lang: Lang): Portfolio {
  const on = !!(d.site && d.site.i18n);
  const base = on && d.site.base === 'en' ? 'en' : 'th';
  return on && lang !== base ? derive(localize(d)) : d;
}
