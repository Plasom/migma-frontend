import { connection } from 'next/server';
import { auth, authEnabled, authProviders } from '@/auth';
import { AccountEngine, type AccountAuth } from '@/features/account/AccountEngine';
import { AccountShell } from '@/features/account/AccountShell';

export default async function Page() {
  await connection(); // อ่าน env และ session ตอนเปิดหน้า ไม่ใช่ตอน build
  let account: AccountAuth | null = null;
  if (authEnabled) {
    const session = await auth();
    const u = session?.user;
    account = {
      providers: authProviders,
      user: u ? { email: u.email ?? '', name: u.name ?? '', image: u.image ?? '' } : null,
    };
  }
  return (
    <>
      <title>บัญชีของฉัน · Migma</title>
      <AccountShell />
      <AccountEngine auth={account} />
    </>
  );
}
