import { WorkShell } from '@/features/site/components/WorkShell';
import { SiteEngine } from '@/features/site/components/SiteEngine';

export default function Page() {
  return (
    <div className="pg pg-work">
      <WorkShell />
      <title>ผลงานทั้งหมด</title>
      <SiteEngine page="work" />
    </div>
  );
}
