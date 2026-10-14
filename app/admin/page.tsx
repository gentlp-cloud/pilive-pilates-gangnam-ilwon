import type { Metadata } from 'next';
import { authConfigured, isAdmin } from '@/lib/auth';
import { getContent, storageReady } from '@/lib/store';
import AdminEditor from './AdminEditor';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: '관리자 | 필라이브필라테스', robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!authConfigured()) {
    return (
      <div className="login">
        <div className="notice">
          관리자 비밀번호가 아직 설정되지 않았습니다. Vercel 프로젝트의 환경변수에 ADMIN_PASSWORD 와 SESSION_SECRET 을
          추가한 뒤 다시 배포해 주세요.
        </div>
      </div>
    );
  }
  if (!(await isAdmin())) return <LoginForm />;
  const content = await getContent();
  return <AdminEditor initial={content} storageOk={storageReady()} />;
}
