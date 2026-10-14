import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';
import { auth, authEnabled } from '@/auth';

/* /editor ต้องเข้าสู่ระบบก่อน · ยังไม่เข้า = พาไปหน้าบัญชี แล้วกลับมาที่เดิมหลังเข้าเสร็จ
   ยังไม่ได้ตั้งค่า OAuth (dev · e2e) = ปล่อยผ่าน */
const guard = auth((req) => {
  if (req.auth) return;
  const to = new URL('/account', req.nextUrl.origin);
  to.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(to);
});

export function proxy(req: NextRequest, ev: NextFetchEvent) {
  if (!authEnabled) return NextResponse.next();
  return guard(req, ev as never);
}

export const config = { matcher: ['/editor/:path*'] };
