import { CaseShell } from '@/features/site/components/CaseShell';
import { SiteEngine } from '@/features/site/components/SiteEngine';

export default function Page() {
  return (
    <div className="pg pg-case">
      <CaseShell />
      <title>Banking app redesign · Case study · phunyisa</title>
      <SiteEngine page="case" />
    </div>
  );
}
