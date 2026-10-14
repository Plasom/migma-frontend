// @ts-nocheck -- กริด/รายการผลงาน (หน้าแรก · ผลงานทั้งหมด) ย้ายมาจากสคริปต์ในหน้าของต้นแบบแบบ 1:1
//   ต้นแบบมีสองชุด (landing-preview.html · work.html) ต่างกันแค่โหมด → รวมเป็นชุดเดียว แยกด้วย data-mode ของ #work
//   หน้าผลงานทั้งหมดเคยหน่วง 1.2 วินาทีเพื่อโชว์โครงโหลด (ข้อมูลอยู่ในเครื่อง ไม่มีอะไรให้รอ) → วาดทันที
/* eslint-disable */
import { ROUTES } from '@/lib/routes';
import type { SiteRuntime } from './types';

export function worksBrowser(PF: SiteRuntime | null): void {
var root=document.getElementById('work');if(!root||!root.classList.contains('wk'))return;
var BASE=(PF&&PF.works||[]).map(function(w){return Object.assign({},w)});/* ข้อมูลจาก data/portfolio.js (decisions #98) */
function many(){var cats=['Mobile','Web','Design system','Research','Branding','Dashboard','Game','AR/VR','Workshop'],w=[9,8,5,5,4,3,2,2,2],
 n1=['แอป','เว็บ','ระบบ','แดชบอร์ด','ชุด UI','แบรนด์','งานวิจัย','ต้นแบบ'],n2=['จองคิวคลินิก','ธนาคาร','ร้านกาแฟ','คลังสินค้า','โรงเรียนดนตรี','ประกันสุขภาพ','สหกรณ์ออมทรัพย์และสินเชื่อเพื่อการเกษตรประจำจังหวัด','ส่งอาหาร','ฟิตเนส','ท่องเที่ยวชุมชน'],
 tg=['Figma','Research','UI','UX writing','Prototype','Accessibility','Fintech','Healthcare','Workshop','Motion'],r=[],k=0;
 cats.forEach(function(c,ci){for(var j=0;j<w[ci];j++){var t=n1[(k*3)%n1.length]+n2[(k*7)%n2.length];r.push({t:t+(k>9?' '+(2016+k%10):''),c:c,y:2026-(k%6),st:k%11===4?'กำลังทำ':'',tags:tg.slice(k%7,k%7+1+(k%5))});k++}});return r}
var exp={},phase='ready',skAt=0,ltm=[],MODE=root.dataset.mode||'home',CAP=24,COLL=12,TEASE=6,PAGE=MODE==='all'?24:12,D=BASE.slice(),shown=PAGE,open=false;
function setData(n){D=(n==='40'?BASE.concat(many()).slice(0,40):n==='20'?BASE.concat(many().filter(function(d,i){return i%2===0})).slice(0,20):BASE.slice());open=false;D.forEach(function(d,i){d.i=i;d.ph='ภาพผลงานจริง 4:5'});st.cat='';st.tags=[];st.status='';shown=PAGE}
D.forEach(function(d,i){d.i=i;d.ph='ภาพผลงานจริง 4:5'});
var MAXC=5,OM=(PF&&PF.data.order&&PF.data.order.works)||'new',SORTS=[['new','ใหม่สุด'],['old','เก่าสุด'],['az','ชื่อ ก–ฮ']];if(OM==='manual')SORTS.unshift(['custom','แนะนำ']);if(OM==='type')SORTS.unshift(['type','ตามประเภท']);/* ลำดับที่เจ้าของจัดในหลังบ้าน (decisions #100) */
var st={cat:'',q:'',tags:[],status:'',sort:SORTS[0][0],view:'grid'};
try{var v=localStorage.getItem('wk-view');if(v==='list'||v==='grid')st.view=v}catch(e){}
var $=function(id){return document.getElementById(id)};
var MARK=/^[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\s]+/;function cleanQ(v){return v.replace(MARK,'')}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function hl(t){var q=st.q.trim();if(!q)return esc(t);var i=t.toLowerCase().indexOf(q.toLowerCase());return i<0?esc(t):esc(t.slice(0,i))+'<mark>'+esc(t.slice(i,i+q.length))+'</mark>'+esc(t.slice(i+q.length))}
/*FILTERS*/
var STATUS=[['live','ใช้งานจริง'],['wip','กำลังทำ']],tagsOpen=false;
function stOf(d){return d.st?'wip':'live'}
function match(d,ex){var q=st.q.trim().toLowerCase();ex=ex||{};
 return (ex.cat!==undefined?(!ex.cat||d.c===ex.cat):(!st.cat||d.c===st.cat))&&(ex.status!==undefined?(!ex.status||stOf(d)===ex.status):(!st.status||stOf(d)===st.status))&&st.tags.every(function(t){return d.tags.indexOf(t)>=0})&&(ex.tag===undefined||d.tags.indexOf(ex.tag)>=0)&&(!q||(d.t+' '+d.c+' '+d.tags.join(' ')+' '+(d.ds||'')).toLowerCase().indexOf(q)>=0)}
function nAct(){return (st.cat?1:0)+(st.status?1:0)+st.tags.length}
function renderFilters(total){
 var cnt={},tc={};D.forEach(function(d){cnt[d.c]=(cnt[d.c]||0)+1;d.tags.forEach(function(t){tc[t]=(tc[t]||0)+1})});
 var cats=Object.keys(cnt).sort(function(a,b){return cnt[b]-cnt[a]||a.localeCompare(b)}),tags=Object.keys(tc).sort(function(a,b){return tc[b]-tc[a]||a.localeCompare(b)});
 var tn={};tags.forEach(function(t){tn[t]=st.tags.indexOf(t)>=0?total:D.filter(function(d){return match(d,{tag:t})}).length});tags=tags.filter(function(t){return tn[t]>0||st.tags.indexOf(t)>=0});var showTags=tagsOpen?tags:tags.slice(0,10);st.tags.forEach(function(t){if(showTags.indexOf(t)<0)showTags.push(t)});
 function chip(attr,val,label,on,n){var dis=!on&&n===0;return '<button type="button" class="wk-fc" data-'+attr+'="'+esc(val)+'" aria-pressed="'+on+'"'+(dis?' aria-disabled="true"':'')+'>'+esc(label)+' <i>'+n+'</i></button>'}
 var h='<div class="wk-fg sortg" role="group" aria-label="เรียงตาม"><p>เรียงตาม</p><div class="chips">'+SORTS.map(function(x){return '<button type="button" class="wk-fc" data-s="'+x[0]+'" aria-pressed="'+(x[0]===st.sort)+'">'+x[1]+'</button>'}).join('')+'</div></div>';
 h+='<div class="wk-fg" role="group" aria-label="หมวด"><p>หมวด</p><div class="chips">'+chip('c','','ทั้งหมด',!st.cat,D.filter(function(d){return match(d,{cat:''})}).length)+cats.map(function(c){return chip('c',c,c,st.cat===c,D.filter(function(d){return match(d,{cat:c})}).length)}).join('')+'</div></div>';
 h+='<div class="wk-fg" role="group" aria-label="สถานะ"><p>สถานะ</p><div class="chips">'+STATUS.map(function(x){return chip('st',x[0],x[1],st.status===x[0],D.filter(function(d){return match(d,{status:x[0]})}).length)}).join('')+'</div></div>';
 h+='<div class="wk-fg" role="group" aria-label="แท็ก"><p>แท็ก · เลือกได้หลายอัน</p><div class="chips">'+showTags.map(function(t){var on=st.tags.indexOf(t)>=0;return chip('t',t,t,on,tn[t])}).join('')+'</div>'+(!tags.length?'<span style="font:var(--body-sm);color:var(--text-2)">ไม่มีแท็กที่ตรงกับตัวกรองนี้</span>':'')+(tags.length>10?'<button type="button" class="wk-fmore" id="wkFMore">'+(tagsOpen?'แสดงน้อยลง':'แสดงแท็กทั้งหมด ('+tags.length+')')+'</button>':'')+'</div>';
 $('wkFBody').innerHTML=h;
 var n=nAct();$('wkFN').hidden=!n;$('wkFN').textContent=n;$('wkFB').setAttribute('aria-label','ตัวกรอง'+(n?' · กรองอยู่ '+n:''));
 $('wkFDone').textContent='แสดง '+total+' ชิ้น';$('wkFClr').disabled=!n;
 var act=$('wkActive'),ch=[];if(st.cat)ch.push(['c',st.cat,st.cat]);if(st.status)ch.push(['st',st.status,STATUS.filter(function(x){return x[0]===st.status})[0][1]]);st.tags.forEach(function(t){ch.push(['t',t,t])});
 act.hidden=!ch.length;act.innerHTML=ch.length?'กรองอยู่ '+ch.map(function(c){return '<span class="wk-ic">'+esc(c[2])+'<button type="button" data-rm="'+c[0]+'" data-v="'+esc(c[1])+'" aria-label="เอา '+esc(c[2])+' ออก"><span class="ms">close</span></button></span>'}).join('')+(ch.length>1?'<button type="button" class="wk-aclr" data-rmall>ล้างทั้งหมด</button>':''):'';
 wireFilters()}
function refocus(sel){var el=$('wkFBody').querySelector(sel);el&&el.focus()}
function wireFilters(){
 $('wkFBody').querySelectorAll('[data-c]').forEach(function(b){b.onclick=function(){if(b.getAttribute('aria-disabled')==='true')return;st.cat=b.dataset.c;shown=PAGE;render();refocus('[data-c="'+b.dataset.c+'"]')}});
 $('wkFBody').querySelectorAll('[data-st]').forEach(function(b){b.onclick=function(){if(b.getAttribute('aria-disabled')==='true')return;st.status=st.status===b.dataset.st?'':b.dataset.st;shown=PAGE;render();refocus('[data-st="'+b.dataset.st+'"]')}});
 $('wkFBody').querySelectorAll('[data-t]').forEach(function(b){b.onclick=function(){if(b.getAttribute('aria-disabled')==='true')return;var t=b.dataset.t,i=st.tags.indexOf(t);if(i>=0)st.tags.splice(i,1);else st.tags.push(t);shown=PAGE;render();refocus('[data-t="'+t+'"]')}});
 $('wkFBody').querySelectorAll('.sortg [data-s]').forEach(function(b){b.onclick=function(){st.sort=b.dataset.s;shown=PAGE;render();refocus('.sortg [data-s="'+b.dataset.s+'"]')}});
 var fm=$('wkFMore');if(fm)fm.onclick=function(){tagsOpen=!tagsOpen;render();$('wkFMore').focus()};
 $('wkActive').querySelectorAll('[data-rm]').forEach(function(b){b.onclick=function(){var k=b.dataset.rm,v=b.dataset.v;if(k==='c')st.cat='';if(k==='st')st.status='';if(k==='t')st.tags=st.tags.filter(function(t){return t!==v});shown=PAGE;render();var f=$('wkActive').querySelector('[data-rm]');(f||$('wkFB')).focus()}});
 var ra=$('wkActive').querySelector('[data-rmall]');if(ra)ra.onclick=clearF}
function clearF(){st.cat='';st.status='';st.tags=[];shown=PAGE;render();$('wkFB').focus()}
var fOpen=false,mob=function(){return matchMedia('(max-width:720px)').matches};
function openF(){fOpen=true;closeM();$('wkF').classList.add('open');$('wkFS').classList.add('open');$('wkFB').setAttribute('aria-expanded','true');$('wkF').setAttribute('aria-modal',mob()?'true':'false');if(mob())document.body.style.overflow='hidden';setTimeout(function(){var f=$('wkFBody').querySelector('.wk-fg:not(.sortg) [aria-pressed=true]')||$('wkFBody').querySelector('button');if(mob())f=$('wkFBody').querySelector('.sortg [aria-pressed=true]')||f;f&&f.focus({preventScroll:true})},30)}
function closeF(ret){if(!fOpen)return;fOpen=false;$('wkF').classList.remove('open');$('wkFS').classList.remove('open');$('wkFB').setAttribute('aria-expanded','false');document.body.style.overflow='';if(ret!==false)$('wkFB').focus({preventScroll:true})}
$('wkFB').onclick=function(e){e.stopPropagation();fOpen?closeF():openF()};
$('wkF').addEventListener('click',function(e){e.stopPropagation()});
$('wkFS').onclick=function(){closeF()};$('wkFX').onclick=function(){closeF()};$('wkFDone').onclick=function(){closeF()};$('wkFClr').onclick=function(){st.cat='';st.status='';st.tags=[];shown=PAGE;render();$('wkFDone').focus()};
document.addEventListener('click',function(){if(fOpen&&!mob())closeF(false)});
$('wkF').addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();closeF()}
 if(e.key==='Tab'&&mob()){var l=[].slice.call($('wkF').querySelectorAll('button:not(:disabled):not([aria-disabled=true])')),i=l.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();l[l.length-1].focus()}else if(!e.shiftKey&&i===l.length-1){e.preventDefault();l[0].focus()}}});
$('wkF').addEventListener('focusout',function(e){if(fOpen&&!mob()&&e.relatedTarget&&!$('wkF').contains(e.relatedTarget)&&e.relatedTarget!==$('wkFB'))closeF(false)});
/*/FILTERS*/

function href(d){return d.href||(PF?PF.caseHref({title:d.t,cat:d.c,year:d.y,tags:d.tags}):ROUTES.case+'')}
/* ในหลังบ้าน: ชื่องานและคำอธิบายบนการ์ดพิมพ์แก้ได้ตรงนั้น (ตอนไม่ได้ค้นหา) */
function pp(d,k){return PF&&PF.edit&&d.pi>=0&&!st.q.trim()?PF.pe('works.'+d.pi+'.'+k):''}
function tt(d){var a=pp(d,'title');return a?'<span'+a+'>'+esc(d.t)+'</span>':hl(d.t)}
function kk(d,k){return PF&&PF.edit&&d.pi>=0?PF.pk(k,'works.'+d.pi):''}
function meta(d){return '<span'+kk(d,'wcat')+'>'+(d.c?esc(d.c):(kk(d,'wcat')?'<i class="tbd-tag">หมวด</i>':''))+'</span> · <span'+kk(d,'wyear')+'>'+(d.st?'<span class="wk-prog">'+d.st+'</span>':d.y)+'</span>'}
/* รายละเอียดบนการ์ดตอนชี้/โฟกัส: งานนี้คืออะไร · แท็ก · บทบาท ระยะเวลา จำนวนตอน (ข้อ 16) */
function ov(d){var m=[d.role,d.time,d.parts>1?d.parts+' ตอน':''].filter(Boolean),tg=(d.tags||[]).slice(0,3);
 return '<div class="wk-ov"><p class="wk-ovd" id="wkD'+d.i+'">'+esc(d.ds||'ยังไม่มีคำอธิบายงานนี้')+'</p>'+(m.length?'<p class="wk-ovm" aria-hidden="true">'+esc(m.join(' · '))+'</p>':'')+(tg.length?'<p class="wk-ovt" aria-hidden="true">'+tg.map(function(t){return '<span>'+esc(t)+'</span>'}).join('')+'</p>':'')+'<span class="wk-ovgo" aria-hidden="true">'+(d.parts?'อ่าน case study':'ดูงานนี้')+'<span class="ms">arrow_forward</span></span></div>'}
function skel(){var g='',l='';for(var i=0;i<6;i++)g+='<div class="wk-it wk-sk" aria-hidden="true"><div class="wk-img"></div><span class="skb" style="width:'+[72,58,80,64,70,52][i]+'%"></span><span class="skb sm" style="width:'+[40,48,36,44,38,46][i]+'%"></span></div>';
 for(var j=0;j<5;j++)l+='<li class="wk-li wk-sk" aria-hidden="true"><span class="th"></span><div><span class="skb" style="width:'+[46,38,52,42,48][j]+'%"></span><span class="skb sm" style="width:22%"></span><span class="skt"><i></i><i></i></span></div><span class="skb sm" style="width:36px"></span></li>';return [g,l]}
function render(){
 var busy=phase!=='ready';root.setAttribute('aria-busy',busy);
 if(busy){var k=skel();$('wkGrid').innerHTML=phase==='skel'?k[0]:'';$('wkList').innerHTML=phase==='skel'?k[1]:'';$('wkGrid').hidden=st.view!=='grid';$('wkList').hidden=st.view!=='list';$('wkEmpty').hidden=true;$('wkMore').hidden=true;$('wkN').textContent='กำลังโหลด…';$('wkJump').hidden=true;
  var vw=$('wkView');vw.dataset.v=st.view;vw.querySelectorAll('[role=radio]').forEach(function(b){b.setAttribute('aria-checked',b.dataset.v===st.view);b.tabIndex=b.dataset.v===st.view?0:-1});return}
 var r=D.filter(function(d){return match(d)});
 var CO={};D.forEach(function(d){if(!(d.c in CO))CO[d.c]=Object.keys(CO).length});
 r.sort(st.sort==='custom'?function(a,b){return (b.pin?1:0)-(a.pin?1:0)||a.i-b.i}:st.sort==='type'?function(a,b){return CO[a.c]-CO[b.c]||(b.pin?1:0)-(a.pin?1:0)||a.i-b.i}:st.sort==='az'?function(a,b){return a.t.localeCompare(b.t,'th')}:st.sort==='old'?function(a,b){return a.y-b.y||b.i-a.i}:function(a,b){return (b.pin?1:0)-(a.pin?1:0)||b.y-a.y||a.i-b.i});
 var total=r.length,compact=MODE==='home'&&D.length>CAP;root.classList.toggle('wk-compact',compact);if(compact&&st.view!=='grid')st.view='grid';
 var lim=compact?TEASE:MODE==='home'?(open?total:COLL):shown;r=r.slice(0,lim);
 $('wkN').textContent=(compact?D.length:total)+' ชิ้น';
 $('wkJump').hidden=!(MODE==='home'&&!compact&&open&&total>COLL);
 var mo=$('wkMore'),h='';
 if(compact)h='<a class="btn btn-outline" href="'+ROUTES.work+'">ดูผลงานทั้งหมด '+D.length+' ชิ้น<span class="ms" aria-hidden="true">arrow_forward</span></a>';
 else if(MODE==='home'&&total>COLL)h='<button type="button" class="btn btn-outline" id="wkTog" aria-expanded="'+open+'" aria-controls="wkGrid wkList">'+(open?'ย่อ<span class="ms" aria-hidden="true">expand_less</span>':'ดูทั้งหมด '+total+' ชิ้น<span class="ms" aria-hidden="true">expand_more</span>')+'</button>';
 else if(MODE==='all'&&total>shown)h='<button type="button" class="btn btn-outline" id="wkMoreB">แสดงเพิ่ม ('+Math.min(PAGE,total-shown)+')</button><span>แสดง '+r.length+' จาก '+total+'</span>';
 mo.innerHTML=h;mo.hidden=!h;
 $('wkGrid').innerHTML=r.map(function(d){return '<article class="wk-it'+(reveal?' wk-in':'')+'"><div class="wk-img"'+(d.cover?' data-cover style="background-image:url(\''+d.cover+'\')"':'')+'>'+(d.cover?'':d.ph)+(d.pin&&st.sort!=='old'&&st.sort!=='az'?'<span class="wk-pin" title="ปักหมุด"><span class="ms" aria-hidden="true">keep</span><span class="vh">ปักหมุด</span></span>':'')+ov(d)+'</div><h3><a href="'+href(d)+'"'+(d.ds?' aria-describedby="wkD'+d.i+'"':'')+'>'+tt(d)+'</a></h3><p class="wk-meta">'+meta(d)+'</p>'+(d.ds?'<p class="wk-gds"><span'+(d.own?pp(d,'sum'):'')+'>'+esc(d.ds)+'</span></p>':'')+'</article>'}).join('');
 $('wkList').innerHTML=r.map(function(d){return '<li class="wk-li'+(reveal?' wk-in':'')+'"><span class="th" aria-hidden="true"'+(d.cover?' data-cover style="background-image:url(\''+d.cover+'\')"':'')+'></span><div><h3>'+(d.pin&&st.sort!=='old'&&st.sort!=='az'?'<span class="wk-pinl ms" aria-hidden="true" title="ปักหมุด">keep</span>':'')+'<a href="'+href(d)+'">'+tt(d)+(d.pin&&st.sort!=='old'&&st.sort!=='az'?'<span class="vh"> (ปักหมุด)</span>':'')+'</a></h3><p class="ty"><span'+kk(d,'wcat')+'>'+(d.c?esc(d.c):(kk(d,'wcat')?'<i class="tbd-tag">หมวด</i>':''))+'</span></p>'+(d.ds?'<p class="wk-ds">'+(d.own&&pp(d,'sum')?'<span'+pp(d,'sum')+'>'+esc(d.ds)+'</span>':hl(d.ds))+'</p>':'')+'<div class="wk-tags" id="wkTags'+d.i+'">'+(exp[d.i]?d.tags:d.tags.slice(0,3)).map(function(t){return '<button type="button" class="wk-tg" data-t="'+esc(t)+'" aria-label="กรองด้วย '+esc(t)+'">'+esc(t)+'</button>'}).join('')+(d.tags.length>3&&!exp[d.i]?'<button type="button" class="wk-tg more" data-x="'+d.i+'" data-tip="'+esc(d.tags.slice(3).join(' · '))+'" aria-expanded="false" aria-controls="wkTags'+d.i+'" aria-label="แสดงแท็กอีก '+(d.tags.length-3)+' อัน: '+esc(d.tags.slice(3).join(', '))+'">+'+(d.tags.length-3)+'</button>':'')+'</div></div><span class="yr'+(d.st?' wk-prog':'')+'"><span'+kk(d,'wyear')+'>'+(d.st||d.y)+'</span></span></li>'}).join('');
 var none=!total;$('wkEmpty').hidden=!none;$('wkGrid').hidden=none||st.view!=='grid';$('wkList').hidden=none||st.view!=='list';
 if(none){if(MODE==='all')$('wkEt').textContent=st.q.trim()?'ไม่พบ “'+st.q.trim()+'”':'ไม่มีผลงานตรงกับตัวกรอง';else{var zero=!D.length;$('wkEt').textContent=zero?'ยังไม่มีผลงาน':st.q.trim()?'ไม่พบ “'+st.q.trim()+'”':'ไม่มีผลงานตรงกับตัวกรอง';var wed=document.querySelector('#wkEmpty .wk-ed');if(wed)wed.textContent=zero?'เพิ่มผลงานชิ้นแรกในหลังบ้าน':'ลองคำอื่น หรือล้างตัวกรอง';$('wkReset').hidden=zero}}
 $('wkClr').hidden=!$('wkQ').value;
 $('wkSortL').textContent=SORTS.filter(function(x){return x[0]===st.sort})[0][1];
 $('wkSortM').innerHTML=SORTS.map(function(x){return '<button type="button" class="wk-mi" role="menuitemradio" aria-checked="'+(x[0]===st.sort)+'" data-s="'+x[0]+'" tabindex="-1">'+x[1]+(x[0]===st.sort?'<span class="ms" aria-hidden="true">check</span>':'')+'</button>'}).join('');
 var vw=$('wkView');vw.dataset.v=st.view;vw.querySelectorAll('[role=radio]').forEach(function(b){b.setAttribute('aria-checked',b.dataset.v===st.view);b.tabIndex=b.dataset.v===st.view?0:-1});
 renderFilters(total);reveal=false;wire()}
function wire(){
 root.querySelectorAll('.wk-tg.more[data-x]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var i=b.dataset.x;exp[i]=1;render();var t=$('wkTags'+i);t&&t.querySelectorAll('.wk-tg')[3]&&t.querySelectorAll('.wk-tg')[3].focus()}});
 root.querySelectorAll('.wk-tg[data-t]').forEach(function(b){b.onclick=function(e){e.stopPropagation();if(st.tags.indexOf(b.dataset.t)<0)st.tags.push(b.dataset.t);shown=PAGE;render();var x=$('wkActive').querySelector('[data-rm]');x&&x.focus()}});
 var m=$('wkSortM');m.querySelectorAll('.wk-mi').forEach(function(it){it.onclick=function(){st.sort=it.dataset.s;shown=PAGE;closeM();render();$('wkSortB').focus()};
  it.onkeydown=function(e){var l=[].slice.call(m.querySelectorAll('.wk-mi')),i=l.indexOf(it);if(e.key==='ArrowDown'){e.preventDefault();l[(i+1)%l.length].focus()}else if(e.key==='ArrowUp'){e.preventDefault();l[(i-1+l.length)%l.length].focus()}else if(e.key==='Escape'){e.preventDefault();closeM();$('wkSortB').focus()}else if(e.key==='Tab')closeM()}})}
function closeM(){$('wkSortM').classList.remove('open');$('wkSortB').setAttribute('aria-expanded','false');var m=$('wkMoreM');if(m){m.classList.remove('open');$('wkMoreC').setAttribute('aria-expanded','false')}}
$('wkSortB').onclick=function(e){e.stopPropagation();closeF(false);var m=$('wkSortM');if(m.classList.contains('open')){closeM();return}m.classList.add('open');this.setAttribute('aria-expanded','true');(m.querySelector('[aria-checked=true]')||m.querySelector('.wk-mi')).focus()};
$('wkSortM').onclick=function(e){e.stopPropagation()};document.addEventListener('click',closeM);
$('wkQ').addEventListener('input',function(){st.q=cleanQ(this.value);shown=PAGE;render()});
$('wkQ').addEventListener('keydown',function(e){if(e.key==='Escape'&&this.value){e.preventDefault();this.value='';st.q='';render()}});
$('wkClr').onclick=function(){$('wkQ').value='';st.q='';render();$('wkQ').focus()};
$('wkReset').onclick=function(){$('wkQ').value='';st={cat:'',q:'',tags:[],status:'',sort:st.sort,view:st.view};render();$('wkQ').focus()};
function setView(v){st.view=v;try{localStorage.setItem('wk-view',v)}catch(e){}render();$('wkView').querySelector('[data-v="'+v+'"]').focus()}
$('wkView').querySelectorAll('[role=radio]').forEach(function(b){b.onclick=function(){setView(b.dataset.v)};b.onkeydown=function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'||e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();setView(st.view==='grid'?'list':'grid')}}});
$('wkMore').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var box=function(){return st.view==='grid'?$('wkGrid'):$('wkList')};
 if(b.id==='wkMoreB'){var from=shown;shown+=PAGE;render();var l=box().querySelectorAll('h3 a');l[from]&&l[from].focus()}
 if(b.id==='wkTog'){var was=open;open=!open;render();if(was){var top=root.getBoundingClientRect().top;if(top<0)root.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}else{var l=box().querySelectorAll('h3 a');l[COLL]&&l[COLL].focus({preventScroll:true})}var t=$('wkTog');if(t&&was)t.focus({preventScroll:true})}});
root.querySelectorAll('.wk-demo [data-d]').forEach(function(b){b.onclick=function(){root.querySelectorAll('.wk-demo [data-d]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});$('wkQ').value='';st.q='';setData(b.dataset.d);render()}});
if(MODE==='all'){if(/[?&]demo=40/.test(location.search))setData('40');var U=new URLSearchParams(location.search);if(U.get('cat'))st.cat=U.get('cat');if(U.get('tag'))st.tags=[U.get('tag')]}
var reveal=false;
function load(ms){ltm.forEach(clearTimeout);ltm=[];phase='pending';skAt=0;render();var css=getComputedStyle(document.documentElement),DL=parseInt(css.getPropertyValue('--skel-delay'))||300,MN=parseInt(css.getPropertyValue('--skel-min-show'))||400;
 ltm.push(setTimeout(function(){phase='skel';skAt=Date.now();render()},DL));
 ltm.push(setTimeout(function(){ltm.forEach(clearTimeout);var w=skAt?Math.max(0,MN-(Date.now()-skAt)):0;ltm=[setTimeout(function(){phase='ready';reveal=!!skAt;render()},w)]},ms))}
root.querySelectorAll('[data-load]').forEach(function(b){b.onclick=function(){load(+b.dataset.load)}});
render();
}
