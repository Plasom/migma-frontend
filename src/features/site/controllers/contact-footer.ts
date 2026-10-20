import { trackSiteView } from '@/lib/api';

/** ปุ่มคัดลอกอีเมล (#ctCopy) + ปุ่มกลับขึ้นบนท้ายเว็บ (.ftr-top) */
export function contactFooter(): void {
  const b = document.getElementById('ctCopy');
  if (b) {
    const lab = b.querySelector('.lb')!, ic = b.querySelector('.ms')!, st = document.getElementById('ctSt')!;
    let t: ReturnType<typeof setTimeout> | undefined;
    b.onclick = () => {
      const slug = typeof window !== 'undefined' ? (window as unknown as { __migma_slug?: string }).__migma_slug : null;
      if (slug) {
        trackSiteView(slug, { path: '/contact' });
      }
      const v = b.dataset.v || '';
      const done = (ok: boolean) => {
        lab.textContent = ok ? 'คัดลอกแล้ว' : 'คัดลอกไม่ได้';
        ic.textContent = ok ? 'check' : 'error';
        b.classList.toggle('ok', ok);
        st.textContent = ok ? 'คัดลอกอีเมลแล้ว' : 'คัดลอกไม่ได้ ลองเลือกข้อความเอง';
        clearTimeout(t);
        t = setTimeout(() => { lab.textContent = 'คัดลอก'; ic.textContent = 'content_copy'; b.classList.remove('ok'); }, 2000);
      };
      const fb = () => {
        try {
          const ta = document.createElement('textarea');
          ta.value = v;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand('copy');
          ta.remove();
          try { b.focus({ preventScroll: true, focusVisible: false } as FocusOptions); } catch { b.focus(); }
          done(ok);
        } catch { done(false); }
      };
      try { navigator.clipboard.writeText(v).then(() => done(true), fb); } catch { fb(); }
    };
  }
  const top = document.querySelector<HTMLElement>('.ftr-top');
  if (top) top.onclick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    document.querySelector<HTMLElement>('.gnav a,.logo')?.focus({ preventScroll: true });
  };
}
