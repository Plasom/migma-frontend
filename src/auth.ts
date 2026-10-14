import NextAuth from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Google from 'next-auth/providers/google';

/* เข้าสู่ระบบด้วย OAuth 2.0 (Auth.js v5) · session เป็น JWT ในคุกกี้ ยังไม่มีฐานข้อมูล
   ผู้ให้บริการ: Google · เปิดเมื่อตั้งค่า client id/secret ไว้ใน env (ดู .env.example)
   ยังไม่ได้ตั้ง = ปิดระบบเข้าสู่ระบบจริง หน้าบัญชีกลับไปใช้แบบจำลองเดิม และ /editor เปิดได้โดยไม่ต้องเข้า */
const providers: Provider[] = [];
// prompt=select_account: ให้ Google ถามทุกครั้งว่าจะใช้บัญชีไหน (สลับบัญชีได้ ไม่เข้าบัญชีเดิมให้อัตโนมัติ)
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google({ authorization: { params: { prompt: 'select_account' } } }));
}

export const authProviders = providers.map((p) => (typeof p === 'function' ? p() : p).id);
export const authEnabled = authProviders.length > 0;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: 'jwt' },
  // หน้าเข้าสู่ระบบและหน้าแจ้งข้อผิดพลาดคือหน้าบัญชี (ข้อผิดพลาดมาเป็น ?error=...)
  pages: { signIn: '/account', error: '/account' },
});
