import { SiteEngine } from '@/features/site/components/SiteEngine';
import { WorkShell } from '@/features/site/components/WorkShell';
import { loadPublished, siteTitle } from '@/lib/published';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = await loadPublished((await params).slug);
  return (
    <div className="pg pg-work">
      <WorkShell base={p.base} />
      <title>{'ผลงานทั้งหมด · ' + siteTitle(p)}</title>
      <SiteEngine page="work" pub={{ base: p.base, data: p.data }} />
    </div>
  );
}
