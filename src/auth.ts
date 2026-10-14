import NextAuth from 'next-auth';
import type { Provider } from 'next-auth/providers';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

/* เข้าสู่ระบบด้วย OAuth 2.0 (Auth.js v5) · session เป็น JWT ในคุกกี้ ยังไม่มีฐานข้อมูล
   ผู้ให้บริการเปิดเฉพาะตัวที่ตั้งค่า client id/secret ไว้ใน env (ดู .env.example)
   ไม่ได้ตั้งเลยสักตัว = ปิดระบบเข้าสู่ระบบจริง หน้าบัญชีกลับไปใช้แบบจำลองเดิม และ /editor เปิดได้โดยไม่ต้องเข้า */
const providers: Provider[] = [];
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) providers.push(Google);
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) providers.push(GitHub);

export const authProviders = providers.map((p) => (typeof p === 'function' ? p() : p).id);
export const authEnabled = authProviders.length > 0;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: 'jwt' },
  // หน้าเข้าสู่ระบบและหน้าแจ้งข้อผิดพลาดคือหน้าบัญชี (ข้อผิดพลาดมาเป็น ?error=...)
  pages: { signIn: '/account', error: '/account' },
});
