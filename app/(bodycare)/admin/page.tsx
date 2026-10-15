import type { Metadata } from 'next';
import Link from 'next/link';
import { authConfigured, isAdmin } from '@/lib/auth';
import { getBrandContent, getContent, storageReady } from '@/lib/store';
import AdminEditor from './AdminEditor';
import BrandEditor from './BrandEditor';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: '관리자 | 필라이브필라테스', robots: { index: false, follow: false } };

type Tab = 'brand' | 'bodycare';

function Tabs({ tab }: { tab: Tab }) {
  const item = (t: Tab, label: string, href: string) => (
    <Link
      href={href}
      className={`adm-btn small ${tab === t ? 'gold' : 'ghost'}`}
      aria-current={tab === t ? 'page' : undefined}
    >
      {label}
    </Link>
  );
  return (
    <nav className="links" aria-label="수정할 페이지 선택">
      {item('brand', '브랜드 홈페이지', '/admin')}
      {item('bodycare', '바디케어 페이지', '/admin?tab=bodycare')}
    </nav>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
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

  const { tab: raw } = await searchParams;
  const tab: Tab = raw === 'bodycare' ? 'bodycare' : 'brand';

  if (tab === 'bodycare') {
    const content = await getContent();
    return <AdminEditor key="bodycare" initial={content} storageOk={storageReady()} tabs={<Tabs tab={tab} />} />;
  }
  const brand = await getBrandContent();
  return <BrandEditor key="brand" initial={brand} storageOk={storageReady()} tabs={<Tabs tab={tab} />} />;
}
