/* ข้อมูลตัวอย่าง: ใช้ตอนยังไม่มีฉบับไหนในเครื่อง (ย้ายมาจาก wireframe/src/preview/data/portfolio.js) */
import type { Portfolio } from './types';

export const PORTFOLIO_DEFAULT: Portfolio = {
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
