/** ไทม์ไลน์ "วิธีทำงาน" (#pcL): กดขั้นไหนกางขั้นนั้น · จอใหญ่ใช้ลูกศร/Home/End ได้ · มือถือกดซ้ำ = ยุบ */
export function processTimeline(): void {
  const l = document.getElementById('pcL');
  if (!l) return;
  const bs = Array.from(l.querySelectorAll<HTMLElement>('.pc-b'));
  const mob = () => matchMedia('(max-width:720px)').matches;
  const panel = (b: HTMLElement) => document.getElementById(b.getAttribute('aria-controls') || '')!;
  const set = (k: number) => {
    bs.forEach((b, i) => {
      const on = i === k, p = panel(b);
      b.setAttribute('aria-expanded', String(on));
      p.classList.toggle('open', on);
      p.inert = !on;
      p.setAttribute('aria-hidden', String(!on));
      b.classList.toggle('done', k >= 0 && i < k);
      (b.parentNode as HTMLElement).classList.toggle('past', k >= 0 && i < k);
    });
    l.dataset.a = String(k + 1);
  };
  bs.forEach((b, i) => {
    b.onclick = () => { if (mob() && b.getAttribute('aria-expanded') === 'true') { set(-1); return; } set(i); };
    b.onkeydown = (e) => {
      if (mob()) return;
      let k: number | null = null;
      if (e.key === 'ArrowRight') k = (i + 1) % bs.length;
      if (e.key === 'ArrowLeft') k = (i - 1 + bs.length) % bs.length;
      if (e.key === 'Home') k = 0;
      if (e.key === 'End') k = bs.length - 1;
      if (k !== null) { e.preventDefault(); set(k); bs[k].focus(); }
    };
  });
  set(0);
}
