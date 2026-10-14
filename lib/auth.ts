import 'server-only';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';

// 관리자 로그인: Vercel 환경변수 ADMIN_PASSWORD 와 같은 비밀번호를 입력하면
// 서명된 쿠키(7일 유지)를 발급합니다. 쿠키가 없거나 위조되면 수정할 수 없습니다.
const COOKIE = 'pilive_admin';
const MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  return process.env.SESSION_SECRET || '';
}

function sign(value: string) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

function sameText(a: string, b: string) {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function authConfigured() {
  return !!process.env.ADMIN_PASSWORD && !!process.env.SESSION_SECRET;
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected) return false;
  return sameText(input, expected);
}

export async function createSession() {
  const expires = String(Date.now() + MAX_AGE * 1000);
  const store = await cookies();
  store.set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAdmin() {
  if (!authConfigured()) return false;
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return false;
  const [expires, signature] = raw.split('.');
  if (!expires || !signature) return false;
  if (Number(expires) < Date.now()) return false;
  return sameText(signature, sign(expires));
}
