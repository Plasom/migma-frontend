/* พอร์ตเปล่าของผู้ใช้ใหม่ (ยังไม่มีฉบับไหนในหลังบ้าน) · ไม่มีข้อมูลตัวอย่างของคนอื่น */
import type { Portfolio } from './types';

export const DEFAULT_BRAND = '#4C45D2';

/** พอร์ตเปล่า · ส่งต่อให้ normalize() เติมส่วนที่เหลือ */
export function blankPortfolio(brand: string = DEFAULT_BRAND): Portfolio {
  return {
    version: 1,
    sample: false,
    site: { name: '', logo: null, year: new Date().getFullYear() },
    theme: { brand },
    profile: {
      name: '', fullName: '', role: '', avatar: null, headline: ['', ''], lede: '', ledeDraft: false,
      skills: [], skillSets: [], location: '', status: 'open', resume: '',
    },
    works: [],
    process: [],
    featuredCase: null,
    sections: { works: true, process: true, case: true, experience: true },
    order: { works: 'manual', experience: 'auto' },
    experience: [],
    education: [],
    contact: { heading: 'ติดต่อ', email: '', links: [] },
    cases: {},
  } as Portfolio;
}
