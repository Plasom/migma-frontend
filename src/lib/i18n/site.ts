/**
 * คำของระบบบนหน้าเว็บ portfolio (เมนู · ปุ่ม · ป้าย) ภาษาอังกฤษ
 * ข้อความต้นฉบับในโค้ดเป็นไทย → แปลทั้งก้อนตามตาราง `SITE_EN` หรือกติกา `RULES` (มีตัวเลข/ชื่อแทรก)
 * เนื้อหาที่เจ้าของพิมพ์เองไม่ถูกแตะ (เนื้อหาสองภาษาใช้ช่อง `_en` ดู `localize`)
 */
import { createDomTranslator, type DomTranslator } from './dom-translator';

export const SITE_EN: Record<string, string> = {
  /* ป้ายช่องว่างและปุ่มเพิ่มที่เห็นในตัวอย่างของหลังบ้าน และข้อความรอข้อมูลบนหน้าเว็บ */
  'เพิ่มผลงานชิ้นแรกในหลังบ้าน': 'Add your first project in the editor', 'คำเกริ่น 1–2 บรรทัด': 'Intro, 1–2 lines', 'ชื่อที่แสดง': 'Display name',
  'เลือก case study': 'Pick a case study', 'เลือก case study ที่จะโชว์บนหน้าแรก': 'Pick a case study to show on the home page', 'เพิ่มประวัติงาน': 'Add work history', 'ใส่ลิงก์': 'Add link',
  'รอตัวเลขจริง': 'Numbers to come', 'หรือสิ่งที่เปลี่ยนจริงหลังปล่อยใช้งาน': 'or what changed after launch',
  'ข้อมูลตัวอย่าง · แก้เป็นของจริง': 'Sample data · replace with yours', 'ข้อมูลตัวอย่าง แก้เป็นของคุณได้': 'Sample data, replace with yours', 'ร่าง · แก้เป็นคำของคุณ': 'Draft · rewrite in your words',
  'ภาพปก 4:5': 'Cover image, 4:5', 'ภาพก่อนแก้ (หน้าจอจริง)': 'Before (real screen)', 'ภาพหลังแก้ (หน้าจอจริง)': 'After (real screen)',
  'ยังว่าง ไม่ขึ้นเว็บ': 'Empty, hidden on the site', 'สรุป 1 ประโยค ยังว่าง': 'One-line summary is empty', 'หัวข้อย่อย ยังว่าง': 'Subheading is empty', 'โน้ต ไม่ขึ้นเว็บ': 'Note, hidden on the site',
  'เพิ่ม': 'Add', 'เพิ่มทักษะ': 'Add skill', 'เพิ่มข้อ': 'Add item', 'เพิ่มย่อหน้า': 'Add paragraph', 'เพิ่มหัวข้อย่อย': 'Add subheading', 'เพิ่มคำพูดผู้ใช้': 'Add user quote', 'เพิ่มบทในตอนนี้': 'Add a chapter to this part',
  /* เมนูและปุ่มทั่วไป */
  'หน้าแรก': 'Home', 'ผลงาน': 'Work', 'ประวัติ': 'Experience', 'ติดต่อ': 'Contact', 'วิธีทำงาน': 'How I work',
  'ผลงานทั้งหมด': 'All work', 'ดูผลงานทั้งหมด': 'See all work', 'ดูทั้งหมด': 'See all', 'กลับขึ้นบน': 'Back to top',
  'คัดลอก': 'Copy', 'คัดลอกแล้ว': 'Copied', 'คัดลอกอีเมลแล้ว': 'Email copied', 'คัดลอกไม่ได้': 'Couldn’t copy', 'คัดลอกไม่ได้ ลองเลือกข้อความเอง': 'Couldn’t copy. Select the text instead.',
  'สลับเป็นโหมดมืด': 'Switch to dark mode', 'สลับเป็นโหมดสว่าง': 'Switch to light mode',
  'เปิดเมนู': 'Open menu', 'ปิดเมนู': 'Close menu', 'เมนู': 'Menu', 'เมนูหลัก': 'Main menu', 'หน้าในเว็บ': 'Site pages', 'ปิด': 'Close', 'กำลังโหลด…': 'Loading…',
  /* หน้าผลงาน */
  'ทั้งหมด': 'All', 'ตัวกรอง': 'Filters', 'กรองอยู่': 'Filtered', '· กรองอยู่': '· filtered', 'ล้างทั้งหมด': 'Clear all', 'ล้างคำค้น': 'Clear search', 'ค้นหาผลงาน': 'Search work',
  'เรียง:': 'Sort:', 'เรียงตาม': 'Sort by', 'เรียงผลงาน': 'Sort work', 'ใหม่สุด': 'Newest', 'เก่าสุด': 'Oldest', 'ชื่อ ก–ฮ': 'Name A–Z', 'แนะนำ': 'Featured', 'ตามประเภท': 'By type',
  'มุมมอง': 'View', 'กริด': 'Grid', 'รายการ': 'List', 'แสดงผลงาน': 'Show work as', 'แสดงน้อยลง': 'Show less', 'ย่อ': 'Show less', 'แสดง': 'Show',
  'แท็ก': 'Tags', 'แท็ก · เลือกได้หลายอัน': 'Tags · pick as many as you like', 'หมวด': 'Category', 'สถานะ': 'Status',
  'ใช้งานจริง': 'Live', 'ต้นแบบ': 'Prototype', 'กำลังทำ': 'In progress', 'ปักหมุด': 'Pinned', '(ปักหมุด)': '(pinned)',
  'ไม่พบผลงาน': 'Nothing found', 'ลองคำอื่น หรือล้างตัวกรอง': 'Try another word, or clear the filters.', 'ไม่มีผลงานตรงกับตัวกรอง': 'Nothing matches these filters', 'ไม่มีแท็กที่ตรงกับตัวกรองนี้': 'No tags match this filter',
  'ยังไม่มีผลงาน': 'No work here yet', 'ยังไม่มีคำอธิบายงานนี้': 'No description yet', 'ดูงานนี้': 'View project', 'อ่าน case study': 'Read the case study', 'ไปวิธีทำงาน': 'Go to how I work',
  'แอป': 'App', 'เว็บ': 'Web', 'ระบบ': 'System', 'แบรนด์': 'Brand', 'แดชบอร์ด': 'Dashboard', 'งานวิจัย': 'Research', 'ชุด UI': 'UI kit',
  /* ประวัติ */
  'ประสบการณ์': 'Experience', 'การศึกษา': 'Education', 'ทักษะ': 'Skills', 'ทักษะเด่น': 'Main skills', 'ทักษะที่ใช้': 'Skills used', 'ทักษะที่ได้': 'Skills picked up',
  'ผลงานที่เกี่ยวข้อง': 'Related work', 'ผลงานเด่น': 'Selected work', 'กิจกรรม': 'Activities', 'ทำอะไรบ้าง': 'What I did', 'สิ่งที่ทำ': 'What I did', 'รายละเอียด': 'Details', 'รายละเอียดการศึกษา': 'Education details',
  'เกรดเฉลี่ย': 'GPA', 'เกียรตินิยม': 'Honours', 'คณะ': 'Faculty', 'สาขา': 'Major', 'วุฒิ': 'Degree', 'วุฒิและสาขา': 'Degree and major', 'ช่องทางอื่น': 'Elsewhere', 'อีเมล': 'Email', 'เอกสารแนบ': 'Attachments',
  'ยังทำอยู่': 'Present', 'ยังเรียนอยู่': 'Still studying', 'ตำแหน่ง': 'Role', 'ประเภทงาน': 'Job type', 'ช่วงเวลา': 'Period', 'อยู่ที่': 'Based in', '(รวมฝึกงาน)': '(internships included)',
  'งานประจำ': 'Full-time', 'ฝึกงาน': 'Internship', 'ฟรีแลนซ์': 'Freelance', 'สัญญาจ้าง': 'Contract', 'อื่นๆ': 'Other',
  'ปริญญาตรี': 'Bachelor’s', 'ปริญญาโท': 'Master’s', 'ปริญญาเอก': 'PhD', 'ปวช.': 'Vocational certificate', 'ปวส.': 'Higher vocational diploma', 'มัธยมปลาย': 'High school', 'ประกาศนียบัตร / คอร์ส': 'Certificate / course',
  'เกียรตินิยมอันดับ 1': 'First-class honours', 'เกียรตินิยมอันดับ 2': 'Second-class honours', 'เกียรตินิยมอันดับ 1 (เหรียญทอง)': 'First-class honours (gold medal)',
  /* Case study */
  'สารบัญ': 'Contents', 'ภาพรวม': 'Overview', 'บทบาท': 'Role', 'ทีม': 'Team', 'ระยะเวลา': 'Duration', 'ขอบเขตงาน': 'Scope', 'โจทย์': 'Brief', 'ปัญหา': 'Problem', 'ปัญหาที่เจอ': 'Problem', 'ทางแก้': 'Solution', 'ผลลัพธ์': 'Result',
  'ก่อน': 'Before', 'หลัง': 'After', 'ภาพก่อนแก้': 'Before', 'ภาพหลังแก้': 'After', 'สิ่งที่ส่งมอบ': 'Deliverables', 'เริ่มอ่าน': 'Start reading', 'ดูผลงานอื่น': 'More work', 'อ่านจบแล้ว': 'End of the case study',
  'ดูต้นฉบับ': 'View original', 'ดูภาพขนาดใหญ่': 'View full size', 'ภาพขนาดใหญ่': 'Full-size image', 'วิดีโอ': 'Video', 'เล่นวิดีโอ': 'Play video', 'ภาพ': 'Image',
  'เลื่อนเทียบภาพก่อนและหลังแก้': 'Drag to compare before and after', '(เปิดแท็บใหม่)': '(opens in a new tab)', 'เปิดลิงก์ของภาพ (แท็บใหม่)': 'Open the image link (new tab)',
  'วิธีทำงานในโปรเจกต์นี้': 'How this project ran', 'ได้อะไรจากขั้นนี้': 'What came out of it', 'AI ทำ': 'Done by AI', 'คนทำ': 'Done by people', 'AI ทำอะไร คนทำอะไร': 'What AI did, what people did',
  'ข้อมูลตัวอย่าง': 'Sample data', 'ตัวอย่าง': 'Sample', 'ตอน': 'Part', 'ปัจจุบัน': 'Present', 'ปี': 'years',
  'อันดับ 1': 'First class', 'อันดับ 2': 'Second class', 'อันดับ 1 เหรียญทอง': 'First class, gold medal', 'ยังไม่ได้ใส่ไฟล์ Resume': 'No résumé file yet', 'ภาพผลงานจริง 4:5': 'Project image, 4:5',
  'ภาษาอังกฤษอยู่ กดเพื่อเปลี่ยนเป็นภาษาไทย': 'English. Switch to Thai', 'ภาษาไทยอยู่ กดเพื่อเปลี่ยนเป็นภาษาอังกฤษ': 'Thai. Switch to English'
};

const MON: Record<string, string> = { 'ม.ค.': 'Jan', 'ก.พ.': 'Feb', 'มี.ค.': 'Mar', 'เม.ย.': 'Apr', 'พ.ค.': 'May', 'มิ.ย.': 'Jun', 'ก.ค.': 'Jul', 'ส.ค.': 'Aug', 'ก.ย.': 'Sep', 'ต.ค.': 'Oct', 'พ.ย.': 'Nov', 'ธ.ค.': 'Dec' };
const UNIT: Record<string, string> = { 'วัน': 'day', 'สัปดาห์': 'week', 'เดือน': 'month', 'ปี': 'year' };
const LV = ['ปริญญาตรี', 'ปริญญาโท', 'ปริญญาเอก', 'ปวช.', 'ปวส.', 'มัธยมปลาย', 'ประกาศนียบัตร / คอร์ส'];
const pl = (n: string, w: string) => n + ' ' + w + (+n === 1 ? '' : 's');

type Rule = [RegExp, (m: RegExpMatchArray) => string | null];
/* ประโยคที่มีตัวเลขหรือชื่ออยู่ข้างใน */
const RULES: Rule[] = [
    [/^ดูผลงานทั้งหมด (\d+) ชิ้น$/, (m) => 'See all ' + pl(m[1], 'project')],
    [/^ดูทั้งหมด (\d+) ชิ้น$/, (m) => 'See all ' + m[1]],
    [/^(\d+) ชิ้น$/, (m) => pl(m[1], 'project')],
    [/^แสดง (\d+) ชิ้น$/, (m) => 'Show ' + pl(m[1], 'project')],
    [/^รายละเอียด (.+)$/, (m) => 'Details for ' + m[1]],
    [/^(\S+\.) – (\S+\.) (\d{4})$/, (m) => MON[m[1]] && MON[m[2]] ? MON[m[1]] + ' – ' + MON[m[2]] + ' ' + m[3] : null],
    [/^แสดงเพิ่ม \((\d+)\)$/, (m) => 'Show ' + m[1] + ' more'],
    [/^แสดงแท็กทั้งหมด \((\d+)\)$/, (m) => 'Show all tags (' + m[1] + ')'],
    [/^แสดงแท็กอีก (\d+) อัน: (.*)$/, (m) => pl(m[1], 'more tag') + ': ' + m[2]],
    [/^กรองด้วย (.+)$/, (m) => 'Filter by ' + m[1]],
    [/^เอา (.+) ออก$/, (m) => 'Remove ' + m[1]],
    [/^ไม่พบ “(.*)”$/, (m) => 'Nothing found for “' + m[1] + '”'],
    [/^ตอน (\d+) จาก (\d+)$/, (m) => 'Part ' + m[1] + ' of ' + m[2]],
    [/^ตอน (\d+)$/, (m) => 'Part ' + m[1]],
    [/^ตอนที่ (\d+)$/, (m) => 'Part ' + m[1]],
    [/^Case study · (\d+) ตอน(.*)$/, (m) => 'Case study · ' + pl(m[1], 'part') + m[2]],
    [/^ดูภาพที่ (\d+) ขนาดใหญ่$/, (m) => 'View image ' + m[1] + ' full size'],
    [/^(\d+)\+? (วัน|สัปดาห์|เดือน|ปี)$/, (m) => pl(m[1], UNIT[m[2]])],
    [/^(?:(\S+\.) )?(\d{4}) – (?:(?:(\S+\.) )?(\d{4})|ปัจจุบัน)$/, (m) => { if ((m[1] && !MON[m[1]]) || (m[3] && !MON[m[3]])) return null; return (m[1] ? MON[m[1]] + ' ' : '') + m[2] + ' – ' + (m[4] ? (m[3] ? MON[m[3]] + ' ' : '') + m[4] : 'Present'); }],
    [/^(\S+\.) (\d{4})$/, (m) => MON[m[1]] ? MON[m[1]] + ' ' + m[2] : null]
];

/** แปลข้อความระบบ 1 ก้อน · ไม่มีในตาราง = null */
export function translateSite(t: string, deep?: boolean): string | null {
  const E = SITE_EN;
  if (E[t]) return E[t];
  if (t.indexOf('+ ') === 0 && E[t.slice(2)]) return '+ ' + E[t.slice(2)];
  for (const [re, fn] of RULES) { const m = t.match(re); if (m) { const r = fn(m); if (r) return r; } }
  /* วุฒิ + สาขา เช่น "ปริญญาตรี Communication design" */
  for (const l of LV) if (t.indexOf(l + ' ') === 0) return E[l] + ', ' + t.slice(l.length + 1);
  /* หลายส่วนคั่นด้วยจุดกลาง เช่น "Lead UX/UI · 8 สัปดาห์" แปลทีละส่วน */
  if (!deep && t.indexOf(' · ') > 0) {
    let ch = false;
    const ps = t.split(' · ').map((x) => { const r = translateSite(x.trim(), true); if (r) { ch = true; return r; } return x; });
    if (ch) return ps.join(' · ');
  }
  return null;
}

/* แปลคำของระบบบนหน้า: ทำงานกับข้อความที่ตรงตารางทั้งก้อนเท่านั้น เนื้อหาที่เจ้าของพิมพ์เองไม่ถูกแตะ */
let translator: DomTranslator | null = null;
export function siteTranslator(): DomTranslator {
  return (translator ??= createDomTranslator({
    translate: translateSite,
    attrs: ['aria-label', 'title', 'placeholder', 'alt', 'data-label', 'data-lab'],
    skip: (el) => !el || !!el.closest('script,style,[data-pe],[contenteditable="true"],.pf-pk'),
    /* ป้ายของระบบที่อยู่ในบริเวณที่แก้ได้ ยังต้องแปล */
    own: (el) => !!el && !!el.closest('.tbd-tag,.pf-addb,.ph-fig,.wk-ed'),
    special: (n, t) => (t === 'ปี' && n.previousSibling && String(n.previousSibling.textContent).trim() === '1' ? 'year' : null),
  }));
}
