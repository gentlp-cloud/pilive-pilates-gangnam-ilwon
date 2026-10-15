import 'server-only';
import { list, put } from '@vercel/blob';
import { defaultContent, mergeContent, type SiteContent } from './content';
import { defaultBrand, mergeBrand, type BrandContent } from './brand';

// 콘텐츠는 Vercel Blob에 저장할 때마다 새 파일(content/시각.json)로 쌓이고,
// 가장 최근 파일을 읽어 사이트에 보여줍니다. 이전 저장본이 그대로 남아 있어 복구도 가능합니다.
const PREFIX = 'content/';

export function storageReady() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export async function getContent(): Promise<SiteContent> {
  if (!storageReady()) return defaultContent;
  try {
    const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
    if (!blobs.length) return defaultContent;
    const latest = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )[0];
    const res = await fetch(latest.url, { cache: 'no-store' });
    if (!res.ok) return defaultContent;
    return mergeContent(await res.json());
  } catch (err) {
    console.error('[store] 콘텐츠를 불러오지 못해 기본값을 사용합니다', err);
    return defaultContent;
  }
}

export async function saveContent(content: SiteContent) {
  const name = `${PREFIX}${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  await put(name, JSON.stringify(content), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: true,
  });
}

export async function saveImage(file: File) {
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').slice(-60) || 'image';
  const blob = await put(`images/${safe}`, file, {
    access: 'public',
    contentType: file.type,
    addRandomSuffix: true,
  });
  return blob.url;
}

// ---- 브랜드 홈페이지(/, /private) 콘텐츠 — 바디케어 페이지와 따로 'brand/' 폴더에 쌓입니다 ----
const BRAND_PREFIX = 'brand/';

async function latestJson(prefix: string): Promise<unknown | null> {
  const { blobs } = await list({ prefix, limit: 1000 });
  if (!blobs.length) return null;
  const latest = [...blobs].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  )[0];
  const res = await fetch(latest.url, { cache: 'no-store' });
  return res.ok ? res.json() : null;
}

export async function getBrandContent(): Promise<BrandContent> {
  if (!storageReady()) return defaultBrand;
  try {
    const saved = await latestJson(BRAND_PREFIX);
    if (saved) return mergeBrand(saved);
    // 브랜드 홈페이지를 아직 한 번도 저장하지 않았다면,
    // 바디케어 페이지에 저장해 둔 네이버 예약 주소를 이어받습니다.
    const bodycare = await getContent();
    const url = bodycare.location.url?.trim();
    return url ? { ...defaultBrand, booking: { ...defaultBrand.booking, url } } : defaultBrand;
  } catch (err) {
    console.error('[store] 브랜드 콘텐츠를 불러오지 못해 기본값을 사용합니다', err);
    return defaultBrand;
  }
}

export async function saveBrandContent(content: BrandContent) {
  const name = `${BRAND_PREFIX}${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  await put(name, JSON.stringify(content), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: true,
  });
}
