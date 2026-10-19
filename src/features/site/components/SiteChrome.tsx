/**
 * แถบเมนู · เมนูมือถือ · ท้ายเว็บ ของหน้า portfolio (โครงเดียวกันทุกหน้า ต่างกันที่ลิงก์ของหน้าปัจจุบัน)
 * ชื่อบนแถบเมนูและท้ายเว็บถูกแทนด้วยข้อมูลจริงตอน engine วาดหน้า
 */
import { PREVIEW_BASE } from '@/lib/routes';

export type SitePage = 'home' | 'work' | 'case';

function Dots() {
  return (
    <span className="dots" aria-hidden="true">
      <svg viewBox="0 0 34 24" focusable="false">
        <path d="M3 21V11a5.5 5.5 0 0 1 11 0v10M14 11a5.5 5.5 0 0 1 11 0v10" fill="none" stroke="var(--logo-dot)" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="30.6" cy="19.6" r="2.6" fill="var(--logo-dot-accent)" />
      </svg>
    </span>
  );
}

/** ลิงก์เมนู: หน้าแรกใช้ลิงก์ในหน้า (#) · หน้าอื่นลิงก์กลับหน้าแรก */
function navLinks(page: SitePage, base: string) {
  const home = page === 'home';
  return [
    { href: home ? '#top' : base, label: 'หน้าแรก', current: home },
    { href: home ? '#work' : base + '/work', label: 'ผลงาน', current: !home },
    { href: home ? '#exp' : base + '#exp', label: 'ประวัติ', current: false },
    { href: home ? '#form' : base + '#form', label: 'ติดต่อ', current: false },
  ];
}

/** base = ชุดหน้าที่อยู่ (/site = ตัวอย่างในหลังบ้าน · /u/<slug> = เว็บสาธารณะ) */
export interface ChromeProps { page: SitePage; base?: string }

export function SiteHeader({ page, base = PREVIEW_BASE }: ChromeProps) {
  const links = navLinks(page, base);
  return (
    <>
      <header className="gnav">
        <div className="in">
          <a className="logo" href={page === 'home' ? '#top' : base}><Dots /></a>
          <nav className="gl" aria-label="เมนูหลัก">
            {links.map((l) => (
              <a key={l.label} href={l.href} data-label={l.label} aria-current={l.current ? 'location' : undefined}>{l.label}</a>
            ))}
          </nav>
          <div className="nr">
            <button className="nib" id="theme" type="button" aria-label="สลับเป็นโหมดมืด"><span className="ms" id="tl">dark_mode</span></button>
            <button className="nib menu" id="menuBtn" type="button" aria-label="เปิดเมนู" aria-expanded="false" aria-controls="sheet"><span className="ms">menu</span></button>
          </div>
        </div>
      </header>
      <div className="scrim" id="scrim" />
      <div className="sheet" id="sheet" role="dialog" aria-modal="true" aria-label="เมนู">
        <div className="sh-top">
          <span className="logo"><Dots /></span>
          <button className="nib" id="sheetClose" type="button" aria-label="ปิดเมนู"><span className="ms">close</span></button>
        </div>
        {links.map((l) => (
          <a key={l.label} className="sl" href={l.href} aria-current={l.current ? 'location' : undefined}>{l.label}</a>
        ))}
        <a className="btn btn-outline" href="#">Resume</a>
      </div>
    </>
  );
}

export function SiteFooter({ page, base = PREVIEW_BASE }: ChromeProps) {
  return (
    <footer className="ftr">
      <span>©</span>
      <nav className="ftr-nav" aria-label="หน้าในเว็บ">
        <a href={base} aria-current={page === 'home' ? 'page' : undefined}>หน้าแรก</a>
        <a href={base + '/work'} aria-current={page === 'work' ? 'page' : undefined}>ผลงานทั้งหมด</a>
      </nav>
      <a className="ftr-top" href="#top">กลับขึ้นบน<span className="ms" aria-hidden="true">arrow_upward</span></a>
    </footer>
  );
}
