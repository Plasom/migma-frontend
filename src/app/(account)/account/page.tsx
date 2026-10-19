import { AccountEngine } from '@/features/account/AccountEngine';
import { AccountShell } from '@/features/account/AccountShell';

export default function Page() {
  return (
    <>
      <title>บัญชีของฉัน · Migma</title>
      <AccountShell />
      <AccountEngine />
    </>
  );
}
