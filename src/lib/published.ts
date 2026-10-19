/**
 * อ่านเว็บพอร์ตที่เผยแพร่แล้วจากหลังบ้าน (ฝั่ง server · ใช้ใน /u/[slug])
 * GET <API_ORIGIN>/api/v1/sites/<slug> · ไม่มี = 404
 */
import { notFound } from 'next/navigation';
import type { Portfolio } from '@/lib/portfolio/types';
import { publicBase } from '@/lib/routes';

const API_ORIGIN = (process.env.API_ORIGIN || 'http://localhost:8080').replace(/\/$/, '');

export interface Published {
  slug: string;
  name: string;
  base: string;
  data: Portfolio;
}

export async function loadPublished(slug: string): Promise<Published> {
  // ไม่ cache ฝั่ง Next: กดเผยแพร่แล้วต้องเห็นฉบับใหม่ทันที (หลังบ้านมี ETag + Cache-Control ให้ CDN อยู่แล้ว)
  const res = await fetch(`${API_ORIGIN}/api/v1/sites/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`load site ${slug}: ${res.status}`);
  const r = (await res.json()) as { slug: string; name: string; data: Portfolio };
  return { slug: r.slug, name: r.name, base: publicBase(r.slug), data: r.data };
}

/** ชื่อบนแท็บ: ชื่อเว็บที่ตั้ง · ไม่มี = ชื่อบนโปรไฟล์ · ไม่มี = ชื่อบัญชี */
export function siteTitle(p: Published): string {
  const d = p.data as { site?: { name?: string }; profile?: { name?: string } };
  return d.site?.name || d.profile?.name || p.name || p.slug;
}
