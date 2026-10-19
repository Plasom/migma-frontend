import { HomeShell } from '@/features/site/components/HomeShell';
import { SiteEngine } from '@/features/site/components/SiteEngine';
import { loadPublished, siteTitle } from '@/lib/published';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = await loadPublished((await params).slug);
  return (
    <div className="pg pg-home">
      <HomeShell base={p.base} />
      <title>{siteTitle(p)}</title>
      <SiteEngine page="home" pub={{ base: p.base, data: p.data }} />
    </div>
  );
}
