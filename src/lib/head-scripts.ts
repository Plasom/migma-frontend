/**
 * สคริปต์หัวหน้าเว็บ (ทำงานก่อนวาดหน้าแรก กันจอวาบผิดธีม) · เขียนเป็น ES5 ล้วนเพราะไม่ผ่าน bundler
 */
import { MOTION_HEAD_SCRIPT } from '@/lib/motion/motion';

/** โหมดสว่าง/มืด: ค่าที่จำไว้ ไม่งั้นตามระบบ */
const THEME =
  "(function(){var t;try{t=localStorage.getItem('theme')}catch(e){}if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t)})();";

/** หน้า portfolio: ธีม · ลูกเล่นเข้าหน้า · ซ่อนจน engine วาดเสร็จ (สูงสุด 3 วินาที) · โหลดซ้ำแบบนิ่งในหลังบ้าน (?still=1) */
export const SITE_HEAD =
  THEME +
  MOTION_HEAD_SCRIPT +
  ";(function(){var r=document.documentElement;r.classList.add('pf-boot');setTimeout(function(){r.classList.remove('pf-boot')},3000);if(/[?&]still=1/.test(location.search))r.classList.add('pf-still')})();";

/** หลังบ้าน: ธีม */
export const EDITOR_HEAD = THEME;

/** หน้าบัญชี: ฝังในหลังบ้าน (?embed=1) = class emb · ธีมตามที่จำไว้ (ไม่มี = สว่าง) */
export const ACCOUNT_HEAD =
  "(function(){var r=document.documentElement,t;if(/[?&]embed=1/.test(location.search))r.className+=' emb';try{t=localStorage.getItem('theme')}catch(e){}r.setAttribute('data-theme',t==='dark'?'dark':'light')})();";
