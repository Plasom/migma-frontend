/* ลูกเล่นการเคลื่อนไหว — spec: core/patterns/motion.md
   ต้องมีสคริปต์สั้นในหัวหน้าเว็บก่อน (ตั้ง class m-on + กันเนื้อหาค้างซ่อนถ้าไฟล์นี้โหลดไม่ได้):
   if(matchMedia('(prefers-reduced-motion: no-preference)').matches){document.documentElement.classList.add('m-on');setTimeout(function(){if(!window.__motion)document.documentElement.classList.remove('m-on')},2500)} */
(function () {
  'use strict';
  window.__motion = true;
  var root = document.documentElement;
  var on = function () { return root.classList.contains('m-on'); };
  var css = getComputedStyle(root);
  var ms = function (name, d) { var v = parseFloat(css.getPropertyValue(name)); return isNaN(v) ? d : v; };
  var STAG = ms('--rv-stagger', 60), DUR = ms('--rv-dur', 600);

  /* ---------- ลอยขึ้นตอนเลื่อนถึง ---------- */
  function done(el, extra) { setTimeout(function () { el.classList.add('rv-done'); }, DUR + extra + 50); }
  function reveal(el) {
    if (el.classList.contains('is-in')) return;
    var extra = 0;
    if (el.hasAttribute('data-rv-stagger')) {
      var kids = el.children, n = Math.min(kids.length, 8);
      for (var i = 0; i < kids.length; i++) kids[i].style.setProperty('--rv-i', Math.min(i, 7));
      extra = n * STAG;
    }
    if (el.classList.contains('pc-l')) extra = Math.max(extra, ms('--track-draw', 700) + 4 * ms('--track-gap', 120));
    var base = performance.now() < 900 ? (document.querySelector('[data-hs]') ? 450 : 160) : 0;  /* ตอนเปิดหน้า ให้ hero นำก่อน */
    if (base) el.style.setProperty('--rv-base', base + 'ms');
    el.classList.add('is-in');
    done(el, extra + base);
  }
  var targets = [].slice.call(document.querySelectorAll('[data-rv],[data-rv-stagger]'));
  if (!on() || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-in', 'rv-done'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); reveal(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });
    targets.forEach(function (el) { io.observe(el); });
    /* เนื้อหาที่สร้างทีหลัง (เช่น สลับโปรเจกต์ในหน้า case) */
    new MutationObserver(function (ms_) {
      ms_.forEach(function (m) { [].forEach.call(m.addedNodes, function (n) {
        if (n.nodeType !== 1) return;
        var list = n.matches('[data-rv],[data-rv-stagger]') ? [n] : [];
        list.concat([].slice.call(n.querySelectorAll('[data-rv],[data-rv-stagger]'))).forEach(function (el) { if (!el.classList.contains('is-in')) io.observe(el); });
      }); });
    }).observe(document.body, { childList: true, subtree: true });
    /* คีย์บอร์ดไปถึงก่อน หรือกระโดดด้วยลิงก์ = โผล่ทันที */
    document.addEventListener('focusin', function (e) {
      var el = e.target.closest && e.target.closest('[data-rv],[data-rv-stagger]');
      if (el) { el.classList.add('is-in', 'rv-done'); }
    });
  }

  /* ---------- ระลอกตอนกด ---------- */
  document.addEventListener('pointerdown', function (e) {
    if (!on() || e.button !== 0) return;
    var b = e.target.closest && e.target.closest('.btn');
    if (!b || b.disabled || b.getAttribute('aria-disabled') === 'true') return;
    var r = b.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    var d = 2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y));
    var s = document.createElement('span');
    s.className = 'm-rip'; s.setAttribute('aria-hidden', 'true');
    s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (x - d / 2) + 'px;top:' + (y - d / 2) + 'px';
    b.appendChild(s);
    s.addEventListener('animationend', function () { s.remove(); });
  });

  /* ---------- ภาพลอยตามเมาส์ (มุมมองรายการ) ---------- */
  var fine = matchMedia('(hover: hover) and (pointer: fine)');
  var peek, row = null, tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
  var FOLLOW = ms('--peek-follow', 1), PW = ms('--peek-w', 200), OFF = ms('--peek-offset', 24);
  function place() {
    var k = on() ? FOLLOW : 1;
    cx += (tx - cx) * k; cy += (ty - cy) * k;
    peek.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
    raf = (Math.abs(tx - cx) + Math.abs(ty - cy) > .5 && row) ? requestAnimationFrame(place) : 0;
  }
  function target(e) {
    var ph = PW * 1.25, x = e.clientX + OFF, y = e.clientY - ph / 2;
    if (x + PW > innerWidth - 8) x = e.clientX - OFF - PW;          /* ชิดขวาเกิน = ไปซ้ายเคอร์เซอร์ */
    y = Math.max(8, Math.min(innerHeight - ph - 8, y));
    tx = x; ty = y;
  }
  document.addEventListener('pointermove', function (e) {
    if (!fine.matches || e.pointerType !== 'mouse') return;
    var r = e.target.closest && e.target.closest('.wk-li:not(.wk-sk)');
    var overCtl = r && e.target.closest('button,.wk-tags,.wk-tg');   /* ชี้ที่แท็ก/ปุ่ม = ซ่อน เพื่อไม่บัง tooltip */
    if (!r || overCtl) { if (row) { row = null; peek.classList.remove('on'); } return; }
    if (!peek) { peek = document.createElement('div'); peek.className = 'm-peek'; peek.setAttribute('aria-hidden', 'true'); document.body.appendChild(peek); }
    target(e);
    if (r !== row) {
      var th = r.querySelector('.th'), cs = th && getComputedStyle(th);
      if (cs) { peek.style.backgroundColor = cs.backgroundColor; peek.style.backgroundImage = cs.backgroundImage; peek.style.border = cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor; }
      if (!row) { cx = tx; cy = ty; }                                  /* โผล่ที่เคอร์เซอร์ ไม่บินมาจากที่เดิม */
      row = r; peek.classList.add('on');
    }
    if (!raf) raf = requestAnimationFrame(place);
  }, { passive: true });
  addEventListener('scroll', function () { if (row) { row = null; peek.classList.remove('on'); } }, { passive: true });

  /* ---------- แถบอ่านถึงไหน ---------- */
  var art = document.querySelector('[data-progress]');
  if (art) {
    var bar = document.createElement('div'); bar.className = 'm-prog'; bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<i></i>'; document.body.appendChild(bar);
    var fill = bar.firstChild, tick = 0;
    var upd = function () {
      tick = 0;
      var r = art.getBoundingClientRect(), total = r.height - innerHeight * .6;
      var p = Math.max(0, Math.min(1, (-r.top + 80) / Math.max(1, total)));
      fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    };
    addEventListener('scroll', function () { if (!tick) tick = requestAnimationFrame(upd); }, { passive: true });
    addEventListener('resize', upd); upd();
  }

  /* ---------- เปลี่ยนหน้า ---------- */
  var KEY = 'm-ghost';
  function internal(a) {
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
    var h = a.getAttribute('href') || '';
    if (!h || h.charAt(0) === '#' || /^(mailto|tel|javascript):/.test(h)) return false;
    var u = new URL(a.href, location.href);
    if (u.protocol !== location.protocol || u.host !== location.host) return false;
    if (u.pathname === location.pathname && u.search === location.search) return false;
    return /\.html$/.test(u.pathname);
  }
  document.addEventListener('click', function (e) {
    if (!on() || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!internal(a)) return;
    /* เล่นเฉพาะการ์ดผลงานที่มีภาพ → หน้า case (decisions #93) · ลิงก์อื่นเปิดหน้าตามปกติ ไม่มีจางออก */
    var card = /case\.html/.test(a.href) && a.closest('.wk-it,.wk-li');
    var img = card && card.querySelector('.wk-img,.th');
    if (!img) return;
    e.preventDefault();
    var href = a.href;
    if (img) {
      var r = img.getBoundingClientRect(), cs = getComputedStyle(img);
      try {
        sessionStorage.setItem(KEY, JSON.stringify({ x: r.left, y: r.top, w: r.width, h: r.height, rad: cs.borderTopLeftRadius,
          bg: cs.backgroundImage, bgc: cs.backgroundColor, t: Date.now() }));
      } catch (err) {}
      var g = img.cloneNode(false); g.className += ' m-ghost'; g.setAttribute('aria-hidden', 'true');
      g.style.cssText = 'position:fixed;margin:0;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;background-color:' + cs.backgroundColor + ';background-image:' + cs.backgroundImage + ';background-size:cover;background-position:center;background-repeat:no-repeat;border:' + cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + cs.borderTopColor;
      document.body.appendChild(g);
      g.animate([{ transform: 'none' }, { transform: 'scale(1.04)' }], { duration: ms('--page-out', 220), easing: 'cubic-bezier(.2,0,0,1)', fill: 'forwards' });
    }
    try { sessionStorage.setItem('m-nav', String(Date.now())); } catch (err) {}
    document.body.classList.add('m-leave');
    setTimeout(function () { location.href = href; }, ms('--page-out', 220));
  });
  /* กลับมาด้วยปุ่มย้อนกลับ (หน้าเดิมจากแคช) = คืนสภาพ */
  addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    document.body.classList.remove('m-leave');
    [].forEach.call(document.querySelectorAll('.m-ghost'), function (g) { g.remove(); });
  });

  /* หน้าใหม่: เนื้อหาจางเข้า · ภาพปก (data-shared) ขยายจากตำแหน่งการ์ดเดิม */
  var came = 0;
  try { came = +sessionStorage.getItem('m-nav') || 0; sessionStorage.removeItem('m-nav'); } catch (err) {}
  if (on() && Date.now() - came < 5000) {                 /* มาจากการกดลิงก์ในเว็บเท่านั้น · เปิดหน้าตรงๆ ไม่เล่น */
    var data = null;
    try { data = JSON.parse(sessionStorage.getItem(KEY) || 'null'); sessionStorage.removeItem(KEY); } catch (err) {}
    if (data && Date.now() - data.t > 5000) data = null;
    var cover = document.querySelector('[data-shared]');
    if (data && cover) {
      var to = cover.getBoundingClientRect(), cc = getComputedStyle(cover);
      if (to.bottom > 0 && to.top < innerHeight) {
        cover.classList.add('m-hide');
        var gh = document.createElement('div'); gh.className = 'm-ghost'; gh.setAttribute('aria-hidden', 'true');
        var R = parseFloat(cc.borderTopLeftRadius) || 0, r0 = parseFloat(data.rad) || 0;
        var sx = data.w / to.width, sy = data.h / to.height;
        /* ขยับด้วย transform เท่านั้น (motion-iconography.md) · ชดเชยมุมโค้งตามสเกล ไม่ให้มุมเบี้ยว */
        gh.style.cssText = 'position:fixed;left:' + to.left + 'px;top:' + to.top + 'px;width:' + to.width + 'px;height:' + to.height + 'px;background-color:' + data.bgc + ';background-image:' + data.bg + ';background-size:cover;background-position:center;background-repeat:no-repeat;border-radius:' + R + 'px;box-shadow:' + cc.boxShadow + ';transform-origin:0 0';
        document.body.appendChild(gh);
        gh.animate([
          { transform: 'translate(' + (data.x - to.left) + 'px,' + (data.y - to.top) + 'px) scale(' + sx + ',' + sy + ')', borderRadius: (r0 / sx) + 'px / ' + (r0 / sy) + 'px' },
          { transform: 'none', borderRadius: R + 'px / ' + R + 'px' }
        ], { duration: ms('--page-in', 480) + 80, easing: 'cubic-bezier(.05,.7,.1,1)' }).onfinish = function () {
          cover.classList.remove('m-hide'); gh.remove();
        };
      }
    }
    document.body.classList.add('m-enter');
    setTimeout(function () { document.body.classList.remove('m-enter'); }, ms('--page-in', 480) + 120);
  }
})();
