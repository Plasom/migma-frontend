/**
 * ลูกเล่นการเคลื่อนไหว — spec: wireframe/src/core/patterns/motion.md
 * หัวหน้าเว็บต้องมีสคริปต์สั้น (ดู MOTION_HEAD_SCRIPT) ตั้ง class m-on + กันเนื้อหาค้างซ่อนถ้าสคริปต์นี้ไม่ทำงาน
 * - ลอยขึ้นตอนเลื่อนถึง ([data-rv] · [data-rv-stagger])
 * - ระลอกตอนกดปุ่ม (.btn)
 * - ภาพลอยตามเมาส์ในมุมมองรายการผลงาน
 * - แถบอ่านถึงไหน ([data-progress])
 * - เปลี่ยนหน้า: การ์ดผลงาน → หน้า case ภาพปกขยายจากตำแหน่งการ์ด (sessionStorage m-ghost · m-nav)
 */
import { ROUTES } from '@/lib/routes';

declare global {
  interface Window { __motion?: boolean | number }
}

/** ใส่ใน <head> ของหน้า portfolio */
export const MOTION_HEAD_SCRIPT =
  "if(matchMedia('(prefers-reduced-motion: no-preference)').matches){document.documentElement.classList.add('m-on');setTimeout(function(){if(!window.__motion)document.documentElement.classList.remove('m-on')},2500)}";

const KEY = 'm-ghost';
const NAV = 'm-nav';

interface Ghost { x: number; y: number; w: number; h: number; rad: string; bg: string; bgc: string; t: number }

export function startMotion(): () => void {
  window.__motion = true;
  const root = document.documentElement;
  const on = () => root.classList.contains('m-on');
  const css = getComputedStyle(root);
  const ms = (name: string, d: number) => { const v = parseFloat(css.getPropertyValue(name)); return isNaN(v) ? d : v; };
  const STAG = ms('--rv-stagger', 60), DUR = ms('--rv-dur', 600);
  const off: (() => void)[] = [];
  const listen = <K extends keyof WindowEventMap>(t: Window | Document, type: K, fn: (e: WindowEventMap[K]) => void, opt?: AddEventListenerOptions) => {
    t.addEventListener(type, fn as EventListener, opt);
    off.push(() => t.removeEventListener(type, fn as EventListener, opt));
  };
  const closest = (t: EventTarget | null, sel: string) => (t instanceof Element ? t.closest(sel) : null);

  /* ---------- ลอยขึ้นตอนเลื่อนถึง ---------- */
  const done = (el: Element, extra: number) => { setTimeout(() => el.classList.add('rv-done'), DUR + extra + 50); };
  const reveal = (el: HTMLElement) => {
    if (el.classList.contains('is-in')) return;
    let extra = 0;
    if (el.hasAttribute('data-rv-stagger')) {
      const kids = el.children, n = Math.min(kids.length, 8);
      for (let i = 0; i < kids.length; i++) (kids[i] as HTMLElement).style.setProperty('--rv-i', String(Math.min(i, 7)));
      extra = n * STAG;
    }
    if (el.classList.contains('pc-l')) extra = Math.max(extra, ms('--track-draw', 700) + 4 * ms('--track-gap', 120));
    const base = performance.now() < 900 ? (document.querySelector('[data-hs]') ? 450 : 160) : 0; /* ตอนเปิดหน้า ให้ hero นำก่อน */
    if (base) el.style.setProperty('--rv-base', base + 'ms');
    el.classList.add('is-in');
    done(el, extra + base);
  };
  const RV = '[data-rv],[data-rv-stagger]';
  const targets = Array.from(document.querySelectorAll<HTMLElement>(RV));
  if (!on() || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in', 'rv-done'));
  } else {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); reveal(e.target as HTMLElement); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
    targets.forEach((el) => io.observe(el));
    /* เนื้อหาที่สร้างทีหลัง (เช่น สลับโปรเจกต์ในหน้า case) */
    const mo = new MutationObserver((list) => {
      list.forEach((m) => m.addedNodes.forEach((n) => {
        if (!(n instanceof Element)) return;
        const found = n.matches(RV) ? [n] : [];
        found.concat(Array.from(n.querySelectorAll(RV))).forEach((el) => { if (!el.classList.contains('is-in')) io.observe(el); });
      }));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    off.push(() => { io.disconnect(); mo.disconnect(); });
    /* คีย์บอร์ดไปถึงก่อน หรือกระโดดด้วยลิงก์ = โผล่ทันที */
    listen(document, 'focusin', (e) => { const el = closest(e.target, RV); if (el) el.classList.add('is-in', 'rv-done'); });
  }

  /* ---------- ระลอกตอนกด ---------- */
  listen(document, 'pointerdown', (e) => {
    if (!on() || e.button !== 0) return;
    const b = closest(e.target, '.btn') as HTMLButtonElement | null;
    if (!b || b.disabled || b.getAttribute('aria-disabled') === 'true') return;
    const r = b.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    const d = 2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
    const s = document.createElement('span');
    s.className = 'm-rip';
    s.setAttribute('aria-hidden', 'true');
    s.style.cssText = `width:${d}px;height:${d}px;left:${x - d / 2}px;top:${y - d / 2}px`;
    b.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  });

  /* ---------- ภาพลอยตามเมาส์ (มุมมองรายการ) ---------- */
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let peek: HTMLDivElement | null = null, row: Element | null = null, tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  const FOLLOW = ms('--peek-follow', 1), PW = ms('--peek-w', 200), OFF = ms('--peek-offset', 24);
  const place = () => {
    const k = on() ? FOLLOW : 1;
    cx += (tx - cx) * k; cy += (ty - cy) * k;
    peek!.style.transform = `translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px)`;
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5 && row ? requestAnimationFrame(place) : 0;
  };
  const aim = (e: PointerEvent) => {
    const ph = PW * 1.25;
    let x = e.clientX + OFF, y = e.clientY - ph / 2;
    if (x + PW > innerWidth - 8) x = e.clientX - OFF - PW; /* ชิดขวาเกิน = ไปซ้ายเคอร์เซอร์ */
    y = Math.max(8, Math.min(innerHeight - ph - 8, y));
    tx = x; ty = y;
  };
  listen(document, 'pointermove', (e) => {
    if (!fine.matches || e.pointerType !== 'mouse') return;
    const r = closest(e.target, '.wk-li:not(.wk-sk)');
    const overCtl = r && closest(e.target, 'button,.wk-tags,.wk-tg'); /* ชี้ที่แท็ก/ปุ่ม = ซ่อน เพื่อไม่บัง tooltip */
    if (!r || overCtl) { if (row) { row = null; peek!.classList.remove('on'); } return; }
    if (!peek) {
      peek = document.createElement('div');
      peek.className = 'm-peek';
      peek.setAttribute('aria-hidden', 'true');
      document.body.appendChild(peek);
    }
    aim(e);
    if (r !== row) {
      const th = r.querySelector('.th'), cs = th && getComputedStyle(th);
      if (cs) {
        peek.style.backgroundColor = cs.backgroundColor;
        peek.style.backgroundImage = cs.backgroundImage;
        peek.style.border = `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`;
      }
      if (!row) { cx = tx; cy = ty; } /* โผล่ที่เคอร์เซอร์ ไม่บินมาจากที่เดิม */
      row = r;
      peek.classList.add('on');
    }
    if (!raf) raf = requestAnimationFrame(place);
  }, { passive: true });
  listen(window, 'scroll', () => { if (row) { row = null; peek!.classList.remove('on'); } }, { passive: true });

  /* ---------- แถบอ่านถึงไหน ---------- */
  const art = document.querySelector('[data-progress]');
  if (art) {
    const bar = document.createElement('div');
    bar.className = 'm-prog';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<i></i>';
    document.body.appendChild(bar);
    const fill = bar.firstChild as HTMLElement;
    let tick = 0;
    const upd = () => {
      tick = 0;
      const r = art.getBoundingClientRect(), total = r.height - innerHeight * 0.6;
      const p = Math.max(0, Math.min(1, (-r.top + 80) / Math.max(1, total)));
      fill.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    listen(window, 'scroll', () => { if (!tick) tick = requestAnimationFrame(upd); }, { passive: true });
    listen(window, 'resize', upd);
    upd();
    off.push(() => bar.remove());
  }

  /* ---------- เปลี่ยนหน้า ---------- */
  const internal = (a: HTMLAnchorElement | null) => {
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
    const h = a.getAttribute('href') || '';
    if (!h || h.charAt(0) === '#' || /^(mailto|tel|javascript):/.test(h)) return false;
    const u = new URL(a.href, location.href);
    if (u.protocol !== location.protocol || u.host !== location.host) return false;
    if (u.pathname === location.pathname && u.search === location.search) return false;
    return u.pathname === ROUTES.site || u.pathname.startsWith(ROUTES.site + '/');
  };
  listen(document, 'click', (e) => {
    if (!on() || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = closest(e.target, 'a[href]') as HTMLAnchorElement | null;
    if (!a || !internal(a)) return;
    /* เล่นเฉพาะการ์ดผลงานที่มีภาพ → หน้า case (decisions #93) · ลิงก์อื่นเปิดหน้าตามปกติ ไม่มีจางออก */
    const card = new URL(a.href).pathname === ROUTES.case && a.closest('.wk-it,.wk-li');
    const img = card ? (card.querySelector('.wk-img,.th') as HTMLElement | null) : null;
    if (!img) return;
    e.preventDefault();
    const href = a.href;
    const r = img.getBoundingClientRect(), cs = getComputedStyle(img);
    try {
      const g: Ghost = { x: r.left, y: r.top, w: r.width, h: r.height, rad: cs.borderTopLeftRadius, bg: cs.backgroundImage, bgc: cs.backgroundColor, t: Date.now() };
      sessionStorage.setItem(KEY, JSON.stringify(g));
    } catch {}
    const g = img.cloneNode(false) as HTMLElement;
    g.className += ' m-ghost';
    g.setAttribute('aria-hidden', 'true');
    g.style.cssText = `position:fixed;margin:0;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;background-color:${cs.backgroundColor};background-image:${cs.backgroundImage};background-size:cover;background-position:center;background-repeat:no-repeat;border:${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`;
    document.body.appendChild(g);
    g.animate([{ transform: 'none' }, { transform: 'scale(1.04)' }], { duration: ms('--page-out', 220), easing: 'cubic-bezier(.2,0,0,1)', fill: 'forwards' });
    try { sessionStorage.setItem(NAV, String(Date.now())); } catch {}
    document.body.classList.add('m-leave');
    setTimeout(() => { location.href = href; }, ms('--page-out', 220));
  });
  /* กลับมาด้วยปุ่มย้อนกลับ (หน้าเดิมจากแคช) = คืนสภาพ */
  listen(window, 'pageshow', (e) => {
    if (!e.persisted) return;
    document.body.classList.remove('m-leave');
    document.querySelectorAll('.m-ghost').forEach((g) => g.remove());
  });

  /* หน้าใหม่: เนื้อหาจางเข้า · ภาพปก (data-shared) ขยายจากตำแหน่งการ์ดเดิม */
  let came = 0;
  try { came = +(sessionStorage.getItem(NAV) || 0); sessionStorage.removeItem(NAV); } catch {}
  if (on() && Date.now() - came < 5000) { /* มาจากการกดลิงก์ในเว็บเท่านั้น · เปิดหน้าตรงๆ ไม่เล่น */
    let data: Ghost | null = null;
    try { data = JSON.parse(sessionStorage.getItem(KEY) || 'null'); sessionStorage.removeItem(KEY); } catch {}
    if (data && Date.now() - data.t > 5000) data = null;
    const cover = document.querySelector<HTMLElement>('[data-shared]');
    if (data && cover) {
      const to = cover.getBoundingClientRect(), cc = getComputedStyle(cover);
      if (to.bottom > 0 && to.top < innerHeight) {
        cover.classList.add('m-hide');
        const gh = document.createElement('div');
        gh.className = 'm-ghost';
        gh.setAttribute('aria-hidden', 'true');
        const R = parseFloat(cc.borderTopLeftRadius) || 0, r0 = parseFloat(data.rad) || 0;
        const sx = data.w / to.width, sy = data.h / to.height;
        /* ขยับด้วย transform เท่านั้น · ชดเชยมุมโค้งตามสเกล ไม่ให้มุมเบี้ยว */
        gh.style.cssText = `position:fixed;left:${to.left}px;top:${to.top}px;width:${to.width}px;height:${to.height}px;background-color:${data.bgc};background-image:${data.bg};background-size:cover;background-position:center;background-repeat:no-repeat;border-radius:${R}px;box-shadow:${cc.boxShadow};transform-origin:0 0`;
        document.body.appendChild(gh);
        gh.animate([
          { transform: `translate(${data.x - to.left}px,${data.y - to.top}px) scale(${sx},${sy})`, borderRadius: `${r0 / sx}px / ${r0 / sy}px` },
          { transform: 'none', borderRadius: `${R}px / ${R}px` },
        ], { duration: ms('--page-in', 480) + 80, easing: 'cubic-bezier(.05,.7,.1,1)' }).onfinish = () => {
          cover.classList.remove('m-hide');
          gh.remove();
        };
      }
    }
    document.body.classList.add('m-enter');
    setTimeout(() => document.body.classList.remove('m-enter'), ms('--page-in', 480) + 120);
  }

  return () => { off.forEach((f) => f()); peek?.remove(); };
}
