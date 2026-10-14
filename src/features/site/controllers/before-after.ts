/** ภาพก่อน/หลัง (.ba): ลากแถบเลื่อนแล้วตั้ง --x */
export function beforeAfter(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.ba').forEach((b) => {
    const r = b.querySelector('input');
    if (!r) return;
    const u = () => {
      b.style.setProperty('--x', r.value + '%');
      r.setAttribute('aria-valuetext', 'ภาพก่อนแก้ ' + r.value + '% · ภาพหลังแก้ ' + (100 - +r.value) + '%');
    };
    r.addEventListener('input', u);
    u();
  });
}
