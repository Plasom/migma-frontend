/** แถวประวัติ (.xp-b): กดกาง/ยุบรายละเอียด */
export function experienceToggle(): void {
  document.querySelectorAll<HTMLElement>('.xp-b').forEach((b) => {
    const p = document.getElementById(b.getAttribute('aria-controls') || '');
    if (!p) return;
    p.inert = b.getAttribute('aria-expanded') !== 'true';
    b.onclick = () => {
      const o = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(o));
      p.classList.toggle('open', o);
      p.inert = !o;
    };
  });
}
