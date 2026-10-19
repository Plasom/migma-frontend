import { CaseShell } from '@/features/site/components/CaseShell';
import { SiteEngine } from '@/features/site/components/SiteEngine';
import { loadPublished, siteTitle } from '@/lib/published';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = await loadPublished((await params).slug);
  return (
    <div className="pg pg-case">
      <CaseShell base={p.base} />
      <title>{'Case study · ' + siteTitle(p)}</title>
      <SiteEngine page="case" pub={{ base: p.base, data: p.data }} />
    </div>
  );
}
