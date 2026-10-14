import { HomeShell } from '@/features/site/components/HomeShell';
import { SiteEngine } from '@/features/site/components/SiteEngine';

export default function Page() {
  return (
    <div className="pg pg-home">
      <HomeShell />
      <title>Portfolio preview</title>
      <SiteEngine page="home" />
    </div>
  );
}
