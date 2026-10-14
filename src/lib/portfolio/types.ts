/**
 * โครงข้อมูล portfolio (spec: wireframe/src/core/patterns/data-model.md)
 * ข้อมูลชุดเดียวกันใช้ทั้งหลังบ้าน (ร่าง · บันทึก · เผยแพร่) และหน้าเว็บ
 * ช่องที่ลงท้าย `_en` = คำแปลอังกฤษของช่องเดิม (ดู `localize`)
 */

/** ช่องคำแปล `<field>_en` ที่วางคู่ช่องเดิมได้ทุกระดับ */
export type Localized = { [k: `${string}_en`]: unknown };

export interface YearMonth {
  y: number | null;
  m?: number | null;
}

export interface Period {
  from?: YearMonth | null;
  to?: YearMonth | null;
  now?: boolean;
  /** คำนวณจาก from/to/now (`derive`) */
  period?: string;
}

export interface Site extends Localized {
  name?: string;
  logo?: string | null;
  logoOff?: boolean;
  year?: number;
  i18n?: boolean;
  lang?: 'th' | 'en';
  base?: 'th' | 'en';
  only?: 'th' | 'en';
  slug?: string;
  footer?: { links?: boolean; top?: boolean };
  [k: string]: unknown;
}

export interface SkillSet extends Localized {
  id?: string;
  name: string;
  items: string[];
}

export interface YearsSetting {
  mode: 'auto' | 'manual';
  n: number | string;
  types: string[];
}

export type HeadlineSize = 'h1' | 'h2' | 'h3';

export interface Profile extends Localized {
  name?: string;
  fullName?: string;
  role?: string;
  avatar?: string | null;
  headline: string[];
  headlineSize?: HeadlineSize;
  headlineSizes?: HeadlineSize[];
  lede?: string;
  ledeDraft?: boolean;
  skills?: string[];
  skillSets?: SkillSet[];
  skillsView?: 'flat' | 'group';
  location?: string;
  status?: 'open' | 'freelance' | 'closed' | string;
  resume?: string;
  years?: YearsSetting;
  [k: string]: unknown;
}

export interface Work extends Localized {
  id?: string;
  title: string;
  sum?: string;
  cat?: string;
  year?: number | string;
  wip?: boolean;
  pinned?: boolean;
  tags?: string[];
  cover?: string | null;
  caseIds?: string[];
  /** ข้อมูลรุ่นเก่า: case เดียว (แปลงเป็น caseIds ตอน normalize) */
  caseId?: string;
  [k: string]: unknown;
}

export interface ProcessStep extends Localized {
  id?: string;
  title: string;
  summary?: string;
  detail?: string;
  outputs?: string[];
  [k: string]: unknown;
}

export interface Experience extends Period, Localized {
  id?: string;
  title?: string;
  org?: string;
  type?: string;
  points?: string[];
  skills?: string[];
  related?: string | null;
  logo?: string | null;
  start?: number | string;
  [k: string]: unknown;
}

export interface EduFile {
  name: string;
  src: string;
}

export interface Education extends Period, Localized {
  id?: string;
  level?: string;
  major?: string;
  faculty?: string;
  org?: string;
  honors?: string;
  gpa?: string;
  files?: EduFile[];
  highlights?: string[];
  skills?: string[];
  activities?: string[];
  /** คำนวณจาก level + major */
  degree?: string;
  start?: number | string;
  [k: string]: unknown;
}

export interface ContactLink extends Localized {
  id?: string;
  label: string;
  icon?: string;
  url: string;
}

export interface Contact extends Localized {
  heading?: string;
  email?: string;
  links: ContactLink[];
  [k: string]: unknown;
}

/** บล็อกเนื้อหา case: p · tbd · quote · ba · image · video · steps · out · links · callout · stats · ai · prompt · gallery */
export interface CaseBlock extends Localized {
  type: string;
  text?: string;
  /** links: [icon, label, site, url] · steps/stats/ai: [a, b] */
  items?: unknown[];
  rows?: string[][];
  [k: string]: unknown;
}

export interface CaseChapter extends Localized {
  t: string;
  b: CaseBlock[];
  [k: string]: unknown;
}

export interface CaseTeaser extends Localized {
  problem?: string;
  solution?: string;
  result?: string;
  before?: string | null;
  after?: string | null;
  [k: string]: unknown;
}

export interface CaseStudy extends Localized {
  title?: string;
  sum?: string;
  cat?: string;
  tags?: string[];
  role?: string;
  scope?: string[];
  time?: string;
  timeN?: number | string;
  timeU?: string;
  team?: string;
  real?: boolean;
  teaser?: CaseTeaser;
  chapters?: CaseChapter[];
  [k: string]: unknown;
}

export type SectionKey = 'works' | 'process' | 'case' | 'experience';

export interface Portfolio {
  version?: number;
  sample?: boolean;
  site: Site;
  theme: { brand: string; [k: string]: unknown };
  profile: Profile;
  works: Work[];
  workCats?: string[];
  process: ProcessStep[];
  featuredCase?: string | null;
  featuredCases?: string[];
  sections: Record<SectionKey, boolean> & Record<string, boolean>;
  order: { works: string; experience: string; education?: string; [k: string]: string | undefined };
  layout?: SectionKey[];
  experience: Experience[];
  education: Education[];
  contact: Contact;
  cases: Record<string, CaseStudy>;
  [k: string]: unknown;
}

export type Lang = 'th' | 'en';

/** ฉบับข้อมูลที่เก็บในเครื่อง */
export type PortfolioVersion = 'draft' | 'saved' | 'published';
