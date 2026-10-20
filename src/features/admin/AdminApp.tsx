'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, fetchMe, goSignIn, type Me } from '@/lib/api';
import {
  admin, baht, toSatang,
  type AdminOrder, type AdminUser, type AiCost, type CreditPackage, type PackageInput,
} from '@/lib/billing';

/** หน้าแอดมิน: สร้าง/แก้แพ็กเกจเครดิต · ตั้งราคาเครดิตต่องาน AI · ดูคำสั่งซื้อ · ปรับเครดิตผู้ใช้
 *  สิทธิ์ตัดสินที่หลังบ้านจากอีเมลใน ADMIN_EMAILS (หน้านี้แค่ซ่อน/แสดง · API ตอบ 403 เองถ้าไม่ใช่แอดมิน) */
export function AdminApp() {
  const [me, setMe] = useState<Me | null | undefined>(undefined); // undefined = กำลังโหลด · null = ยังไม่เข้าสู่ระบบ
  const [tab, setTab] = useState<'packages' | 'costs' | 'orders' | 'users'>('packages');
  const [msg, setMsg] = useState<{ text: string; err: boolean } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const say = useCallback((text: string, err = false) => {
    setMsg({ text, err });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), err ? 6000 : 3000);
  }, []);
  const fail = useCallback((e: unknown) => say(e instanceof ApiError ? e.message : 'ติดต่อหลังบ้านไม่ได้ ลองอีกครั้ง', true), [say]);

  useEffect(() => {
    fetchMe().then(setMe, () => setMe(null));
    return () => clearTimeout(timer.current);
  }, []);

  if (me === undefined) return <p className="ad-c">กำลังโหลด…</p>;
  if (me === null) {
    return (
      <main className="ad-c">
        <h1>แอดมิน</h1>
        <p>เข้าสู่ระบบด้วยบัญชี Google ของแอดมินก่อน</p>
        <button type="button" className="ad-btn pri" onClick={() => goSignIn('/admin')}>เข้าสู่ระบบ</button>
      </main>
    );
  }
  if (!me.isAdmin) {
    return (
      <main className="ad-c">
        <h1>ไม่มีสิทธิ์เข้าหน้านี้</h1>
        <p>{me.email} ไม่ได้อยู่ในรายชื่อแอดมิน (ตั้งที่ ADMIN_EMAILS ของหลังบ้าน)</p>
        <a className="ad-btn" href="/editor">กลับไปตัวแก้ Portfolio</a>
      </main>
    );
  }

  const tabs = [['packages', 'แพ็กเกจเครดิต'], ['costs', 'ราคา AI'], ['orders', 'คำสั่งซื้อ'], ['users', 'ผู้ใช้']] as const;
  return (
    <main className="ad">
      <header className="ad-top">
        <div>
          <h1>แอดมิน</h1>
          <p>{me.email}</p>
        </div>
        <a className="ad-btn sm" href="/editor">กลับไปตัวแก้ Portfolio</a>
      </header>
      <div className="ad-tabs" role="tablist">
        {tabs.map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>
      {tab === 'packages' && <Packages say={say} fail={fail} />}
      {tab === 'costs' && <Costs say={say} fail={fail} />}
      {tab === 'orders' && <Orders fail={fail} />}
      {tab === 'users' && <Users say={say} fail={fail} />}
      {msg && <div className={'ad-msg' + (msg.err ? ' err' : '')} role="status" aria-live="polite">{msg.text}</div>}
    </main>
  );
}

interface Tools {
  say: (t: string, err?: boolean) => void;
  fail: (e: unknown) => void;
}

const EMPTY = { id: '', name: '', credits: '', price: '', sort: '0', active: true };

function Packages({ say, fail }: Tools) {
  const [rows, setRows] = useState<CreditPackage[] | null>(null);
  const [payOn, setPayOn] = useState(true);
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    admin.packages().then((r) => { setRows(r.packages); setPayOn(r.paymentsEnabled); }, fail);
  }, [fail]);
  useEffect(load, [load]);

  const edit = (p: CreditPackage) =>
    setF({ id: p.id, name: p.name, credits: String(p.credits), price: String(p.priceSatang / 100), sort: String(p.sort), active: p.active });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const credits = Number(f.credits);
    const priceSatang = toSatang(f.price);
    const sort = Number(f.sort || 0);
    if (!f.name.trim()) return say('ใส่ชื่อแพ็กเกจ', true);
    if (!Number.isInteger(credits) || credits < 1 || credits > 1_000_000) return say('จำนวนเครดิตต้องเป็นจำนวนเต็ม 1 ถึง 1,000,000', true);
    if (priceSatang === null || priceSatang < 1000 || priceSatang > 99_999_999) return say('ราคาต้องอยู่ระหว่าง 10 ถึง 999,999.99 บาท (ทศนิยมไม่เกิน 2 ตำแหน่ง)', true);
    if (!Number.isInteger(sort)) return say('ลำดับต้องเป็นจำนวนเต็ม', true);
    const body: PackageInput = { name: f.name.trim(), credits, priceSatang, active: f.active, sort };
    setBusy(true);
    try {
      if (f.id) await admin.updatePackage(f.id, body);
      else await admin.createPackage(body);
      say(f.id ? 'บันทึกแพ็กเกจแล้ว' : 'สร้างแพ็กเกจแล้ว');
      setF(EMPTY);
      load();
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const toggle = (p: CreditPackage) =>
    admin.updatePackage(p.id, { name: p.name, credits: p.credits, priceSatang: p.priceSatang, active: !p.active, sort: p.sort })
      .then(() => { say(p.active ? 'หยุดขายแล้ว' : 'เปิดขายแล้ว'); load(); }, fail);

  const remove = (p: CreditPackage) => {
    if (!confirm(`ลบแพ็กเกจ “${p.name}”?\nคำสั่งซื้อที่ผ่านมายังอยู่ครบ (ถ้าแค่อยากหยุดขาย ให้กด “หยุดขาย” แทน)`)) return;
    admin.deletePackage(p.id).then(() => { say('ลบแพ็กเกจแล้ว'); if (f.id === p.id) setF(EMPTY); load(); }, fail);
  };

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  return (
    <section>
      <h2>แพ็กเกจเครดิตที่ขายให้ลูกค้า</h2>
      <p className="ad-d">ลูกค้าเห็นเฉพาะแพ็กที่เปิดขาย จ่ายผ่าน Stripe Checkout (บัตร / PromptPay) · แก้ราคาแล้วมีผลกับคำสั่งซื้อใหม่เท่านั้น คำสั่งซื้อเดิมยังเป็นราคาตอนซื้อ</p>
      {!payOn && <p className="ad-note">หลังบ้านยังไม่ได้ตั้ง STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET — ลูกค้ากดจ่ายเงินไม่ได้จนกว่าจะตั้งค่า</p>}
      <form className="ad-f" onSubmit={submit} aria-label={f.id ? 'แก้แพ็กเกจ' : 'เพิ่มแพ็กเกจ'}>
        <label>ชื่อแพ็กเกจ<input className="ad-in" value={f.name} onChange={set('name')} maxLength={60} placeholder="เช่น แพ็กกลาง" /></label>
        <label>เครดิตที่ได้<input className="ad-in num" value={f.credits} onChange={set('credits')} inputMode="numeric" placeholder="300" /></label>
        <label>ราคา (บาท)<input className="ad-in num" value={f.price} onChange={set('price')} inputMode="decimal" placeholder="249" /></label>
        <label>ลำดับแสดง<input className="ad-in num" value={f.sort} onChange={set('sort')} inputMode="numeric" /></label>
        <label className="chk"><input type="checkbox" checked={f.active} onChange={set('active')} />เปิดขาย</label>
        <div className="acts">
          <button type="submit" className="ad-btn pri" disabled={busy}>{f.id ? 'บันทึก' : 'เพิ่มแพ็กเกจ'}</button>
          {f.id && <button type="button" className="ad-btn" onClick={() => setF(EMPTY)}>ยกเลิกแก้</button>}
        </div>
      </form>
      {rows === null ? <p className="ad-empty">กำลังโหลด…</p> : rows.length === 0 ? <p className="ad-empty">ยังไม่มีแพ็กเกจ เพิ่มแพ็กแรกด้านบน</p> : (
        <div className="ad-tw">
          <table className="ad-t">
            <thead><tr><th>แพ็กเกจ</th><th className="r">เครดิต</th><th className="r">ราคา</th><th className="r">ต่อเครดิต</th><th>สถานะ</th><th /></tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className={p.active ? '' : 'off'}>
                  <td>{p.name}</td>
                  <td className="r">{p.credits.toLocaleString('en-US')}</td>
                  <td className="r">฿{baht(p.priceSatang)}</td>
                  <td className="r">฿{(p.priceSatang / 100 / p.credits).toFixed(2)}</td>
                  <td><span className={'ad-tag' + (p.active ? ' ok' : '')}>{p.active ? 'เปิดขาย' : 'หยุดขาย'}</span></td>
                  <td>
                    <div className="acts">
                      <button type="button" className="ad-btn sm" onClick={() => edit(p)}>แก้</button>
                      <button type="button" className="ad-btn sm" onClick={() => toggle(p)}>{p.active ? 'หยุดขาย' : 'เปิดขาย'}</button>
                      <button type="button" className="ad-btn sm dng" onClick={() => remove(p)}>ลบ</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

type CostDraft = { credits: string; label: string; place: string; unit: string };

function Costs({ say, fail }: Tools) {
  const [rows, setRows] = useState<AiCost[] | null>(null);
  const [draft, setDraft] = useState<Record<string, CostDraft>>({});

  const load = useCallback(() => {
    admin.costs().then((r) => {
      setRows(r.costs);
      setDraft(Object.fromEntries(r.costs.map((c) => [c.kind, { credits: String(c.credits), label: c.label, place: c.place, unit: c.unit }])));
    }, fail);
  }, [fail]);
  useEffect(load, [load]);

  const save = (c: AiCost) => {
    const d = draft[c.kind];
    const credits = Number(d.credits);
    if (d.credits.trim() === '' || !Number.isInteger(credits) || credits < 0 || credits > 10_000) return say('เครดิตต้องเป็นจำนวนเต็ม 0 ถึง 10,000 (0 = ใช้ฟรี)', true);
    if (!d.label.trim()) return say('ใส่ชื่องาน', true);
    admin.updateCost(c.kind, { credits, label: d.label, place: d.place, unit: d.unit }).then(() => { say(`บันทึกราคา “${d.label}” แล้ว`); load(); }, fail);
  };

  const dirty = (c: AiCost) => {
    const d = draft[c.kind];
    return d && (d.credits !== String(c.credits) || d.label !== c.label || d.place !== c.place || d.unit !== c.unit);
  };
  const upd = (kind: string, k: keyof CostDraft) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft({ ...draft, [kind]: { ...draft[kind], [k]: e.target.value } });

  return (
    <section>
      <h2>ราคาเครดิตต่องาน AI</h2>
      <p className="ad-d">ลูกค้าเสียเครดิตเท่าที่ตั้งไว้ทุกครั้งที่กดให้ AI ช่วย · มีผลทันทีกับการใช้ครั้งต่อไป (งานที่ใช้เครดิตเพิ่มเองไม่ได้ เพราะผูกกับโค้ดของตัวแก้) ตั้งเป็น 0 = ฟรี</p>
      {rows === null ? <p className="ad-empty">กำลังโหลด…</p> : (
        <div className="ad-tw">
          <table className="ad-t">
            <thead><tr><th>งาน</th><th>ใช้ตรงไหน</th><th>หน่วย</th><th className="r">เครดิต</th><th /></tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.kind}>
                  <td><input className="ad-in" aria-label={`ชื่องาน ${c.kind}`} value={draft[c.kind]?.label ?? ''} onChange={upd(c.kind, 'label')} maxLength={80} /><small>{c.kind}</small></td>
                  <td><input className="ad-in" aria-label={`ใช้ตรงไหน ${c.kind}`} value={draft[c.kind]?.place ?? ''} onChange={upd(c.kind, 'place')} maxLength={80} /></td>
                  <td><input className="ad-in" aria-label={`หน่วย ${c.kind}`} value={draft[c.kind]?.unit ?? ''} onChange={upd(c.kind, 'unit')} maxLength={40} /></td>
                  <td className="r"><input className="ad-in num" aria-label={`เครดิต ${c.kind}`} value={draft[c.kind]?.credits ?? ''} onChange={upd(c.kind, 'credits')} inputMode="numeric" /></td>
                  <td><button type="button" className="ad-btn sm pri" disabled={!dirty(c)} onClick={() => save(c)}>บันทึก</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

const STATUS: Record<string, [string, string]> = {
  paid: ['จ่ายแล้ว', ' ok'], pending: ['รอจ่าย', ' wait'], expired: ['หมดเวลา', ' bad'], failed: ['ไม่สำเร็จ', ' bad'],
};

const when = (iso: string) => new Date(iso).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' });

function Orders({ fail }: Pick<Tools, 'fail'>) {
  const [rows, setRows] = useState<AdminOrder[] | null>(null);
  const load = useCallback(() => { admin.orders().then((r) => setRows(r.orders), fail); }, [fail]);
  useEffect(load, [load]);
  const paid = rows?.filter((o) => o.status === 'paid') ?? [];
  const sum = paid.reduce((n, o) => n + o.amountSatang, 0);
  return (
    <section>
      <h2>คำสั่งซื้อล่าสุด</h2>
      <p className="ad-d">{rows ? `${rows.length} รายการล่าสุด · จ่ายแล้ว ${paid.length} รายการ รวม ฿${baht(sum)}` : 'กำลังโหลด…'} <button type="button" className="ad-btn sm" onClick={load}>รีเฟรช</button></p>
      {rows && (rows.length === 0 ? <p className="ad-empty">ยังไม่มีคำสั่งซื้อ</p> : (
        <div className="ad-tw">
          <table className="ad-t">
            <thead><tr><th>เลขที่</th><th>ผู้ซื้อ</th><th>แพ็กเกจ</th><th className="r">เครดิต</th><th className="r">ยอด</th><th>สถานะ</th><th>เวลา</th></tr></thead>
            <tbody>
              {rows.map((o) => {
                const [label, cls] = STATUS[o.status] ?? [o.status, ''];
                return (
                  <tr key={o.id}>
                    <td>{o.no}</td><td>{o.userEmail}</td><td>{o.packageName}</td>
                    <td className="r">{o.credits.toLocaleString('en-US')}</td><td className="r">฿{baht(o.amountSatang)}</td>
                    <td><span className={'ad-tag' + cls}>{label}</span></td>
                    <td>{when(o.paidAt && o.status === 'paid' ? o.paidAt : o.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  pass: 'Job Hunt Pass',
  pro: 'Pro yearly',
};

const PLAN_OPTIONS = [
  { value: 'free:0', label: 'Free (ฟรี)' },
  { value: 'pass:90', label: 'Job Hunt Pass (3 เดือน)' },
  { value: 'pass:30', label: 'Job Hunt Pass (1 เดือน)' },
  { value: 'pro:365', label: 'Pro yearly (1 ปี)' },
  { value: 'pro:0', label: 'Pro (ไม่หมดอายุ)' },
];

function Users({ say, fail }: Tools) {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<AdminUser[] | null>(null);
  const [adj, setAdj] = useState<Record<string, { delta: string; note: string }>>({});
  const [planSel, setPlanSel] = useState<Record<string, string>>({});

  const search = useCallback((text: string) => { admin.users(text).then((r) => setRows(r.users), fail); }, [fail]);
  useEffect(() => { search(''); }, [search]);

  const apply = (u: AdminUser) => {
    const a = adj[u.id] ?? { delta: '', note: '' };
    const delta = Number(a.delta);
    if (!Number.isInteger(delta) || delta === 0 || Math.abs(delta) > 100_000) return say('จำนวนเครดิตที่ปรับต้องเป็นจำนวนเต็ม (บวก = เพิ่ม · ลบ = ลด) ไม่เกิน ±100,000', true);
    if (!a.note.trim()) return say('ใส่เหตุผล (บันทึกไว้ในประวัติของลูกค้า)', true);
    if (!confirm(`${delta > 0 ? 'เพิ่ม' : 'ลด'} ${Math.abs(delta)} เครดิต ให้ ${u.email}?`)) return;
    admin.adjustCredits(u.id, delta, a.note).then((r) => {
      say(`ปรับแล้ว ${u.email} เหลือ ${r.balance} เครดิต`);
      setAdj({ ...adj, [u.id]: { delta: '', note: '' } });
      search(q);
    }, fail);
  };

  const applyPlan = (u: AdminUser) => {
    const sel = planSel[u.id];
    if (!sel) return;
    const [targetPlan, daysStr] = sel.split(':');
    const days = daysStr ? parseInt(daysStr, 10) : 0;
    const planName = PLAN_LABELS[targetPlan] || targetPlan;
    if (!confirm(`เปลี่ยนแพ็กเกจของ ${u.email} เป็น ${planName}?`)) return;
    admin.updatePlan(u.id, targetPlan, days).then((updated) => {
      say(`เปลี่ยนแพ็กเกจของ ${u.email} เป็น ${PLAN_LABELS[updated.plan || 'free']} แล้ว`);
      setPlanSel({ ...planSel, [u.id]: '' });
      search(q);
    }, fail);
  };

  const upd = (id: string, k: 'delta' | 'note') => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAdj({ ...adj, [id]: { ...(adj[id] ?? { delta: '', note: '' }), [k]: e.target.value } });

  return (
    <section>
      <h2>ผู้ใช้ เครดิต และแพ็กเกจ</h2>
      <p className="ad-d">ค้นจากอีเมลหรือชื่อ ใช้ปรับเครดิตและเปลี่ยนแพ็กเกจ (Free / Job Hunt Pass / Pro) ให้ผู้ใช้โดยตรง</p>
      <form className="ad-f" onSubmit={(e) => { e.preventDefault(); search(q.trim()); }}>
        <label>ค้นหา<input className="ad-in" value={q} onChange={(e) => setQ(e.target.value)} placeholder="อีเมลหรือชื่อ" maxLength={100} /></label>
        <div className="acts"><button type="submit" className="ad-btn pri">ค้นหา</button></div>
      </form>
      {rows && (rows.length === 0 ? <p className="ad-empty">ไม่พบผู้ใช้</p> : (
        <div className="ad-tw">
          <table className="ad-t">
            <thead>
              <tr>
                <th>ผู้ใช้</th>
                <th>แพ็กเกจ</th>
                <th>เปลี่ยนแพ็กเกจ</th>
                <th className="r">เครดิตคงเหลือ</th>
                <th>ปรับเครดิต (+/−)</th>
                <th>เหตุผล</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => {
                const planKey = u.plan || 'free';
                const planLabel = PLAN_LABELS[planKey] || 'Free';
                return (
                  <tr key={u.id}>
                    <td>{u.email}<small>{u.name}</small></td>
                    <td>
                      <span className={`ad-tag ${planKey === 'free' ? '' : 'act'}`}>
                        {planLabel}
                      </span>
                      {u.planExpiresAt && (
                        <small style={{ display: 'block', color: 'var(--text-2)', marginTop: '2px' }}>
                          ถึง {new Date(u.planExpiresAt).toLocaleDateString('th-TH')}
                        </small>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <select
                          className="ad-in"
                          style={{ width: 'auto', minWidth: '150px' }}
                          value={planSel[u.id] ?? ''}
                          onChange={(e) => setPlanSel({ ...planSel, [u.id]: e.target.value })}
                        >
                          <option value="">-- เลือกแพ็กเกจ --</option>
                          {PLAN_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="ad-btn sm pri"
                          disabled={!planSel[u.id]}
                          onClick={() => applyPlan(u)}
                        >
                          เปลี่ยน
                        </button>
                      </div>
                    </td>
                    <td className="r">{u.credits.toLocaleString('en-US')}</td>
                    <td><input className="ad-in num" aria-label={`ปรับเครดิต ${u.email}`} value={adj[u.id]?.delta ?? ''} onChange={upd(u.id, 'delta')} inputMode="numeric" placeholder="+50" /></td>
                    <td><input className="ad-in" aria-label={`เหตุผล ${u.email}`} value={adj[u.id]?.note ?? ''} onChange={upd(u.id, 'note')} maxLength={150} placeholder="เช่น ชดเชยระบบล่ม" /></td>
                    <td><button type="button" className="ad-btn sm pri" onClick={() => apply(u)}>ปรับ</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
