/**
 * อัปโหลดภาพ · PDF · วิดีโอ ขึ้นหลังบ้าน (POST /api/v1/media) แล้วเก็บแค่ URL ในข้อมูลพอร์ต
 * (เดิมเก็บเป็น data URL ใน JSON ทำให้ข้อมูลพอร์ตใหญ่หลาย MB)
 */
import { ApiError, api, goAccount } from '@/lib/api';

export interface Uploaded {
  id: string;
  url: string;
  mime: string;
  size: number;
  name: string;
}

const EXT: Record<string, string> = {
  'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif',
  'image/svg+xml': '.svg', 'application/pdf': '.pdf', 'video/mp4': '.mp4', 'video/webm': '.webm',
};

function dataUrlToBlob(u: string): Blob {
  const i = u.indexOf(',');
  const head = u.slice(0, i);
  const body = u.slice(i + 1);
  const mime = /^data:([^;,]+)/.exec(head)?.[1] || 'application/octet-stream';
  if (!/;base64/.test(head)) return new Blob([decodeURIComponent(body)], { type: mime });
  const bin = atob(body);
  const bytes = new Uint8Array(bin.length);
  for (let n = 0; n < bin.length; n++) bytes[n] = bin.charCodeAt(n);
  return new Blob([bytes], { type: mime });
}

/** file = File/Blob หรือ data URL (ผลจาก canvas) · name ไม่มีนามสกุล = เติมตามชนิดไฟล์ */
export async function uploadMedia(file: Blob | string, name?: string): Promise<Uploaded> {
  const blob = typeof file === 'string' ? dataUrlToBlob(file) : file;
  let fname = name || (file instanceof File ? file.name : 'file');
  if (!/\.[a-z0-9]{2,5}$/i.test(fname)) fname += EXT[blob.type] || '';
  const fd = new FormData();
  fd.append('file', blob, fname);
  try {
    return await api<Uploaded>('/api/v1/media', { method: 'POST', body: fd });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) goAccount();
    if (e instanceof ApiError && e.status === 413) throw new Error('ไฟล์ใหญ่เกินไป ลองย่อไฟล์ก่อน');
    if (e instanceof ApiError && e.status === 415) throw new Error('ไฟล์ชนิดนี้อัปโหลดไม่ได้');
    throw new Error('อัปโหลดไม่สำเร็จ ลองอีกครั้ง');
  }
}
