/**
 * AI ที่หลังบ้าน (migma-backend เรียก OpenRouter ให้ · key ไม่อยู่ในเบราว์เซอร์)
 * AI ใช้ไม่ได้ (ปิดอยู่ · บริการล่ม · อ่านไฟล์ไม่ได้) = โยน AiError พร้อมข้อความไทยให้ editor แจ้งผู้ใช้แล้วให้กรอกเอง
 */
import { ApiError, api } from '@/lib/api';
import type { YearMonth } from '@/lib/portfolio/types';

export interface ResumeExperience {
  title: string;
  org: string;
  type: string;
  fromYear: number | null;
  fromMonth: number | null;
  toYear: number | null;
  toMonth: number | null;
  now: boolean;
  points: string[];
}

export interface ResumeEducation {
  level: string;
  major: string;
  faculty: string;
  org: string;
  gpa: string;
  honors: string;
  fromYear: number | null;
  toYear: number | null;
}

/** ผลจาก POST /api/v1/me/ai/resume · ไม่พบ = สตริงว่าง / null / [] */
export interface ResumeData {
  name: string;
  fullName: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  headline: string[];
  lede: string;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  links: { label: string; url: string }[];
}

/** บทเนื้อหาของ Case study ที่ AI สกัดได้ */
export interface WorkChapterData {
  title: string;
  text: string;
  items: string[];
}

/** ผลงาน 1 ชิ้นที่ AI สกัดได้จาก POST /api/v1/me/ai/works */
export interface WorkData {
  title: string;
  sum: string;
  cat: string;
  year: number | null;
  tags: string[];
  role: string;
  team: string;
  scope: string[];
  problem: string;
  solution: string;
  result: string;
  cover: string;
  images: string[];
  chapters: WorkChapterData[];
}

export interface WorkScanResult {
  count: number;
  isMultiPage: boolean;
  fileNames: string[];
}

export class AiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** ข้อความที่บอกผู้ใช้ตามสาเหตุ (ภาษาไทยต้นฉบับ · หลังบ้านภาษาอังกฤษแปลผ่าน ui-dictionary) */
function reason(status: number, task: 'resume' | 'write' | 'works' = 'resume'): string {
  if (status === 402) return 'เครดิต AI ไม่พอ เติมเครดิตแล้วลองอีกครั้ง';
  if (task === 'write') {
    if (status === 429) return 'ใช้ AI เขียนข้อความครบ 60 ครั้งในชั่วโมงนี้แล้ว ลองใหม่ภายหลัง';
    if (status === 502) return 'AI เขียนข้อความนี้ไม่ได้ ลองเปลี่ยนคำขอ';
    if (status === 413) return 'ข้อความยาวเกินไป ลองตัดให้สั้นลงก่อน';
  }
  if (task === 'works') {
    if (status === 429) return 'ใช้ AI อ่านไฟล์ครบ 10 ครั้งในชั่วโมงนี้แล้ว ลองใหม่ภายหลัง';
    if (status === 413) return 'ไฟล์ใหญ่เกินไป ลองบีบอัดไฟล์ก่อน';
    if (status === 415) return 'ใช้ไฟล์ PDF หรือภาพ (JPG, PNG, WebP) เท่านั้น';
    if (status === 502) return 'AI อ่านไฟล์นี้ไม่ได้ หรือไม่พบข้อมูลโปรเจกต์';
  }
  if (status === 429) return 'ใช้ AI อ่านไฟล์ครบ 10 ครั้งในชั่วโมงนี้แล้ว ลองใหม่ภายหลัง';
  if (status === 413) return 'ไฟล์ใหญ่เกิน 5 MB ลองบีบอัด PDF ก่อน';
  if (status === 415) return 'ใช้ไฟล์ PDF เท่านั้น';
  if (status === 401) return 'เซสชันหมดอายุ เข้าสู่ระบบใหม่แล้วลองอีกครั้ง';
  if (status === 504) return 'AI ใช้เวลานานเกินไป ลองใหม่อีกครั้ง';
  if (status === 502) return 'AI อ่านไฟล์นี้ไม่ได้ อาจเป็นไฟล์สแกนที่ไม่ชัดหรือมีรหัสผ่าน';
  return 'ตอนนี้ AI ใช้ไม่ได้ชั่วคราว';
}

/** ส่ง PDF ให้ AI อ่าน · ล้มเหลว = AiError */
export async function readResume(file: File): Promise<ResumeData> {
  const fd = new FormData();
  fd.append('file', file, file.name);
  try {
    const r = await api<{ resume: ResumeData }>('/api/v1/me/ai/resume', { method: 'POST', body: fd });
    return r.resume;
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 0; // 0 = ติดต่อหลังบ้านไม่ได้
    throw new AiError(status, reason(status));
  }
}

/** ส่งไฟล์ผลงาน (PDF / ภาพ) ให้ AI สกัดเป็นผลงานพร้อมรูปภาพ · ล้มเหลว = AiError */
export async function readWorks(
  files: File[],
  units: number = 1,
  single: boolean = false
): Promise<WorkData[]> {
  const fd = new FormData();
  for (const f of files) {
    fd.append('files', f, f.name);
  }
  fd.append('units', String(units));
  if (single) {
    fd.append('single', 'true');
  }
  try {
    const r = await api<{ model: string; works: WorkData[] }>('/api/v1/me/ai/works', {
      method: 'POST',
      body: fd,
    });
    return r.works;
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 0;
    throw new AiError(status, reason(status, 'works'));
  }
}

/** สแกนไฟล์งานเบื้องต้นเพื่อประเมินจำนวนโปรเจกต์และคำนวณเครดิต */
export async function scanWorkFiles(files: File[]): Promise<WorkScanResult> {
  const fileNames = files.map(f => f.name);
  if (files.length > 1) {
    return {
      count: Math.min(Math.max(files.length, 1), 10),
      isMultiPage: false,
      fileNames,
    };
  }

  const f = files[0];
  if (!f) {
    return { count: 1, isMultiPage: false, fileNames: [] };
  }

  if (!/\.pdf$/i.test(f.name) && f.type !== 'application/pdf') {
    return { count: 1, isMultiPage: false, fileNames };
  }

  try {
    const slice = f.slice(0, Math.min(f.size, 5 * 1024 * 1024));
    const buf = await slice.arrayBuffer();
    const bytes = new Uint8Array(buf);
    const latin = new TextDecoder('latin1').decode(bytes);

    let streamText = '';
    let pos = 0;
    while (pos < bytes.length) {
      const idx = latin.indexOf('/ObjStm', pos);
      if (idx === -1) break;
      pos = idx + 7;
      const s1 = latin.indexOf('stream\r\n', idx);
      const s2 = latin.indexOf('stream\n', idx);
      let sStart = -1;
      if (s1 !== -1 && (s2 === -1 || s1 <= s2)) sStart = s1 + 8;
      else if (s2 !== -1) sStart = s2 + 7;
      if (sStart === -1) continue;
      const eIdx = latin.indexOf('endstream', sStart);
      if (eIdx === -1) continue;
      const streamBytes = bytes.subarray(sStart, eIdx);
      if (typeof DecompressionStream !== 'undefined') {
        try {
          const ds = new DecompressionStream('deflate-raw');
          const writer = ds.writable.getWriter();
          writer.write(streamBytes.subarray(2));
          writer.close();
          const res = await new Response(ds.readable).arrayBuffer();
          streamText += new TextDecoder('latin1').decode(res) + '\n';
        } catch {
          // ข้ามถ้าถอด zlib stream ไม่สำเร็จ
        }
      }
    }

    const fullText = latin + '\n' + streamText;

    // 1. ตรวจสอบ /Count ใน /Pages
    const countMatch = fullText.match(/\/Type\s*\/Pages[^>]*\/Count\s+(\d+)/);
    if (countMatch && countMatch[1]) {
      const p = parseInt(countMatch[1], 10);
      if (p > 1) {
        const est = Math.max(1, Math.min(10, Math.round(p / 3)));
        return { count: est, isMultiPage: true, fileNames };
      }
    }

    // 2. ตรวจสอบ /Type /Page
    const pageOccurrences = (fullText.match(/\/Type\s*\/Page\b/g) || []).length;
    if (pageOccurrences > 1) {
      const est = Math.max(1, Math.min(10, Math.round(pageOccurrences / 3)));
      return { count: est, isMultiPage: true, fileNames };
    }

    // 3. ตรวจสอบ MediaBox ในกรณีที่เป็นหน้ายาวต่อเนื่อง (Figma / Canva export)
    const mbMatch = fullText.match(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/);
    if (mbMatch) {
      const w = Math.abs(parseFloat(mbMatch[3]) - parseFloat(mbMatch[1]));
      const h = Math.abs(parseFloat(mbMatch[4]) - parseFloat(mbMatch[2]));
      if (w > 0 && h / w >= 2.5) {
        const equivPages = Math.round((h / w) / 1.4);
        const est = Math.max(1, Math.min(10, Math.round(equivPages / 2.8)));
        return { count: est, isMultiPage: true, fileNames };
      }
    }

    // 4. ตรวจสอบจำนวนภาพ DCTDecode
    const dctMatches = (latin.match(/\/Filter\s*\/DCTDecode/g) || []).length;
    if (dctMatches >= 6) {
      const est = Math.max(1, Math.min(10, Math.round(dctMatches / 3)));
      return { count: est, isMultiPage: true, fileNames };
    }
  } catch {
    // fallback
  }

  return { count: 1, isMultiPage: false, fileNames };
}

/** คำขอของปุ่ม ✦ ข้างช่อง (ดู WriteRequest ในหลังบ้าน) */
export interface WriteRequest {
  kind: string;
  label: string;
  current: string;
  request: string;
  lang: 'th' | 'en';
  max: number;
  context: string;
  avoid: string[];
}

/** ให้ AI เขียนข้อความในช่อง · ได้สูงสุด 3 แบบ แต่ละแบบเป็นรายการบรรทัด · ล้มเหลว = AiError */
export async function writeText(req: WriteRequest): Promise<string[][]> {
  try {
    const r = await api<{ options: string[][] }>('/api/v1/me/ai/write', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req),
    });
    return r.options;
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 0;
    throw new AiError(status, reason(status, 'write'));
  }
}

/** ปี/เดือนจาก AI → YearMonth ของพอร์ต (ไม่มีปี = null) */
export function ym(y: number | null, m: number | null = null): YearMonth | null {
  return y ? { y, m: m && m >= 1 && m <= 12 ? m : null } : null;
}
