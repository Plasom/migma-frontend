/* ==========================================================================
   ข้อมูล portfolio ทั้งหมด — template (หน้าแรก · ผลงาน · case) อ่านจากไฟล์นี้ที่เดียว
   หลังบ้านแก้ข้อมูลชุดนี้ · spec: core/patterns/data-model.md (decisions #98)
   ช่องว่าง ('' / null / []) = หน้าเว็บซ่อนช่องนั้น · ในหลังบ้าน (?edit=1) ขึ้นป้าย "รอข้อมูล" แทน
   ========================================================================== */
window.PORTFOLIO_DEFAULT = {
  version: 1,
  sample: true,                 /* true = ยังเป็นข้อมูลตัวอย่าง → ขึ้นป้าย "ข้อมูลตัวอย่าง" */
  site: { name: 'phunyisa', logo: null, year: 2026 },
  theme: { brand: '#4C45D2' },  /* สีแบรนด์ + โลโก้ = สิ่งที่ผู้ใช้ปรับหน้าตาได้ */
  profile: {
    name: 'Phunyisa', fullName: 'Phunyisa T.', role: 'UX/UI designer', avatar: null,
    headline: ['ออกแบบแอปและระบบ', 'ที่ทีมเอาไปใช้ต่อได้จริง'],   /* 1–2 วลี · แต่ละวลี = 1 บรรทัดที่ยกขึ้น */
    lede: 'เริ่มจากคุยกับผู้ใช้ แล้วออกแบบด้วย design system ที่ทีม dev หยิบไปทำต่อได้ทันที ทั้งแอปมือถือและเว็บ', ledeDraft: true,
    skills: ['UX research', 'UI design', 'Design system', 'Prototyping', 'Figma'],
    location: '',
    status: 'open',             /* open · freelance · closed */
    resume: ''
  },
  works: [
    { id: 'bank', title: 'Banking app redesign', sum: 'แอปธนาคารที่โอนเงินและจ่ายบิลจบได้ในหน้าเดียว', cat: 'Mobile', year: 2026, wip: false, pinned: true, tags: ['Fintech', 'UX research'], cover: null, caseIds: ['bank'] },
    { id: 'booking', title: 'Booking flow สำหรับคลินิก', sum: 'ระบบจองคิวคลินิกที่คนไข้จองเองได้ ไม่ต้องโทร', cat: 'Web', year: 2025, wip: false, pinned: false, tags: ['Research', 'UI'], cover: null, caseIds: [] },
    { id: 'kit', title: 'Kit for teams', sum: 'ชุด component กลางที่ทีมออกแบบและ dev ใช้ร่วมกัน', cat: 'Design system', year: 2026, wip: false, pinned: true, tags: ['Figma', 'Design system'], cover: null, caseIds: [] },
    { id: 'onboarding', title: 'Onboarding study', sum: 'งานวิจัยหาว่าผู้ใช้ใหม่ติดตรงไหนในสัปดาห์แรก', cat: 'Research', year: 2025, wip: false, pinned: false, tags: ['Research', 'Mobile'], cover: null, caseIds: ['research'] },
    { id: 'analytics', title: 'Analytics console', sum: 'แดชบอร์ดให้ทีมดูตัวเลขสำคัญได้ในหน้าจอเดียว', cat: 'Web', year: 2026, wip: true, pinned: false, tags: ['Dashboard'], cover: null, caseIds: ['fe'] }
  ],
  process: [
    { title: 'Understand', summary: 'คุยกับผู้ใช้และคนในทีมก่อนเปิด Figma', detail: 'สัมภาษณ์ผู้ใช้ ดูข้อมูลการใช้งานเดิม และคุยกับทีม dev เรื่องข้อ⁠จำกัด⁠ทาง⁠เทคนิค เพื่อให้รู้ว่าปัญหาจริงคืออะไรก่อนเริ่มออกแบบ', outputs: ['สรุปปัญหา', 'ข้อมูลผู้ใช้'] },
    { title: 'Define', summary: 'เขียน flow และตกลงว่าจะวัดผลจากอะไร', detail: 'วาด user flow ของงานหลัก เลือกว่าจะแก้ตรงไหนก่อน และตกลงตัวชี้วัดกับทีม เช่น อัตราทำรายการสำเร็จ', outputs: ['User flow', 'ตัวชี้วัด'] },
    { title: 'Design', summary: 'ทำ wireframe แล้วต่อเป็น UI ด้วย component ชุดเดียว', detail: 'เริ่มจาก wireframe ขาวดำ คุยกับทีมจนลงตัว แล้วทำ UI ด้วย component จาก design system เดียวกัน ทีม dev หยิบไปใช้ต่อได้ทันที', outputs: ['Wireframe', 'UI ใน Figma', 'Component'] },
    { title: 'Validate', summary: 'ให้ผู้ใช้ลองกด ดูว่าติดตรงไหน แล้วแก้', detail: 'ทำ prototype ให้ผู้ใช้ลองทำงานจริง จดว่าติดตรงไหน แก้แล้วทดสอบซ้ำ ก่อนส่งต่อให้ทีม dev', outputs: ['Prototype', 'ผลทดสอบ', 'รายการแก้ไข'] }
  ],
  featuredCase: 'bank', featuredCases: ['bank'],         /* case ที่โชว์บนหน้าแรก (ใช้ teaser ของ case นั้น) */
  sections: { works: true, process: true, 'case': true, experience: true },   /* ส่วนที่เลือกได้ว่าจะโชว์ */
  order: { works: 'manual', experience: 'auto' },  /* works: manual · new · type   experience: auto (ใหม่ → เก่า) · manual */
  experience: [
    { from: { y: 2024, m: 3 }, to: null, now: true, title: 'UX/UI Designer', org: 'บริษัทฟินเทค (ชื่อตัวอย่าง) · กรุงเทพฯ', type: 'งานประจำ',
      points: ['ออกแบบแอปธนาคารบนมือถือ ส่วนโอนเงินและจ่ายบิล ทำงานคู่กับ PM และทีม dev', 'ทำ design system ชุดแรกของทีม ใช้ร่วมกันทั้งแอปและเว็บ', 'สัมภาษณ์ผู้ใช้และทำ usability test ทุกครั้งก่อนปล่อยฟีเจอร์ใหม่'],
      skills: ['UX research', 'Figma', 'Design system', 'Prototyping'], related: 'bank' },
    { from: { y: 2023, m: 1 }, to: { y: 2024, m: 2 }, now: false, title: 'UI Designer', org: 'ดิจิทัลเอเจนซี (ชื่อตัวอย่าง)', type: 'งานประจำ',
      points: ['ออกแบบเว็บและแอปให้ลูกค้าหลายธุรกิจ ตั้งแต่ wireframe จนส่งไฟล์ให้ dev', 'ทำ UI kit ให้ทีมใช้ซ้ำ ลดเวลาเริ่มโปรเจกต์ใหม่'],
      skills: ['UI design', 'Figma', 'Responsive web', 'Handoff'], related: 'fe' },
    { from: { y: 2022, m: 6 }, to: { y: 2022, m: 10 }, now: false, title: 'UX/UI Designer Intern', org: 'สตาร์ทอัพส่งของ (ชื่อตัวอย่าง)', type: 'ฝึกงาน',
      points: ['ช่วยทำ usability test แอปไรเดอร์ และสรุปปัญหาที่เจอให้ทีม', 'วาด wireframe หน้าติดตามพัสดุ'],
      skills: ['Usability test', 'Wireframe', 'FigJam'], related: null }
  ],
  education: [
    { from: { y: 2019 }, to: { y: 2023 }, now: false, level: 'ปริญญาตรี', major: 'ออกแบบนิเทศศิลป์', faculty: 'ศิลปกรรมศาสตร์', org: 'มหาวิทยาลัย (ชื่อตัวอย่าง)', honors: 'เกียรตินิยมอันดับ 2', gpa: '3.52', files: [],
      highlights: ['ปริญญานิพนธ์: แอปช่วยผู้สูงอายุนัดหมอและเตือนกินยา', 'เข้ารอบสุดท้ายการประกวดออกแบบแอประดับมหาวิทยาลัย'],
      skills: ['User interview', 'Figma', 'Illustrator', 'Typography'],
      activities: ['ฝ่ายออกแบบ งานนิทรรศการคณะ', 'อาสาสอนศิลปะให้เด็กในชุมชน'] }
  ],
  contact: {
    heading: 'มีโจทย์อยาก⁠คุย ส่งมา⁠ได้⁠เลย',
    email: 'hello@yourdomain.com',
    links: [ { label: 'LinkedIn', icon: 'person', url: '' }, { label: 'Dribbble', icon: 'palette', url: '' } ]
  },
  /* เนื้อหา case study · บล็อก: p · tbd · quote · ba · image · video · steps · out · links · callout · stats · ai · prompt
     teaser = ส่วนที่โชว์บนหน้าแรก (ปัญหา / ทางแก้ / ผลลัพธ์ + ภาพก่อน/หลัง) */
  cases: {
 bank:{teaser:{problem:'ผู้ใช้กดยกเลิกกลางทางตอนโอนเงิน เพราะต้องกรอกเลขบัญชีซ้ำ และไม่แน่ใจว่ากรอกถูกไหม',solution:'รวมขั้นตอนยืนยันไว้หน้าเดียว เพิ่มรายชื่อผู้รับล่าสุด และโชว์สรุปก่อนกดโอน',result:'',before:null,after:null},title:'Banking app redesign',sum:'ออกแบบ flow โอนเงินใหม่ ให้ผู้ใช้โอนจบในหน้าเดียวและมั่นใจว่ากรอกถูก',cat:'Mobile',tags:['Fintech','UX research'],role:'Lead UX/UI',scope:['UX','UI'],time:'8 สัปดาห์',team:'PM, 2 Dev, QA',chapters:[
  {t:'ปัญหาที่ผู้ใช้เจอ',b:[{type:'p',text:'ผู้ใช้กดยกเลิกกลางทางตอนโอนเงิน เพราะต้องกรอกเลขบัญชีซ้ำ และไม่แน่ใจว่ากรอกถูกไหม'},{type:'tbd',text:'บริบทเพิ่ม: ผู้ใช้กลุ่มไหน เจอตอนไหน ข้อมูลมาจากไหน'}]},
  {t:'วิธีทำงานในโปรเจกต์นี้',b:[{type:'steps',items:[['Understand','สัมภาษณ์ + ดูข้อมูลเดิม'],['Define','flow โอนเงินใหม่'],['Design','UI ด้วย component กลาง'],['Validate','ทดสอบกับผู้ใช้']]},{type:'out',items:['สรุปปัญหา','User flow','UI ใน Figma','ผลทดสอบ']}]},
  {t:'คุยกับผู้ใช้',b:[{type:'tbd',text:'วิธีที่ใช้ จำนวนคน และสิ่งที่เจอ'},{type:'quote',text:'— คำพูดจริงจากผู้ใช้หรือผู้เข้าร่วมทดสอบ (ขออนุญาตก่อนใช้) —',by:'ชื่อ · บทบาท'}]},
  {t:'ทางแก้ และสิ่งที่ตัดทิ้ง',b:[{type:'p',text:'รวมขั้นตอนยืนยันไว้หน้าเดียว เพิ่มรายชื่อผู้รับล่าสุด และโชว์สรุปก่อนกดโอน'},{type:'ba'},{type:'callout',title:'สิ่งที่ตัดทิ้ง',text:'ทางเลือกที่ลองแล้วไม่ใช้ และเหตุผล (รอข้อมูลจริง)'},{type:'links',items:[['draw','ดู prototype','Figma','#']]}]},
  {t:'ผลลัพธ์',b:[{type:'stats',items:[['—','อัตราโอนสำเร็จ (รอตัวเลขจริง)'],['—','เวลาเฉลี่ยต่อรายการ (รอตัวเลขจริง)']]}]}]},
 research:{title:'Onboarding study',sum:'หาว่าผู้ใช้ใหม่ติดตรงไหนตอนสมัคร และส่งข้อเสนอให้ทีมแก้ก่อนปล่อยเวอร์ชันถัดไป',cat:'Research',tags:['Research','Mobile'],role:'UX researcher',scope:['UX research'],time:'4 สัปดาห์',team:'PM, Designer',chapters:[
  {t:'คำถามของงานวิจัย',b:[{type:'p',text:'ผู้ใช้ใหม่ติดตรงไหนตอนสมัคร และทำไมถึงไม่กลับมาในวันที่สอง'}]},
  {t:'วิธีทำงานในโปรเจกต์นี้',b:[{type:'steps',items:[['Plan','ตั้งคำถามและเลือกวิธี'],['Interview','คุยกับผู้ใช้ใหม่'],['Synthesize','จัดกลุ่มสิ่งที่เจอ']]},{type:'out',items:['แผนวิจัย','บันทึกสัมภาษณ์','Affinity map','ข้อเสนอแนะ']}]},
  {t:'สิ่งที่เจอ',b:[{type:'tbd',text:'ข้อค้นพบหลัก 3–5 ข้อ พร้อมหลักฐาน'},{type:'quote',text:'— คำพูดจริงจากผู้ให้สัมภาษณ์ (ขออนุญาตก่อนใช้) —',by:'ผู้ใช้ใหม่ · อายุ/อาชีพ'},{type:'image',cap:'Affinity map (ภาพจริง)'}]},
  {t:'ข้อเสนอแนะและสิ่งที่ทีมทำต่อ',b:[{type:'tbd',text:'ข้อเสนอที่ทีมนำไปใช้จริง'}]}]},
 ai:{title:'ผู้ช่วยตอบแชตร้านค้า',sum:'ให้ AI ร่างคำตอบแชตลูกค้า โดยคนในร้านตรวจและกดส่งเองทุกข้อความ',cat:'Web',tags:['AI','UX writing'],role:'Product designer',scope:['UX','UI','AI integration'],time:'10 สัปดาห์',team:'PM, 2 Dev, Data',chapters:[
  {t:'โจทย์',b:[{type:'p',text:'ร้านค้าตอบแชตลูกค้าไม่ทัน อยากให้ AI ร่างคำตอบให้ แต่คนในร้านยังเป็นคนกดส่งเอง'}]},
  {t:'วิธีทำงานในโปรเจกต์นี้',b:[{type:'steps',items:[['Understand','ดูแชตจริงที่ร้านตอบ'],['Prompt','ออกแบบคำสั่งและน้ำเสียง'],['Design','หน้าตรวจคำตอบก่อนส่ง'],['Evaluate','วัดคุณภาพคำตอบ']]},{type:'out',items:['ชุดคำสั่ง (prompt)','ชุดทดสอบคำตอบ','UI ใน Figma']}]},
  {t:'AI ทำอะไร คนทำอะไร',b:[{type:'ai',rows:[['AI ทำ','ร่างคำตอบจากประวัติแชตและข้อมูลสินค้า'],['คนทำ','ตรวจ แก้ และกดส่งทุกข้อความ'],['เครื่องมือ','ระบุโมเดล / บริการที่ใช้จริง (รอข้อมูลจริง)'],['กันพลาด','ไม่ตอบเรื่องราคาและการคืนเงินเอง ส่งต่อให้คน']]},{type:'prompt',title:'ตัวอย่างคำสั่ง (ย่อ)',text:'คุณคือพนักงานร้าน ตอบสั้น สุภาพ เป็นกันเอง\nใช้ข้อมูลสินค้าที่ให้เท่านั้น ถ้าไม่แน่ใจให้บอกว่าจะส่งต่อให้พนักงาน\nห้ามสัญญาเรื่องราคา ส่วนลด หรือการคืนเงิน'},{type:'callout',title:'สิ่งที่ตัดทิ้ง',text:'ให้ AI ส่งข้อความเองอัตโนมัติ เพราะร้านไม่มั่นใจในคำตอบเรื่องเงิน (รอข้อมูลจริง)'}]},
  {t:'ดูการทำงาน',b:[{type:'video',cap:'วิดีโอสาธิตการตรวจและส่งคำตอบ (ใส่ลิงก์จริง)'}]},
  {t:'ผลลัพธ์',b:[{type:'stats',items:[['—','เวลาตอบเฉลี่ย (รอตัวเลขจริง)'],['—','คำตอบที่ส่งโดยไม่ต้องแก้ (รอตัวเลขจริง)']]}]}]},
 fe:{title:'Analytics console',sum:'สร้างหน้าดูข้อมูลสำหรับทีมปฏิบัติการ ให้โหลดเร็วกับข้อมูลจำนวนมาก',cat:'Web',tags:['Dashboard','Frontend'],role:'Frontend developer',scope:['Frontend'],time:'6 สัปดาห์',team:'Designer, Backend',chapters:[
  {t:'โจทย์',b:[{type:'p',text:'ทำหน้าดูข้อมูลสำหรับทีมปฏิบัติการ จาก design ที่มีอยู่แล้ว ให้โหลดเร็วและใช้กับข้อมูลจำนวนมากได้'}]},
  {t:'วิธีทำงานในโปรเจกต์นี้',b:[{type:'steps',items:[['Plan','แยก component และ state'],['Build','ทำหน้าและตาราง'],['Ship','ทดสอบ + ปล่อยใช้งาน']]},{type:'out',items:['Component library','หน้า Dashboard','Test']}]},
  {t:'ดูการทำงาน',b:[{type:'video',src:'',cap:'วิดีโอสาธิต (ใส่ลิงก์ YouTube / Vimeo / MP4)'},{type:'links',items:[['code','ดูโค้ด','GitHub','#'],['open_in_new','เว็บที่ใช้งานจริง','ลิงก์จริง','#']]}]},
  {t:'ผลลัพธ์',b:[{type:'tbd',text:'ความเร็วโหลด จำนวนผู้ใช้ หรือสิ่งที่ทีมได้ใช้จริง'}]}]}
  }
};

/* เติมช่องที่ข้อมูลรุ่นเก่ายังไม่มี (id ของรายการ · caseIds · sections · order) */
/* ทักษะแยกกลุ่ม: เดาหมวดจากชื่อ (ใช้ตอนย้ายข้อมูลเก่า และตอน AI เติมทักษะ) */
window.PF_SKILL_CAT = function (s) {
  var t = String(s).toLowerCase();
  if (/figma|figjam|framer|protopie|miro|notion|illustrator|photoshop|sketch|maze|adobe|after effects|canva|jira/.test(t)) return 'เครื่องมือ';
  if (/html|css|javascript|typescript|react|vue|swift|kotlin|python|git|tailwind|frontend|code|sql|flutter/.test(t)) return 'Coding';
  if (/ux|ui|design|prototyp|wirefram|usability|research|interview|interaction|information architecture|accessib|visual|motion|persona|journey|typograph|user|responsive|handoff/.test(t)) return 'UX/UI';
  return 'อื่นๆ';
};
window.PF_SKILL_ORDER = ['UX/UI', 'Coding', 'เครื่องมือ', 'อื่นๆ'];
/* ช่วงเวลา (v3.5): from/to = { y, m } (เดือนไม่บังคับ) · now = ยังทำอยู่ → period เป็นข้อความที่คำนวณให้ */
window.PF_MON = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
window.PF_PERIOD = function (x) {
  var M = window.PF_MON, f = x.from || {}, t = x.to || {}, one = function (o) { return o.y ? (o.m ? M[o.m - 1] + ' ' : '') + o.y : ''; };
  if (!f.y) return '';
  if (x.now) return one(f) + ' – ปัจจุบัน';
  if (!t.y) return one(f);
  if (t.y === f.y && f.m && t.m) return f.m === t.m ? one(f) : M[f.m - 1] + ' – ' + M[t.m - 1] + ' ' + f.y;
  if (t.y === f.y && !f.m && !t.m) return String(f.y);
  return one(f) + ' – ' + one(t);
};
window.PF_PARSE_PERIOD = function (s) {
  s = String(s || ''); var M = window.PF_MON, ys = s.match(/\d{4}/g) || [], ms = [];
  M.forEach(function (n, i) { var k = s.indexOf(n); if (k >= 0) ms.push([k, i + 1]); }); ms.sort(function (a, b) { return a[0] - b[0]; });
  var now = /ปัจจุบัน|now|present/i.test(s), y1 = +ys[0] || null, y2 = +ys[1] || null;
  if (!y2 && !now && ms.length > 1) y2 = y1;
  return { from: { y: y1, m: ms[0] ? ms[0][1] : null }, to: now || !y2 ? null : { y: y2, m: ms[1] ? ms[1][1] : null }, now: now };
};
window.PF_EDU_LEVELS = ['ปริญญาเอก', 'ปริญญาโท', 'ปริญญาตรี', 'ปวส.', 'ปวช.', 'มัธยมปลาย', 'ประกาศนียบัตร / คอร์ส'];
/* ปีประสบการณ์: ใส่เอง หรือคำนวณจากประวัติงานเท่านั้น (นับเฉพาะประเภทที่เลือก · ช่วงที่ซ้อนกันนับครั้งเดียว) */
window.PF_YEARS = function (d) {
  var Y = (d.profile && d.profile.years) || {}, X = d.experience || [];
  if (Y.mode === 'manual') return { n: +Y.n || null, manual: true };
  var inc = Y.types, now = new Date(), nI = now.getFullYear() * 12 + now.getMonth();
  var iv = X.filter(function (x) { return !inc || inc.indexOf(x.type) >= 0; }).map(function (x) {
    var f = x.from || {}, t = x.to || {}; if (!f.y) return null;
    var a = f.y * 12 + ((f.m || 1) - 1), b = x.now ? nI : t.y ? t.y * 12 + ((t.m || 12) - 1) : a + (f.m ? 0 : 11);
    return b >= a ? [a, b + 1] : null;
  }).filter(Boolean).sort(function (p, q) { return p[0] - q[0]; });
  var mo = 0, cur = null;
  iv.forEach(function (r) { if (cur && r[0] <= cur[1]) cur[1] = Math.max(cur[1], r[1]); else { if (cur) mo += cur[1] - cur[0]; cur = r.slice(); } });
  if (cur) mo += cur[1] - cur[0];
  var intern = X.some(function (x) { return x.type === 'ฝึกงาน' && (!inc || inc.indexOf('ฝึกงาน') >= 0); });
  return { n: mo ? Math.max(1, Math.round(mo / 12)) : null, intern: intern, count: iv.length };
};
/* ค่าที่คำนวณจากช่องอื่น (เรียกทุกครั้งที่ข้อมูลเปลี่ยน) */
window.PF_DERIVE = function (d) {
  if (Array.isArray(d.featuredCases)) { d.featuredCases = d.featuredCases.filter(function (k) { return d.cases && d.cases[k]; }).slice(0, 3); d.featuredCase = d.featuredCases[0] || null; }
  var P = d.profile;
  if (P && Array.isArray(P.skillSets)) P.skills = [].concat.apply([], P.skillSets.map(function (g) { return g.items || []; }));
  var fix = function (o) { if (!o) return o; o.y = +o.y || null; o.m = +o.m || null; return o; };
  [].concat(d.experience || [], d.education || []).forEach(function (x) {
    if (!x.from) return; fix(x.from); fix(x.to); x.period = window.PF_PERIOD(x);
  });
  (d.experience || []).forEach(function (x) { if (x.from) x.start = x.from.y || ''; });
  (d.education || []).forEach(function (e) { if (e.level !== undefined || e.major !== undefined) e.degree = [e.level, e.major].filter(Boolean).join(' '); });
  Object.keys(d.cases || {}).forEach(function (k) { ((d.cases[k] || {}).chapters || []).forEach(function (ch) { (ch.b || []).forEach(function (b) {
    if (b.type !== 'links') return; (b.items || []).forEach(function (l) { var u = String(l[3] || '').trim(); if (u === '#') { l[3] = ''; return; } if (!u) return; if (!/^[a-z]+:/i.test(u) && /\./.test(u)) u = 'https://' + u; l[3] = u;
      var h = (u.match(/^https?:\/\/(?:www\.)?([^\/]+)/i) || [])[1] || ''; l[2] = /figma/.test(h) ? 'Figma' : /github/.test(h) ? 'GitHub' : /youtu/.test(h) ? 'YouTube' : /behance/.test(h) ? 'Behance' : /dribbble/.test(h) ? 'Dribbble' : h;
      l[0] = /figma/.test(h) ? 'draw' : /github|gitlab/.test(h) ? 'code' : /youtu|vimeo/.test(h) ? 'play_circle' : 'open_in_new'; }); }); }); });
  Object.keys(d.cases || {}).forEach(function (k) { var c = d.cases[k]; if (c && c.timeN !== undefined) c.time = c.timeN !== '' && c.timeN != null ? c.timeN + ' ' + (c.timeU || 'สัปดาห์') : ''; });
  return d;
};
/* ทักษะบนหน้าแรก: 'flat' | 'group' | ไม่ตั้ง = อัตโนมัติ (แยกกลุ่มเมื่อทักษะเกิน 8 และมีมากกว่า 1 กลุ่ม) */
window.PF_SKV = function (P) {
  var g = (P.skillSets || []).filter(function (x) { return x.items && x.items.length; }).length, n = (P.skills || []).length;
  var v = P.skillsView === 'flat' || P.skillsView === 'group' ? P.skillsView : (n > 8 && g > 1 ? 'group' : 'flat');
  return v === 'group' && g < 2 ? 'flat' : v;
};
window.PF_NORMALIZE = function (d) {
  /* id คงที่ (ไม่สุ่ม): normalize ข้อมูลชุดเดิมกี่ครั้งก็ได้ id เดิม ร่างกับฉบับบันทึกเทียบกันได้ */
  var used = {}, all = [].concat(d.works || [], d.process || [], d.experience || [], d.education || [], (d.contact && d.contact.links) || []);
  all.forEach(function (x) { if (x && x.id) used[x.id] = 1; });
  ((d.profile && d.profile.skillSets) || []).forEach(function (g) { if (g && g.id) used[g.id] = 1; });
  var id = function (p) { for (var n = 1; used[p + n]; n++); used[p + n] = 1; return p + n; };
  d.sections = Object.assign({ works: true, process: true, 'case': true, experience: true }, d.sections || {});
  d.order = Object.assign({ works: 'manual', experience: 'auto', education: 'auto' }, d.order || {});
  /* v4: ลำดับส่วนบนหน้าแรก (ผู้ใช้ลากเรียงเอง) · ท้ายเว็บ · ขนาดประโยคแนะนำตัว */
  var LAY = ['works', 'process', 'case', 'experience'];
  d.layout = (Array.isArray(d.layout) ? d.layout : []).filter(function (k, i, a) { return LAY.indexOf(k) >= 0 && a.indexOf(k) === i; });
  LAY.forEach(function (k) { if (d.layout.indexOf(k) < 0) d.layout.push(k); });
  d.cases = d.cases || {}; d.site = d.site || {}; d.site.footer = Object.assign({ links: true, top: true }, d.site.footer || {}); d.theme = d.theme || { brand: '#4C45D2' }; d.contact = d.contact || { links: [] };
  (d.works || []).forEach(function (w) { if (!w.id) w.id = id('w'); if (!w.caseIds) w.caseIds = w.caseId ? [w.caseId] : []; delete w.caseId; });
  ['process', 'experience', 'education'].forEach(function (k) { (d[k] || []).forEach(function (x) { if (!x.id) x.id = id(k.charAt(0)); }); });
  (d.contact.links || []).forEach(function (x) { if (!x.id) x.id = id('l'); });
  var P = d.profile;
  if (P) {
    if (!Array.isArray(P.headline)) P.headline = P.headline ? [String(P.headline)] : [''];
    P.headline = P.headline.slice(0, 3); if (!P.headline.length) P.headline = [''];
    if (['h1', 'h2', 'h3'].indexOf(P.headlineSize) < 0) P.headlineSize = 'h1';
    /* ขนาดของแต่ละบรรทัด (h1 · h2 · h3) · ข้อมูลเก่าที่มีขนาดเดียวทั้งก้อน ใช้ค่านั้นกับทุกบรรทัด */
    var HS0 = Array.isArray(P.headlineSizes) ? P.headlineSizes : [];
    P.headlineSizes = P.headline.map(function (l, i) { return ['h1', 'h2', 'h3'].indexOf(HS0[i]) >= 0 ? HS0[i] : P.headlineSize; });
    if (!Array.isArray(P.skillSets)) {
      var by = {};
      (P.skills || []).forEach(function (s) { var c = window.PF_SKILL_CAT(s); (by[c] = by[c] || []).push(s); });
      P.skillSets = window.PF_SKILL_ORDER.filter(function (c) { return by[c]; }).map(function (c) { return { name: c, items: by[c] }; });
    }
    P.skillSets.forEach(function (g) { if (!g.id) g.id = id('g'); g.items = g.items || []; g.name = g.name || ''; });
    P.years = Object.assign({ mode: 'auto', n: '', types: ['งานประจำ', 'ฟรีแลนซ์', 'สัญญาจ้าง', 'ฝึกงาน'] }, P.years || {});
  }
  [].concat(d.experience || [], d.education || []).forEach(function (x) {
    if (!x.from) { var r = window.PF_PARSE_PERIOD(x.period); if (!r.from.y && x.start) r.from.y = +x.start; x.from = r.from; x.to = r.to; x.now = r.now; }
  });
  (d.education || []).forEach(function (e) {
    if (e.level === undefined) { var dg = String(e.degree || ''), L = window.PF_EDU_LEVELS.filter(function (l) { return dg.indexOf(l) === 0; })[0]; e.level = L || ''; e.major = (L ? dg.slice(L.length) : dg).trim(); }
    e.faculty = e.faculty || ''; e.files = e.files || [];
  });
  Object.keys(d.cases).forEach(function (k) { var c = d.cases[k]; if (!c || c.timeN !== undefined) return; var m = String(c.time || '').match(/^\s*(\d+)\s*(วัน|สัปดาห์|เดือน|ปี)\s*$/); if (m) { c.timeN = +m[1]; c.timeU = m[2]; } else if (!c.time) { c.timeN = ''; c.timeU = 'สัปดาห์'; } });
  if (!Array.isArray(d.featuredCases)) d.featuredCases = d.featuredCase ? [d.featuredCase] : [];
  if (!Array.isArray(d.workCats)) { var wc = []; (d.works || []).forEach(function (w) { if (w.cat && wc.indexOf(w.cat) < 0) wc.push(w.cat); }); d.workCats = wc; }
  window.PF_DERIVE(d);
  return d;
};
/* ==========================================================================
   สองภาษา (ไทย · อังกฤษ)
   - คำแปลของแต่ละช่องเก็บคู่กับช่องเดิม ต่อท้ายชื่อด้วย _en เช่น title + title_en (ย้าย/เรียงรายการแล้วคำแปลตามไปด้วย)
   - ช่องที่ยังไม่แปล = ใช้ภาษาไทยแทน (หน้าเว็บไม่มีช่องโหว่)
   - รายการข้อความ (ข้อย่อย · บรรทัดหัวเรื่อง) จับคู่ตามลำดับ ข้อไหนยังไม่แปลใช้ข้อไทยข้อนั้น
   - คำของระบบบนหน้าเว็บ (เมนู · ปุ่ม · ป้าย) แปลจากตาราง PF_EN ด้านล่าง
   ========================================================================== */
window.PF_LOC = function (o) {
  var ne = function (v) { return v != null && String(v).trim() !== ''; };
  var mix = function (en, th) {
    if (Array.isArray(en)) {
      if (!Array.isArray(th)) return en.filter(ne).length ? en : th;
      var n = th.length || en.length, r = [];
      for (var i = 0; i < n; i++) { var e = en[i], t = th[i]; r.push(Array.isArray(e) || Array.isArray(t) ? mix(e || [], t || []) : ne(e) ? e : t); }
      return r.filter(function (x) { return x !== undefined; });
    }
    return ne(en) ? en : th;
  };
  var loc = function (x) {
    if (Array.isArray(x)) return x.map(loc);
    if (x && typeof x === 'object') {
      var r = {}, k;
      for (k in x) if (!/_en$/.test(k)) r[k] = loc(x[k]);
      for (k in x) if (/_en$/.test(k)) { var b = k.slice(0, -3); r[b] = mix(x[k], r[b]); }
      return r;
    }
    return x;
  };
  return loc(o);
};
window.PF_EN = {
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
(function () {
  var MON = { 'ม.ค.': 'Jan', 'ก.พ.': 'Feb', 'มี.ค.': 'Mar', 'เม.ย.': 'Apr', 'พ.ค.': 'May', 'มิ.ย.': 'Jun', 'ก.ค.': 'Jul', 'ส.ค.': 'Aug', 'ก.ย.': 'Sep', 'ต.ค.': 'Oct', 'พ.ย.': 'Nov', 'ธ.ค.': 'Dec' };
  var UNIT = { 'วัน': 'day', 'สัปดาห์': 'week', 'เดือน': 'month', 'ปี': 'year' };
  var LV = ['ปริญญาตรี', 'ปริญญาโท', 'ปริญญาเอก', 'ปวช.', 'ปวส.', 'มัธยมปลาย', 'ประกาศนียบัตร / คอร์ส'];
  var pl = function (n, w) { return n + ' ' + w + (+n === 1 ? '' : 's'); };
  /* ประโยคที่มีตัวเลขหรือชื่ออยู่ข้างใน */
  var RULES = [
    [/^ดูผลงานทั้งหมด (\d+) ชิ้น$/, function (m) { return 'See all ' + pl(m[1], 'project'); }],
    [/^ดูทั้งหมด (\d+) ชิ้น$/, function (m) { return 'See all ' + m[1]; }],
    [/^(\d+) ชิ้น$/, function (m) { return pl(m[1], 'project'); }],
    [/^แสดง (\d+) ชิ้น$/, function (m) { return 'Show ' + pl(m[1], 'project'); }],
    [/^รายละเอียด (.+)$/, function (m) { return 'Details for ' + m[1]; }],
    [/^(\S+\.) – (\S+\.) (\d{4})$/, function (m) { return MON[m[1]] && MON[m[2]] ? MON[m[1]] + ' – ' + MON[m[2]] + ' ' + m[3] : null; }],
    [/^แสดงเพิ่ม \((\d+)\)$/, function (m) { return 'Show ' + m[1] + ' more'; }],
    [/^แสดงแท็กทั้งหมด \((\d+)\)$/, function (m) { return 'Show all tags (' + m[1] + ')'; }],
    [/^แสดงแท็กอีก (\d+) อัน: (.*)$/, function (m) { return pl(m[1], 'more tag') + ': ' + m[2]; }],
    [/^กรองด้วย (.+)$/, function (m) { return 'Filter by ' + m[1]; }],
    [/^เอา (.+) ออก$/, function (m) { return 'Remove ' + m[1]; }],
    [/^ไม่พบ “(.*)”$/, function (m) { return 'Nothing found for “' + m[1] + '”'; }],
    [/^ตอน (\d+) จาก (\d+)$/, function (m) { return 'Part ' + m[1] + ' of ' + m[2]; }],
    [/^ตอน (\d+)$/, function (m) { return 'Part ' + m[1]; }],
    [/^ตอนที่ (\d+)$/, function (m) { return 'Part ' + m[1]; }],
    [/^Case study · (\d+) ตอน(.*)$/, function (m) { return 'Case study · ' + pl(m[1], 'part') + m[2]; }],
    [/^ดูภาพที่ (\d+) ขนาดใหญ่$/, function (m) { return 'View image ' + m[1] + ' full size'; }],
    [/^(\d+)\+? (วัน|สัปดาห์|เดือน|ปี)$/, function (m) { return pl(m[1], UNIT[m[2]]); }],
    [/^(?:(\S+\.) )?(\d{4}) – (?:(?:(\S+\.) )?(\d{4})|ปัจจุบัน)$/, function (m) { if ((m[1] && !MON[m[1]]) || (m[3] && !MON[m[3]])) return null; return (m[1] ? MON[m[1]] + ' ' : '') + m[2] + ' – ' + (m[4] ? (m[3] ? MON[m[3]] + ' ' : '') + m[4] : 'Present'); }],
    [/^(\S+\.) (\d{4})$/, function (m) { return MON[m[1]] ? MON[m[1]] + ' ' + m[2] : null; }]
  ];
  window.PF_TR = function (t, deep) {
    var E = window.PF_EN; if (E[t]) return E[t];
    if (t.indexOf('+ ') === 0 && E[t.slice(2)]) return '+ ' + E[t.slice(2)];
    for (var i = 0; i < RULES.length; i++) { var m = t.match(RULES[i][0]); if (m) { var r = RULES[i][1](m); if (r) return r; } }
    /* วุฒิ + สาขา เช่น "ปริญญาตรี Communication design" */
    for (var j = 0; j < LV.length; j++) if (t.indexOf(LV[j] + ' ') === 0) return E[LV[j]] + ', ' + t.slice(LV[j].length + 1);
    /* หลายส่วนคั่นด้วยจุดกลาง เช่น "Lead UX/UI · 8 สัปดาห์" แปลทีละส่วน */
    if (!deep && t.indexOf(' · ') > 0) { var ch = false, ps = t.split(' · ').map(function (x) { var r = window.PF_TR(x.trim(), 1); if (r) { ch = true; return r; } return x; }); if (ch) return ps.join(' · '); }
    return null;
  };
  /* แปลคำของระบบบนหน้า: ทำงานกับข้อความที่ตรงตารางทั้งก้อนเท่านั้น เนื้อหาที่เจ้าของพิมพ์เองไม่ถูกแตะ */
  var TH = /[฀-๿]/, ATTR = ['aria-label', 'title', 'placeholder', 'alt', 'data-label', 'data-lab'];
  var skip = function (el) { return !el || (el.closest && el.closest('script,style,[data-pe],[contenteditable="true"],.pf-pk')); };
  var own = function (el) { return el && el.closest && el.closest('.tbd-tag,.pf-addb,.ph-fig,.wk-ed'); };   /* ป้ายของระบบที่อยู่ในบริเวณที่แก้ได้ ยังต้องแปล */
  var txt = function (n) { var v = n.nodeValue; if (!v || !TH.test(v) || (skip(n.parentNode) && !own(n.parentNode))) return; var t = v.trim(), r = window.PF_TR(t); if (t === 'ปี' && n.previousSibling && String(n.previousSibling.textContent).trim() === '1') r = 'year'; if (r && r !== t) n.nodeValue = v.replace(t, r); };
  var att = function (el) { for (var i = 0; i < ATTR.length; i++) { var v = el.getAttribute(ATTR[i]); if (v && TH.test(v)) { var r = window.PF_TR(v.trim()); if (r && r !== v) el.setAttribute(ATTR[i], r); } } };
  var walk = function (root) {
    if (root.nodeType === 3) { txt(root); return; }
    if (root.nodeType !== 1 || (skip(root) && !own(root))) return;
    att(root); var els = root.querySelectorAll('[aria-label],[title],[placeholder],[alt],[data-label],[data-lab]'); for (var i = 0; i < els.length; i++) if (!skip(els[i]) || own(els[i])) att(els[i]);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n; while ((n = w.nextNode())) txt(n);
  };
  window.PF_I18N_START = function () {
    walk(document.documentElement);
    new MutationObserver(function (ms) { ms.forEach(function (m) {
      if (m.type === 'characterData') txt(m.target);
      else if (m.type === 'attributes') { if (!skip(m.target)) att(m.target); }
      else [].forEach.call(m.addedNodes, walk);
    }); }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
  };
})();
/* ภาษาที่ใช้แสดง: หลังบ้านกำหนดให้ (PF_LANG) · หน้าเว็บจริง = ที่ผู้ชมเลือกไว้ ไม่งั้นใช้ภาษาเริ่มต้นของเว็บ · เว็บที่ไม่ได้เปิดสองภาษา = ไทย */
window.PF_SETLANG = function (d) {
  var on = !!(d.site && d.site.i18n), L = window.PF_LANG;
  if (!on && d.site && d.site.only === 'en') L = 'en';   /* เว็บอังกฤษภาษาเดียว: หัวข้อของเว็บเป็นอังกฤษ เนื้อหาใช้ชุดหลัก */
  if (L !== 'en' && L !== 'th') { L = null; if (on) { try { L = localStorage.getItem('pf-lang'); } catch (e) {} if (L !== 'en' && L !== 'th') L = d.site.lang === 'en' ? 'en' : 'th'; } }
  window.PF_LANG = L === 'en' ? 'en' : 'th';
  try { document.documentElement.lang = window.PF_LANG; } catch (e) {}
  /* เนื้อหา: ชุดหลักเป็นภาษาแรกที่เจ้าของเลือก (site.base) ดูอีกภาษา = เอาช่องคำแปลมาทับ · หัวข้อของเว็บ: แปลเป็นอังกฤษเมื่อดูภาษาอังกฤษ */
  var base = on && d.site.base === 'en' ? 'en' : 'th';
  if (on && window.PF_LANG !== base) d = window.PF_DERIVE(window.PF_LOC(d));
  if (window.PF_LANG === 'en') { try { window.PF_I18N_START(); } catch (e) {} }
  return d;
};
/* เลือกชุดข้อมูล: หลังบ้าน (?edit=1) = ร่างที่กำลังแก้ · หน้าเว็บปกติ = ฉบับเผยแพร่ล่าสุด · ไม่มี = ตัวอย่างด้านบน */
window.PORTFOLIO = (function () {
  var edit = /[?&]edit=1/.test((window.PF_QS||location.search)), keys = edit ? ['pf-draft', 'pf-saved', 'pf-published'] : ['pf-published'];
  /* หลังบ้านส่งข้อมูลมาให้ตรงๆ (PF_DATA) = ใช้ชุดนั้นเลย ไม่อ่านจาก localStorage ซึ่งเต็มได้เมื่อมีภาพเยอะ */
  if (window.PF_DATA) { try { return window.PF_SETLANG(window.PF_NORMALIZE(window.PF_DATA)); } catch (e) {} }
  try { for (var i = 0; i < keys.length; i++) { var s = localStorage.getItem(keys[i]); if (s) return window.PF_SETLANG(window.PF_NORMALIZE(JSON.parse(s))); } } catch (e) {}
  return window.PF_SETLANG(window.PF_NORMALIZE(JSON.parse(JSON.stringify(window.PORTFOLIO_DEFAULT))));
})();
