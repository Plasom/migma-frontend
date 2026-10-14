/** แถบเมนูมีเงาเมื่อเลื่อนลง (.gnav.is-scrolled) */
export function navScroll(): void {
  const n = document.querySelector('.gnav');
  if (!n) return;
  let t = 0;
  const u = () => { t = 0; n.classList.toggle('is-scrolled', scrollY > 4); };
  addEventListener('scroll', () => { if (!t) t = requestAnimationFrame(u); }, { passive: true });
  u();
}
