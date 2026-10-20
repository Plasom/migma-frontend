// @ts-nocheck -- หน้าบัญชี (เข้าสู่ระบบ · ภาพรวม · เครดิต · แพ็กเกจ · สถิติ · ตั้งค่า) ย้ายมาจากสคริปต์ใน account.html ของต้นแบบแบบ 1:1
//   เข้าสู่ระบบด้วย Google ผ่านหลังบ้าน (migma-backend) · ผู้ใช้ อีเมล ชื่อ และลิงก์เว็บมาจาก GET /api/v1/me
//   เครดิต แพ็กเกจ ราคา และใบเสร็จมาจากหลังบ้าน (GET /api/v1/pricing · /me/credits) · จ่ายเงินผ่าน Stripe Checkout
//   `pf-acct-demo` ใน localStorage เป็นแค่ cache ให้ editor อ่านยอดเครดิต (ตัวจริงอยู่ที่หลังบ้านเสมอ)
//   ฝังในหลังบ้าน (?embed=1) = คุยกับหลังบ้านผ่าน postMessage (pf:acct*)
/* eslint-disable */
import { updateSlug, type Me } from '@/lib/api';
import { applyCredits, baht, confirmCheckout, fetchCredits, fetchPricing, startCheckout } from '@/lib/billing';
import { uiLang } from '@/lib/i18n/ui';
import { publicBase } from '@/lib/routes';
import { portfolioStore } from '@/lib/storage/portfolio-store';

type Auth = {
  /** null = ยังไม่เข้าสู่ระบบ */
  user: Me | null;
  /** ไปหน้าเลือกบัญชีของ Google แล้วกลับมาที่ callbackUrl */
  signIn: (callbackUrl: string) => void;
  signOut: () => Promise<unknown>;
};

export function mountAccount(AUTH: Auth): void {

'use strict';
var $=function(id){return document.getElementById(id)},esc=function(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var LS={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
/* ---------- ราคา AI แต่ละจุดและแพ็กเครดิต: แอดมินตั้งที่ /admin · โหลดจากหลังบ้านตอนเปิดหน้า ---------- */
var COST=[],PACKS=[],PAYON=true,LOADED=0;
var MON=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
var fd=function(s,time){var d=new Date(s);return d.getDate()+' '+MON[d.getMonth()]+' '+d.getFullYear()+(time?' · '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2):'')};
/* ---------- บัญชี: ตัวตนมาจากหลังบ้าน · เครดิต/แพ็กเกจ/ใบเสร็จเป็นแบบจำลองในเครื่อง ---------- */
function seed(){
  return{v:1,signed:false,email:'',name:'',slug:'',siteUrl:'',plan:'free',passEnd:'',coins:20,base:20,ask:true,low:20,lowAt:'09:00',mail:{low:true,exp:true,news:false},
   log:[],mu:{},tops:[{t:new Date().toISOString().slice(0,16),d:'เครดิตต้อนรับ',coin:20,thb:0}],bills:[]}}
var A;try{A=JSON.parse(LS.get('pf-acct-demo')||'null')}catch(e){}if(!A||A.v!==1)A=seed();if(!A.base)A.base=Math.max(A.coins,1);if(!A.lowAt)A.lowAt='09:00';if(!A.mu)A.mu={};
var EMB=/(^| )emb( |$)/.test(document.documentElement.className),up=function(m){if(EMB)try{parent.postMessage(m,'*')}catch(e){}};
function save(){LS.set('pf-acct-demo',JSON.stringify(A));up({type:'pf:acct',coins:A.coins,signed:A.signed,data:JSON.stringify(A)})}
/* session ที่หลังบ้านเป็นตัวตัดสิน · บัญชีใหม่ใช้ชื่อจาก Google · คนละบัญชีกับที่จำไว้ = เริ่มแบบจำลองเครดิตใหม่ */
var U=AUTH.user;if(U){if(A.email!==U.email){A=seed();A.email=U.email;A.name=U.name||''}if(!A.name)A.name=U.name||'';A.slug=U.slug;A.siteUrl=location.origin+publicBase(U.slug);A.signed=true;if(U.plan)A.plan=U.plan;if(U.planExpiresAt)A.passEnd=U.planExpiresAt}else A.signed=false;LS.set('pf-acct-demo',JSON.stringify(A));
var siteHost=function(){return String(A.siteUrl||'').replace(/^https?:\/\//,'')};
var costOf=function(k){return COST.filter(function(x){return x.k===k})[0]};
var tT=0;function toast(t,act){var el=$('edToast');el.innerHTML='<span>'+esc(t)+'</span>'+(act?'<button type="button" class="act">'+esc(act.label)+'</button>':'');el.classList.add('on');if(act)el.querySelector('.act').onclick=function(){el.classList.remove('on');act.fn()};clearTimeout(tT);tT=setTimeout(function(){el.classList.remove('on')},act?6000:4000)}
function modal(html){var d=document.createElement('div');d.className='dlg';d.innerHTML='<div class="dg md" role="dialog" aria-modal="true" aria-labelledby="dgT">'+html+'</div>';var back=document.activeElement;document.body.appendChild(d);
  var close=function(){d.remove();document.removeEventListener('keydown',key,true);back&&back.focus&&back.focus()},key=function(e){if(e.key==='Escape'){e.stopPropagation();close()}if(e.key==='Tab'){var f=d.querySelectorAll('button,input,select,textarea,a[href]'),a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}};
  document.addEventListener('keydown',key,true);d.addEventListener('mousedown',function(e){if(e.target===d)close()});return{box:d,close:close}}
var fld=function(id,label,val,o){o=o||{};var v=val==null?'':String(val);return '<div class="fld"><span class="lb"><label for="'+id+'">'+esc(label)+'</label>'+(o.opt?'<span class="opt">ไม่บังคับ</span>':'')+(o.max&&!o.dis?'<span class="cnt cnt-end" data-cnt="'+o.max+'">'+v.length+' / '+o.max+'</span>':'')+'</span><span class="inw'+(v&&!o.dis?' has':'')+(o.sfx?' sfx':'')+(o.cbx?' cbx':'')+'">'+(o.sfx?'<span class="sfx-in">':'')+'<input class="in" id="'+id+'" type="'+(o.type||'text')+'"'+(o.set?' data-set="'+o.set+'"':'')+' value="'+esc(v)+'"'+(o.max?' maxlength="'+o.max+'"':'')+(o.ph?' placeholder="'+esc(o.ph)+'"':'')+(o.dis?' disabled':'')+(o.attr||'')+' autocomplete="'+(o.ac||'off')+'">'+(o.cbx?'<button type="button" class="cbx-b" data-cbx tabindex="-1" aria-label="เลือก'+esc(label)+'จากรายการ"'+(o.dis?' disabled':'')+'><span class="ms" aria-hidden="true">expand_more</span></button>':'')+(o.dis?'':'<button type="button" class="clr" data-clr tabindex="-1" aria-label="ล้าง'+esc(label)+'"><span class="ms" aria-hidden="true">close</span></button>')+(o.sfx?'</span><span class="sx">'+esc(o.sfx)+'</span>':'')+'</span>'+(o.hint?'<span class="hint">'+o.hint+'</span>':'')+'</div>'};
var seg=function(attr,cur,opts,labId){return '<div class="seg" role="radiogroup" aria-labelledby="'+labId+'">'+opts.map(function(o){return '<button type="button" role="radio" data-'+attr+'="'+o[0]+'" aria-checked="'+(String(cur)===String(o[0]))+'">'+(o[2]?'<span class="ms" aria-hidden="true">'+o[2]+'</span>':'')+esc(o[1])+'</button>'}).join('')+'</div>'};
var initial=function(n){n=String(n||'').replace(/^(นาย|นางสาว|นาง|Mr\.?|Ms\.?|Mrs\.?)\s*/i,'').trim();if(!n)return '<span class="ms" aria-hidden="true">person</span>';if(/[\u0E00-\u0E7F]/.test(n.charAt(0)))return esc(n.replace(/^[เแโใไ]/,'').charAt(0)||n.charAt(0));var w=n.split(/\s+/);return esc((w[0].charAt(0)+(w[1]?w[1].charAt(0):'')).toUpperCase())};
var sw=function(label,key,on,sub){return '<label class="swr"><span class="lab">'+esc(label)+(sub?'<small>'+esc(sub)+'</small>':'')+'</span><input type="checkbox" role="switch" data-sw="'+key+'"'+(on?' checked':'')+'><span class="trk" aria-hidden="true"><i></i></span></label>'};
var daysLeft=function(){return Math.max(0,Math.ceil((new Date(A.passEnd)-new Date())/864e5))};
var monthUse=function(){var o={},tot=0;Object.keys(A.mu||{}).forEach(function(k){var v=Math.max(0,A.mu[k]||0);o[k]=v;tot+=v});return{by:o,tot:tot}};
var money=function(thb){return baht(Math.round(thb*100))};
var SUP='support@migma.site',help=function(what){return '<section class="sec"><div class="sec-h"><h2>ติดต่อทีมงาน</h2></div><p class="sec-d">'+what+' เขียนมาที่อีเมลนี้ได้เลย แนบเลขที่ใบเสร็จมาด้วยจะตรวจให้ได้เร็วขึ้น</p><div class="lg-acts" style="margin-top:0"><a class="btn outlined" href="mailto:'+SUP+'"><span class="ms" aria-hidden="true">mail</span>'+SUP+'</a><button type="button" class="btn ghost" data-copy="'+SUP+'"><span class="ms" aria-hidden="true">content_copy</span>คัดลอกอีเมล</button></div></section>'};
var PLAN={free:'Free',pass:'Job Hunt Pass',pro:'Pro รายปี'};
var crPct=function(){var b=Math.max(A.base||A.coins,1);return Math.min(100,Math.max(0,Math.round((b-A.coins)/b*100)))},crLv=function(){var p=crPct();return A.coins<=0?'out':p>=90?'crit':p>=75?'warn':''};
function meter(big){var p=crPct(),lv=crLv(),b=Math.max(A.base||A.coins,1),W={warn:['warning','ใช้ไปเกิน 75% แล้ว เติมไว้ก่อนได้ เครดิตไม่มีวันหมดอายุ'],crit:['warning','เหลือไม่ถึง 10% ใช้ AI ได้อีกไม่กี่ครั้ง'],out:['error','เครดิตหมดแล้ว ปุ่ม AI ใช้ไม่ได้จนกว่าจะเติม ส่วนอื่นของเว็บใช้ได้ปกติ']}[lv];
  return '<div class="mt'+(big?' big':'')+'"><p class="mt-n"><span class="ms" aria-hidden="true">toll</span><b id="balN">'+A.coins+'</b><span>เครดิตคงเหลือ</span></p><div class="cr-bar"'+(lv?' data-lv="'+lv+'"':'')+' role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+p+'" aria-label="ใช้ไปแล้ว '+p+' เปอร์เซ็นต์"><i style="width:'+p+'%"></i></div><p class="cr-s"><span>ใช้ไป '+(b-A.coins)+' จาก '+b+' เครดิต</span><span>'+p+'%</span></p>'+(W?'<p class="cr-w" data-lv="'+lv+'"><span class="ms" aria-hidden="true">'+W[0]+'</span><span>'+W[1]+'</span></p>':'')+'</div>'}
var logRows=function(a){return a.length?'<div class="tb-w"><table class="tb2"><thead><tr><th scope="col">ใช้ทำอะไร</th><th scope="col">เมื่อ</th><th scope="col" class="num">เครดิต</th></tr></thead><tbody>'+a.map(function(l){var c=costOf(l.k)||{n:l.k};return '<tr><td class="main">'+(l.refund?'คืนเครดิต · ':'')+esc(c.n)+'<small>'+esc(l.d)+'</small></td><td class="sub">'+fd(l.t,1)+'</td><td class="num">'+(l.c<0?'−':'+')+Math.abs(l.c)+'</td></tr>'}).join('')+'</tbody></table></div>':'<div class="es sm"><p class="es-t">ยังไม่ได้ใช้ AI</p><p class="es-d">กดปุ่ม AI ในตัวแก้ Portfolio แล้วรายการจะขึ้นที่นี่</p></div>'};
/* ---------- หน้าต่างๆ ---------- */
var V={
overview:function(){var mu=monthUse();return '<h1 class="ac-h" tabindex="-1">ภาพรวม</h1><p class="ac-sub">'+(A.name?esc(A.name)+' · ':'')+esc(A.email||'')+'</p>'+
 '<dl><div class="row"><dt>เว็บของคุณ</dt><dd><b>'+esc(siteHost())+'</b><span>ลิงก์นี้ใช้ได้หลังกดเผยแพร่ในตัวแก้ Portfolio</span></dd><div class="act"><a class="btn outlined sm" href="'+esc(A.siteUrl||'/site')+'" target="_blank" rel="noopener">เปิดเว็บ</a><a class="btn filled sm" href="/editor">แก้ Portfolio</a></div></div>'+
 '<div class="row"><dt>แพ็กเกจ</dt><dd><b>'+PLAN[A.plan]+'</b><span>'+(A.plan==='pass'?'ใช้ได้ถึง '+fd(A.passEnd)+' เหลือ '+daysLeft()+' วัน หมดแล้วเว็บยังอยู่ กลับเป็นแพ็ก Free':A.plan==='free'?'เว็บออนไลน์ตลอด มีป้าย Made with Migma':'ต่ออายุปีละครั้ง')+'</span></dd><div class="act"><a class="btn outlined sm" href="#plan">ดูแพ็กเกจ</a></div></div>'+
 '<div class="row"><dt>เครดิต AI</dt><dd><b>'+A.coins+' เครดิต</b><span>ใช้ไปแล้ว '+crPct()+'% ของที่เติมล่าสุด เดือนนี้ใช้ '+mu.tot+' เครดิต</span></dd><div class="act"><a class="btn '+(crLv()?'filled':'outlined')+' sm" href="#credits">เติมเครดิต</a></div></div></dl>'+
 '<section class="sec" style="margin-top:var(--space-6)"><div class="sec-h"><h2>ใช้ AI ล่าสุด</h2><a class="btn text sm" href="#usage">ดูทั้งหมด</a></div>'+logRows(A.log.slice(0,3))+'</section>'},
stats:function(){return '<h1 class="ac-h" tabindex="-1">สถิติ</h1><p class="ac-sub">ดูว่ามีคนเปิด portfolio ไหม มาจากไหน และดูงานชิ้นไหน</p>'+
 '<div class="es"><p class="es-t">ยังไม่มีข้อมูลสถิติ</p><p class="es-d">ระบบนับคนเข้าดูยังไม่เปิดใช้ เปิดเมื่อไรตัวเลขจะขึ้นที่นี่</p></div>'},
credits:function(){return '<h1 class="ac-h" tabindex="-1">เครดิต AI</h1><p class="ac-sub">ใช้เฉพาะตอนกดให้ AI ช่วย ฟีเจอร์อื่นของเว็บไม่ใช้เครดิต</p>'+
 meter(1)+'<p class="hint">แท่งนี้นับจากการเติมครั้งล่าสุด เครดิตไม่มีวันหมดอายุ</p>'+
 '<section class="sec" style="margin-top:var(--space-6)"><div class="sec-h"><h2>เติมเครดิต</h2></div><p class="sec-d">จ่ายครั้งเดียว ไม่ตัดเงินอัตโนมัติ</p>'+
 (PACKS.length?'<ul class="pk-l" role="radiogroup" aria-label="เลือกแพ็กเครดิต">'+PACKS.map(function(p,i){return '<li><label><input type="radio" name="pk" value="'+esc(p.k)+'"'+(i===Math.min(1,PACKS.length-1)?' checked':'')+'><span class="n"><b>'+p.coin+' เครดิต</b><span>เครดิตละ '+(p.thb/p.coin).toFixed(2)+' บาท</span></span><span class="p">฿'+money(p.thb)+'</span></label></li>'}).join('')+'</ul>'+
 '<button type="button" class="btn filled" id="buy"'+(PAYON?'':' disabled')+'>จ่ายเงิน</button><p class="hint">'+(PAYON?'กดแล้วไปหน้าจ่ายเงินของ Stripe จ่ายด้วยบัตรหรือ PromptPay ได้ จ่ายเสร็จกลับมาหน้านี้ เครดิตเข้าทันที':'ระบบจ่ายเงินยังไม่เปิด ลองใหม่ภายหลัง')+'</p>':'<p class="empty">'+(LOADED>0?'ตอนนี้ยังไม่มีแพ็กเครดิตที่เปิดขาย':LOADED<0?'โหลดแพ็กเครดิตไม่ได้ ลองรีเฟรชหน้านี้':'กำลังโหลดแพ็กเครดิต…')+'</p>')+'</section>'+
 '<section class="sec"><div class="sec-h"><h2>เครดิตที่ได้รับ</h2><a class="btn text sm" href="#plan">ดูใบเสร็จทั้งหมด</a></div>'+
 '<div class="tb-w"><table class="tb2"><thead><tr><th scope="col">รายการ</th><th scope="col">เมื่อ</th><th scope="col">จ่ายผ่าน</th><th scope="col" class="num">เครดิต</th><th scope="col" class="num">จ่าย</th><th scope="col" class="num"><span class="vh">ใบเสร็จ</span></th></tr></thead><tbody>'+A.tops.map(function(t){var paid=t.thb>0,no=t.no||'';return '<tr><td class="main">'+esc(t.d)+(paid&&no?'<small>เลขที่ '+esc(no)+'</small>':'')+'</td><td class="sub">'+fd(t.t)+'</td><td class="sub hide-m">'+(paid?esc(t.m||'Stripe'):'ไม่มีการจ่าย')+'</td><td class="num">+'+t.coin+'</td><td class="num">'+(paid?'฿'+money(t.thb):'ฟรี')+'</td><td class="num hide-m">'+(paid&&no?'<button type="button" class="btn text sm" data-rc="'+esc(no)+'" aria-label="เปิดใบเสร็จเลขที่ '+esc(no)+'">เปิดใบเสร็จ</button>':'')+'</td></tr>'}).join('')+'</tbody></table></div></section>'},
usage:function(){var mu=monthUse(),mx=Math.max.apply(null,COST.map(function(c){return mu.by[c.k]||0}).concat([1]));return '<h1 class="ac-h" tabindex="-1">การใช้ AI</h1><p class="ac-sub">ดูว่าใช้เครดิตไปเท่าไร และใช้กับงานไหนบ้าง</p>'+meter()+
 '<p style="margin:var(--space-3) 0 var(--space-8)"><a class="btn outlined sm" href="#credits">เติมเครดิต</a></p>'+
 '<section class="sec" style="border-top:0;padding-top:0"><div class="sec-h"><h2>เดือนนี้ใช้ไป '+mu.tot+' เครดิต</h2></div><p class="sec-d">เครดิตเป็นกองเดียว ใช้ร่วมกันทุกงานของ AI งานยาวใช้มากกว่างานสั้น</p>'+(mu.tot?'<ul class="use">'+COST.map(function(c){var v=mu.by[c.k]||0;return '<li><span>'+esc(c.n)+'</span><span class="v">'+v+'</span><span class="bar" aria-hidden="true"><i style="width:'+Math.round(v/mx*100)+'%"></i></span></li>'}).join('')+'</ul>':'<p class="empty">เดือนนี้ยังไม่ได้ใช้ AI</p>')+'</section>'+
 '<section class="sec"><div class="sec-h"><h2>ประวัติการใช้</h2></div>'+logRows(A.log)+'</section>'},
plan:function(){var P=[['free','Free','฿0','',['ที่อยู่ ชื่อ.migma.site','ผลงาน 3 ชิ้น','มีป้าย Made with Migma','20 เครดิต AI ครั้งเดียว']],['pass','Job Hunt Pass','฿390','3 เดือน',['ใช้โดเมนของตัวเอง ไม่มีป้าย','ผลงานไม่จำกัด','ตั้งรหัสผ่าน Case study','สถิติคนเปิดดู และ export CV','100 เครดิต AI']],['pro','Pro รายปี','฿1,290','ต่อปี',['ทุกอย่างใน Pass ตลอดปี','50 เครดิต AI ทุกเดือน สะสมได้']]];
 return '<h1 class="ac-h" tabindex="-1">แพ็กเกจและใบเสร็จ</h1><p class="ac-sub">ไม่มีการตัดเงินอัตโนมัติ แพ็กหมดอายุแล้วเว็บยังออนไลน์อยู่ในแพ็ก Free</p>'+
 '<p class="note"><span class="ms" aria-hidden="true">info</span><span>แพ็กเกจรายเดือน/รายปียังไม่เปิดขาย ตอนนี้ซื้อได้เฉพาะเครดิต AI ที่แท็บ “เครดิต AI”</span></p>'+
 '<div class="pl">'+P.map(function(p){var cur=A.plan===p[0];return '<div'+(cur?' class="cur"':'')+'><h3>'+p[1]+(cur?'<span class="cur-t">แพ็กตอนนี้</span>':'')+'</h3><p class="pr">'+p[2]+(p[3]?' <small>'+p[3]+'</small>':'')+'</p><ul>'+p[4].map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>'+(cur?(p[0]==='pass'?'<button type="button" class="btn outlined sm" data-plan="pass" disabled>ต่ออีก 3 เดือน</button>':''):p[0]==='free'?'':'<button type="button" class="btn outlined sm" data-plan="'+p[0]+'" disabled>เร็วๆ นี้</button>')+'</div>'}).join('')+'</div>'+
 '<section class="sec" style="margin-top:var(--space-8)"><div class="sec-h"><h2>ใบเสร็จ</h2></div>'+(A.bills.length?'<div class="tb-w"><table class="tb2"><thead><tr><th scope="col">รายการ</th><th scope="col">วันที่</th><th scope="col">จ่ายผ่าน</th><th scope="col" class="num">ยอด</th><th scope="col" class="num"><span class="vh">ใบเสร็จ</span></th></tr></thead><tbody>'+A.bills.map(function(b){return '<tr><td class="main">'+esc(b.d)+'<small>เลขที่ '+esc(b.no)+'</small></td><td class="sub">'+fd(b.t)+'</td><td class="sub hide-m">'+esc(b.m)+'</td><td class="num">฿'+money(b.thb)+'</td><td class="num hide-m"><button type="button" class="btn text sm" data-rc="'+esc(b.no)+'" aria-label="เปิดใบเสร็จเลขที่ '+esc(b.no)+'">เปิดใบเสร็จ</button></td></tr>'}).join('')+'</tbody></table></div>':'<p class="empty">ยังไม่มีใบเสร็จ</p>')+'<p class="hint">ใบเสร็จส่งไปที่ '+esc(A.email)+' ทุกครั้งที่จ่าย</p></section>'+help('จ่ายเงินแล้วเครดิตหรือแพ็กไม่เข้า ขอใบกำกับภาษี หรือขอเงินคืน')},
settings:function(){return '<h1 class="ac-h" tabindex="-1">ตั้งค่า</h1><p class="ac-sub">บัญชี ที่อยู่เว็บ การแจ้งเตือน และข้อมูลของคุณ</p>'+
 '<section class="sec" style="border-top:0;padding-top:0"><div class="sec-h"><h2>บัญชี</h2></div>'+
 '<div class="av-row"><span class="avt" style="--s:var(--avatar-56);--fs:20px" aria-hidden="true">'+initial(A.name)+'</span><div><b>'+esc(A.name||'ยังไม่ได้ตั้งชื่อ')+'</b><span>ใช้ตัวอักษรแรกของชื่อแทนรูป</span></div></div>'+
 fld('stN','ชื่อ',A.name,{max:60,set:'name',ac:'name',hint:'ชื่อนี้ใช้ในหลังบ้านและใบเสร็จ ชื่อบนหน้าเว็บแก้ที่แท็บโปรไฟล์'})+
 fld('stE','บัญชี Google ที่ใช้เข้าสู่ระบบ',A.email,{type:'email',dis:1,hint:'ใช้บัญชี Google อื่นได้ <button type="button" class="btn text sm" id="acSwitch">เปลี่ยนบัญชี Google</button>'})+'</section>'+
 '<section class="sec"><div class="sec-h"><h2>การแสดงผล</h2></div><div class="lg-row"><span class="lab" id="thL">โหมดสีของหลังบ้าน</span>'+seg('thm',document.documentElement.getAttribute('data-theme'),[['light','สว่าง','light_mode'],['dark','มืด','dark_mode']],'thL')+'</div><div class="lg-row" style="margin-top:var(--space-3)"><span class="lab" id="fsL">ขนาดตัวหนังสือในหลังบ้าน</span>'+seg('fs',LS.get('pf-fs')==='lg'?'lg':'md',[['md','ปกติ'],['lg','ใหญ่']],'fsL')+'</div><div class="lg-row" style="margin-top:var(--space-3)"><span class="lab" id="uiL">ภาษาของหลังบ้าน</span>'+seg('uil',uiLang(),[['en','English'],['th','ไทย']],'uiL')+'</div></section>'+
 '<section class="sec"><div class="sec-h"><h2>ที่อยู่เว็บ</h2></div>'+
 ((A.plan==='pass'||A.plan==='pro')?(
   '<p class="sec-d">คุณใช้งานแพ็กเกจ <b>'+PLAN[A.plan]+'</b> สามารถตั้งชื่อที่อยู่เว็บของตัวเองได้</p>'+
   '<div class="fld" id="stSlugFld">'+
     '<span class="lb"><label for="stSlugIn">ชื่อที่อยู่เว็บ (URL Slug)</label><span class="cnt cnt-end" id="stSlugCnt">'+(A.slug||'').length+' / 30</span></span>'+
     '<div style="display:flex;gap:var(--space-2);align-items:center;margin-top:var(--space-1)">'+
       '<span style="font:var(--body-md);color:var(--text-2);user-select:none;white-space:nowrap">'+location.origin+'/u/</span>'+
       '<span class="inw" style="flex:1"><input class="in" id="stSlugIn" type="text" value="'+esc(A.slug||'')+'" maxlength="30" placeholder="เช่น your-name" autocomplete="off"></span>'+
       '<button type="button" class="btn filled" id="stSlugSave">บันทึกที่อยู่</button>'+
     '</div>'+
     '<span class="hint" id="stSlugHint">ใช้ตัวอักษรพิมพ์เล็ก ตัวเลข และขีดกลาง 3–30 ตัวอักษร</span>'+
   '</div>'
 ):(
   fld('stS','ที่อยู่ที่ได้มากับบัญชี',siteHost(),{dis:1,hint:'ตั้งจากอีเมลตอนสมัคร · <a class="btn text sm btn-inline" href="#plan">อัปเกรดเป็น Job Hunt Pass หรือ Pro เพื่อตั้งที่อยู่เว็บเองได้</a>'})
 ))+
 '</section>'+
 ''+
'</section>'+
 '<section class="sec"><div class="sec-h"><h2>เตือนเมื่อเครดิตเหลือน้อย</h2></div><p class="sec-d">ส่งอีเมลหาคุณ 1 ครั้งเมื่อเครดิตลดต่ำกว่าจำนวนที่ตั้ง และมีป้ายเตือนในตัวแก้ Portfolio</p>'+
 sw('ส่งอีเมลเตือนเมื่อเครดิตเหลือน้อย','mail.low',A.mail.low)+
 '<div class="row2">'+fld('stL','เตือนเมื่อเหลือน้อยกว่า',A.low,{set:'low',cbx:1,sfx:'เครดิต',dis:!A.mail.low,attr:' inputmode="numeric" pattern="[0-9]*" maxlength="4" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="tmMn"',hint:'พิมพ์ตัวเลขเอง หรือเลือกจากรายการ ค่าเริ่มต้น 20 เครดิต'})+fld('stT','ส่งอีเมลเวลา',A.lowAt,{set:'lowAt',cbx:1,ph:'09:00',dis:!A.mail.low,attr:' inputmode="numeric" maxlength="5" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="tmMn"',hint:'พิมพ์เวลาเอง เช่น 9 หรือ 0930 หรือเลือกจากรายการทุก 15 นาที ค่าเริ่มต้น 09:00 น.'})+'</div></section>'+
 '<section class="sec"><div class="sec-h"><h2>อีเมลแจ้งเตือน</h2></div>'+sw('แพ็กเกจใกล้หมดอายุ','mail.exp',A.mail.exp,'เตือนล่วงหน้า 7 วัน')+sw('ฟีเจอร์ใหม่ของ Migma','mail.news',A.mail.news)+'</section>'+
 '<section class="sec danger-z"><div class="sec-h"><h2>ข้อมูลของคุณ</h2></div><p class="sec-d">ข้อมูล portfolio เป็นของคุณ ดาวน์โหลดเก็บไว้หรือย้ายออกได้ทุกเมื่อ</p>'+
 '<div class="lg-acts" style="margin-top:0"><button type="button" class="btn outlined" data-soon><span class="ms" aria-hidden="true">download</span>ดาวน์โหลดข้อมูลทั้งหมด</button></div><p class="hint">ไฟล์ที่ได้เป็น CSV เปิดด้วย Excel หรือ Google Sheets ได้ รูปภาพมาเป็นลิงก์</p></section>'+
 '<section class="sec"><div class="sec-h"><h2>เริ่มใหม่หรือลบ</h2></div><p class="sec-d">สองปุ่มนี้ทำให้ข้อมูลหาย ดาวน์โหลดเก็บไว้ก่อนได้จากด้านบน</p>'+
 '<dl><div class="row"><dt>เริ่มทำพอร์ตใหม่</dt><dd><span>ตอบคำถามตั้งต้นอีกครั้ง ทุกช่องในพอร์ตกลับเป็นว่าง บัญชี เครดิต และเว็บที่เผยแพร่ไปแล้วยังอยู่</span></dd><div class="act"><button type="button" class="btn outlined sm" data-restart>เริ่มทำพอร์ตใหม่</button></div></div>'+
 '<div class="row"><dt>ลบบัญชี</dt><dd><span>เว็บ ข้อมูลทั้งหมด และเครดิตที่เหลือหายถาวร กู้คืนไม่ได้</span></dd><div class="act"><button type="button" class="btn danger ghost sm" data-soon>ลบบัญชี</button></div></div></dl></section>'+help('มีปัญหาการใช้งานหรืออยากเสนอฟีเจอร์')}
};
/* ---------- นำทาง ---------- */
var HASH=(location.search.match(/[?&]h=([a-z]+)/)||[])[1];HASH=HASH?'#'+HASH:null;
var ALONE=/[?&]alone=1/.test(location.search),toApp=function(h){h=(h||'').replace('#','');location.replace('/editor'+(h&&h!=='overview'?'?acct='+h:''))};
function route(){var h=((EMB&&HASH)||location.hash||'').slice(1);up({type:'pf:acct',coins:A.coins,signed:A.signed});if(!A.signed){$('app').hidden=true;$('lg').hidden=false;document.title='เข้าสู่ระบบ · Migma';return}
  if(!V[h])h='overview';$('lg').hidden=true;$('app').hidden=false;$('acMain').innerHTML='<div class="ac-pg">'+V[h]()+'</div>';$('acCoinN').textContent=A.coins;
  [].forEach.call(document.querySelectorAll('#acNav a'),function(a){if(a.getAttribute('href')==='#'+h)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  document.documentElement.classList.toggle('pg-settings',h==='settings');
  var TB=[['overview','ภาพรวม'],['stats','สถิติ'],['credits','เครดิต AI'],['usage','การใช้ AI'],['plan','แพ็กเกจและใบเสร็จ']],tl=$('acTabs');tl.hidden=!EMB||h==='settings';tl.innerHTML=TB.map(function(t){return '<button type="button" class="tb" role="tab" data-h="'+t[0]+'" data-label="'+t[1]+'" aria-selected="'+(h===t[0])+'" tabindex="'+(h===t[0]?0:-1)+'">'+t[1]+'</button>'}).join('');
  document.title=document.querySelector('.ac-h').textContent+' · บัญชีของฉัน';return h}
function go(focus){var h=route();if(focus&&h){var hd=document.querySelector('.ac-h');hd&&hd.focus({preventScroll:true});scrollTo(0,0)}}
addEventListener('hashchange',function(){go(true)});
/* ฝังในหลังบ้าน: ลิงก์กลับไปแก้ Portfolio = ปิดหน้านี้ · เปิดเว็บ = ใช้ปุ่มดูหน้าเว็บของหลังบ้าน · เปลี่ยนหน้าเองเพราะ srcdoc ไม่มี hash ให้ตาม */
if(EMB){document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href');if(h==='/editor'){e.preventDefault();up({type:'pf:acct-close'})}else if(h==='/site'){e.preventDefault();up({type:'pf:acct-site'})}else if(h.charAt(0)==='#'){e.preventDefault();HASH=h;go(true)}},true);
  addEventListener('message',function(e){var m=e.data||{};if(m.type==='pf:mode'&&(m.theme==='dark'||m.theme==='light')&&document.documentElement.getAttribute('data-theme')!==m.theme)setThm(m.theme);if(m.type==='pf:acct-go'&&m.hash){HASH=m.hash;go(true)}})}
/* ---------- เข้าสู่ระบบ: Google ผ่านหลังบ้าน · กลับมาที่ callbackUrl (ภายในแอปเท่านั้น) ---------- */
var CB=(location.search.match(/[?&]callbackUrl=([^&]+)/)||[])[1];CB=CB?decodeURIComponent(CB):'/editor';if(CB.charAt(0)!=='/'||CB.charAt(1)==='/')CB='/editor';
$('lgG').onclick=function(){this.disabled=true;AUTH.signIn(CB)};
if(/[?&]error=/.test(location.search))setTimeout(function(){toast('เข้าสู่ระบบไม่สำเร็จ ลองอีกครั้ง')},0);
/* เปลี่ยนบัญชี Google: หลังบ้านให้ Google ถามเลือกบัญชีทุกครั้ง · ฝังในหลังบ้าน (iframe) Google ไม่ยอมเปิดในกรอบ จึงพาทั้งหน้าไป */
var switchAcct=function(){AUTH.signIn('/account?alone=1#settings')};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#acSwitch');if(b){b.disabled=true;switchAcct()}});
/* ออกจากระบบ: ลบ session ที่หลังบ้าน · ล้างพอร์ตที่ cache ในเครื่อง · ฝังในหลังบ้านอยู่ = พาทั้งหน้าไปหน้าเข้าสู่ระบบ */
$('acOut').onclick=function(){A.signed=false;save();
  AUTH.signOut().catch(function(){}).then(function(){portfolioStore.clearLocal();if(EMB){try{top.location.href='/account'}catch(e){}return}route();toast('ออกจากระบบแล้ว')})};
/* กลุ่มตัวเลือกแบบ seg: ลูกศรซ้ายขวา (และขึ้นลง) ย้ายและเลือกตัวถัดไป Home/End ไปตัวแรกหรือตัวสุดท้าย ตามแบบ radiogroup */
document.addEventListener('keydown',function(e){var t=e.target;if(!t.matches||!t.matches('[role=radio]')||!/^(Arrow(Left|Right|Up|Down)|Home|End)$/.test(e.key)||e.metaKey||e.ctrlKey||e.altKey)return;var g=t.closest('[role=radiogroup]');if(!g)return;var a=[].filter.call(g.querySelectorAll('[role=radio]'),function(b){return !b.disabled&&b.offsetWidth>0}),i=a.indexOf(t);if(i<0||a.length<2)return;e.preventDefault();var n=e.key==='Home'?0:e.key==='End'?a.length-1:(i+(/Right|Down/.test(e.key)?1:a.length-1))%a.length;a[n].click();var f=document.contains(a[n])?a[n]:null;if(!f){var gl=g.getAttribute('aria-labelledby')||g.getAttribute('aria-label'),g2=gl&&[].filter.call(document.querySelectorAll('[role=radiogroup]'),function(x){return (x.getAttribute('aria-labelledby')||x.getAttribute('aria-label'))===gl})[0];f=g2&&g2.querySelector('[role=radio][aria-checked=true]')}f&&f.focus()});
$('acTheme').onclick=function(){setThm(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark')};
/* ---------- ช่องเวลา: รายการเลือกใต้ช่อง (ทุกชั่วโมง) · พิมพ์เองได้เหมือนเดิม ---------- */
var TM=null,TMDEF='09:00';
function tmClose(){if(!TM)return;TM.el.remove();TM.inp.setAttribute('aria-expanded','false');TM=null}
function tmOpen(inp){tmClose();var el=document.createElement('div'),cur=inp.value.trim();var num=inp.dataset.set==='low',opts=[];el.className='mn';el.id='tmMn';el.setAttribute('role','listbox');el.setAttribute('aria-label',num?'เลือกจำนวนเครดิต':'เลือกเวลา');
  if(num)opts=[10,20,30,50,100,200].map(function(n){return [String(n),n+' เครดิต']});else for(var h=0;h<96;h++){var hv=('0'+Math.floor(h/4)).slice(-2)+':'+('0'+(h%4)*15).slice(-2);opts.push([hv,hv+' น.'])}
  var html=opts.map(function(o){return '<button type="button" class="mi" role="option" data-tm="'+o[0]+'" aria-selected="'+(o[0]===cur)+'" tabindex="-1"><span>'+o[1]+'</span>'+(o[0]===cur?'<span class="ms" aria-hidden="true">check</span>':'')+'</button>'}).join('');TMDEF=num?'20':'09:00';
  el.innerHTML=html;document.body.appendChild(el);var r=inp.getBoundingClientRect(),below=innerHeight-r.bottom-12,up=below<200&&r.top>below;el.style.left=r.left+'px';el.style.width=r.width+'px';el.style.maxHeight=Math.max(160,Math.min(280,(up?r.top:below)-8))+'px';el.style.top=(up?r.top-el.offsetHeight-6:r.bottom+6)+'px';
  TM={el:el,inp:inp,at:Date.now()};inp.setAttribute('aria-expanded','true');var s0=el.querySelector('[aria-selected=true]')||el.querySelector('[data-tm="'+TMDEF+'"]');s0&&s0.scrollIntoView({block:'center'})}
function tmPick(v){var inp=TM.inp;tmClose();inp.value=v;inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));var n=document.getElementById(inp.id);n&&n.focus()}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-cbx]'),o=e.target.closest&&e.target.closest('[data-tm]');if(o){tmPick(o.dataset.tm);return}if(b){var inp=b.parentNode.querySelector('.in');if(TM&&TM.inp===inp)tmClose();else{inp.scrollIntoView({block:'nearest'});inp.focus({preventScroll:true});tmOpen(inp)}}});
document.addEventListener('mousedown',function(e){if(TM&&!TM.el.contains(e.target)&&!(e.target.closest&&e.target.closest('.inw.cbx')))tmClose()});
document.addEventListener('keydown',function(e){var t=e.target,isIn=t.matches&&t.matches('.inw.cbx .in');if(!TM){if(isIn&&(e.key==='ArrowDown'||e.key==='ArrowUp')){e.preventDefault();tmOpen(t);var f=TM.el.querySelector('[aria-selected=true]')||TM.el.querySelector('[data-tm="'+TMDEF+'"]');f&&f.focus()}return}
  var it=[].slice.call(TM.el.querySelectorAll('.mi')),i=it.indexOf(document.activeElement);
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();var b=TM.inp;tmClose();b.focus();return}
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();var n=i<0?it.indexOf(TM.el.querySelector('[aria-selected=true]')):i+(e.key==='ArrowDown'?1:-1);if(n<0)n=e.key==='ArrowDown'?0:it.length-1;it[Math.max(0,Math.min(it.length-1,n))].focus();return}
  if(e.key==='Enter'&&i>=0){e.preventDefault();tmPick(it[i].dataset.tm);return}
  if(e.key==='Tab')tmClose()},true);
document.addEventListener('input',function(e){if(TM&&e.target===TM.inp)tmClose()});
addEventListener('resize',tmClose);document.addEventListener('scroll',function(e){if(TM&&!TM.el.contains(e.target)&&Date.now()-TM.at>250)tmClose()},true);
/* ---------- การกระทำในหน้า ---------- */
/* จ่ายเงิน: สร้างคำสั่งซื้อที่หลังบ้านแล้วพาทั้งหน้าไป Checkout ของ Stripe (Stripe เปิดในกรอบ iframe ไม่ได้) · จ่ายเสร็จกลับมาที่ /account?paid=1&session_id=… */
function buy(p,btn){btn.disabled=true;startCheckout(p.k).then(function(r){try{(window.top||window).location.href=r.url}catch(e){location.href=r.url}},function(err){btn.disabled=false;var s=err&&err.status;
  toast(s===503?'ระบบจ่ายเงินยังไม่เปิด ลองใหม่ภายหลัง':s===429?'กดจ่ายเงินหลายครั้งเกินไป รอสักครู่แล้วลองใหม่':s===404?'แพ็กนี้ปิดขายแล้ว โหลดรายการใหม่ให้แล้ว':s===401?'เซสชันหมดอายุ เข้าสู่ระบบใหม่แล้วลองอีกครั้ง':'เริ่มจ่ายเงินไม่ได้ ลองอีกครั้ง');if(s===404)loadData()})}
/* ใบเสร็จ: แสดงรายละเอียดคำสั่งซื้อ (ใบเสร็จจาก Stripe ส่งทางอีเมลตอนจ่าย · ใบกำกับภาษีขอที่ทีมงาน) */
function receipt(no){var b=A.bills.filter(function(x){return x.no===no})[0];if(!b){toast('ไม่พบใบเสร็จ');return}
  var m=modal('<h2 class="dg-t" id="dgT">ใบเสร็จรับเงิน</h2><dl class="rc-l"><div class="row"><dt>เลขที่</dt><dd>'+esc(b.no)+'</dd></div><div class="row"><dt>วันที่</dt><dd>'+fd(b.t,1)+'</dd></div><div class="row"><dt>รายการ</dt><dd>'+esc(b.d)+'</dd></div><div class="row"><dt>ยอดชำระ</dt><dd>฿'+money(b.thb)+'</dd></div><div class="row"><dt>จ่ายผ่าน</dt><dd>'+esc(b.m)+'</dd></div><div class="row"><dt>ผู้ซื้อ</dt><dd>'+esc(A.email)+'</dd></div></dl><p class="dg-d">ใบนี้ใช้เป็นหลักฐานการจ่ายเงิน ถ้าต้องการใบกำกับภาษี เขียนมาที่ '+SUP+' พร้อมเลขที่ใบเสร็จ</p><div class="dg-a"><button type="button" class="btn filled" data-x>ปิด</button></div>');
  m.box.querySelector('[data-x]').onclick=m.close;m.box.querySelector('[data-x]').focus()}
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-plan],[data-soon],[data-rc],[data-restart],#buy');if(!t)return;
  if(t.dataset.restart!==undefined){var rm=modal('<h2 class="dg-t" id="dgT">เริ่มทำพอร์ตใหม่?</h2><p class="dg-d">ทุกช่องในพอร์ตที่กรอกไว้จะกลับเป็นว่าง แล้วระบบถามคำถามตั้งต้นอีกครั้ง บัญชี เครดิต และเว็บที่เผยแพร่ไปแล้วยังอยู่ ถ้าอยากเก็บข้อมูลเดิมไว้ กดยกเลิกแล้วดาวน์โหลดจาก “ข้อมูลของคุณ” ก่อน</p><div class="dg-a"><button type="button" class="btn cancel" data-x>ยกเลิก</button><button type="button" class="btn filled danger" data-ok>เริ่มใหม่</button></div>');
   rm.box.querySelector('[data-x]').onclick=rm.close;rm.box.querySelector('[data-ok]').onclick=function(){rm.close();if(EMB)up({type:'pf:acct-restart'});else location.href='/editor'};rm.box.querySelector('[data-x]').focus();return}
  if(t.id==='buy'){var k=(document.querySelector('input[name=pk]:checked')||{}).value,p=PACKS.filter(function(x){return x.k===k})[0];if(!p){toast('เลือกแพ็กเครดิตก่อน');return}buy(p,t);return}
  if(t.dataset.plan){toast('แพ็กเกจนี้ยังไม่เปิดขาย');return}
  if(t.dataset.rc!==undefined){receipt(t.dataset.rc);return}
  if(t.dataset.soon!==undefined){toast('ส่วนนี้ยังไม่เปิดใช้');return}
});
function setThm(n){var r=document.documentElement;r.setAttribute('data-theme',n);LS.set('theme',n);[].forEach.call(document.querySelectorAll('[data-thm]'),function(b){b.setAttribute('aria-checked',b.dataset.thm===n)});var tb=$('acTheme');if(tb){tb.setAttribute('aria-label',n==='dark'?'สลับโหมดสว่าง':'สลับโหมดมืด');tb.firstChild.textContent=n==='dark'?'light_mode':'dark_mode'}}
function fsApply(){document.documentElement.classList.toggle('fs-lg',LS.get('pf-fs')==='lg')}fsApply();
/* ภาษาของหลังบ้าน: สลับแล้วโหลดใหม่ ถ้าหน้านี้ฝังอยู่ในตัวแก้ ให้ตัวแก้เป็นคนโหลด */
function uiSet(l){if(l===uiLang())return;try{localStorage.setItem('pf-ui',l)}catch(e){}if(EMB)up({type:'pf:ui'});else location.reload()}
(function(){var b=$('lgUi');if(!b)return;var to=uiLang()==='en'?'th':'en';$('lgUiT').textContent=to==='th'?'ภาษาไทย':'English';b.lang=to;b.onclick=function(){uiSet(to)}})();
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-uil]');if(b)uiSet(b.dataset.uil)});
document.addEventListener('click',function(e){var f=e.target.closest&&e.target.closest('[data-fs]');if(!f)return;LS.set('pf-fs',f.dataset.fs);fsApply();up({type:'pf:fs'});[].forEach.call(f.parentNode.children,function(x){x.setAttribute('aria-checked',x===f)})});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-thm]');if(!b)return;setThm(b.dataset.thm);up({type:'pf:mode',theme:b.dataset.thm});b.focus()});
document.addEventListener('click',function(e){var c=e.target.closest&&e.target.closest('[data-copy]');if(!c)return;var v=c.dataset.copy,ok=function(){toast('คัดลอก '+v+' แล้ว')};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(v).then(ok,function(){toast('คัดลอกไม่ได้ ลองเลือกข้อความเอง')});else toast('คัดลอกไม่ได้ ลองเลือกข้อความเอง')});
document.addEventListener('input',function(e){var t=e.target,w=t.closest&&t.closest('.inw');if(!w)return;w.classList.toggle('has',t.value!=='');var c=t.closest('.fld').querySelector('[data-cnt]');if(c){c.textContent=t.value.length+' / '+c.dataset.cnt;c.classList.toggle('over',t.value.length>+c.dataset.cnt)}});
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-clr]');if(b){var inp=b.parentNode.querySelector('.in');inp.value='';inp.dispatchEvent(new Event('input',{bubbles:true}));var cid=inp.id;inp.dispatchEvent(new Event('change',{bubbles:true}));(document.getElementById(cid)||inp).focus();return}
  var l=e.target.closest&&e.target.closest('[data-low]');if(l){A.low=+l.dataset.low;save();[].forEach.call(l.parentNode.children,function(x){x.setAttribute('aria-checked',x===l)});return}
  var tb=e.target.closest&&e.target.closest('.tb[data-h]');if(tb){if(EMB){HASH='#'+tb.dataset.h;go(true)}else location.hash='#'+tb.dataset.h}});
document.addEventListener('keydown',function(e){var t=e.target;if(!t.matches||!t.matches('.tb[data-h]')||(e.key!=='ArrowRight'&&e.key!=='ArrowLeft'))return;var a=[].slice.call(t.parentNode.children),n=a[(a.indexOf(t)+(e.key==='ArrowRight'?1:a.length-1))%a.length];e.preventDefault();n.click();setTimeout(function(){var x=document.querySelector('.tb[data-h="'+n.dataset.h+'"]');x&&x.focus()},0)});
document.addEventListener('change',function(e){var t=e.target;if(t.dataset.sw){var k=t.dataset.sw.split('.');if(k.length>1)A[k[0]][k[1]]=t.checked;else A[k[0]]=t.checked;save();if(t.dataset.sw!=='mail.low')return}
  if(t.dataset.sw==='mail.low'){route();return}
  if(t.dataset.set==='low'||t.dataset.set==='lowAt'){var f=t.closest('.fld'),o=f.querySelector('.err-msg'),bad=function(msg){f.classList.add('err');f.insertAdjacentHTML('beforeend','<span class="err-msg"><span class="ms" aria-hidden="true">error</span><span>'+msg+'</span></span>')};o&&o.remove();f.classList.remove('err');
   if(t.dataset.set==='low'){var n=+t.value;if(!/^\d+$/.test(t.value.trim())||n<1||n>9999){bad('ใส่ตัวเลข 1 ถึง 9999');return}A.low=n;save();toast('เตือนเมื่อเหลือน้อยกว่า '+n+' เครดิต')}
   else{var tv=t.value.trim(),m=tv.match(/^(\d{1,2})[:.](\d{2})$/)||tv.match(/^(\d{1,2})(\d{2})$/)||(tv.match(/^(\d{1,2})$/)?[0,tv,'00']:null);if(!m||+m[1]>23||+m[2]>59){bad('ใส่เวลาเป็น ชั่วโมง:นาที เช่น 09:00');return}A.lowAt=('0'+m[1]).slice(-2)+':'+m[2];t.value=A.lowAt;save();toast('ส่งอีเมลเตือนเวลา '+A.lowAt+' น.')}return}
  if(t.dataset.set==='name'){A.name=t.value.trim();save();route();toast('บันทึกชื่อแล้ว');return}
});
document.addEventListener('click',function(e){
  var b=e.target.closest&&e.target.closest('#stSlugSave');
  if(!b)return;
  var inp=$('stSlugIn');if(!inp)return;
  var v=inp.value.trim().toLowerCase(),hint=$('stSlugHint');
  if(v===A.slug){toast('ที่อยู่เว็บนี้เป็นชื่อเดิมของคุณอยู่แล้ว');return}
  if(v.length<3||v.length>30||!/^[a-z0-9]([a-z0-9-]{0,28}[a-z0-9])?$/.test(v)){
    if(hint){hint.style.color='var(--danger-tint-foreground, #ef4444)';hint.textContent='ที่อยู่เว็บต้องเป็นตัวพิมพ์เล็ก ตัวเลข หรือขีดกลาง 3–30 ตัว และไม่ขึ้น/ลงท้ายด้วยขีด'}
    inp.focus();return;
  }
  b.disabled=true;b.textContent='กำลังบันทึก…';
  updateSlug(v).then(function(updated){
    b.disabled=false;b.textContent='บันทึกที่อยู่';
    A.slug=updated.slug;
    A.siteUrl=location.origin+publicBase(updated.slug);
    save();
    toast('เปลี่ยนที่อยู่เว็บเป็น /u/'+updated.slug+' แล้ว');
    if(hint){hint.style.color='';hint.textContent='ตัวอย่างลิงก์เต็ม: '+siteHost()}
  }).catch(function(err){
    b.disabled=false;b.textContent='บันทึกที่อยู่';
    var msg=(err&&err.message)||'ไม่สามารถเปลี่ยนที่อยู่เว็บได้';
    if(hint){hint.style.color='var(--danger-tint-foreground, #ef4444)';hint.textContent=msg}
    toast(msg);
  });
});
document.addEventListener('input',function(e){
  if(e.target&&e.target.id==='stSlugIn'){
    var cnt=$('stSlugCnt');if(cnt)cnt.textContent=e.target.value.length+' / 30';
    var hint=$('stSlugHint');if(hint&&hint.style.color){hint.style.color='';hint.textContent='ใช้ตัวอักษรพิมพ์เล็ก ตัวเลข และขีดกลาง 3–30 ตัวอักษร'}
  }
});
if(!EMB&&!ALONE&&A.signed){toApp(location.hash);return}
route();
/* ---------- ข้อมูลจากหลังบ้าน: ราคา AI · แพ็กเครดิต · ยอดเครดิต · ประวัติ · ใบเสร็จ ---------- */
function redraw(){var h=((EMB&&HASH)||location.hash||'').slice(1);if(!V[h])h='overview';if(A.signed&&h!=='settings'&&h!=='stats')route()}
function loadData(){if(!A.signed)return Promise.resolve();return Promise.all([fetchPricing(),fetchCredits()]).then(function(r){
  COST=r[0].costs.map(function(c){return{k:c.kind,n:c.label,w:c.place,c:c.credits,u:c.unit}});PACKS=r[0].packages.map(function(p){return{k:p.id,coin:p.credits,thb:p.priceSatang/100}});PAYON=r[0].paymentsEnabled;
  applyCredits(A,r[1]);LOADED=1;save();redraw()},function(){LOADED=-1;redraw()})}
/* กลับจากหน้าจ่ายเงินของ Stripe: ให้หลังบ้านถาม Stripe แล้วใส่เครดิต (ไม่ต้องรอ webhook) · PromptPay อาจใช้เวลา จึงลองซ้ำสักพัก */
function settle(id,n){confirmCheckout(id).then(function(r){
  if(r.status==='paid'){toast('ได้รับเครดิตแล้ว ตอนนี้มี '+r.balance+' เครดิต');end()}
  else if(r.status==='pending'&&n<6)setTimeout(function(){settle(id,n+1)},2500);
  else if(r.status==='pending'){toast('ยังไม่ได้รับการยืนยันการจ่ายเงิน ถ้าตัดเงินแล้ว เครดิตจะเข้าเองภายในไม่กี่นาที');end()}
  else{toast('การจ่ายเงินไม่สำเร็จ ยังไม่ได้ตัดเงิน');end()}
 },function(){toast('ยืนยันการจ่ายเงินไม่ได้ ถ้าตัดเงินแล้ว เครดิตจะเข้าเองภายในไม่กี่นาที');end()})}
function end(){try{history.replaceState(null,'',location.pathname+'?alone=1'+location.hash)}catch(e){}loadData()}
addEventListener('pageshow',function(e){if(e.persisted)loadData().then(go)});
var SID=(location.search.match(/[?&]session_id=([^&]+)/)||[])[1];
if(A.signed&&SID&&/[?&]paid=1/.test(location.search)){toast('กำลังตรวจการจ่ายเงิน…');settle(decodeURIComponent(SID),0)}else loadData();

}
