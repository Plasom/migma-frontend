/**
 * เครดิต AI · แพ็กเกจ · จ่ายเงิน (Stripe Checkout) · หน้าแอดมิน — เรียกหลังบ้าน (migma-backend/internal/billing)
 * ราคาเก็บเป็นสตางค์ (satang) ทั้งหมด แปลงเป็นบาทตอนแสดงผลเท่านั้น
 */
import { api } from '@/lib/api';

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  priceSatang: number;
  active: boolean;
  sort: number;
}

/** ราคาเครดิตต่องาน AI · kind ตรงกับโค้ดของ editor (case · resume · tr · polish · steps) */
export interface AiCost {
  kind: string;
  label: string;
  place: string;
  unit: string;
  credits: number;
}

export interface Pricing {
  packages: CreditPackage[];
  costs: AiCost[];
  paymentsEnabled: boolean;
}

export interface LedgerRow {
  id: number;
  delta: number;
  kind: 'welcome' | 'purchase' | 'spend' | 'refund' | 'adjust';
  tag: string;
  note: string;
  createdAt: string;
}

export interface OrderRow {
  id: string;
  no: string;
  packageName: string;
  credits: number;
  amountSatang: number;
  status: 'pending' | 'paid' | 'expired' | 'failed';
  createdAt: string;
  paidAt: string;
}

export interface CreditsState {
  balance: number;
  ledger: LedgerRow[];
  monthUsage: Record<string, number>;
  orders: OrderRow[];
}

/** 9900 → "99" · 9950 → "99.50" */
export function baht(satang: number): string {
  const v = satang / 100;
  return Number.isInteger(v) ? v.toLocaleString('en-US') : v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** "99" · "99.5" → สตางค์ · ไม่ใช่ตัวเลขบวกที่มีทศนิยมไม่เกิน 2 ตำแหน่ง = null */
export function toSatang(text: string): number | null {
  const t = text.trim().replace(/,/g, '');
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return null;
  return Math.round(parseFloat(t) * 100);
}

export const fetchPricing = () => api<Pricing>('/api/v1/pricing');
export const fetchCredits = () => api<CreditsState>('/api/v1/me/credits');

const post = <T>(path: string, body: unknown) =>
  api<T>(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const put = <T>(path: string, body: unknown) =>
  api<T>(path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

/** สร้างคำสั่งซื้อ แล้วได้ URL หน้าจ่ายเงินของ Stripe */
export const startCheckout = (packageId: string) => post<{ url: string }>('/api/v1/me/checkout', { packageId });
/** กลับจากหน้าจ่ายเงิน: ให้หลังบ้านถาม Stripe แล้วให้เครดิตถ้าจ่ายแล้ว */
export const confirmCheckout = (sessionId: string) =>
  post<{ status: OrderRow['status']; balance: number }>('/api/v1/me/checkout/confirm', { sessionId });
/** หักเครดิตของงาน AI ที่ทำฝั่งหน้าบ้าน (งานที่หลังบ้านทำเองหักในตัว endpoint แล้ว) */
export const spendCredits = (kind: string, units: number, note: string) =>
  post<{ charged: number; balance: number }>('/api/v1/me/credits/spend', { kind, units, note });

/**
 * ใส่ข้อมูลจากหลังบ้านลงก้อนบัญชีที่หน้าบัญชีและ editor ใช้ร่วมกัน (`pf-acct-demo` ใน localStorage)
 * base = ยอดหลังได้เครดิตเข้าครั้งล่าสุด (ใช้คำนวณแท่งเปอร์เซ็นต์ที่ใช้ไป)
 */
export function applyCredits(a: Record<string, unknown>, c: CreditsState): void {
  a.coins = c.balance;
  // ledger เรียงใหม่→เก่า ไม่มียอดคงเหลือต่อแถว จึงไล่ย้อนจากยอดปัจจุบัน: ยอดหลังรายการที่เพิ่มเครดิตล่าสุด = base
  let bal = c.balance;
  let peak = bal;
  let base = 0;
  for (const r of c.ledger) {
    if (r.delta > 0 && r.kind !== 'refund') {
      base = bal;
      break;
    }
    bal -= r.delta;
    peak = Math.max(peak, bal);
  }
  a.base = Math.max(base || peak, 1);
  a.log = c.ledger
    .filter((r) => r.kind === 'spend' || r.kind === 'refund')
    .map((r) => ({ t: r.createdAt, k: r.tag, d: r.note, c: r.delta, refund: r.kind === 'refund' }));
  const paid = c.orders.map((o) => ({ no: o.no, t: o.paidAt || o.createdAt, d: `เติม ${o.credits} เครดิต`, coin: o.credits, thb: o.amountSatang / 100, m: 'Stripe' }));
  const gifts = c.ledger
    .filter((r) => r.kind === 'welcome' || r.kind === 'adjust')
    .filter((r) => r.delta > 0)
    .map((r) => ({ t: r.createdAt, d: r.kind === 'welcome' ? 'เครดิตต้อนรับ' : r.note || 'ทีมงานเพิ่มเครดิตให้', coin: r.delta, thb: 0, no: '', m: '' }));
  a.tops = [...paid, ...gifts].sort((x, y) => +new Date(y.t) - +new Date(x.t));
  a.bills = c.orders.map((o) => ({
    no: o.no, t: o.paidAt || o.createdAt, d: `เครดิต AI ${o.credits} เครดิต · ${o.packageName}`, thb: o.amountSatang / 100, m: 'Stripe',
  }));
  a.mu = c.monthUsage;
}

// ---- แอดมิน (ต้องเป็นอีเมลใน ADMIN_EMAILS ของหลังบ้าน ไม่งั้น 403) ----

export interface AdminOrder extends OrderRow {
  userEmail: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  credits: number;
  plan?: 'free' | 'pass' | 'pro';
  planExpiresAt?: string;
}

export type PackageInput = Pick<CreditPackage, 'name' | 'credits' | 'priceSatang' | 'active' | 'sort'>;

export const admin = {
  packages: () => api<{ packages: CreditPackage[]; paymentsEnabled: boolean }>('/api/v1/admin/packages'),
  createPackage: (p: PackageInput) => post<CreditPackage>('/api/v1/admin/packages', p),
  updatePackage: (id: string, p: PackageInput) => put<CreditPackage>(`/api/v1/admin/packages/${id}`, p),
  deletePackage: (id: string) => api<void>(`/api/v1/admin/packages/${id}`, { method: 'DELETE' }),
  costs: () => api<{ costs: AiCost[] }>('/api/v1/admin/costs'),
  updateCost: (kind: string, c: Partial<Pick<AiCost, 'credits' | 'label' | 'place' | 'unit'>>) => put<AiCost>(`/api/v1/admin/costs/${kind}`, c),
  orders: () => api<{ orders: AdminOrder[] }>('/api/v1/admin/orders'),
  users: (q: string) => api<{ users: AdminUser[] }>(`/api/v1/admin/users?q=${encodeURIComponent(q)}`),
  adjustCredits: (id: string, delta: number, note: string) => post<{ balance: number }>(`/api/v1/admin/users/${id}/credits`, { delta, note }),
  updatePlan: (id: string, plan: string, days?: number) => post<AdminUser>(`/api/v1/admin/users/${id}/plan`, { plan, days }),
};
