/**
 * เรียกหลังบ้าน (migma-backend) จากเบราว์เซอร์ · ผ่าน origin เดียวกัน (next.config.ts rewrites /api/v1/* และ /auth/*)
 * error ของหลังบ้านมาในรูป {"error": {"status", "message"}}
 */

export class ApiError extends Error {
  constructor(public status: number, message: string, public body: unknown = null) {
    super(message);
  }
}

/** ผู้ใช้ปัจจุบัน (GET /api/v1/me) */
export interface Me {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  slug: string;
  siteUrl: string;
  /** เครดิต AI คงเหลือ */
  credits: number;
  /** อีเมลอยู่ใน ADMIN_EMAILS ของหลังบ้าน (เปิด /admin ได้) */
  isAdmin: boolean;
  plan?: 'free' | 'pass' | 'pro';
  planExpiresAt?: string;
}

/** พาไปเข้าสู่ระบบ แล้วกลับมาที่หน้าเดิม · อยู่ใน iframe = พาทั้งหน้า (Google ไม่ยอมเปิดในกรอบ) */
export function goSignIn(callbackUrl = location.pathname + location.search): void {
  const url = '/auth/google/login?callbackUrl=' + encodeURIComponent(callbackUrl);
  // โหลดทั้งหน้าโดยตั้งใจ: /auth/* เป็นของหลังบ้าน (ส่งต่อไปหน้า Google) ไม่ใช่หน้า Next
  try {
    (window.top || window).location.href = url;
  } catch {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    location.href = url;
  }
}

/** ไปหน้าบัญชี (หน้าเข้าสู่ระบบ) เมื่อ session หมดอายุ */
export function goAccount(): void {
  const to = '/account?callbackUrl=' + encodeURIComponent(location.pathname + location.search);
  try {
    (window.top || window).location.href = to;
  } catch {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    location.href = to;
  }
}

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, { credentials: 'same-origin', ...init });
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {}
  if (!res.ok) {
    const msg = (body as { error?: { message?: string } } | null)?.error?.message || res.statusText;
    throw new ApiError(res.status, msg, body);
  }
  return body as T;
}

/** ผู้ใช้ปัจจุบัน · ยังไม่เข้าสู่ระบบ = null */
export async function fetchMe(): Promise<Me | null> {
  try {
    return await api<Me>('/api/v1/me');
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return null;
    throw e;
  }
}

export async function updateSlug(slug: string): Promise<Me> {
  return api<Me>('/api/v1/me/slug', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug }),
  });
}

export async function signOut(): Promise<void> {
  await api('/auth/logout', { method: 'POST' });
}
