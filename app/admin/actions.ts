'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { checkPassword, clearSession, createSession, isAdmin } from '@/lib/auth';
import { mergeContent, type SiteContent } from '@/lib/content';
import { saveContent, saveImage, storageReady } from '@/lib/store';

export type ActionResult = { ok: boolean; message: string; url?: string };

export async function login(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const password = String(formData.get('password') ?? '');
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 800));
    return { ok: false, message: '비밀번호가 맞지 않습니다. 다시 입력해 주세요.' };
  }
  await createSession();
  redirect('/admin');
}

export async function logout() {
  await clearSession();
  redirect('/admin');
}

function cleanUrl(u: unknown) {
  const s = typeof u === 'string' ? u.trim() : '';
  return s.startsWith('https://') || s.startsWith('/') || s === '' ? s : '';
}

export async function saveSite(raw: SiteContent): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, message: '로그인이 만료되었습니다. 새로고침 후 다시 로그인해 주세요.' };
  if (!storageReady()) return { ok: false, message: '저장소(Vercel Blob)가 연결되지 않아 저장할 수 없습니다.' };
  const content = mergeContent(raw);
  content.brand.logoUrl = cleanUrl(content.brand.logoUrl);
  content.hero.image = cleanUrl(content.hero.image);
  content.sections = content.sections.map((s) => ({ ...s, image: s.image === undefined ? undefined : cleanUrl(s.image) }));
  content.location.url = cleanUrl(content.location.url).startsWith('https://') ? content.location.url.trim() : '';
  try {
    await saveContent(content);
    revalidatePath('/', 'layout');
    return { ok: true, message: '저장했습니다. 사이트에 바로 반영됩니다.' };
  } catch (e) {
    console.error('[admin] save failed', e);
    return { ok: false, message: '저장 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.' };
  }
}

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif'];

export async function uploadImage(formData: FormData): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, message: '로그인이 만료되었습니다. 새로고침 후 다시 로그인해 주세요.' };
  if (!storageReady()) return { ok: false, message: '저장소(Vercel Blob)가 연결되지 않아 업로드할 수 없습니다.' };
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: '이미지 파일을 선택해 주세요.' };
  if (!IMAGE_TYPES.includes(file.type)) return { ok: false, message: 'JPG, PNG, WEBP, SVG 이미지만 올릴 수 있습니다.' };
  if (file.size > 7 * 1024 * 1024) return { ok: false, message: '7MB 이하의 이미지를 올려 주세요.' };
  try {
    const url = await saveImage(file);
    return { ok: true, message: '이미지를 올렸습니다. 아래 저장 버튼을 눌러야 사이트에 반영됩니다.', url };
  } catch (e) {
    console.error('[admin] upload failed', e);
    return { ok: false, message: '업로드 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.' };
  }
}
