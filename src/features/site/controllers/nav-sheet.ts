/**
 * เมนูมือถือ (sheet) + ไฮไลต์เมนูตามส่วนที่อ่านอยู่ (scroll spy)
 * หน้าแรก (`home`): hero = #top · ส่วนวิธีทำงานและ case นับเป็น "ผลงาน"
 */
export function navSheet({ home }: { home: boolean }): void {
  const b = document.getElementById('menuBtn'), sh = document.getElementById('sheet'), sc = document.getElementById('scrim');
  const close = document.getElementById('sheetClose');
  if (!b || !sh || !sc || !close) return;
  const open = (o: boolean) => {
    sh.classList.toggle('open', o);
    sc.classList.toggle('open', o);
    b.setAttribute('aria-expanded', String(o));
    document.body.style.overflow = o ? 'hidden' : '';
    if (o) setTimeout(() => sh.querySelector<HTMLElement>('a.sl')?.focus(), 60);
    else b.focus();
  };
  b.addEventListener('click', () => open(true));
  close.addEventListener('click', () => open(false));
  sc.addEventListener('click', () => open(false));
  sh.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = sh.querySelectorAll<HTMLElement>('a,button');
    const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sh.classList.contains('open')) open(false); });
  sh.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => open(false)));

  /* scroll spy */
  const LINKS = '.gl a,.sheet a.sl';
  const map: Record<string, Element[]> = {};
  document.querySelectorAll(LINKS).forEach((a) => { const h = a.getAttribute('href') || ''; (map[h] = map[h] || []).push(a); });
  if (!('IntersectionObserver' in window)) return;
  const alias: Record<string, string> = home ? { '#process': '#work', '#case': '#work' } : {};
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      let id = home && e.target.classList.contains('hero') ? '#top' : '#' + e.target.id;
      id = alias[id] || id;
      document.querySelectorAll(LINKS).forEach((a) => a.removeAttribute('aria-current'));
      (map[id] || []).forEach((a) => a.setAttribute('aria-current', 'location'));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(map).forEach((h) => {
    if (h.charAt(0) !== '#' || h.length < 2) return;
    const el = document.querySelector(home && h === '#top' ? '.hero' : h);
    if (el) io.observe(el);
  });
  if (home) ['#process', '#case'].forEach((h) => { const el = document.querySelector(h); if (el) io.observe(el); });
}
