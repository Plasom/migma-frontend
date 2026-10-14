// @ts-nocheck -- ตัววาดหน้า portfolio ย้ายมาจาก wireframe/src/preview/js/template.js แบบ 1:1 (DOM + สตริง HTML)
//   สิ่งที่เปลี่ยน: อ่านข้อมูลจาก env แทน window.PORTFOLIO · ลิงก์เป็น route ของ Next · CSS ที่เคยฉีดด้วย JS ย้ายไป styles/site/{template,edit}.css
//   แผนต่อไป: แยกเป็น React component ทีละส่วน (hero · works · process · case · experience · contact)
/* eslint-disable */
import { EDU_LEVELS, MONTHS_TH, experienceYears, formatPeriod, skillsView } from '@/lib/portfolio/model';
import { ROUTES, routeToPage } from '@/lib/routes';
import type { TemplateEnv, SiteRuntime } from './types';

const isSiteRoute = (h: string) => /^\/site(\/|$|\?|#)/.test(h);

/* ==========================================================================
   Portfolio template — วาดเนื้อหาจาก window.PORTFOLIO (data/portfolio.js)
   วางหลัง </main> ก่อนสคริปต์อื่นของหน้า เพื่อให้สคริปต์เดิม (ไทม์ไลน์ · กางประวัติ · ภาพก่อน/หลัง · คัดลอก) ผูกกับ DOM ที่วาดแล้ว
   ?edit=1 = อยู่ในหลังบ้าน: ช่องว่างขึ้นป้าย "รอข้อมูล" · ชี้ส่วนแล้วมีกรอบ · กดส่วน = เปิดฟอร์มของส่วนนั้น
   spec: core/patterns/data-model.md · decisions #98
   ========================================================================== */
export function renderTemplate(env: TemplateEnv): SiteRuntime {
  var D = env.data;
  var EDIT = /[?&]edit=1/.test(location.search);
  /* โหลดซ้ำในหลังบ้านหลังแก้ข้อมูล: ปิดแอนิเมชันเข้าหน้า ให้ตัวอย่างนิ่ง */
  if (/[?&]still=1/.test(location.search)) { document.documentElement.classList.remove('m-on'); window.__motion = 0; setTimeout(function () { document.documentElement.classList.remove('pf-still'); }, 600); }   /* pf-still = ปิด transition ชั่วครู่ตอนโหลดซ้ำ ทุกอย่างอยู่ในสภาพสุดท้ายตั้งแต่เฟรมแรก */
  var SHOW_EMPTY = EDIT || D.sample;            /* ตัวอย่าง/หลังบ้าน = โชว์ป้ายแทนช่องว่าง */
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var has = function (v) { return Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== ''; };
  var tag = function (t) { return '<i class="tbd-tag">' + esc(t) + '</i>'; };
  var ph = function (t) { return SHOW_EMPTY ? tag(t) : ''; };
  /* ข้อความที่แก้ได้ตรงตัวอย่าง (เฉพาะในหลังบ้าน): data-pe = ตำแหน่งข้อมูล */
  /* ค่าที่เลือกจากตัวเลือก (ไม่ใช่ข้อความอิสระ): data-pk = ชนิด|ตำแหน่งข้อมูล → กดแล้วมีตัวเลือกเด้งขึ้นในตัวอย่าง */
  var pk = function (kind, base) { return EDIT && base ? ' data-pk="' + kind + '|' + esc(base) + '" tabindex="0" role="button"' : ''; };
  /* ปุ่ม “+ เพิ่ม” ท้ายรายการในตัวอย่าง (ทักษะ · ข้อย่อย · สิ่งที่ได้): กดแล้วพิมพ์ตรงนั้น Enter = เพิ่ม */
  var pa = function (path, label, kind) { return EDIT && path ? '<span class="pf-addb" role="button" tabindex="0" data-pa="' + esc(path) + '"' + (kind ? ' data-pak="' + kind + '"' : '') + ' data-lab="+ ' + esc(label) + '">+ ' + esc(label) + '</span>' : ''; };
  var pal = function (path, label) { var h = pa(path, label); return h ? '<li class="pf-addl">' + h + '</li>' : ''; };
  var pe = function (path, multi) { return EDIT && path ? ' data-pe="' + esc(path) + '"' + (multi ? ' data-pem' : '') : ''; };
  /* แถวชื่อบนหัวหน้าแรก: มีรูปใช้รูป · ไม่มีรูปใช้อักษรแรกของชื่อ · ไม่มีชื่อด้วยก็ไม่มีวงกลม (ไม่ขึ้น "?") ·
     ว่างหมด = หน้าเว็บจริงซ่อนทั้งแถว / หลังบ้านขึ้นป้ายบอกช่องที่ยังว่าง */
  function heroId() {
    var P = D.profile || {}, n = has(P.name), r = has(P.role);
    var av = P.avatar ? '<img class="hero-av" src="' + esc(P.avatar) + '" alt="">' : n ? '<span class="hero-av" aria-hidden="true">' + esc(String(P.name).trim().charAt(0)) + '</span>' : '';
    var nm = n ? '<b' + pe('profile.name') + '>' + esc(P.name) + '</b>' : ph('ชื่อที่แสดง');
    var rl = r ? '<span>' + (n ? '· ' : '') + '<span' + pe('profile.role') + '>' + esc(P.role) + '</span></span>' : (n ? '' : ph('ตำแหน่ง'));
    var inner = av + nm + rl;
    return inner ? '<p class="hero-id" data-hs style="--s:0">' + inner + '</p>' : '';
  }
  var MOCK = D.sample ? '<p class="mock-note">' + tag('ข้อมูลตัวอย่าง · แก้เป็นของจริง') + '</p>' : '';
  var CASES = D.cases || {};
  var PF = { data: D, edit: EDIT, esc: esc, has: has, pe: pe, pk: pk, pa: pa };
  /* ในหลังบ้าน แถวที่กดกางได้ใช้ div role=button แทน button เพื่อให้พิมพ์แก้ข้อความข้างในได้ (ข้อความใน button แก้ตรงๆ ไม่ได้) · หน้าเว็บจริงยังเป็น button */
  var BO = EDIT ? '<div role="button" tabindex="0"' : '<button type="button"', BC = EDIT ? '</div>' : '</button>';

  /* ---------- ลิงก์ไปหน้า case ของงาน (มีเนื้อหา = ?p= · ยังไม่มี = โครงจากชื่อ/หมวด/ปี/แท็ก) ---------- */
  PF.caseHref = function (w) {
    var ids = (w.caseIds || []).filter(function (k) { return CASES[k]; });
    if (ids.length) return ROUTES.case + '?p=' + encodeURIComponent(ids[0]) + '&w=' + encodeURIComponent(w.id);   /* หลาย case = หน้า case มีตัวสลับ (decisions #100) */
    return ROUTES.case + '?t=' + encodeURIComponent(w.title) + '&c=' + encodeURIComponent(w.cat || '') + '&y=' + (w.year || '') + (has(w.tags) ? '&tags=' + encodeURIComponent(w.tags.join(',')) : '');
  };
  /* รูปแบบที่สคริปต์กริดผลงานเดิมใช้ */
  PF.works = (D.works || []).map(function (w) {
    var ks = (w.caseIds || []).filter(function (k) { return CASES[k]; }), mc = ks.length ? CASES[ks[0]] : {};
    return { id: w.id, pi: (D.works || []).indexOf(w), own: has(w.sum), t: w.title, c: w.cat || '', y: w.year || '', st: w.wip ? 'กำลังทำ' : '', pin: w.pinned ? 1 : 0, tags: w.tags || [], cover: w.cover || null, href: PF.caseHref(w),
      ds: w.sum || mc.sum || (mc.teaser || {}).problem || '', role: mc.role || '', time: mc.time || '', parts: ks.length };
  });

  /* ---------- สีแบรนด์ + โลโก้ (สิ่งที่ผู้ใช้ปรับหน้าตาได้) ---------- */
  var DEF_BRAND = '#4C45D2';
  var brand = D.theme && D.theme.brand;
  function applyBrand(b) {
    var old = document.getElementById('pf-theme'); if (old) old.remove();
    if (!b || !/^#[0-9a-f]{6}$/i.test(b) || b.toUpperCase() === DEF_BRAND) return;
    var mixW = function (p) { return 'color-mix(in srgb, ' + b + ' ' + p + '%, #fff)'; }, mixK = function (p) { return 'color-mix(in srgb, ' + b + ' ' + p + '%, #000)'; };
    var css = ':root{--brand-500:' + b + ';--brand-600:' + mixK(82) + ';--brand-700:' + mixK(68) + ';--brand-50:' + mixW(6) + ';--brand-100:' + mixW(11) + ';--brand-200:' + mixW(24) + ';--brand-300:' + mixW(44) + ';--brand-400:' + mixW(68) +
      ';--brand-dark-500:' + mixW(88) + ';--brand-dark-600:' + mixW(94) + ';--brand-dark-link:' + mixW(52) + ';--brand-dark-tint-fg:' + mixW(34) + ';--brand-dark-tint-solid:color-mix(in srgb, ' + b + ' 24%, #1F2128)' +
      ';--brand-deep:' + mixK(72) + ';--brand-night:' + mixK(30) + ';--brand-midnight:' + mixK(18) + '}';
    var st = document.createElement('style'); st.id = 'pf-theme'; st.textContent = css; document.head.appendChild(st);
  }
  applyBrand(brand);
  if (D.site) {
    document.querySelectorAll('.logo').forEach(function (l) {
      /* v3.5: ชื่อบนแถบเมนู = ชื่อที่แสดงในโปรไฟล์ · โลโก้ = จุด 4 จุดเสมอ (ไม่ให้ปรับแล้ว) */
      var last = l.lastChild; if (last && last.nodeType === 3) last.textContent = (D.profile && D.profile.name) || D.site.name || '';
    });
  }

  /* ---------- หน้าแรก ---------- */
  var hero = document.querySelector('.hero');
  if (hero) {
    var P = D.profile || {}, RSM = (P.resumeFile && P.resumeFile.src) || P.resume;
    var YR = experienceYears(D), years = YR.n;
    var STATUS = { open: 'Open to work', freelance: 'Open to freelance', closed: 'Not available' };
    var lines = (P.headline || []).map(function (l, i) { return { t: l, i: i }; }).filter(function (x) { return has(x.t); }).slice(0, 3);
    var HS = '', HZ = P.headlineSizes || [];
    var meta = '', SKP = {};
    (P.skillSets || []).forEach(function (g, gi) { (g.items || []).forEach(function (s, ii) { SKP[s] = 'profile.skillSets.' + gi + '.items.' + ii; }); });
    var skLi = function (s) { return '<li><span' + pe(SKP[s]) + '>' + esc(s) + '</span></li>'; };
    /* v3.8: ไม่มีข้อมูล = ไม่ขึ้น (ทั้งหน้าเว็บและตัวอย่าง) */
    if (years) meta += '<div><dt>ประสบการณ์</dt><dd><span id="heroYrs">' + years + '</span> ปี' + (YR.intern ? ' <span class="hero-note">(รวมฝึกงาน)</span>' : '') + '</dd></div>';
    if (has(P.location)) meta += '<div><dt>อยู่ที่</dt><dd><span' + pe('profile.location') + '>' + esc(P.location) + '</span></dd></div>';
    if (STATUS[P.status]) meta += '<div><dt>สถานะ</dt><dd class="hero-st"' + pk('status', 'profile') + ' data-status="' + (P.status === 'closed' ? 'closed' : 'open') + '"><span class="hero-dot" aria-hidden="true"></span><span class="hero-stl">' + STATUS[P.status] + '</span>' + (D.sample ? tag('ตัวอย่าง') : '') + '</dd></div>';
    hero.setAttribute('data-pf', 'profile');
    hero.innerHTML =
      heroId() +
      (lines.length ? '<h1' + HS + '>' + lines.map(function (l, i) { return '<span class="hl' + ({ h2: ' hl-2', h3: ' hl-3' }[HZ[l.i]] || '') + '" style="--l:' + i + '"><span' + pe('profile.headline.' + l.i) + '>' + esc(l.t) + '</span></span>'; }).join('') + '</h1>' : '<h1 class="vh">' + esc(P.name) + (has(P.role) ? ' · ' + esc(P.role) : '') + '</h1>') +  /* ประโยคหลักไม่บังคับ (decisions #101) */
      (has(P.lede) ? '<p class="hero-lede" data-hs style="--s:4"><span' + pe('profile.lede', 1) + '>' + esc(P.lede) + '</span>' + (P.ledeDraft && D.sample ? ' ' + tag('ร่าง · แก้เป็นคำของคุณ') : '') + '</p>' : (SHOW_EMPTY ? '<p class="hero-lede" data-hs style="--s:4">' + ph('คำเกริ่น 1–2 บรรทัด') + '</p>' : '')) +
      (has(P.skills) ? (skillsView(P) === 'group'
        ? '<div class="hero-skg" data-hs style="--s:5">' + P.skillSets.map(function (g, gi) { return !has(g.items) ? '' : '<div class="hero-skr"><span class="hero-skl"><span' + pe('profile.skillSets.' + gi + '.name') + '>' + esc(g.name || 'อื่นๆ') + '</span></span><ul class="hero-sk" aria-label="ทักษะ ' + esc(g.name) + '">' + g.items.map(skLi).join('') + pal('profile.skillSets.' + gi + '.items', 'เพิ่มทักษะ') + '</ul></div>'; }).join('') + '</div>'
        : '<ul class="hero-sk" aria-label="ทักษะเด่น" data-hs style="--s:5">' + P.skills.map(skLi).join('') + pal('profile.skillSets.0.items', 'เพิ่มทักษะ') + '</ul>') : '') +
      '<div class="hero-row" data-hs style="--s:6"><dl class="hero-meta">' + meta + '</dl><div class="cta">' + (EDIT || has((D.contact || {}).email) || ((D.contact || {}).links || []).some(function (l) { return has(l.url); }) ? '<a class="btn btn-primary" href="#form">ติดต่อ</a>' : '') + '' +
      (has(RSM) ? '<a class="btn btn-outline" href="' + esc(RSM) + '" download' + (P.resumeFile && P.resumeFile.src ? '="' + esc(P.resumeFile.name || 'resume.pdf') + '"' : '') + '>Resume</a>' : '') + '</div></div>';
  }

  var SEC = D.sections || {};
  var hideSec = function (el, key) { if (el && SEC[key] === false) el.hidden = true; };  /* v3.7: ซ่อน = หายจากตัวอย่างด้วย ให้เห็นเหมือนหน้าเว็บจริง */
  var work = document.getElementById('work');
  if (work) {
    work.setAttribute('data-pf', 'works'); hideSec(work, 'works');
    /* รายละเอียดตอนชี้การ์ด: แบบทับบนภาพแบบเดียว (เจ้าของเลือกแล้ว 2026-10-12) */
    var wn = work.querySelector('.wk-head .tbd-tag'); if (wn && !D.sample) wn.remove();
  }

  var pc = document.getElementById('process');
  if (pc) {
    var steps = (D.process || []).filter(function (s) { return has(s.title); });
    pc.setAttribute('data-pf', 'process'); hideSec(pc, 'process');
    if (!steps.length && !EDIT) pc.hidden = true;
    var ol = $('pcL');
    if (ol) ol.innerHTML = steps.map(function (s, i) {
      var n = ('0' + (i + 1)).slice(-2), id = i + 1, pb = 'process.' + (D.process || []).indexOf(s);
      var pcC = steps.length > 5 ? Math.ceil(steps.length / 2) : steps.length; return '<li class="pc-s' + (steps.length > 5 && i >= pcC ? ' pc-r2' : '') + (steps.length > 5 && i === pcC - 1 ? ' pc-end' : '') + '" data-item="' + esc(s.id || '') + '" style="--i:' + i + '">' + BO + ' class="pc-b" id="pcB' + id + '" aria-expanded="' + (i === 0) + '" aria-controls="pcP' + id + '"><span class="pc-dot" aria-hidden="true"></span><span class="pc-n">' + n + '</span><span class="pc-t"><span' + pe(pb + '.title') + '>' + esc(s.title) + '</span></span><span class="pc-sm"><span' + pe(pb + '.summary') + '>' + esc(s.summary) + '</span></span><span class="ms pc-chev" aria-hidden="true">expand_more</span>' + BC +
        '<div class="pc-p" id="pcP' + id + '" role="region" aria-labelledby="pcB' + id + '"><div class="pc-pi"><p class="pc-h"><span aria-hidden="true">' + n + '</span><b class="pc-ht"' + pe(pb + '.title') + '>' + esc(s.title) + '</b></p><p class="pc-d"><span' + pe(pb + '.detail', 1) + '>' + esc(s.detail) + '</span></p>' +
        (has(s.outputs) ? '<p class="pc-gl">ได้อะไรจากขั้นนี้</p><div class="pc-out">' + s.outputs.map(function (o, oi) { return '<span><span' + pe(pb + '.outputs.' + oi) + '>' + esc(o) + '</span></span>'; }).join('') + pa(pb + '.outputs', 'เพิ่ม') + '</div>' : '') + '</div></div></li>';
    }).join('');
    if (ol) { ol.style.setProperty('--n', steps.length); ol.style.setProperty('--cols', steps.length > 5 ? Math.ceil(steps.length / 2) : Math.max(steps.length, 1)); ol.setAttribute('data-rows', steps.length > 5 ? '2' : '1'); }   /* แถวละไม่เกิน 5 ขั้น · 6–10 ขั้น = ขึ้นแถวที่สอง */
  }

  var cs = document.getElementById('case');
  if (cs) {
    var FK = (D.featuredCases || [D.featuredCase]).filter(function (x) { return x && CASES[x]; }).slice(0, 3);
    cs.setAttribute('data-pf', 'case'); hideSec(cs, 'case');
    if (!FK.length) { if (!cs.hidden) { cs.hidden = !EDIT; if (EDIT) cs.innerHTML = '<div class="sh"><div><h2>Case study</h2></div></div>' + ph('เลือก case study ที่จะโชว์บนหน้าแรก'); } }
    else {
      var fig = function (src, alt) { return src ? '<img src="' + esc(src) + '" alt="' + esc(alt) + '">' : '<span class="ph-fig">' + esc(alt) + ' (หน้าจอจริง)</span>'; };
      var one = function (key) { var C = CASES[key], T = C.teaser || {};
        return '<div class="cs-head"><h3>' + esc(C.title) + '</h3><a class="cs-link" href="' + ROUTES.case + '?p=' + encodeURIComponent(key) + '">อ่าน case study<span class="ms" aria-hidden="true">arrow_forward</span></a></div>' +
        '<dl class="cs-meta"><div><dt>บทบาท</dt><dd>' + (has(C.role) ? esc(C.role) : ph('บทบาท')) + '</dd></div><div><dt>ระยะเวลา</dt><dd>' + (has(C.time) ? esc(C.time) : ph('ระยะเวลา')) + '</dd></div><div><dt>ทีม</dt><dd>' + (has(C.team) ? esc(C.team) : ph('ทีม')) + '</dd></div><div><dt>ผลลัพธ์</dt><dd>' + (has(T.result) ? esc(T.result) : tag('รอตัวเลขจริง')) + '</dd></div></dl>' +
        (T.before || T.after || SHOW_EMPTY ? '<div class="ba" style="--x:50%"><div class="ba-l ba-before">' + fig(T.before, 'ภาพก่อนแก้') + '</div><div class="ba-l ba-after">' + fig(T.after, 'ภาพหลังแก้') + '</div><span class="ba-tag l" aria-hidden="true">ก่อน</span><span class="ba-tag r" aria-hidden="true">หลัง</span><span class="ba-line" aria-hidden="true"><span class="ba-knob"><span class="ms">code</span></span></span><input type="range" min="0" max="100" value="50" step="1" aria-label="เลื่อนเทียบภาพก่อนและหลังแก้"></div>' : '') +
        '<div class="cs-story"><div><h4><i>1</i>ปัญหา</h4><p>' + (has(T.problem) ? esc(T.problem) : ph('ปัญหาที่เจอ')) + '</p></div><div><h4><i>2</i>ทางแก้</h4><p>' + (has(T.solution) ? esc(T.solution) : ph('สิ่งที่ทำ')) + '</p></div><div><h4><i>3</i>ผลลัพธ์</h4><p>' + (has(T.result) ? esc(T.result) : tag('รอตัวเลขจริง') + ' หรือสิ่งที่เปลี่ยนจริงหลังปล่อยใช้งาน') + '</p></div></div>'; };
      var real = FK.every(function (x) { return CASES[x].real; });
      cs.innerHTML = '<div class="sh"><div><h2>Case study</h2>' + (real ? '' : MOCK) + '</div></div>' +
        (FK.length > 1 ? '<div class="cs-tabs" role="tablist" aria-label="เลือก case study">' + FK.map(function (x, i) { return '<button type="button" role="tab" class="cs-tab" data-fk="' + esc(x) + '" aria-selected="' + (i === 0) + '">' + esc(CASES[x].title || 'Case study') + '</button>'; }).join('') + '</div>' : '') +
        '<div class="cs-one" role="tabpanel">' + one(FK[0]) + '</div>';
      var bindBa = function () { cs.querySelectorAll('.ba').forEach(function (b) { var r = b.querySelector('input'); if (!r) return; var u = function () { b.style.setProperty('--x', r.value + '%'); }; r.addEventListener('input', u); u(); }); };
      bindBa();
      cs.querySelectorAll('.cs-tab').forEach(function (t) { t.addEventListener('click', function () { cs.querySelectorAll('.cs-tab').forEach(function (x) { x.setAttribute('aria-selected', x === t); }); cs.querySelector('.cs-one').innerHTML = one(t.dataset.fk); bindBa(); }); });
      }
  }

  var xp = document.getElementById('exp');
  if (xp) {
    xp.setAttribute('data-pf', 'experience'); hideSec(xp, 'experience');
    var jobs = (D.experience || []).slice(), edu = D.education || [];
    /* เรียง: auto = ใหม่สุดก่อน · asc = เก่าสุดก่อน · manual = ตามที่ลากไว้ (decisions #101) */
    var yr = function (x) { return +x.start || +((String(x.period || '').match(/\d{4}/) || [])[0]) || 0; };
    var srt = function (arr, mode) { if (mode === 'manual') return arr; return arr.sort(function (a, b) { return mode === 'asc' ? yr(a) - yr(b) : yr(b) - yr(a); }); };
    edu = edu.slice(); srt(jobs, (D.order || {}).experience); srt(edu, (D.order || {}).education);
    if (!jobs.length && !edu.length && !EDIT) xp.hidden = true;
    var sk = function (a, b) { return has(a) ? '<div class="xp-sk">' + a.map(function (s, i) { return '<span><span' + pe(b && b + '.' + i) + '>' + esc(s) + '</span></span>'; }).join('') + pa(b, 'เพิ่ม') + '</div>' : ''; };
    var pts = function (a, b) { a = a || []; return has(a.filter(has)) ? '<ul class="xp-pts">' + a.map(function (s, i) { return has(s) ? '<li><span' + pe(b && b + '.' + i, 1) + '>' + esc(s) + '</span></li>' : ''; }).join('') + pal(b, 'เพิ่มข้อ') + '</ul>' : ''; };
    var grp = function (lb, inner) { return inner ? '<div class="xp-g"><p class="xp-gl">' + lb + '</p>' + inner + '</div>' : ''; };
    var row = function (id, period, title, sub, kind, label, body, start, x) {
      var lg = x && x.logo ? '<img class="xp-lg" src="' + esc(x.logo) + '" alt="">' : '';
      var xk = x && D.experience.indexOf(x) >= 0 ? 'experience.' + D.experience.indexOf(x) : x && (D.education || []).indexOf(x) >= 0 ? 'education.' + D.education.indexOf(x) : '';
      var isJob = /^experience/.test(xk), tp = xk ? (isJob ? pe(xk + '.title') : pk('degree', xk)) : '', op = xk ? pe(xk + '.org') : '';
      return '<li class="xp-i" data-item="' + esc((x && x.id) || '') + '"' + (start ? ' data-start="' + esc(start) + '"' : '') + '>' + BO + ' class="xp-b" aria-expanded="' + !!body + '" aria-controls="' + id + '"><span class="xp-y"><span' + pk('period', xk) + '>' + (has(period) ? esc(period) : ph('ปี')) + '</span></span><span class="xp-t' + (lg ? ' has-lg' : '') + '">' + lg + '<span class="xp-tx"><b><span' + tp + '>' + esc(title) + '</span></b>' + (has(sub) ? '<span class="xp-c"><span' + op + '>' + esc(sub) + '</span></span>' : '') + '</span></span><span class="xp-k"><span' + pk(isJob ? 'type' : 'honors', xk) + '>' + (has(kind) ? esc(kind) : (EDIT && xk && !isJob ? '<i class="tbd-tag">เกียรตินิยม</i>' : '')) + '</span></span><span class="ms xp-chev" aria-hidden="true">expand_more</span>' + BC +
        '<div class="xp-p' + (body ? ' open' : '') + '" id="' + id + '" role="region" aria-label="' + esc(label) + '"><div class="xp-pi">' + body + '</div></div></li>';
    };
    var EF = !!((D.order || {}).eduFirst) && edu.length > 0;   /* การศึกษาขึ้นก่อน: หัวข้อใหญ่เป็น “การศึกษา” ประสบการณ์ย้ายไปเป็นหัวข้อรอง */
    var html = '<div class="sh"><div><h2 id="xpH">' + (EF ? 'การศึกษา' : 'ประสบการณ์') + '</h2>' + MOCK + '</div></div>', hJ = '', hE = '';
    hJ += jobs.length ? '<ol class="xp-l">' + jobs.map(function (j, i) {
      var rel = j.related && CASES[j.related] ? '<a class="xp-rel" href="' + ROUTES.case + '?p=' + encodeURIComponent(j.related) + '">' + esc(CASES[j.related].title) + '<span class="ms" aria-hidden="true">arrow_forward</span></a>' : '';
      return row('xpP' + (i + 1), j.period, j.title, j.org, j.type, 'รายละเอียด ' + j.title, grp('ทำอะไรบ้าง', pts(j.points, 'experience.' + D.experience.indexOf(j) + '.points')) + grp('ทักษะที่ใช้', sk(j.skills, 'experience.' + D.experience.indexOf(j) + '.skills')) + grp('ผลงานที่เกี่ยวข้อง', rel), j.start, j);
    }).join('') + '</ol>' : (EDIT ? ph('เพิ่มประวัติงาน') : '');
    if (edu.length) hE += (EF ? '' : '<h3 class="xp-h2">การศึกษา</h3>') + '<ol class="xp-l">' + edu.map(function (e, i) {
      var fl = (e.files || []).filter(function (f) { return f && f.src; }), att = fl.length ? '<ul class="xp-pts">' + fl.map(function (f) { return '<li><a href="' + esc(f.src) + '" download="' + esc(f.name) + '">' + esc(f.name) + '</a></li>'; }).join('') + '</ul>' : '';
      var dl = [['คณะ', e.faculty], ['เกรดเฉลี่ย', e.gpa], ['เกียรตินิยม', (e.honors || '').replace(/^เกียรตินิยม/, '')]].filter(function (x) { return has(x[1]); });
      return row('xpE' + (i + 1), e.period, e.degree, e.org, e.honors, 'รายละเอียดการศึกษา', (dl.length ? '<dl class="xp-dl">' + dl.map(function (x) { return '<div><dt>' + x[0] + '</dt><dd>' + esc(x[1]) + '</dd></div>'; }).join('') + '</dl>' : '') + grp('ผลงานเด่น', pts(e.highlights, 'education.' + D.education.indexOf(e) + '.highlights')) + grp('ทักษะที่ได้', sk(e.skills, 'education.' + D.education.indexOf(e) + '.skills')) + grp('กิจกรรม', pts(e.activities, 'education.' + D.education.indexOf(e) + '.activities')) + grp('เอกสารแนบ', att), null, e);
    }).join('') + '</ol>';
    html += EF ? hE + (jobs.length || EDIT ? '<h3 class="xp-h2">ประสบการณ์</h3>' + hJ : '') : hJ + hE;
    xp.innerHTML = html;
    }

  /* ไม่มีอีเมล ไม่มีช่องทางที่ใส่ลิงก์ และไม่มี Resume: หน้าเว็บจริงไม่มีส่วนติดต่อและลิงก์เมนูไปหาส่วนนี้ ทุกหน้า (หลังบ้านยังเห็นเพื่อให้กรอก) */
  (function () { var K0 = D.contact || {}; if (EDIT || has(K0.email) || (K0.links || []).some(function (l) { return has(l.url); }) || has((D.profile || {}).resume) || ((D.profile || {}).resumeFile || {}).src) return;
    document.documentElement.classList.add('pf-noct'); })();
  var ct = document.getElementById('form');
  if (ct) {
    var K = D.contact || {}, R = ((D.profile || {}).resumeFile || {}).src || (D.profile || {}).resume;
    ct.setAttribute('data-pf', 'contact');
    var links = (K.links || []).filter(function (l) { return has(l.url) || SHOW_EMPTY; });
    ct.innerHTML = '<div class="ct-main"><h2 class="ct-h" id="ctH"><span' + pe('contact.heading') + '>' + esc(K.heading || (env.lang === 'en' ? 'Contact' : 'ติดต่อ')) + '</span></h2>' +
      (has(K.email) ? '<div class="ct-mail"><a class="ct-addr" href="mailto:' + esc(K.email) + '"><span' + pe('contact.email') + '>' + esc(K.email) + '</span></a><button type="button" class="ct-copy" id="ctCopy" data-v="' + esc(K.email) + '"><span class="ms" aria-hidden="true">content_copy</span><span class="lb">คัดลอก</span></button><span class="vh" id="ctSt" aria-live="polite"></span></div>' : ph('อีเมล')) +
      (has(R) ? '<div class="ct-act"><a class="btn btn-primary" href="' + (has(R) ? esc(R) : '#') + '" download><span class="ms" aria-hidden="true">download</span>Resume</a></div>' : '') + '</div>' +
      (links.length ? '<nav class="ct-side" aria-labelledby="ctSideH"><p class="ct-sl" id="ctSideH">ช่องทางอื่น</p><ul class="ct-links">' + links.map(function (l) {
        var hu = String(l.url || '').trim(); if (l.label === 'เบอร์โทร' && hu) hu = 'tel:' + hu.replace(/[^\d+]/g, ''); else if (l.label === 'LINE' && hu && !/\./.test(hu)) hu = 'https://line.me/ti/p/~' + hu.replace(/^@/, ''); else if (hu && !/^[a-z]+:/i.test(hu)) hu = 'https://' + hu;
        return '<li><a href="' + (hu ? esc(hu) : '#') + '" target="_blank" rel="noopener"><span class="ms ic" aria-hidden="true">' + esc(l.icon || 'link') + '</span><span' + pe('contact.links.' + (K.links || []).indexOf(l) + '.label') + '>' + esc(l.label) + '</span>' + (has(l.url) ? '' : ' ' + tag('ใส่ลิงก์')) + '<span class="ms go" aria-hidden="true">arrow_outward</span><span class="vh"> (เปิดแท็บใหม่)</span></a></li>';
      }).join('') + '</ul></nav>' : '');
  }

  /* footer: ชื่อ + ปี · ลิงก์หน้าในเว็บและปุ่มกลับขึ้นบน เปิดปิดได้จากหลังบ้าน (ข้อ 3) */
  var FT = (D.site && D.site.footer) || {};
  document.querySelectorAll('.ftr').forEach(function (f) {
    f.setAttribute('data-pf', 'footer');
    var s = f.querySelector(':scope > span:first-child'); if (s) s.textContent = '© ' + ((D.site && D.site.year) || new Date().getFullYear()) + ' ' + ((D.profile && (D.profile.fullName || D.profile.name)) || '');
    var nv = f.querySelector('.ftr-nav'), tp = f.querySelector('.ftr-top');
    if (nv) { nv.querySelectorAll('a[href="components.html"]').forEach(function (a) { a.remove(); }); nv.hidden = FT.links === false; }
    if (tp) tp.hidden = false;   /* ปุ่มกลับขึ้นบนมีเสมอ (เอาตัวเลือกออก 2026-10-13) */
    if (has(FT.note) && s) { var nt = document.createElement('span'); nt.className = 'ftr-note'; nt.textContent = FT.note; s.appendChild(document.createTextNode(' · ')); s.appendChild(nt); }
  });
  /* ลำดับส่วนบนหน้าแรก: ตามที่ผู้ใช้ลากเรียงในหลังบ้าน (ข้อ 3) */
  var mainEl = hero && hero.parentNode, band = mainEl && mainEl.querySelector('.ct-band');
  if (mainEl && band && Array.isArray(D.layout)) {
    var SID = { works: 'work', process: 'process', 'case': 'case', experience: 'exp' };
    D.layout.forEach(function (k) { var el = document.getElementById(SID[k]); if (el && el.parentNode === mainEl) mainEl.insertBefore(el, band); });
  }
  /* ปุ่มกลับขึ้นบน: ลอยมุมขวาล่างเมื่อเลื่อนลงมาแล้ว (ข้อ 9) */
  (function () {
    var tb = document.createElement('button'); tb.type = 'button'; tb.className = 'pf-top'; tb.id = 'pfTop'; tb.tabIndex = -1;
    tb.innerHTML = '<span class="ms" aria-hidden="true">arrow_upward</span><span>กลับขึ้นบน</span>';
    document.body.appendChild(tb);
    var on = false, upd = function () { var o = scrollY > 400; if (o !== on) { on = o; tb.classList.toggle('on', o); tb.tabIndex = o ? 0 : -1; } };
    addEventListener('scroll', upd, { passive: true }); upd();
    tb.onclick = function () { scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); var f = document.querySelector('.logo'); f && f.focus({ preventScroll: true }); };
  })();
  var nm = (D.profile && D.profile.name) || (D.site && D.site.name) || '';
  if (hero && nm) document.title = nm + ' · ' + ((D.profile && D.profile.role) || 'Portfolio');

  if (!EDIT) ['case', 'exp', 'form'].forEach(function (id) { var el = document.getElementById(id); if (el && !el.hidden) el.setAttribute('data-rv', ''); });
  /* ---------- สลับโหมดสว่าง/มืด: สีทั้งหน้าค่อยๆ เปลี่ยน 360ms (duration-slow · ease-standard) แทนการตัดฉับ ----------
     ไล่สีพื้น ตัวอักษร เส้นขอบ เงา ของทุกชิ้นพร้อมกัน (ใช้ได้ทุกเบราว์เซอร์) · ขอลดการเคลื่อนไหว = เปลี่ยนทันที */
  var setMode = function (v, quiet) {
    var root = document.documentElement, apply = function () {
      root.setAttribute('data-theme', v); var ic = document.getElementById('tl'), bt = document.getElementById('theme');
      if (ic) ic.textContent = v === 'dark' ? 'light_mode' : 'dark_mode'; if (bt) bt.setAttribute('aria-label', v === 'dark' ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด');
      try { localStorage.setItem('theme', v); } catch (e) {} };
    if (root.getAttribute('data-theme') === v) return;
    if (quiet || matchMedia('(prefers-reduced-motion: reduce)').matches) { apply(); return; }
    root.classList.add('pf-thm'); apply(); setTimeout(function () { root.classList.remove('pf-thm'); }, 420);
  };
  PF.setMode = setMode;
  /* ---------- ปุ่มสลับภาษา (เฉพาะเว็บที่เปิดสองภาษา): ป้ายบนปุ่ม = ภาษาที่จะสลับไป ----------
     หน้าเว็บจริง: จำภาษาที่เลือกแล้วโหลดหน้าใหม่ · ในหลังบ้าน: บอกหลังบ้านให้สลับภาษาที่กำลังกรอกตาม */
  (function () {
    var th0 = document.getElementById('theme'); if (!th0 || !(D.site && D.site.i18n) || document.getElementById('lang')) return;
    var en = env.lang === 'en', to = en ? 'th' : 'en', b = document.createElement('button');
    /* ไอคอนลูกโลก + รหัสภาษาที่ใช้อยู่ตอนนี้ (กด = สลับไปอีกภาษา) · โชว์ภาษาปัจจุบันเสมอ เพราะเคยโชว์ภาษาปลายทางแล้วคนอ่านเป็นภาษาปัจจุบัน */
    b.className = 'nib nlg'; b.id = 'lang'; b.type = 'button';
    b.setAttribute('aria-label', en ? 'ภาษาอังกฤษอยู่ กดเพื่อเปลี่ยนเป็นภาษาไทย' : 'ภาษาไทยอยู่ กดเพื่อเปลี่ยนเป็นภาษาอังกฤษ');
    b.innerHTML = '<span class="ms" aria-hidden="true">language</span><span class="on">' + (en ? 'EN' : 'TH') + '</span>'; b.title = en ? 'Switch to Thai' : 'เปลี่ยนเป็น English';
    th0.parentNode.insertBefore(b, th0);
    b.addEventListener('click', function () {
      if (EDIT && env.embedded) { try { parent.postMessage({ type: 'pf:lang', lang: to }, '*'); } catch (x) {} return; }
      try { localStorage.setItem('pf-lang', to); } catch (x) {}
      location.reload();
    });
  })();
  var thB = document.getElementById('theme');
  if (thB) thB.addEventListener('click', function (e) { e.stopImmediatePropagation(); var nt = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; setMode(nt); try { if (EDIT) parent.postMessage({ type: 'pf:mode', theme: nt, from: 'preview' }, '*'); } catch (x) {} }, true);
  addEventListener('message', function (e) { var m = e.data || {}; if (m.type === 'pf:mode' && (m.theme === 'dark' || m.theme === 'light')) setMode(m.theme); });
  /* ---------- กดลิงก์ไปส่วนในหน้าจากหน้าอื่น: เลื่อนซ้ำหลังฟอนต์/กริดผลงานขึ้นครบ (decisions #98) ---------- */
  if (location.hash.length > 1 && !EDIT) {
    var fix = function () { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView({ block: 'start', behavior: 'instant' }); };
    addEventListener('load', function () { fix(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fix); setTimeout(fix, 350); });
  }

  /* ---------- โหมดหลังบ้าน ---------- */
  if (EDIT) {
    document.documentElement.classList.add('pf-edit');
    var post = function (m) { try { parent.postMessage(m, '*'); } catch (e) {} };
    /* จำตำแหน่งเลื่อนข้ามการโหลดใหม่ (เปิดเป็นไฟล์แยก) · ฝังในหลังบ้าน = หลังบ้านคุมตำแหน่งเอง ไม่ใช้ค่าที่จำข้ามหน้า (ข้อ 4) */
    if (!env.embedded) {
      try { var y = +sessionStorage.getItem('pf-scroll-' + location.pathname); if (y) addEventListener('load', function () { scrollTo(0, y); }); } catch (e) {}
      addEventListener('scroll', function () { try { sessionStorage.setItem('pf-scroll-' + location.pathname, String(scrollY)); } catch (e) {} }, { passive: true });
    }

    /* ---------- ตัวเลือกเด้งในตัวอย่าง: ค่าที่ไม่ใช่ข้อความอิสระ (ช่วงเวลา · ประเภท · วุฒิ · สถานะ · หมวด · ปี · ระยะเวลา) เลือกได้ตรงนั้น ----------
       ใช้ token ของ Menu / Input / Chip ของระบบ · เลือกแล้วส่งค่าให้หลังบ้านทันที · ปิด = หลังบ้านวาดตัวอย่างใหม่ */
    var gv = function (p) { return p.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, D); };
    var MON = MONTHS_TH, PKO = null;
    var pkCfg = function (kind, base) {
      var x = gv(base) || {}, O = function (label, path, opts, cur) { return { t: 'o', label: label, path: path, opts: opts, v: cur }; };
      if (kind === 'period') { var per = function (k, lb) { var v = x[k] || {}; return [{ t: 'n', label: lb + ' · ปี ค.ศ.', path: base + '.' + k + '.y', v: v.y || '', ph: String(new Date().getFullYear()), grp: k }, { t: 'g', label: lb + ' · เดือน (ไม่บังคับ)', path: base + '.' + k + '.m', v: v.m || '', opts: MON.map(function (n, i) { return [i + 1, n]; }), grp: k }]; };
        return { title: 'ช่วงเวลา', f: per('from', 'เริ่ม').concat(per('to', 'ถึง'), [{ t: 'c', label: /^education/.test(base) ? 'ยังเรียนอยู่' : 'ยังทำอยู่ (ถึงปัจจุบัน)', path: base + '.now', v: !!x.now, hides: 'to' }]) }; }
      if (kind === 'type') return { title: 'ประเภทงาน', f: [O('', base + '.type', ['งานประจำ', 'ฟรีแลนซ์', 'สัญญาจ้าง', 'ฝึกงาน'].map(function (v) { return [v, v]; }), x.type)] };
      if (kind === 'honors') return { title: 'เกียรตินิยม', f: [O('', base + '.honors', [['', 'ไม่มี'], ['เกียรตินิยมอันดับ 1', 'อันดับ 1'], ['เกียรตินิยมอันดับ 1 (เหรียญทอง)', 'อันดับ 1 เหรียญทอง'], ['เกียรตินิยมอันดับ 2', 'อันดับ 2']], x.honors || '')] };
      if (kind === 'degree') return { title: 'วุฒิและสาขา', f: [{ t: 's', label: 'สาขา', path: base + '.major', v: x.major || '', ph: 'เช่น ออกแบบนิเทศศิลป์' }, O('วุฒิ', base + '.level', (EDU_LEVELS || []).map(function (v) { return [v, v]; }), x.level || '')] };
      if (kind === 'status') return { title: 'สถานะรับงาน', f: [O('', 'profile.status', [['open', 'Open to work'], ['freelance', 'Open to freelance'], ['closed', 'Not available']], (D.profile || {}).status)] };
      if (kind === 'wcat') return { title: 'หมวดของงานนี้', f: [O('', base + '.cat', [['', 'ไม่ใส่หมวด']].concat((D.workCats || []).map(function (c) { return [c, c]; })), x.cat || ''), { t: 's', label: 'หรือพิมพ์หมวดใหม่ แล้วกด Enter', path: base + '.cat', v: '', ph: 'เช่น Mobile app', newcat: 1 }] };
      if (kind === 'wyear') return { title: 'ปีของงานนี้', f: [{ t: 'n', label: 'ปี ค.ศ.', path: base + '.year', v: x.year || '', ph: String(new Date().getFullYear()) }, { t: 'c', label: 'ยังทำอยู่', path: base + '.wip', v: !!x.wip }] };
      if (kind === 'ctime') return { title: 'ระยะเวลา', f: [{ t: 'n', label: 'จำนวน', path: base + '.timeN', v: x.timeN == null ? '' : x.timeN, ph: '8', max: 3 }, { t: 'g', label: 'หน่วย', path: base + '.timeU', v: x.timeU || 'สัปดาห์', opts: ['วัน', 'สัปดาห์', 'เดือน', 'ปี'].map(function (v) { return [v, v]; }), req: 1 }] };
      return null;
    };
    /* ไม่โหลดตัวอย่างใหม่หลังเลือก: เก็บค่าลงข้อมูลในหน้านี้ แล้วเปลี่ยนข้อความตรงจุดที่กดเอง (เฉพาะสถานะรับงานที่เปลี่ยนหลายจุด ถึงให้หลังบ้านวาดใหม่) */
    var sv = function (p, v) { var ks = p.split('.'), o = D; for (var i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null) o[ks[i]] = {}; o = o[ks[i]]; } o[ks[ks.length - 1]] = v; };
    var pkShow = function (o) { var a = o.trig.getAttribute('data-pk').split('|'), k = a[0], x = gv(a[1]) || {}, t = null;
      if (k === 'period') { if (x.now) x.to = null; ['from', 'to'].forEach(function (f) { if (x[f]) { x[f].y = +x[f].y || null; x[f].m = +x[f].m || null; } }); t = formatPeriod(x); }
      if (k === 'type') t = x.type || ''; if (k === 'honors') t = x.honors || ''; if (k === 'degree') t = [x.level, x.major].filter(Boolean).join(' ');
      if (k === 'wcat') t = x.cat || ''; if (k === 'wyear') t = x.wip ? 'กำลังทำ' : (x.year || ''); if (k === 'ctime') t = x.timeN !== '' && x.timeN != null ? x.timeN + ' ' + (x.timeU || 'สัปดาห์') : '';
      if (t !== null) o.trig.textContent = t; };
    var pkClose = function (silent) { if (!PKO) return; var o = PKO; PKO = null; o.el.remove(); o.trig.classList.remove('pk-on'); if (!silent && o.last && /^status\|/.test(o.trig.getAttribute('data-pk'))) post({ type: 'pf:editend', path: o.last }); };
    var pkSend = function (path, v) { sv(path, v); if (PKO) { PKO.last = path; pkShow(PKO); } post({ type: 'pf:edit', path: path, value: v, raw: 1 }); };
    var pkOpen = function (trig) {
      pkClose(true); var a = trig.getAttribute('data-pk').split('|'), cfg = pkCfg(a[0], a[1]); if (!cfg) return;
      var el = document.createElement('div'); el.className = 'pf-pk'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', cfg.title);
      el.innerHTML = '<p class="pf-pk-t">' + esc(cfg.title) + '</p>' + cfg.f.map(function (f, i) {
        var lb = f.label ? '<span class="pf-pk-l" id="pkL' + i + '">' + esc(f.label) + '</span>' : '', g = f.grp ? ' data-grp="' + f.grp + '"' : '';
        if (f.t === 'o') return '<div' + g + '>' + lb + '<div class="pf-pk-o" role="radiogroup" aria-label="' + esc(f.label || cfg.title) + '">' + f.opts.map(function (o) { var on = String(o[0]) === String(f.v == null ? '' : f.v); return '<button type="button" role="radio" aria-checked="' + on + '" data-f="' + i + '" data-v="' + esc(o[0]) + '"><span>' + esc(o[1]) + '</span>' + (on ? '<span class="ms" aria-hidden="true">check</span>' : '') + '</button>'; }).join('') + '</div></div>';
        if (f.t === 'g') return '<div' + g + '>' + lb + '<div class="pf-pk-g" role="radiogroup" aria-labelledby="pkL' + i + '">' + f.opts.map(function (o) { return '<button type="button" role="radio" aria-checked="' + (String(o[0]) === String(f.v)) + '" data-f="' + i + '" data-v="' + esc(o[0]) + '">' + esc(o[1]) + '</button>'; }).join('') + '</div></div>';
        if (f.t === 'c') return '<label class="pf-pk-c"><input type="checkbox" data-f="' + i + '"' + (f.v ? ' checked' : '') + '>' + esc(f.label) + '</label>';
        return '<div' + g + '>' + lb + '<input class="pf-pk-in" data-f="' + i + '" value="' + esc(f.v) + '" placeholder="' + esc(f.ph || '') + '" aria-labelledby="pkL' + i + '" autocomplete="off"' + (f.t === 'n' ? ' inputmode="numeric" maxlength="' + (f.max || 4) + '"' : ' maxlength="80"') + '></div>';
      }).join('');
      document.body.appendChild(el); PKO = { el: el, trig: trig, cfg: cfg, last: '' }; trig.classList.add('pk-on');
      var hide = function () { cfg.f.forEach(function (f, i) { if (f.t === 'c' && f.hides) { var on = el.querySelector('input[data-f="' + i + '"]').checked; el.querySelectorAll('[data-grp="' + f.hides + '"]').forEach(function (g) { g.hidden = on; }); } }); };
      var place = function () { var r = trig.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight, l = Math.max(8, Math.min(r.left, innerWidth - w - 8)), t = r.bottom + 6; if (t + h > innerHeight - 8) t = Math.max(8, r.top - h - 6); el.style.left = l + 'px'; el.style.top = t + 'px'; };
      PKO.place = place; hide(); place();
      el.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-f]'); if (!b) return; var f = cfg.f[+b.dataset.f], v = b.dataset.v, grp = b.parentNode;
        if (f.t === 'g' && !f.req && b.getAttribute('aria-checked') === 'true') v = '';         /* กดเดือนเดิมซ้ำ = ไม่ระบุเดือน */
        grp.querySelectorAll('button').forEach(function (x) { var on = x === b && v !== '' || (v === '' && x.dataset.v === '' ); x.setAttribute('aria-checked', on); var ck = x.querySelector('.ms'); if (ck) ck.remove(); if (on && f.t === 'o') x.insertAdjacentHTML('beforeend', '<span class="ms" aria-hidden="true">check</span>'); });
        pkSend(f.path, f.t === 'g' && /\.m$/.test(f.path) ? (v === '' ? null : +v) : v);
        if (f.t === 'o' && cfg.f.filter(function (q) { return q.t !== 'o' || q === f; }).length === 1) pkClose();     /* ตัวเลือกชุดเดียว = เลือกแล้วปิดเลย */
      });
      el.addEventListener('input', function (e) { var i = e.target.dataset.f; if (i == null) return; var f = cfg.f[+i];
        if (f.t === 'c') { pkSend(f.path, e.target.checked); hide(); place(); return; }
        if (f.t === 'n') { var dg = e.target.value.replace(/\D/g, ''); if (dg !== e.target.value) e.target.value = dg; pkSend(f.path, dg === '' ? '' : +dg); return; }
        if (!f.newcat) pkSend(f.path, e.target.value); });
      el.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Escape') { e.preventDefault(); pkClose(); return; }
        if (e.key === 'Enter' && e.target.classList.contains('pf-pk-in')) { e.preventDefault(); var f = cfg.f[+e.target.dataset.f], v = e.target.value.trim(); if (f.newcat) { if (!v) return; post({ type: 'pf:newcat', value: v }); pkSend(f.path, v); } pkClose(); }
        if (e.key === 'Tab') { var fs = [].slice.call(el.querySelectorAll('button,input')).filter(function (x) { return x.offsetParent !== null; }), ix = fs.indexOf(document.activeElement); if (e.shiftKey && ix <= 0) { e.preventDefault(); fs[fs.length - 1].focus(); } else if (!e.shiftKey && ix === fs.length - 1) { e.preventDefault(); fs[0].focus(); } } });
      var first = el.querySelector('.pf-pk-in,[aria-checked=true],button'); first && first.focus({ preventScroll: true });
    };
    /* เลื่อนหน้า = ตัวเลือกเกาะตามจุดที่กด ไม่ปิดเอง (ปิดด้วย Esc หรือกดข้างนอก) */
    addEventListener('scroll', function () { if (PKO && PKO.place) PKO.place(); }, { passive: true }); addEventListener('resize', function () { if (PKO && PKO.place) PKO.place(); });
    /* ลากสลับลำดับขั้นตอนในตัวอย่าง: กดค้างที่ขั้นแล้วลากไปวางตำแหน่งใหม่ (ขยับเกิน 8px ถึงนับเป็นลาก ไม่ชนกับการกดเปิดขั้น) */
    var DG = null, dgSkip = 0;
    var dgTarget = function (x, y) { var best = null, bd = 1e9; DG.all.forEach(function (li, i) { var r = li.querySelector('.pc-b').getBoundingClientRect(), d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)); if (d < bd) { bd = d; best = { i: i, aft: DG.vert ? y > r.top + r.height / 2 : x > r.left + r.width / 2 }; } }); return best; };
    document.addEventListener('pointerdown', function (e) { var b = e.target.closest && e.target.closest('.pc-b'); if (!b || e.button > 0 || (e.target.closest('[data-pe]') && e.target.closest('[data-pe]').isContentEditable)) return;
      var li = b.closest('.pc-s'), all = [].slice.call(li.parentNode.querySelectorAll('.pc-s')); if (all.length < 2) return; var r0 = all[0].getBoundingClientRect(), r1 = all[1].getBoundingClientRect();
      DG = { li: li, all: all, x: e.clientX, y: e.clientY, on: false, vert: Math.abs(r1.top - r0.top) > Math.abs(r1.left - r0.left), pid: e.pointerId, b: b }; }, true);
    document.addEventListener('pointermove', function (e) { if (!DG) return; var dx = e.clientX - DG.x, dy = e.clientY - DG.y;
      if (!DG.on) { if (Math.hypot(dx, dy) < 8) return; DG.on = true; DG.li.classList.add('pf-drag'); try { DG.b.setPointerCapture(DG.pid); } catch (x) {} var ae = document.activeElement; if (ae && ae.blur && ae.isContentEditable) ae.blur(); }
      e.preventDefault(); DG.b.style.transform = DG.vert ? 'translateY(' + dy + 'px)' : 'translateX(' + dx + 'px)';
      DG.all.forEach(function (x) { x.classList.remove('pf-drop', 'aft'); }); var t = dgTarget(e.clientX, e.clientY); if (t && DG.all[t.i] !== DG.li) { DG.all[t.i].classList.add('pf-drop'); DG.all[t.i].classList.toggle('aft', t.aft); } }, true);
    var dgEnd = function (e) { if (!DG) return; var d = DG; DG = null; if (!d.on) return; dgSkip = Date.now();
      d.b.style.transform = ''; d.li.classList.remove('pf-drag'); d.all.forEach(function (x) { x.classList.remove('pf-drop', 'aft'); });
      var t = e.type === 'pointerup' ? (DG = d, dgTarget(e.clientX, e.clientY)) : null; DG = null; if (!t || d.all[t.i] === d.li) return;
      var ids = d.all.map(function (x) { return x.getAttribute('data-item'); }), me = d.li.getAttribute('data-item'), ref = ids[t.i]; ids.splice(ids.indexOf(me), 1); ids.splice(ids.indexOf(ref) + (t.aft ? 1 : 0), 0, me);
      post({ type: 'pf:order', path: 'process', ids: ids }); };
    document.addEventListener('pointerup', dgEnd, true); document.addEventListener('pointercancel', dgEnd, true);
    document.addEventListener('click', function (e) { if (Date.now() - dgSkip < 350) { e.preventDefault(); e.stopPropagation(); } }, true);
    /* แก้ข้อความตรงตัวอย่าง: กดที่ข้อความ = พิมพ์แก้ได้เลย ส่งค่าให้หลังบ้านทุกครั้งที่พิมพ์ */
    var peOn = function (el) {
      if (el.isContentEditable) return;
      el.setAttribute('contenteditable', 'plaintext-only'); if (!el.isContentEditable) el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false'); el.setAttribute('role', 'textbox'); el.__v0 = el.textContent; el.focus();
    };
    document.addEventListener('input', function (e) { var el = e.target.closest && e.target.closest('[data-pe]'); if (el) post({ type: 'pf:edit', path: el.getAttribute('data-pe'), value: el.textContent.replace(/\u00a0/g, ' ') }); });
    document.addEventListener('keydown', function (e) { var el = e.target.closest && e.target.closest('[data-pe]'); if (!el) return; e.stopPropagation();   /* ปุ่มลูกศร/เว้นวรรคระหว่างพิมพ์ ไม่ไปสลับแท็บหรือกางแถวที่ครอบอยู่ */
      if (e.key === 'Escape' || (e.key === 'Enter' && !(el.hasAttribute('data-pem') && e.shiftKey))) { e.preventDefault(); el.blur(); } }, true);
    document.addEventListener('keyup', function (e) { if (e.target.closest && e.target.closest('[data-pe],[data-pa]')) e.stopPropagation(); }, true);
    var paDone = function (el, keep) { if (!el.isContentEditable) return; var v = el.textContent.replace(/\s+/g, ' ').trim(); el.removeAttribute('contenteditable'); el.classList.remove('on'); el.textContent = el.getAttribute('data-lab'); if (!v || !keep) return; var ap = el.getAttribute('data-pa'), kd = el.getAttribute('data-pak') || '';
      if (!kd) { var arr = gv(ap), wrap = el.parentNode.classList.contains('pf-addl') ? el.parentNode : el; if (!Array.isArray(arr)) { arr = []; sv(ap, arr); }
        if (arr.indexOf(v) < 0) { var n = document.createElement(wrap.tagName), mk = '<span data-pe="' + esc(ap + '.' + arr.length) + '"' + (wrap.parentNode.classList.contains('xp-pts') ? ' data-pem' : '') + '>' + esc(v) + '</span>'; n.innerHTML = wrap.tagName === 'LI' ? mk : mk; if (wrap.tagName !== 'LI') n.innerHTML = mk; arr.push(v); wrap.parentNode.insertBefore(n, wrap); } }
      post({ type: 'pf:add', path: ap, value: v, kind: kd }); };
    document.addEventListener('keydown', function (e) { var el = e.target.closest && e.target.closest('[data-pa]'); if (!el) return; e.stopPropagation();
      if (!el.isContentEditable) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } return; }
      if (e.key === 'Enter') { e.preventDefault(); paDone(el, true); } else if (e.key === 'Escape') { e.preventDefault(); paDone(el, false); el.blur(); } }, true);
    document.addEventListener('focusout', function (e) { var el = e.target.closest && e.target.closest('[data-pa]'); if (el) paDone(el, true); });
    document.addEventListener('keydown', function (e) { var t = e.target; if (t.hasAttribute && t.hasAttribute('data-pk') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopPropagation(); pkOpen(t); } }, true);
    document.addEventListener('paste', function (e) { var el = e.target.closest && e.target.closest('[data-pe]'); if (!el) return; e.preventDefault(); var t = ((e.clipboardData || window.clipboardData).getData('text') || '').replace(/\s*\n\s*/g, ' '); document.execCommand('insertText', false, t); });
    document.addEventListener('focusout', function (e) { var el = e.target.closest && e.target.closest('[data-pe]'); if (el) { el.removeAttribute('contenteditable'); if (el.textContent !== el.__v0) post({ type: 'pf:editend', path: el.getAttribute('data-pe') }); } });   /* ไม่ได้แก้อะไร = ไม่ต้องบอกหลังบ้าน */
    document.addEventListener('click', function (e) {
      if (e.target.closest('.pf-pk')) return;                    /* กดในตัวเลือกเด้ง = ให้ตัวเลือกจัดการเอง */
      var hadPk = !!PKO; if (hadPk) pkClose();
      var paEl = e.target.closest('[data-pa]');
      if (paEl) { e.preventDefault(); e.stopPropagation(); if (!paEl.isContentEditable) { paEl.textContent = ''; paEl.classList.add('on'); paEl.setAttribute('contenteditable', 'plaintext-only'); if (!paEl.isContentEditable) paEl.setAttribute('contenteditable', 'true'); paEl.focus(); } return; }
      var pkEl = e.target.closest('[data-pk]');
      if (pkEl) { e.preventDefault(); e.stopPropagation(); pkOpen(pkEl); return; }
      if (hadPk) { e.preventDefault(); e.stopPropagation(); return; }   /* กดข้างนอกครั้งแรก = ปิดตัวเลือกอย่างเดียว */
      var a = e.target.closest('a[href]');
      var sec = e.target.closest('[data-pf]');
      var ed = e.target.closest('[data-pe]');
      /* กดพลาดไปโดนช่องว่างระหว่างบรรทัดของย่อหน้า/ข้อย่อย = นับเป็นกดข้อความนั้น */
      if (!ed && /^(P|LI|H1|H2|H3|BLOCKQUOTE|DD)$/.test(e.target.tagName) && !e.target.closest('a,button,[role=button]')) { var only = e.target.querySelectorAll(':scope > [data-pe]'); if (only.length === 1) ed = only[0]; }
      if (ed) { e.preventDefault(); e.stopPropagation(); var was = ed.isContentEditable; peOn(ed); if (!was) post({ type: 'pf:goto', path: ed.getAttribute('data-pe') }); return; }   /* กดข้อความเพื่อแก้ = ฟอร์มซ้ายเลื่อนไปช่องเดียวกันให้ (เลื่อนนุ่มๆ ไม่วาดใหม่ถ้าอยู่หน้านั้นอยู่แล้ว) */
      if (a) e.preventDefault();               /* ไม่ให้ลิงก์พาออกจากหน้าตัวอย่าง */
      /* ลิงก์ระหว่างหน้า case (ปุ่มตอน · อ่านต่อ) = ให้หลังบ้านพาไป (v3.7.1) */
      var h = a && a.getAttribute('href');
      if (h && h.charAt(0) === '#' && h.length > 1) { var tg = document.getElementById(h.slice(1)); if (tg) tg.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); return; }
      if (h && isSiteRoute(h)) { post({ type: 'pf:nav', href: routeToPage(h) }); return; }   /* ลิงก์ไปหน้าอื่นในพอร์ต (ดูผลงานอื่น ฯลฯ) */
      /* หน้า Case study: กดที่ว่างในบทไหน ฟอร์มซ้ายไปที่บทนั้น · กดหัวเรื่อง ไปที่ภาพรวมงาน */
      if (!sec && !a && !e.target.closest('button,input,label,[role=button]')) { var chE = e.target.closest('.cp-ch[data-case]'), ptE = e.target.closest('.cp-part[data-case]'), hdE = e.target.closest('.cp-hd,.cp-meta'), fk = (document.querySelector('.cp-ch[data-case]') || {}).dataset;
        if (chE) { post({ type: 'pf:goto', path: 'cases.' + chE.dataset['case'] + '.chapters.' + chE.dataset.ci + '.t' }); return; }
        if (ptE) { post({ type: 'pf:goto', path: 'cases.' + ptE.dataset['case'] + '.sum' }); return; }
        if (hdE && fk && fk['case']) { post({ type: 'pf:goto', path: 'cases.' + fk['case'] + '.sum' }); return; } }
      var itm = e.target.closest('[data-item]');
      /* กดแถวประวัติที่กางอยู่ = เลือกมาแก้ในฟอร์ม ไม่ยุบแถว (ยังยุบได้ด้วยลูกศรท้ายแถว) */
      var xb = e.target.closest('.xp-b'); if (xb && xb.getAttribute('aria-expanded') === 'true' && !e.target.closest('.xp-chev')) e.stopPropagation();
      if (sec && (a || itm || !e.target.closest('button,input,label'))) post({ type: 'pf:select', section: sec.getAttribute('data-pf'), item: (itm && itm.getAttribute('data-item')) || '' });
    }, true);
    addEventListener('message', function (e) {
      var m = e.data || {};
      if (m.type === 'pf:reload') { location.reload(); }
      if (m.type === 'pf:cur') {          /* ส่วนที่กำลังแก้ในหลังบ้าน = กรอบสีแบรนด์ค้างไว้ */
        document.querySelectorAll('.pf-cur').forEach(function (x) { x.classList.remove('pf-cur'); });
        var c = document.querySelector('[data-pf="' + m.section + '"]'); if (c) c.classList.add('pf-cur');
      }
      if (m.type === 'pf:hl') {           /* ชี้ช่องที่กำลังกรอกบนหน้าเว็บ */
        document.querySelectorAll('.pf-hl').forEach(function (x) { x.classList.remove('pf-hl'); });
        var h = m.sel && document.querySelector(m.sel); if (!h) return;
        h.classList.add('pf-hl'); if (m.quiet) return; var r = h.getBoundingClientRect(); if (r.top < 60 || r.bottom > innerHeight) h.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
      if (m.type === 'pf:theme') applyBrand(m.brand);      /* เลือกสีแบรนด์: เปลี่ยนสีสด ๆ ไม่โหลดหน้าใหม่ ตำแหน่งเลื่อนจึงไม่ขยับ (ข้อ 4) */
      if (m.type === 'pf:set') { var se = document.querySelector('[data-pe="' + m.path + '"]'); if (se && document.activeElement !== se) se.textContent = m.value; }
      if (m.type === 'pf:open') {        /* เปิดรายการที่กำลังแก้ในฟอร์ม (ขั้นตอน · ประวัติ) แล้วเลื่อนให้เห็น (ข้อ 6) */
        var it = m.item && document.querySelector('[data-pf="' + m.section + '"] [data-item="' + m.item + '"]'); if (!it) return;
        var ob = it.querySelector('.pc-b,.xp-b'); if (ob && ob.getAttribute('aria-expanded') !== 'true') ob.click();
        document.querySelectorAll('.pf-hl').forEach(function (x) { x.classList.remove('pf-hl'); }); it.classList.add('pf-hl');
        it.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
      if (m.type === 'pf:focus') {
        var t = document.querySelector('[data-pf="' + m.section + '"]'); if (!t) return;
        document.querySelectorAll('.pf-flash').forEach(function (x) { x.classList.remove('pf-flash'); });
        t.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        t.classList.add('pf-flash'); setTimeout(function () { t.classList.remove('pf-flash'); }, 1400);
      }
    });
    post({ type: 'pf:ready', page: routeToPage(location.pathname) });
  }
  return PF;
}
