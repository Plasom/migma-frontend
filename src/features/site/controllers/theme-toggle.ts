import { KEYS, local } from '@/lib/storage/local';

/** ปุ่มสลับโหมดสว่าง/มืดบนแถบเมนู (#theme · ไอคอน #tl) · จำค่าไว้ใน localStorage `theme` */
export function themeToggle(): void {
  const r = document.documentElement;
  const btn = document.getElementById('theme'), icon = document.getElementById('tl');
  if (!btn || !icon) return;
  let t = local.get(KEYS.theme);
  if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const set = (v: string) => {
    if (r.getAttribute('data-theme') === v) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      r.setAttribute('data-theme', v);
    } else {
      r.classList.add('pf-thm');
      r.setAttribute('data-theme', v);
      setTimeout(() => r.classList.remove('pf-thm'), 200);
    }
    icon.textContent = v === 'dark' ? 'light_mode' : 'dark_mode';
    btn.setAttribute('aria-label', v === 'dark' ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด');
    local.set(KEYS.theme, v);
  };
  set(t);
  btn.addEventListener('click', () => set(r.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
}
