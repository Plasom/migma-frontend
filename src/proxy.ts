import { NextResponse, type NextRequest } from 'next/server';

/** cookie session ที่หลังบ้าน (migma-backend) ตั้งให้หลังเข้าสู่ระบบด้วย Google */
export const SESSION_COOKIE = 'pf_session';

/* /editor ต้องเข้าสู่ระบบก่อน · ไม่มี cookie session = พาไปหน้าบัญชี แล้วกลับมาที่เดิมหลังเข้าเสร็จ
   ตรวจแค่ว่ามี cookie (ถูกหรือหมดอายุไหมให้หลังบ้านตัดสิน · API ตอบ 401 แล้วหน้าเว็บพาไปเข้าสู่ระบบใหม่) */
export function proxy(req: NextRequest) {
  if (req.cookies.get(SESSION_COOKIE)?.value) return NextResponse.next();
  const to = new URL('/account', req.nextUrl.origin);
  to.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(to);
}

export const config = { matcher: ['/editor/:path*'] };
