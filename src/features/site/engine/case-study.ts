// @ts-nocheck -- หน้า Case study (เนื้อหาบท · บล็อก · ตัวสลับ case · สารบัญ) ย้ายมาจากสคริปต์ในหน้า case.html ของต้นแบบแบบ 1:1
/* eslint-disable */
import { ROUTES } from '@/lib/routes';
import type { Portfolio } from '@/lib/portfolio/types';
import type { SiteRuntime } from './types';

/** ภาพก่อน/หลังเริ่มต้น (เดิมอยู่ใน <template id="cpBaTpl"> ของหน้า) */
const BA_TEMPLATE = '<div class="ba" style="--x:50%"><div class="ba-l ba-before"><span class="ph-fig">ภาพก่อนแก้ (หน้าจอจริง)</span></div><div class="ba-l ba-after"><span class="ph-fig">ภาพหลังแก้ (หน้าจอจริง)</span></div><span class="ba-tag l" aria-hidden="true">ก่อน</span><span class="ba-tag r" aria-hidden="true">หลัง</span><span class="ba-line" aria-hidden="true"><span class="ba-knob"><span class="ms">code</span></span></span><input type="range" min="0" max="100" value="50" step="1" aria-label="เลื่อนเทียบภาพก่อนและหลังแก้"></div>';

export function caseStudy(DATA: Portfolio, PF: SiteRuntime | null): void {
var body=document.getElementById('cpBody');if(!body)return;var CPM=800;
/* ข้อมูลแต่ละโปรเจกต์ (ตอนนี้ทุกอันเป็นข้อมูลตัวอย่าง · ใส่ของจริงแล้วเพิ่ม real:true ป้าย "ข้อมูลตัวอย่าง" จะหายเอง): เลือกบล็อกเองได้ — type: p · tbd · quote · ba · image · video · steps · out · links · callout · stats */
var P=(DATA&&DATA.cases)||{};/* เนื้อหา case ย้ายไป data/portfolio.js (decisions #98) */
var BA=BA_TEMPLATE;
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
/* บล็อก (v3.5): ว่าง = หน้าเว็บจริงซ่อน · ตอนแก้ = กรอบเส้นประบอกว่าต้องใส่อะไร · โน้ตกันลืมเห็นเฉพาะตอนแก้ */
var ED0=/[?&]edit=1/.test(location.search),CUR={};
function has(v){return v!=null&&v!==''&&!(Array.isArray(v)&&!v.filter(has).length)}
function ph(t){return ED0?'<div class="ph-fig cp-ph">'+esc(t)+'</div>':''}
function vid(src){var m;if((m=String(src).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/)))return 'https://www.youtube-nocookie.com/embed/'+m[1]+'?autoplay=1';if((m=String(src).match(/vimeo\.com\/(\d+)/)))return 'https://player.vimeo.com/video/'+m[1]+'?autoplay=1';if((m=String(src).match(/drive\.google\.com\/file\/d\/([\w-]+)/)))return 'https://drive.google.com/file/d/'+m[1]+'/preview';return null}
function rows(a,n){return (a||[]).filter(function(r){return r&&r.slice(0,n).some(has)})}
/* ข้อความจัดรูปแบบจากหลังบ้าน: esc ก่อนเสมอ แล้วแปลงเครื่องหมายเป็นแท็กที่อนุญาตเท่านั้น */
function md(s){var L=[],t=esc(s).replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g,function(m,x,u){u=u.replace(/^(?!https?:|mailto:)/i,'https://');if(!/^(https?:|mailto:)/i.test(u)||/^https:\/\/$/.test(u))return x;L.push('<a href="'+u+'" target="_blank" rel="noopener">'+x+'<span class="vh"> (เปิดแท็บใหม่)</span></a>');return '\u0000'+(L.length-1)+'\u0000'});
 t=t.replace(/\*\*(\S(?:[^*]|\*(?!\*))*?)\*\*/g,'<strong>$1</strong>').replace(/\*(\S[^*\n]*?)\*/g,'<em>$1</em>').replace(/\+\+(\S[^\n]*?)\+\+/g,'<u>$1</u>').replace(/==(\S[^\n]*?)==/g,'<mark>$1</mark>');
 return t.replace(/\u0000(\d+)\u0000/g,function(m,i){return L[+i]}).replace(/\n/g,'<br>')}
function blk(b){var cap=b.cap?'<figcaption>'+esc(b.cap)+'</figcaption>':'';switch(b.type){
 case 'h':return has(b.text)?'<h3 class="cp-h"><span'+pe(BP+'.text')+'>'+esc(b.text)+'</span></h3>':(ED0?'<h3 class="cp-h"><i class="tbd-tag">หัวข้อย่อย ยังว่าง</i></h3>':'');
 case 'hr':return '<hr class="cp-hr">';
 case 'p':return has(b.text)?(plain(b.text)&&!/\n/.test(b.text)?'<p><span'+pe(BP+'.text',1)+'>'+esc(b.text)+'</span></p>':'<p>'+md(b.text)+'</p>'):(ED0?'<p class="cp-tbd"><span'+pe(BP+'.text',1)+' data-ph="'+esc(b.hint||'พิมพ์ย่อหน้าตรงนี้')+'"></span> <i class="tbd-tag">ยังว่าง ไม่ขึ้นเว็บ</i></p>':'');
 case 'tbd':return ED0&&has(b.text)?'<p class="cp-tbd"><span'+pe(BP+'.text',1)+'>'+esc(b.text)+'</span> <i class="tbd-tag">โน้ต ไม่ขึ้นเว็บ</i></p>':'';
 case 'quote':return has(b.text)?'<blockquote class="cp-q"><span'+pe(BP+'.text',1)+'>'+esc(b.text)+'</span><small><span'+pe(BP+'.by')+'>'+esc(b.by||'')+'</span></small></blockquote>':'';
 case 'ba':var T=CUR.teaser||{},bf=b.before||T.before,af=b.after||T.after;if(!bf&&!af&&!ED0)return '';var fg=function(x,t){return x?'<img src="'+esc(x)+'" alt="'+t+'">':'<span class="ph-fig">'+t+'</span>'};
  return '<div class="ba" style="--x:50%"><div class="ba-l ba-before">'+fg(bf,'ภาพก่อนแก้')+'</div><div class="ba-l ba-after">'+fg(af,'ภาพหลังแก้')+'</div><span class="ba-tag l" aria-hidden="true">ก่อน</span><span class="ba-tag r" aria-hidden="true">หลัง</span><span class="ba-line" aria-hidden="true"><span class="ba-knob"><span class="ms">code</span></span></span><input type="range" min="0" max="100" value="50" step="1" aria-label="เลื่อนเทียบภาพก่อนและหลังแก้"></div>';
 case 'image':var hr=b.href?String(b.href).replace(/^(?!https?:)/i,'https://'):'',rf=hr?' <a class="cp-ref" href="'+esc(hr)+'" target="_blank" rel="noopener">ดูต้นฉบับ<span class="ms" aria-hidden="true">arrow_outward</span><span class="vh"> (เปิดแท็บใหม่)</span></a>':'',cp2=(b.cap||rf)?'<figcaption>'+esc(b.cap||'')+rf+'</figcaption>':'',im='<img src="'+esc(b.src)+'" alt="'+esc(b.cap||'')+'">';
  return b.src?'<figure class="cp-fig">'+(hr&&b.click==='link'?'<a class="cp-imgl" href="'+esc(hr)+'" target="_blank" rel="noopener" aria-label="เปิดลิงก์ของภาพ (แท็บใหม่)">'+im+'</a>':'<button type="button" class="cp-gi cp-zoom" data-src="'+esc(b.src)+'" aria-label="ดูภาพขนาดใหญ่">'+im+'</button>')+cp2+'</figure>':(ED0?'<figure class="cp-fig">'+ph(b.hint||'ภาพ')+cap+'</figure>':'');
 case 'gallery':var it=(b.items||[]).filter(function(x){return x&&x.src});if(!it.length)return ED0?'<figure class="cp-fig"><div class="cp-gal" style="--c:'+(+b.cols||3)+'">'+'<span class="ph-fig cp-ph"></span>'.repeat(+b.cols||3)+'</div>'+cap+'</figure>':'';
  return '<figure class="cp-fig"><div class="cp-gal" style="--c:'+(+b.cols||3)+'">'+it.map(function(x,i){return '<button type="button" class="cp-gi" data-src="'+esc(x.src)+'" aria-label="ดูภาพที่ '+(i+1)+' ขนาดใหญ่"><img src="'+esc(x.src)+'" alt=""></button>'}).join('')+'</div>'+cap+'</figure>';
 case 'video':if(!b.src)return ED0?'<figure class="cp-vid">'+ph('วิดีโอ')+cap+'</figure>':'';
  if(/^data:video|\.(mp4|webm)(\?|$)/i.test(b.src))return '<figure class="cp-vid"><video src="'+esc(b.src)+'" controls preload="metadata" playsinline></video>'+cap+'</figure>';
  return '<figure class="cp-vid"><button type="button" class="cp-vbtn" data-emb="'+esc(vid(b.src)||'')+'" data-href="'+esc(b.src)+'" aria-label="เล่นวิดีโอ'+(b.cap?': '+esc(b.cap):'')+'"><span class="pl"><span class="ms" aria-hidden="true">play_arrow</span></span><span class="vl"><span class="ms" aria-hidden="true">movie</span>วิดีโอ</span></button>'+cap+'</figure>';
 case 'steps':var st=rows(b.items,2);return st.length?'<ol class="cp-steps" style="--n:'+st.length+'">'+st.map(function(x){var ri=b.items.indexOf(x);return '<li><b'+pe(BP+'.items.'+ri+'.0')+'>'+esc(x[0])+'</b><span'+pe(BP+'.items.'+ri+'.1')+'>'+esc(x[1]||'')+'</span></li>'}).join('')+'</ol>':'';
 case 'out':var ou=(b.items||[]).filter(has);return ou.length?'<h3 class="cp-h">'+esc(b.title||'สิ่งที่ส่งมอบ')+'</h3><div class="cp-out">'+ou.map(function(x){return '<span><span'+pe(BP+'.items.'+b.items.indexOf(x))+'>'+esc(x)+'</span></span>'}).join('')+(ED0&&BP&&PF&&PF.pa?PF.pa(BP+'.items','เพิ่ม'):'')+'</div>':'';
 case 'links':var lk=(b.items||[]).filter(function(l){return l&&has(l[3])});return lk.length?'<div class="cp-links">'+lk.map(function(l){return '<a class="cp-link" href="'+esc(l[3])+'" target="_blank" rel="noopener"><span class="ic"><span class="ms" aria-hidden="true">'+esc(l[0]||'open_in_new')+'</span></span><span><b>'+esc(l[1]||l[2]||l[3])+'</b><small>'+esc(l[2]||'')+'</small></span><span class="ms go" aria-hidden="true">arrow_outward</span><span class="vh"> (เปิดแท็บใหม่)</span></a>'}).join('')+'</div>':'';
 case 'ai':var ar=(b.rows||[]).filter(function(r){return r&&has(r[1])});return ar.length?'<dl class="cp-ai">'+ar.map(function(r){return '<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd></div>'}).join('')+'</dl>':'';
 case 'prompt':return has(b.text)?'<figure class="cp-code"><figcaption><span>'+esc(b.title||'Prompt')+'</span><button type="button" class="cp-copy">คัดลอก</button></figcaption><pre><code>'+esc(b.text)+'</code></pre></figure>':'';
 case 'callout':return has(b.text)||has(b.title)?'<div class="cp-call"><b'+pe(BP+'.title')+'>'+esc(b.title||'')+'</b><p>'+md(b.text||'')+'</p></div>':'';
 case 'stats':var sx=rows(b.items,2);return sx.length?'<div class="cp-stats">'+sx.map(function(x){var ri=b.items.indexOf(x);return '<div><b'+pe(BP+'.items.'+ri+'.0')+'>'+esc(x[0]||'—')+'</b><span'+pe(BP+'.items.'+ri+'.1')+'>'+esc(x[1]||'')+'</span></div>'}).join('')+'</div>':'';}return ''}
var BP='';
function pe(path,multi){return ED0&&BP&&PF&&PF.pe?PF.pe(path,multi):''}
function plain(t){return !/\*\*|\*\S|\+\+|==|\]\(/.test(String(t))}
function metaRows(d,ED,base){var TB=function(t){return ED?'<i class="tbd-tag">'+esc(t)+'</i>':''},ob=BP;BP=base||'';var can=ED&&base&&PF&&PF.pa,w=function(k){return '<span'+pe(base+'.'+k)+'>'+esc(d[k]||'')+'</span>'},sc=(d.scope||[]);
 var lite=!!d.lite;if(lite)can=false;var mr=[['บทบาท',d.role||can?w('role'):''],['ขอบเขตงาน',sc.filter(has).length||can?'<span class="cp-scope">'+sc.map(function(x,i){return has(x)?'<span><span'+pe(base+'.scope.'+i)+'>'+esc(x)+'</span></span>':''}).join('')+(can?PF.pa(base+'.scope','เพิ่ม'):'')+'</span>':''],['ระยะเวลา',d.time?'<span'+(base&&PF&&PF.pk?PF.pk('ctime',base):'')+'>'+esc(d.time)+'</span>':''],['ทีม',d.team||can?w('team'):'']].filter(function(r){return r[1]||(ED&&!lite)});BP=ob;
 return mr.map(function(r){return '<div><dt>'+r[0]+'</dt><dd>'+(r[1]||TB('ยังว่าง ไม่ขึ้นเว็บ'))+'</dd></div>'}).join('')}
function show(k){
 /* ผลงานที่มีหลายตอน: ทุกตอนเรียงต่อกันในหน้าเดียว อ่านจากบนลงล่าง ตอน 1 → ตอนสุดท้าย (ไม่ต้องกดเปลี่ยนหน้า) · สารบัญซ้ายไล่ตามลำดับเดียวกัน */
 var QS=new URLSearchParams(location.search),wid=QS.get('w'),WS=(DATA&&DATA.works)||[],W=(wid&&WS.filter(function(x){return x.id===wid})[0])||WS.filter(function(x){return (x.caseIds||[]).indexOf(k)>=0})[0]||null;
 var ids=W?(W.caseIds||[]).filter(function(x){return P[x]}):[];if(ids.indexOf(k)<0)ids=[k];
 var ED=ED0,TB=function(t){return ED?'<i class="tbd-tag">'+esc(t)+'</i>':''},multi=ids.length>1,hk=ids[0],d=P[hk],pn=function(x,i){var tt=P[x].title||'';return tt&&(!W||tt!==W.title||!i)?tt:i?'ตอนที่ '+(i+1):'ภาพรวม'};
 CUR=d;var SN=(DATA.site&&DATA.site.name)||(DATA.profile&&DATA.profile.name)||'';document.title=((W&&W.title)||d.title)+' · Case study'+(SN?' · '+SN:'');
 var kd=document.getElementById('cpKind');kd.textContent=(multi?'Case study · '+ids.length+' ตอน':d.lite?'รายละเอียดงาน':'Case study')+(d.cat?' · '+d.cat:'');if(!d.real){var tg=document.createElement('i');tg.className='tbd-tag cp-mock';tg.textContent='ข้อมูลตัวอย่าง แก้เป็นของคุณได้';kd.appendChild(document.createTextNode(' '));kd.appendChild(tg)}
 BP=hk==='_t'?'':'x';document.getElementById('cpTitle').innerHTML='<span'+pe((multi&&W&&W.title)?'works.'+WS.indexOf(W)+'.title':W&&(W.caseIds||[])[0]===hk&&W.title===d.title?'works.'+WS.indexOf(W)+'.title':'cases.'+hk+'.title')+'>'+esc((multi&&W&&W.title)||d.title)+'</span>';
 var sm=document.getElementById('cpSum'),hs=(multi&&W&&W.sum)||d.sum;BP=hk==='_t'?'':'x';if(hs){sm.innerHTML='<span'+((multi&&W&&W.sum)?'':pe('cases.'+hk+'.sum',1))+'>'+esc(hs)+'</span>';sm.hidden=false}else{sm.innerHTML=ED&&BP?'<span'+pe((multi&&W)?'works.'+WS.indexOf(W)+'.sum':'cases.'+hk+'.sum',1)+' data-ph="สรุปงานนี้ใน 1 ประโยค"></span>':TB('สรุป 1 ประโยค ยังว่าง');sm.hidden=!ED}
 var tgEl=document.getElementById('cpTags');tgEl.hidden=!d.cat&&!(d.tags||[]).length;tgEl.innerHTML=(d.cat?'<a class="cat" href="'+ROUTES.work+'?cat='+encodeURIComponent(d.cat)+'">'+esc(d.cat)+'</a>':'')+(d.tags||[]).map(function(t){return '<a href="'+ROUTES.work+'?tag='+encodeURIComponent(t)+'">'+esc(t)+'</a>'}).join('');
 /* ภาพปก: ใช้ภาพเดียวกับการ์ดผลงาน สัดส่วน 4:5 เท่ากัน จึงไม่ถูกตัดผิดตำแหน่ง · ไม่มีภาพ = หน้าเว็บจริงซ่อน / หลังบ้านขึ้นกรอบบอก */
 var cv=document.getElementById('cpCover'),cs=W&&W.cover;cv.hidden=!cs&&!ED;cv.classList.toggle('ph',!cs);cv.style.backgroundImage=cs?'url("'+String(cs).replace(/"/g,'%22')+'")':'';cv.textContent=cs?'':'ภาพปก 4:5';
 /* ช่องว่าง: หน้าเว็บจริง = ซ่อนแถว · หลังบ้าน = ป้ายรอข้อมูล (data-model.md) */
 var me=document.getElementById('cpMeta'),mh=metaRows(d,ED,hk==='_t'?'':'cases.'+hk);me.hidden=!mh;me.innerHTML=mh;
 var cid=function(pi,i){return (pi?'p'+(pi+1):'')+'ch'+(i+1)};
 var tocCh=function(x,pi){return (P[x].chapters||[]).map(function(c,i){return '<li><a class="cp-tr" href="#'+cid(pi,i)+'" data-ch="'+cid(pi,i)+'"><span class="cp-no">'+(i+1)+'</span><span class="cp-tt" title="'+esc(c.t)+'">'+esc(c.t)+'</span></a></li>'}).join('')};
 document.getElementById('cpToc').innerHTML=multi?ids.map(function(x,pi){return '<li><a class="cp-tp" href="#part'+(pi+1)+'" data-part="part'+(pi+1)+'"><small>ตอน '+(pi+1)+'</small><span class="cp-tt">'+esc(pn(x,pi))+'</span></a><ol>'+tocCh(x,pi)+'</ol></li>'}).join(''):tocCh(hk,0);
 body.innerHTML=ids.map(function(x,pi){var c0=P[x];CUR=c0;c0.chapters=c0.chapters||[];var base=x==='_t'?'':'cases.'+x;
  var head=pi?'<header class="cp-part" id="part'+(pi+1)+'" data-case="'+esc(x)+'"><p class="cp-kind"><span class="cp-pn" aria-hidden="true">'+(pi+1)+'</span>ตอน '+(pi+1)+' จาก '+ids.length+(c0.real?'':' <i class="tbd-tag cp-mock">ข้อมูลตัวอย่าง</i>')+'</p><h2 class="cp-pt" id="part'+(pi+1)+'h" tabindex="-1"><span'+(BP=base,pe(base+'.title'))+'>'+esc(pn(x,pi))+'</span></h2>'+(c0.sum?'<p class="cp-sum"><span'+pe(base+'.sum',1)+'>'+esc(c0.sum)+'</span></p>':'')+(function(){var h=metaRows(c0,false,base);return h?'<dl class="cp-meta">'+h+'</dl>':''})()+'</header>':'';
  return head+c0.chapters.map(function(c,i){var id=cid(pi,i);BP=base;
   return '<section class="cp-ch"'+(ED0?'':' data-rv')+' id="'+id+'" data-case="'+esc(x)+'" data-ci="'+i+'" aria-labelledby="'+id+'h"><h2 id="'+id+'h" tabindex="-1"><span>'+(i+1)+'</span><b class="cp-ct"'+pe(base+'.chapters.'+i+'.t')+'>'+esc(c.t)+'</b></h2>'+(c.b||[]).map(function(b,bi){BP=base?base+'.chapters.'+i+'.b.'+bi:'';return blk(b)}).join('')+(ED0&&base&&PF&&PF.pa&&(c.b||[]).length<10?'<div class="cp-adds">'+PF.pa(base+'.chapters.'+i+'.b','เพิ่มย่อหน้า','p')+PF.pa(base+'.chapters.'+i+'.b','เพิ่มหัวข้อย่อย','h')+PF.pa(base+'.chapters.'+i+'.b','เพิ่มคำพูดผู้ใช้','quote')+'</div>':'')+'</section>'}).join('')+(ED0&&base&&PF&&PF.pa?'<div class="cp-adds">'+PF.pa(base+'.chapters','เพิ่มบทในตอนนี้','chap')+'</div>':'')}).join('')+
  '<a class="cp-next" href="'+ROUTES.work+'"><small>อ่านจบแล้ว</small><b>ดูผลงานอื่น</b><span class="ms" aria-hidden="true">arrow_forward</span></a>';
 CUR=d;BP='';
 body.querySelectorAll('.ba').forEach(function(b){var r=b.querySelector('input');function u(){b.style.setProperty('--x',r.value+'%');r.setAttribute('aria-valuetext','ภาพก่อนแก้ '+r.value+'% · ภาพหลังแก้ '+(100-r.value)+'%')}r.addEventListener('input',u);u()});
 body.querySelectorAll('.cp-vbtn').forEach(function(v){v.onclick=function(){var e=v.dataset.emb;if(!e){window.open(v.dataset.href,'_blank','noopener');return}v.outerHTML='<div class="cp-vframe"><iframe src="'+esc(e)+'" title="วิดีโอ" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>'}});
 body.querySelectorAll('.cp-gi').forEach(function(g){g.onclick=function(){var d=document.createElement('div');d.className='cp-lbx';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label','ภาพขนาดใหญ่');d.innerHTML='<img src="'+esc(g.dataset.src)+'" alt=""><button type="button" class="cp-lbx-x" aria-label="ปิด"><span class="ms" aria-hidden="true">close</span></button>';document.body.appendChild(d);var x=d.querySelector('button');x.focus();var cl=function(){d.remove();g.focus()};x.onclick=cl;d.onclick=function(e){if(e.target===d)cl()};d.onkeydown=function(e){if(e.key==='Escape'||e.key==='Tab'){e.preventDefault();if(e.key==='Escape')cl()}}}});
 body.querySelectorAll('.cp-copy').forEach(function(c){c.onclick=function(){var t=c.closest('.cp-code').querySelector('code').textContent;function done(ok){c.textContent=ok?'คัดลอกแล้ว':'คัดลอกไม่ได้';setTimeout(function(){c.textContent='คัดลอก'},1600)}try{navigator.clipboard.writeText(t).then(function(){done(true)},function(){done(false)})}catch(e){done(false)}}});
 var jump=function(a,id,e){e.preventDefault();var el=document.getElementById(id),rm=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!el)return;lock=Date.now()+900;mark(a.dataset.ch||null,a.dataset.part||null);el.scrollIntoView({behavior:rm?'auto':'smooth',block:'start'});if(!ED0)try{history.replaceState(null,'','#'+id)}catch(x){}setTimeout(function(){var h=document.getElementById(id+'h');h&&h.focus({preventScroll:true})},rm?0:500)};
 document.querySelectorAll('.cp-tr').forEach(function(a){a.onclick=function(e){jump(a,a.dataset.ch,e)}});
 document.querySelectorAll('.cp-tp').forEach(function(a){a.onclick=function(e){jump(a,a.dataset.part,e)}});
 spy();
 /* เปิดมาที่ตอนที่ขอ (?p=) : ตอน 2 ขึ้นไป = เลื่อนไปต้นตอนนั้นทันที */
 var at=ids.indexOf(k);if(at>0&&!(location.hash.length>1)){var go=function(){var t=document.getElementById('part'+(at+1));t&&t.scrollIntoView({block:'start',behavior:'instant'})};go();addEventListener('load',go)}
 document.querySelectorAll('.wk-demo [data-p]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.p===k)})}
function mark(ch,part){var cur=ch&&document.getElementById(ch),pk=part||(cur&&(function(){var x=cur.previousElementSibling;while(x&&!x.classList.contains('cp-part'))x=x.previousElementSibling;return x?x.id:'part1'})());
 document.querySelectorAll('.cp-tr').forEach(function(a){a.setAttribute('aria-current',a.dataset.ch===ch)});document.querySelectorAll('.cp-tp').forEach(function(a){a.setAttribute('aria-current',a.dataset.part===pk)});
 var on=document.querySelector('.cp-tr[aria-current=true]')||document.querySelector('.cp-tp[aria-current=true]'),nv=document.getElementById('cpNav');if(on&&nv&&nv.scrollHeight>nv.clientHeight){var r=on.getBoundingClientRect(),n=nv.getBoundingClientRect();if(r.top<n.top||r.bottom>n.bottom)nv.scrollTop+=r.top-n.top-n.height/2}}
var io,lock=0;function spy(){if(!('IntersectionObserver' in window))return;if(io)io.disconnect();io=new IntersectionObserver(function(es){if(Date.now()<lock)return;es.forEach(function(e){if(!e.isIntersecting)return;if(e.target.classList.contains('cp-ch'))mark(e.target.id,null);else mark(null,e.target.id)})},{rootMargin:'-30% 0px -60% 0px'});document.querySelectorAll('.cp-ch,.cp-part,.cp-hd').forEach(function(c){io.observe(c)})}
document.querySelectorAll('.wk-demo [data-p]').forEach(function(b){b.onclick=function(){show(b.dataset.p)}});
document.getElementById('cpStart').onclick=function(e){e.preventDefault();var t=document.querySelector('.cp-tr');t&&t.click()};
var U=new URLSearchParams(location.search),q=U.get('p');
/* ผลงานที่ยังไม่มีเนื้อหา case: สร้างโครงจากชื่อ/หมวด/ปี/แท็กที่ส่งมาจากการ์ด ทุกช่องเป็นป้ายรอข้อมูล (decisions #97) */
if(!P[q]&&U.get('t')){P._t={title:U.get('t'),sum:'',cat:U.get('c')||'ผลงาน',tags:(U.get('tags')||'').split(',').filter(Boolean),role:'',scope:[''],time:'',team:'',chapters:[
 {t:'โจทย์',b:[{type:'tbd',text:'ปัญหาหรือเป้าหมายของงานนี้ 1–2 ประโยค'}]},
 {t:'วิธีทำงานในโปรเจกต์นี้',b:[{type:'tbd',text:'ขั้นตอนที่ทำจริง และสิ่งที่ได้จากแต่ละขั้น'}]},
 {t:'ทางแก้',b:[{type:'tbd',text:'สิ่งที่ออกแบบหรือสร้าง พร้อมภาพก่อน/หลัง'}]},
 {t:'ผลลัพธ์',b:[{type:'stats',items:[['','']]}]}]};q='_t'}
var K0=P[q]?q:(DATA&&P[DATA.featuredCase]?DATA.featuredCase:Object.keys(P)[0]);
/* พอร์ตยังไม่มี case study เลย (ผู้ใช้ใหม่ไม่มีข้อมูลตัวอย่างแล้ว) */
if(!K0){body.innerHTML='<div class="es"><p class="es-t">ยังไม่มี Case study</p><p class="es-d"><a href="'+ROUTES.work+'">ดูผลงานทั้งหมด</a></p></div>';return}
show(K0);

}
