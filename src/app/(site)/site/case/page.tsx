import { CaseShell } from '@/features/site/components/CaseShell';
import { SiteEngine } from '@/features/site/components/SiteEngine';

export default function Page() {
  return (
    <div className="pg pg-case">
      <CaseShell />
      <title>Case study</title>
      <SiteEngine page="case" />
    </div>
  );
}
